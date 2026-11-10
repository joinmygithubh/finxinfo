import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Home,
  ShieldCheck,
  Receipt,
  AlertTriangle,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';

export const PaymentResultPage = () => {
  const { orderId: paramOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve orderId from route param or query param
  const orderId = paramOrderId || searchParams.get('order_id') || searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [rechecking, setRechecking] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const verifyOrder = useCallback(async (isRecheck = false) => {
    if (!orderId) {
      setError('No Order ID provided. Unable to verify payment.');
      setLoading(false);
      return;
    }

    if (isRecheck) setRechecking(true);
    else setLoading(true);

    try {
      const response = await api.get(`/payments/verify/${orderId}`);
      if (response.data && response.data.success) {
        setPaymentData(response.data);
      } else {
        throw new Error(response.data?.message || 'Verification failed.');
      }
    } catch (err) {
      console.error('[Payment Verification Error]:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to retrieve payment confirmation. Please contact support.'
      );
    } finally {
      setLoading(false);
      setRechecking(false);
    }
  }, [orderId]);

  useEffect(() => {
    verifyOrder();
  }, [verifyOrder]);

  const renderStatus = () => {
    if (loading) {
      return (
        <div className="py-20 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-navy-50 text-navy-900 animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-navy-900">
            Verifying Transaction with Cashfree...
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Please wait while we establish a secure cryptographic confirmation with Cashfree Payments.
          </p>
        </div>
      );
    }

    if (error && !paymentData) {
      return (
        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-xl max-w-xl mx-auto text-center space-y-5">
          <div className="inline-flex p-3 rounded-full bg-red-100 text-americanRed">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-navy-900">
            Order Verification Inconclusive
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {error}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => verifyOrder(true)}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Verification</span>
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center justify-center gap-2 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      );
    }

    const status = (paymentData?.paymentStatus || '').toUpperCase();

    // 1. SUCCESS / PAID
    if (status === 'PAID') {
      return (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-2xl max-w-2xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wide border border-emerald-200">
              Payment Successful &bull; Confirmed
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy-900">
              Thank You for Your Payment!
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your transaction has been securely processed and confirmed by Cashfree Payments. Your onboarding manager will be in touch shortly.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Transaction Receipt</span>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                Order #{paymentData.orderId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Service / Plan</span>
                <span className="font-bold text-navy-900 text-sm mt-0.5 block">
                  {paymentData.serviceName || 'FinXinfo Accounting Services'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Total Amount Paid</span>
                <span className="font-extrabold text-emerald-600 text-lg font-heading mt-0.5 block">
                  {paymentData.currency} {paymentData.amount?.toFixed?.(2) || paymentData.amount}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Customer Name</span>
                <span className="font-semibold text-darkText mt-0.5 block">
                  {paymentData.customerName || 'Valued Client'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Confirmation Email</span>
                <span className="font-semibold text-darkText mt-0.5 block">
                  {paymentData.customerEmail || '—'}
                </span>
              </div>

              {paymentData.cashfreePaymentId && (
                <div>
                  <span className="text-slate-500 block">Cashfree Reference</span>
                  <span className="font-mono text-slate-700 mt-0.5 block">
                    {paymentData.cashfreePaymentId}
                  </span>
                </div>
              )}

              {paymentData.paymentMethod && (
                <div>
                  <span className="text-slate-500 block">Payment Channel</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block capitalize">
                    {paymentData.paymentMethod}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="py-3 px-6 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Home className="w-4 h-4" />
              <span>Return to FinXinfo Home</span>
            </Link>

            <a
              href="mailto:support@finxinfo.com?subject=Payment%20Confirmation%20Inquiry%20-%20Order%20"
              className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center justify-center gap-2 transition"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Contact Support</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bank-grade verified &bull; Transaction recorded in FinXinfo official ledger</span>
          </div>
        </div>
      );
    }

    // 2. FAILED or USER_DROPPED
    if (status === 'FAILED' || status === 'USER_DROPPED' || status === 'EXPIRED') {
      const isDropped = status === 'USER_DROPPED';
      const isExpired = status === 'EXPIRED';

      return (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-red-200 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-full bg-red-100 text-americanRed shadow-sm">
              <XCircle className="w-12 h-12 stroke-[2.5]" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-red-50 text-americanRed text-xs font-extrabold uppercase tracking-wide border border-red-200">
              {isDropped ? 'Checkout Cancelled' : isExpired ? 'Payment Session Expired' : 'Payment Failed'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy-900">
              {isDropped
                ? 'Payment Was Not Completed'
                : isExpired
                ? 'Your Payment Session Has Expired'
                : 'Payment Could Not Be Authorized'}
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {isDropped
                ? 'The payment flow was closed before authorization was complete. No funds were deducted from your account.'
                : isExpired
                ? 'The payment window timed out for security reasons. You can initiate a fresh checkout at any time.'
                : 'Your bank or payment provider was unable to authorize this transaction. Please verify card or bank details and try again.'}
            </p>
          </div>

          {/* Details */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between text-slate-600">
              <span>Order Reference:</span>
              <span className="font-mono font-semibold text-navy-900">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Selected Plan:</span>
              <span className="font-semibold text-navy-900">{paymentData.serviceName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Attempted Amount:</span>
              <span className="font-semibold text-navy-900">
                {paymentData.currency} {paymentData.amount}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/#pricing"
              className="py-3 px-6 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-cta transition"
            >
              <span>Retry Payment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/#contact"
              className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center justify-center gap-2 transition"
            >
              <span>Speak with an Advisor</span>
            </Link>
          </div>
        </div>
      );
    }

    // 3. PENDING
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-2xl max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-full bg-amber-100 text-amber-600 shadow-sm">
            <Clock className="w-12 h-12 stroke-[2.5]" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold uppercase tracking-wide border border-amber-200">
            Awaiting Final Gateway Confirmation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy-900">
            Payment Status: Processing
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your payment is currently being acknowledged by the banking network. This usually takes just a few moments.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-2.5">
          <div className="flex justify-between text-slate-600">
            <span>Order Reference:</span>
            <span className="font-mono font-semibold text-navy-900">{paymentData.orderId}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payable Amount:</span>
            <span className="font-semibold text-navy-900">
              {paymentData.currency} {paymentData.amount}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => verifyOrder(true)}
            disabled={rechecking}
            className="py-3 px-6 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${rechecking ? 'animate-spin' : ''}`} />
            <span>Check Status Again</span>
          </button>

          <Link
            to="/"
            className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-darkText">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {renderStatus()}
      </main>
      <Footer />
    </div>
  );
};

export default PaymentResultPage;

