import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold uppercase tracking-wider mb-3 border border-navy-100">
            <HelpCircle className="w-3.5 h-3.5 text-americanRed" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900 tracking-tight">
            Common Inquiries About Our Services
          </h2>
          <p className="mt-3 text-base text-mutedText leading-relaxed">
            Everything you need to know about our Certified QuickBooks ProAdvisor and CPA partner services.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-navy-300 bg-navy-50/20 shadow-sm'
                    : 'border-appBorder bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-heading font-bold text-base sm:text-lg transition-colors ${
                      isOpen ? 'text-navy-900' : 'text-darkText'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isOpen
                        ? 'bg-navy-900 text-white rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100/80">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Need more answers? */}
        <div className="mt-12 p-6 rounded-2xl bg-surface-light border border-appBorder text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h4 className="font-heading font-bold text-navy-900 text-base">
              Have a specific question about your financial books?
            </h4>
            <p className="text-xs sm:text-sm text-mutedText mt-1">
              Speak directly with a senior QuickBooks ProAdvisor today.
            </p>
          </div>
          <a
            href={`tel:${siteConfig.contact.phoneRaw}`}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4 text-americanRed" />
            <span>Call {siteConfig.contact.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

