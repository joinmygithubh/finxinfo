import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  ShieldCheck,
  CircleDollarSign,
  Lock,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const benefitIcons = {
  UserCheck,
  ShieldCheck,
  CircleDollarSign,
  Lock,
};

export const WhyChooseUsSection = () => {
  const { whyChooseUs } = siteConfig;

  return (
    <section id="why-us" className="py-20 bg-white border-y border-appBorder relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold uppercase tracking-wider mb-3 border border-navy-100">
            <ShieldCheck className="w-3.5 h-3.5 text-americanRed" />
            The FinXinfo Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900 tracking-tight">
            {whyChooseUs.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedText leading-relaxed">
            {whyChooseUs.subheading}
          </p>
        </div>

        {/* Two Column Layout: Left Visual, Right 4 Benefit Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Column: Visual Security & Accuracy Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-navy-700 relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-americanRed/10 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between border-b border-navy-700/80 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-americanRed flex items-center justify-center text-white font-bold">
                  QA
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">Full-Cycle Accuracy</h4>
                  <p className="text-[11px] text-slate-400">Intuit Certified &bull; Dual-Review Model</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                100% Tax Tie-Out
              </span>
            </div>

            {/* Workflow steps graphic */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-navy-800/80 border border-navy-700/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Continuous Bank & CC Feeds</div>
                  <div className="text-[11px] text-slate-300">Automated categorization with receipts verified daily.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-800/80 border border-navy-700/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ProAdvisor Review & Reconciliation</div>
                  <div className="text-[11px] text-slate-300">Detailed month-end closing, chart restructuring, and balance sheet adjustments.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-800/80 border border-navy-700/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Licensed CPA Partner Filing</div>
                  <div className="text-[11px] text-slate-300">Direct integration into federal & state corporate tax return preparation.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400">
              <span>Client Retention Rate</span>
              <span className="font-bold text-white">99.2% Satisfaction</span>
            </div>
          </motion.div>

          {/* Right Column: 4 Benefit Blocks */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChooseUs.benefits.map((benefit, index) => {
              const IconComp = benefitIcons[benefit.icon] || ShieldCheck;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-surface-light border border-appBorder hover:border-navy-300 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center mb-3 shadow-sm">
                    <IconComp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-darkText text-base mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
                    {benefit.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 bg-white rounded-2xl border border-appBorder shadow-card overflow-hidden">
          <div className="bg-navy-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold font-heading">
                Side-by-Side Operational Comparison
              </h3>
              <p className="text-xs text-slate-300">
                How FinXinfo Compares to Traditional In-House Bookkeeping
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-americanRed text-white">
              <Sparkles className="w-3.5 h-3.5" />
              Optimal ROI
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-appBorder bg-slate-50 text-xs uppercase tracking-wider text-slate-600 font-bold">
                  <th className="py-3.5 px-6">Features</th>
                  <th className="py-3.5 px-6 bg-navy-50/50 text-navy-900">
                    FinXinfo
                  </th>
                  <th className="py-3.5 px-6 text-slate-500">Traditional In-House</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-appBorder">
                {whyChooseUs.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-darkText text-xs sm:text-sm">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 bg-navy-50/30 text-xs sm:text-sm font-medium text-navy-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{row.us}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-sm text-mutedText">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{row.them}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

