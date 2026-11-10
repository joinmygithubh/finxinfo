import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import CheckoutModal from '../components/checkout/CheckoutModal';

export const PricingSection = () => {
  const { pricing } = siteConfig;
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleOpenCheckout = (plan) => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="pricing" className="py-20 bg-surface-light relative border-b border-appBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-americanRed"></span>
            Transparent Flat-Rate Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900 tracking-tight">
            Flexible Monthly Plans Built for Scale
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedText leading-relaxed">
            No surprise billing or hidden hourly charges. Predictable flat fees that scale seamlessly with your company’s monthly operational expenses.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricing.map((plan, index) => {
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-3xl transition-all flex flex-col justify-between ${
                  isPopular
                    ? 'bg-navy-900 text-white border-2 border-americanRed shadow-2xl p-8 lg:-mt-2 lg:mb-2'
                    : 'bg-white text-darkText border border-appBorder shadow-card hover:shadow-card-hover p-8'
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-americanRed text-white text-xs font-extrabold tracking-wide uppercase shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      Most Popular Plan
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-4">
                    <h3
                      className={`text-2xl font-bold font-heading ${
                        isPopular ? 'text-white' : 'text-navy-900'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        isPopular ? 'text-slate-300' : 'text-mutedText'
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Header */}
                  <div className="flex items-baseline gap-1 my-6 pb-6 border-b border-slate-200/20">
                    <span
                      className={`text-4xl sm:text-5xl font-extrabold font-heading ${
                        isPopular ? 'text-white' : 'text-navy-900'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isPopular ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {plan.billing}
                    </span>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 mb-8">
                    <div
                      className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isPopular ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Plan Inclusions:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isPopular
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={isPopular ? 'text-slate-200' : 'text-darkText'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA Button */}
                <div>
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-americanRed hover:bg-americanRed-hover text-white shadow-cta transform hover:-translate-y-0.5'
                        : 'bg-navy-900 hover:bg-navy-800 text-white'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-center mt-3 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>No annual contract &bull; Cancel anytime</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cashfree Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlanForCheckout}
      />
    </section>
  );
};

export default PricingSection;

