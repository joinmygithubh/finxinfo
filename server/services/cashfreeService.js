const crypto = require('crypto');
const { Cashfree, CFEnvironment } = require('cashfree-pg');

/**
 * Cashfree Payment Gateway Service
 *
 * Implements Cashfree Payment Gateway Hosted Checkout API
 * via official Cashfree Node.js SDK (cashfree-pg).
 */
class CashfreeService {
  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || '';
    this.secretKey = process.env.CASHFREE_SECRET_KEY || '';
    this.env = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
    this.apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01';

    const cfEnv =
      this.env === 'PRODUCTION'
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX;

    // Initialize Cashfree client instance
    this.client = new Cashfree(cfEnv, this.appId, this.secretKey);
    this.client.XApiVersion = this.apiVersion;
  }

  /**
   * Reload configuration if environment variables change
   */
  reloadConfig() {
    this.appId = process.env.CASHFREE_APP_ID || '';
    this.secretKey = process.env.CASHFREE_SECRET_KEY || '';
    this.env = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
    this.apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01';

    const cfEnv =
      this.env === 'PRODUCTION'
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX;

    this.client = new Cashfree(cfEnv, this.appId, this.secretKey);
    this.client.XApiVersion = this.apiVersion;
  }

  /**
   * Check if Cashfree credentials are configured
   */
  isConfigured() {
    return Boolean(this.appId && this.secretKey);
  }

  /**
   * Create Cashfree Order
   * @param {Object} orderData
   * @returns {Promise<Object>}
   */
  async createOrder({
    orderId,
    orderAmount,
    orderCurrency = 'INR',
    customerName,
    customerEmail,
    customerPhone,
    serviceName,
    returnUrl,
  }) {
    if (!this.isConfigured()) {
      throw new Error(
        'Cashfree credentials (CASHFREE_APP_ID and CASHFREE_SECRET_KEY) are missing in server/.env'
      );
    }

    // Clean phone number (must be 10 digits for Indian numbers or proper format)
    const cleanedPhone = customerPhone.replace(/\D/g, '').slice(-10);
    const validPhone = cleanedPhone.length === 10 ? cleanedPhone : '9999999999';

    // Unique customer ID safe for Cashfree (alphanumeric, max 45 chars)
    const customerId = `cust_${crypto
      .createHash('md5')
      .update(customerEmail)
      .digest('hex')
      .slice(0, 16)}`;

    const orderRequest = {
      order_id: orderId,
      order_amount: Number(orderAmount.toFixed(2)),
      order_currency: orderCurrency,
      customer_details: {
        customer_id: customerId,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim().toLowerCase(),
        customer_phone: validPhone,
      },
      order_meta: {
        return_url: returnUrl,
      },
      order_note: `FinXinfo: ${serviceName}`,
    };

    try {
      const response = await this.client.PGCreateOrder(orderRequest);
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Cashfree order creation failed';
      console.error('[Cashfree Service Error - PGCreateOrder]:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const customErr = new Error(errorMsg);
      customErr.status = err.response?.status || 500;
      customErr.details = err.response?.data;
      throw customErr;
    }
  }

  /**
   * Fetch order details directly from Cashfree
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  async fetchOrder(orderId) {
    if (!this.isConfigured()) {
      throw new Error('Cashfree credentials are not configured');
    }

    try {
      const response = await this.client.PGFetchOrder(orderId);
      return response.data;
    } catch (err) {
      console.error('[Cashfree Service Error - PGFetchOrder]:', {
        orderId,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      throw err;
    }
  }

  /**
   * Fetch payment attempts for an order from Cashfree
   * @param {string} orderId
   * @returns {Promise<Array>}
   */
  async fetchOrderPayments(orderId) {
    if (!this.isConfigured()) {
      throw new Error('Cashfree credentials are not configured');
    }

    try {
      const response = await this.client.PGOrderFetchPayments(orderId);
      return response.data || [];
    } catch (err) {
      console.error('[Cashfree Service Error - PGOrderFetchPayments]:', {
        orderId,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      return [];
    }
  }

  /**
   * Verify Cashfree Webhook Signature using raw body
   * @param {string} signature - Value from 'x-webhook-signature' header
   * @param {string} rawBody - Raw body string of request
   * @param {string} timestamp - Value from 'x-webhook-timestamp' header
   * @returns {boolean}
   */
  verifyWebhookSignature(signature, rawBody, timestamp) {
    if (!signature || !rawBody || !timestamp || !this.secretKey) {
      return false;
    }

    try {
      // 1. Try SDK's verification method
      if (typeof this.client.PGVerifyWebhookSignature === 'function') {
        const isValid = this.client.PGVerifyWebhookSignature(
          signature,
          rawBody,
          timestamp
        );
        if (isValid) return true;
      }

      // 2. Fallback to standard HMAC-SHA256 signature verification:
      // signature = Base64(HMAC-SHA256(timestamp + rawBody, secretKey))
      const payload = `${timestamp}${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(payload)
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (err) {
      console.error('[Cashfree Webhook Signature Verification Error]:', err.message);
      return false;
    }
  }
}

module.exports = new CashfreeService();

