const mongoose = require('mongoose');

/**
 * Payment Model
 *
 * Represents a Cashfree payment transaction for FinXinfo.
 * Enforces server-side validated amounts, customer records, and transaction status.
 */
const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      index: true,
      trim: true,
    },
    cashfreeOrderId: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid customer email',
      ],
      index: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
    },
    serviceName: {
      type: String,
      required: [true, 'Service or plan name is required'],
      trim: true,
    },
    planId: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Payable amount is required'],
      min: [1, 'Amount must be at least 1.00'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['PENDING', 'PAID', 'FAILED', 'USER_DROPPED', 'EXPIRED'],
        message: 'Invalid payment status: {VALUE}',
      },
      default: 'PENDING',
      index: true,
    },
    cashfreePaymentId: {
      type: String,
      trim: true,
      default: '',
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: '',
    },
    paymentSessionId: {
      type: String,
      trim: true,
      default: '',
    },
    failureReason: {
      type: String,
      trim: true,
      default: '',
    },
    rawCashfreeResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for admin search and reporting
PaymentSchema.index({ paymentStatus: 1, createdAt: -1 });
PaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);

