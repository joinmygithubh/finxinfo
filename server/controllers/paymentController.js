const crypto = require('crypto');
const Payment = require('../models/Payment');
const cashfreeService = require('../services/cashfreeService');
const { PRICING_CATALOG, getCatalogItem } = require('../config/pricingCatalog');

/**
 * @route   GET /api/payments/catalog
 * @desc    Fetch available plans & services with backend verified pricing
 * @access  Public
 */
exports.getPlansCatalog = (req, res) => {
  return res.status(200).json({
    success: true,
    catalog: Object.values(PRICING_CATALOG),
  });
};

/**
 * @route   POST /api/payments/create-order
 * @desc    Validate customer & plan, generate order, register with Cashfree, return payment_session_id
 * @access  Public
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { planId, serviceId, customerName, customerEmail, customerPhone } = req.body;

    // 1. Validate customer information
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (minimum 2 characters).',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!customerEmail || !emailRegex.test(customerEmail.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const rawPhone = (customerPhone || '').toString().replace(/\D/g, '');
    if (!rawPhone || rawPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.',
      });
    }

    // 2. Resolve selected service or plan from backend catalog
    const requestedKey = planId || serviceId;
    const catalogItem = getCatalogItem(requestedKey);

    if (!catalogItem) {
      return res.status(400).json({
        success: false,
        message: `Invalid service or plan selected: "${requestedKey}". Please choose a valid plan.`,
      });
    }

    // 3. Strictly calculate amount on backend
    const finalAmount = catalogItem.amount;
    const finalCurrency = catalogItem.currency || 'INR';

    // 4. Generate unique, clean orderId (alphanumeric + underscores, max 45 chars)
    const timestamp = Date.now().toString().slice(-8);
    const randomHex = crypto.randomBytes(3).toString('hex');
    const orderId = `finx_${timestamp}_${randomHex}`;

    // Resolve client URL dynamically from request headers or environment (production-ready)
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = req.secure || forwardedProto === 'https' ? 'https' : 'http';
    const host = req.get('host');
    const dynamicOrigin = host ? `${protocol}://${host}` : 'http://localhost:5173';
    const clientUrl = (process.env.CLIENT_URL || dynamicOrigin).replace(/\/+$/, '');

    // Cashfree hosted checkout redirects to return_url after customer submits or cancels
    const returnUrl = `${clientUrl}/payment-result/${orderId}?order_id={order_id}`;

    // 5. Save pending order in MongoDB
    const paymentRecord = await Payment.create({
      orderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: rawPhone.slice(-10),
      serviceName: catalogItem.name,
      planId: catalogItem.id,
      amount: finalAmount,
      currency: finalCurrency,
      paymentStatus: 'PENDING',
    });

    // 6. Create Cashfree payment order
    let cashfreeOrder;
    try {
      cashfreeOrder = await cashfreeService.createOrder({
        orderId,
        orderAmount: finalAmount,
        orderCurrency: finalCurrency,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: rawPhone.slice(-10),
        serviceName: catalogItem.name,
        returnUrl,
      });
    } catch (cfErr) {
      // If Cashfree call fails, mark record as FAILED with reason
      paymentRecord.paymentStatus = 'FAILED';
      paymentRecord.failureReason = cfErr.message;
      await paymentRecord.save();

      return res.status(cfErr.status || 500).json({
        success: false,
        message: cfErr.message || 'Unable to initialize Cashfree payment gateway.',
        details: cfErr.details || null,
      });
    }

    // 7. Update MongoDB record with Cashfree session & order ID
    paymentRecord.cashfreeOrderId = cashfreeOrder.cf_order_id ? String(cashfreeOrder.cf_order_id) : '';
    paymentRecord.paymentSessionId = cashfreeOrder.payment_session_id || '';
    paymentRecord.rawCashfreeResponse = cashfreeOrder;
    await paymentRecord.save();

    // 8. Return payment_session_id to frontend
    return res.status(201).json({
      success: true,
      orderId: paymentRecord.orderId,
      paymentSessionId: cashfreeOrder.payment_session_id,
      amount: finalAmount,
      currency: finalCurrency,
      serviceName: catalogItem.name,
      environment: (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase(),
    });
  } catch (error) {
    console.error('[Payment Controller Error - createPaymentOrder]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating payment order.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/payments/verify/:orderId
 * @desc    Fetch payment status directly from Cashfree, verify transaction, update MongoDB
 * @access  Public
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.',
      });
    }

    // 1. Fetch order from MongoDB
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Order "${orderId}" not found in system.`,
      });
    }

    // 2. Fetch official order and payments state directly from Cashfree
    let cfOrder = null;
    let cfPayments = [];

    try {
      cfOrder = await cashfreeService.fetchOrder(orderId);
      cfPayments = await cashfreeService.fetchOrderPayments(orderId);
    } catch (cfErr) {
      console.warn(`[Verify Order Warning] Could not reach Cashfree directly for ${orderId}:`, cfErr.message);
      // If Cashfree query fails, return existing database status with advisory
      return res.status(200).json({
        success: true,
        orderId: payment.orderId,
        paymentStatus: payment.paymentStatus,
        amount: payment.amount,
        currency: payment.currency,
        serviceName: payment.serviceName,
        customerName: payment.customerName,
        customerEmail: payment.customerEmail,
        cashfreePaymentId: payment.cashfreePaymentId,
        paymentMethod: payment.paymentMethod,
        updatedAt: payment.updatedAt,
        advisory: 'Gateway status currently syncing; displaying verified internal ledger record.',
      });
    }

    // 3. Inspect latest payment attempt
    const latestPayment = Array.isArray(cfPayments) && cfPayments.length > 0 ? cfPayments[0] : null;

    let newStatus = payment.paymentStatus;
    let cashfreePaymentId = payment.cashfreePaymentId || '';
    let paymentMethod = payment.paymentMethod || '';

    if (latestPayment) {
      cashfreePaymentId = String(latestPayment.cf_payment_id || '');
      paymentMethod = latestPayment.payment_group || latestPayment.payment_method || '';

      if (latestPayment.payment_status === 'SUCCESS' || cfOrder.order_status === 'PAID') {
        newStatus = 'PAID';
      } else if (latestPayment.payment_status === 'FAILED') {
        newStatus = 'FAILED';
      } else if (latestPayment.payment_status === 'USER_DROPPED') {
        newStatus = 'USER_DROPPED';
      } else if (latestPayment.payment_status === 'PENDING') {
        newStatus = 'PENDING';
      }
    } else {
      if (cfOrder.order_status === 'PAID') {
        newStatus = 'PAID';
      } else if (cfOrder.order_status === 'EXPIRED') {
        newStatus = 'EXPIRED';
      } else {
        newStatus = 'PENDING';
      }
    }

    // 4. Update MongoDB record
    payment.paymentStatus = newStatus;
    if (cashfreePaymentId) payment.cashfreePaymentId = cashfreePaymentId;
    if (paymentMethod) payment.paymentMethod = typeof paymentMethod === 'object' ? JSON.stringify(paymentMethod) : String(paymentMethod);
    payment.rawCashfreeResponse = {
      order: cfOrder,
      payments: cfPayments,
    };
    await payment.save();

    return res.status(200).json({
      success: true,
      orderId: payment.orderId,
      paymentStatus: payment.paymentStatus,
      amount: payment.amount,
      currency: payment.currency,
      serviceName: payment.serviceName,
      customerName: payment.customerName,
      customerEmail: payment.customerEmail,
      cashfreePaymentId: payment.cashfreePaymentId,
      paymentMethod: payment.paymentMethod,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error('[Payment Controller Error - verifyPayment]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying payment.',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/payments/webhook
 * @desc    Receive Cashfree webhooks, verify signature with raw body, idempotently update MongoDB
 * @access  Public (Cashfree Server)
 */
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.rawBody;

    // 1. Verify webhook signature using original raw request body
    const isSignatureValid = cashfreeService.verifyWebhookSignature(signature, rawBody, timestamp);

    if (!isSignatureValid) {
      console.warn('[Cashfree Webhook Security Alert] Invalid signature received:', {
        signature,
        timestamp,
        ip: req.ip,
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature verification.',
      });
    }

    // 2. Parse verified payload
    const event = typeof req.body === 'object' ? req.body : JSON.parse(rawBody);
    const eventType = event.type;
    const orderData = event.data?.order;
    const paymentData = event.data?.payment;

    if (!orderData || !orderData.order_id) {
      return res.status(200).json({
        success: true,
        message: 'Webhook received without order data; acknowledged.',
      });
    }

    const orderId = orderData.order_id;
    const paymentRecord = await Payment.findOne({ orderId });

    if (!paymentRecord) {
      console.warn(`[Webhook Warning] Order ID "${orderId}" not found in database.`);
      return res.status(200).json({
        success: true,
        message: 'Order not found, acknowledged.',
      });
    }

    // 3. Prevent duplicate webhook processing
    // If order is already PAID, do not overwrite with stale or repeat events
    if (paymentRecord.paymentStatus === 'PAID') {
      console.log(`[Webhook Idempotency] Order ${orderId} is already PAID. Skipping re-processing.`);
      return res.status(200).json({
        success: true,
        message: 'Order is already marked as PAID. Duplicate webhook ignored.',
      });
    }

    // 4. Update status based on event type
    switch (eventType) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        paymentRecord.paymentStatus = 'PAID';
        if (paymentData?.cf_payment_id) {
          paymentRecord.cashfreePaymentId = String(paymentData.cf_payment_id);
        }
        if (paymentData?.payment_method) {
          paymentRecord.paymentMethod = JSON.stringify(paymentData.payment_method);
        }
        break;

      case 'PAYMENT_FAILED_WEBHOOK':
        paymentRecord.paymentStatus = 'FAILED';
        paymentRecord.failureReason = paymentData?.payment_message || 'Payment failed at gateway';
        break;

      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        paymentRecord.paymentStatus = 'USER_DROPPED';
        break;

      case 'ORDER_EXPIRED':
        paymentRecord.paymentStatus = 'EXPIRED';
        break;

      default:
        console.log(`[Webhook Notice] Received unhandled Cashfree event type: ${eventType}`);
        break;
    }

    paymentRecord.rawCashfreeResponse = event;
    await paymentRecord.save();

    console.log(`[Webhook Success] Order ${orderId} updated to status: ${paymentRecord.paymentStatus}`);

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully.',
      orderId,
      status: paymentRecord.paymentStatus,
    });
  } catch (error) {
    console.error('[Payment Controller Webhook Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing webhook event.',
      error: error.message,
    });
  }
};

