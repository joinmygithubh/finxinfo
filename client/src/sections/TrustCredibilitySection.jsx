import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileCheck, ShieldCheck, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const iconMap = {
  Award: Award,
  FileCheck: FileCheck,
  ShieldCheck: ShieldCheck,
  MapPin: MapPin,
};

export const TrustCredibilitySection = () => {
  return (
    <section className="bg-white border-b border-appBorder py-10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.trustStats.map((item, index) => {
            const IconComp = iconMap[item.icon] || ShieldCheck;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface-light border border-slate-200/70 hover:border-navy-200 transition-colors shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-navy-900 text-americanRed flex items-center justify-center flex-shrink-0 shadow-sm">
                  <IconComp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-americanRed mb-0.5">
                    {item.value}
                  </div>
                  <h3 className="font-heading font-bold text-darkText text-sm sm:text-base leading-snug">
                    {item.label}
                  </h3>
                  <p className="text-xs text-mutedText mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustCredibilitySection;

