import React from 'react';
import { motion } from 'framer-motion';
import {
  HardHat,
  HeartPulse,
  UtensilsCrossed,
  Building2,
  ShoppingCart,
  Briefcase,
  Store,
  HandHeart,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const industryIcons = {
  HardHat,
  HeartPulse,
  UtensilsCrossed,
  Building2,
  ShoppingCart,
  Briefcase,
  Store,
  HandHeart,
};

export const IndustriesSection = () => {
  const scrollToContactWithIndustry = (industryName) => {
    const messageInput = document.getElementById('message-input');
    if (messageInput && !messageInput.value) {
      messageInput.value = `Hello, I run a business in the ${industryName} industry and need specialized bookkeeping & tax support.`;
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="industries" className="py-20 bg-surface-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-americanRed"></span>
            Specialized Industry Practice
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900 tracking-tight">
            Industries We Serve Across the US
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedText leading-relaxed">
            Every industry presents unique chart-of-accounts challenges, compliance regulations,
            and software stacks. Our ProAdvisors bring battle-tested domain expertise.
          </p>
        </div>

        {/* 8 Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.industries.map((ind, index) => {
            const IconComp = industryIcons[ind.icon] || Briefcase;
            return (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-appBorder p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-200 flex items-center justify-center mb-4 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-navy-900 group-hover:text-americanRed transition-colors mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-mutedText leading-relaxed mb-4">
                    {ind.requirements}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => scrollToContactWithIndustry(ind.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-americanRed transition-colors"
                  >
                    <span>Industry Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;

