import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { triggerCashfreeCheckout } from '../../services/cashfree';

export const CheckoutModal = ({ isOpen, onClose, selectedPlan }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !selectedPlan) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    const trimmedName = formData.customerName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail || !emailRegex.test(formData.customerEmail.trim())) {
      setErrorMessage('Please enter a valid business or personal email address.');
      return;
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);

      // 1. Call backend to calculate verified amount and generate Cashfree order session
      const response = await api.post('/payments/create-order', {
        planId: selectedPlan.id,
        serviceId: selectedPlan.id,
        customerName: trimmedName,
        customerEmail: formData.customerEmail.trim().toLowerCase(),
        customerPhone: cleanPhone.slice(-10),
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to initialize payment session.');
      }

      const { paymentSessionId, environment } = response.data;

      if (!paymentSessionId) {
        throw new Error('Payment session identifier missing from server response.');
      }

      // 2. Trigger Cashfree Hosted Checkout
      const envMode = (environment || 'SANDBOX').toLowerCase() === 'production' ? 'production' : 'sandbox';
      await triggerCashfreeCheckout(paymentSessionId, envMode, '_self');
    } catch (err) {
      console.error('[Checkout Error]:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        'Unable to initialize Cashfree payment gateway. Please verify your details and try again.';
      setErrorMessage(serverMsg);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-slate-200"
          >
            {/* Header with Navy background */}
            <div className="bg-navy-900 text-white px-6 py-5 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-americanRed/20 text-americanRed-light text-xs font-semibold mb-2">
                  <Sparkles className="w-3 h-3 text-americanRed" />
                  <span>Official Cashfree Checkout</span>
                </div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Confirm Plan &amp; Proceed to Payment
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Secure 256-bit encrypted checkout powered by Cashfree Payments
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Plan Summary Banner */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Selected Package
                </div>
                <div className="text-base font-bold text-navy-900 mt-0.5">
                  {selectedPlan.name}
                </div>
                <div className="text-xs text-mutedText line-clamp-1">
                  {selectedPlan.description}
                </div>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <div className="text-2xl font-extrabold text-navy-900 font-heading">
                  {selectedPlan.price}
                </div>
                <div className="text-xs text-slate-500">
                  {selectedPlan.billing || 'Flat rate'}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-americanRed" />
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Full Name <span className="text-americanRed">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Email Address <span className="text-americanRed">*</span>
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  placeholder="e.g. john@yourcompany.com"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition disabled:bg-slate-100 disabled:text-slate-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Official invoice and payment receipt will be sent to this email.
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Mobile Number <span className="text-americanRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Used by Cashfree for instant payment confirmation &amp; OTP verification.
                </span>
              </div>

              {/* Security & Inclusions Notice */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-navy-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bank-Grade Payment Security</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  FinXinfo does not store any sensitive card numbers or bank credentials. Transactions are securely routed via Cashfree's PCI-DSS Level 1 certified gateway.
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-2/3 py-3 px-4 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-cta transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay {selectedPlan.price} Now</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> UPI &amp; Cards
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Netbanking
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Instant Receipt
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
