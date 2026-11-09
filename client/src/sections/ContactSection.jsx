import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import api from '../services/api';

const serviceOptions = [
  'General Bookkeeping & Ledger Management',
  'QuickBooks Online / Desktop Setup & Cleanup',
  'Payroll Processing & 1099 Support',
  'Tax Preparation & Deductions Planning',
  'Federal & State Tax Filing (CPA Partner)',
  'Financial Reporting & P&L Dashboards',
  'White Label CPA Outsourcing',
  'Bookkeeping & Financial Advisory (Essential Plan)',
  'Bookkeeping & Financial Advisory (Growth Plan)',
  'Bookkeeping & Financial Advisory (Scale & Tax Plan)',
  'Other Financial Consultation',
];

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    setSubmitSuccess(null);

    try {
      const response = await api.post('/contact', data);
      if (response.data.success) {
        setSubmitSuccess(response.data);
        reset();
      } else {
        setServerError(response.data.message || 'Submission failed. Please check inputs.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      const msg =
        err.response?.data?.message ||
        'Unable to connect to the server. Please verify your connection or call us at +1-888-843-3173.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-surface-light relative border-b border-appBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-americanRed"></span>
            Speak With A Certified ProAdvisor
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900 tracking-tight">
            Book Your Free Financial Consultation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedText leading-relaxed">
            Let’s discuss your bookkeeping catch-up, software migration, or tax filing. Receive a transparent price quote and custom action plan with no obligation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact & Trust Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-900 text-white rounded-2xl p-7 sm:p-8 shadow-xl border border-navy-800">
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                FinXinfo Headquarters
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Connect directly with our senior financial specialists. We serve businesses nationwide across all US time zones.
              </p>

              <div className="space-y-4 text-sm">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 text-americanRed border border-navy-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">Toll-Free Phone</div>
                    <a
                      href={`tel:${siteConfig.contact.phoneRaw}`}
                      className="font-bold text-white hover:text-americanRed transition-colors text-base"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 text-americanRed border border-navy-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">Email Inquiries</div>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="font-semibold text-white hover:text-americanRed transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 text-americanRed border border-navy-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">Physical Office</div>
                    <p className="text-slate-200">{siteConfig.contact.address}</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 text-americanRed border border-navy-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">Consultation Hours</div>
                    <p className="text-slate-200">{siteConfig.contact.hours}</p>
                  </div>
                </div>
              </div>

              {/* Security Pill */}
              <div className="mt-8 pt-6 border-t border-navy-800 flex items-center gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>All consultation details are protected under 256-bit SSL encryption and strict NDA.</span>
              </div>
            </div>

            {/* ProAdvisor Guarantee Box */}
            <div className="bg-white rounded-2xl p-6 border border-appBorder shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-amber-500" />
                <h4 className="font-heading font-bold text-navy-900 text-sm">
                  100% Satisfaction & Accuracy Guarantee
                </h4>
              </div>
              <p className="text-xs text-mutedText leading-relaxed">
                If our Certified ProAdvisors cannot identify clear bookkeeping improvements or reconciliation discrepancies on your free strategy call, you pay nothing.
              </p>
            </div>
          </div>

          {/* Right Column: React Hook Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-appBorder p-6 sm:p-10 shadow-card">
            {/* Success Notification Alert */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-base">Request Successfully Received!</h4>
                      <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                        {submitSuccess.message}
                      </p>
                      <div className="mt-2 text-xs font-mono font-bold bg-white/80 px-2.5 py-1 rounded inline-block border border-emerald-200">
                        Reference ID: {submitSuccess.data?.inquiryId}
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-2">
                        A confirmation email has been dispatched to your inbox.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Notification Alert */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-americanRed flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <strong>Submission Notice:</strong> {serverError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-americanRed">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Smith"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all ${
                      errors.name ? 'border-americanRed bg-red-50/20' : 'border-appBorder bg-slate-50/50'
                    }`}
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />
                  {errors.name && (
                    <p className="text-americanRed text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-americanRed">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. robert@company.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all ${
                      errors.email ? 'border-americanRed bg-red-50/20' : 'border-appBorder bg-slate-50/50'
                    }`}
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-americanRed text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-americanRed">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. (555) 234-5678"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all ${
                      errors.phone ? 'border-americanRed bg-red-50/20' : 'border-appBorder bg-slate-50/50'
                    }`}
                    {...register('phone', {
                      required: 'Phone number is required',
                      minLength: { value: 7, message: 'Please enter a valid phone number' },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-americanRed text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Enterprises LLC"
                    className="w-full px-4 py-3 rounded-xl border border-appBorder bg-slate-50/50 text-sm text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all"
                    {...register('company')}
                  />
                </div>
              </div>

              {/* Service Interested In Dropdown */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Service Interested In <span className="text-americanRed">*</span>
                </label>
                <select
                  id="service-select"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-darkText focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all ${
                    errors.service ? 'border-americanRed bg-red-50/20' : 'border-appBorder bg-slate-50/50'
                  }`}
                  {...register('service', { required: 'Please select a service' })}
                >
                  <option value="">Select a Financial Service</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-americanRed text-xs mt-1">{errors.service.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Business Financial Details & Goals <span className="text-americanRed">*</span>
                </label>
                <textarea
                  id="message-input"
                  rows={4}
                  placeholder="Tell us about your current bookkeeping software, monthly transaction volume, or any overdue reconciliations..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all ${
                    errors.message ? 'border-americanRed bg-red-50/20' : 'border-appBorder bg-slate-50/50'
                  }`}
                  {...register('message', {
                    required: 'Please provide brief details about your financial needs',
                    minLength: { value: 10, message: 'Message should be at least 10 characters' },
                  })}
                ></textarea>
                {errors.message && (
                  <p className="text-americanRed text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white font-bold text-base shadow-cta transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying & Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Consultation Request</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-mutedText pt-1">
                We respect your privacy. Zero spam. A ProAdvisor will respond within 24 business hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

