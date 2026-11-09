import React from 'react';
import { motion } from 'framer-motion';
import {
  Ghost,
  Layers,
  Receipt,
  FileSpreadsheet,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Handshake,
  CheckCircle2,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const whiteLabelIcons = {
  Ghost,
  Layers,
  ReceiptCheck: Receipt,
  FileSpreadsheet,
  UserCheck,
  ShieldAlert,
};

export const CpaOutsourcingSection = () => {
  const { whiteLabelCPA } = siteConfig;

  const scrollToContactForPartnership = () => {
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
      serviceSelect.value = 'White Label CPA Outsourcing';
    }
    const messageInput = document.getElementById('message-input');
    if (messageInput && !messageInput.value) {
      messageInput.value = 'Hello, our accounting/CPA firm is interested in exploring white-label outsourcing partnerships to scale back-office capacity.';
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="cpa-outsourcing" className="py-20 bg-navy-950 text-white relative overflow-hidden">
      {/* Decorative USA flag accents in background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-americanRed/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-navy-700 text-xs font-bold uppercase tracking-wider mb-3 text-slate-300">
            <Handshake className="w-4 h-4 text-americanRed" />
            B2B Accounting Partnerships
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            {whiteLabelCPA.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {whiteLabelCPA.subheading}
          </p>
        </div>

        {/* 6 Feature Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {whiteLabelCPA.features.map((feat, index) => {
            const IconComp = whiteLabelIcons[feat.icon] || Layers;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-navy-900/90 border border-navy-800 rounded-2xl p-6 hover:border-navy-600 transition-colors shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-800 text-americanRed border border-navy-700/80 flex items-center justify-center mb-4">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Callout Box */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 rounded-2xl border border-navy-700/80 p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-americanRed uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Confidentiality Guaranteed &bull; Mutual NDA Executed First
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">
              Ready to Expand Your CPA Firm's Capacity?
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              Schedule a confidential 20-minute executive partnership briefing to discuss firm volume, workflow integration, and trial clients.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={scrollToContactForPartnership}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white font-bold text-base shadow-cta transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CpaOutsourcingSection;

