import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenCheck,
  Wrench,
  Users,
  Calculator,
  Landmark,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const iconMap = {
  BookOpenCheck: BookOpenCheck,
  Wrench: Wrench,
  Users: Users,
  Calculator: Calculator,
  Landmark: Landmark,
  BarChart3: BarChart3,
};

export const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleSelectServiceForConsultation = (serviceTitle) => {
    setSelectedService(null);
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
      serviceSelect.value = serviceTitle;
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-surface-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-americanRed"></span>
            End-to-End Accounting Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-navy-900 tracking-tight">
            Comprehensive Financial Solutions for US Businesses
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedText leading-relaxed">
            From daily transaction categorization to advanced financial reporting, we help
            businesses maintain accurate financial records and make better decisions.
          </p>
        </div>

        {/* 6 Premium Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.services.map((service, index) => {
            const IconComp = iconMap[service.icon] || BookOpenCheck;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-appBorder p-7 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative group"
              >
                {/* Top Accent Bar */}
                <div className="absolute top-0 inset-x-8 h-1 bg-transparent group-hover:bg-americanRed rounded-t-full transition-colors duration-300"></div>

                <div>
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-xl bg-navy-50 text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-200 flex items-center justify-center p-3 shadow-sm">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-navy-800 border border-slate-200">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold font-heading text-navy-900 group-hover:text-americanRed transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5 mb-3">
                    {service.subtitle}
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-mutedText leading-relaxed mb-5">
                    {service.shortDesc}
                  </p>

                  {/* Key Feature List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-darkText">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Action */}
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-navy-900 text-navy-900 hover:text-white border border-slate-200 hover:border-navy-900 font-semibold text-sm transition-all duration-200"
                  >
                    <span>Learn More & Scope</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-appBorder"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center">
                  {React.createElement(iconMap[selectedService.icon] || BookOpenCheck, {
                    className: 'w-6 h-6',
                  })}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-americanRed">
                    {selectedService.badge}
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-navy-900">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-darkText mb-4 leading-relaxed">
                {selectedService.shortDesc}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6">
                <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5">
                  Scope of Work Included:
                </h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-darkText">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleSelectServiceForConsultation(selectedService.title)}
                  className="flex-1 py-3 px-4 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white font-bold text-sm shadow-md transition-all text-center"
                >
                  Request Consultation For This Service
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-darkText font-semibold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;

