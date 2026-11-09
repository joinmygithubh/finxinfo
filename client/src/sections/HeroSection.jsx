import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  CheckCircle2,
  Award,
  Lock,
  Globe2,
  Star,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import InteractiveDashboardVisual from '../components/dashboard/InteractiveDashboardVisual';

export const HeroSection = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-navy-gradient text-white py-16 lg:py-24 border-b border-navy-800">
      {/* Background Decorative USA Flag-inspired Subtle Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-americanRed filter blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* ProAdvisor Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/90 border border-navy-700/80 shadow-sm text-xs font-semibold text-white">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-americanRed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-americanRed"></span>
              </span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="tracking-wide uppercase text-[11px] font-bold">
                PROADVISOR CERTIFIED FINANCIAL EXPERTS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.12]">
              Financial Clarity for{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white">Growing US</span>
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-americanRed/80 -z-0 rounded-sm"></span>
              </span>{' '}
              Businesses
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Certified QuickBooks ProAdvisors providing professional bookkeeping, payroll,
              financial reporting and tax services through trusted licensed US CPA partners.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white text-base font-bold shadow-cta transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-navy-800/90 hover:bg-navy-700 border border-navy-600/80 text-white text-base font-bold transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-americanRed">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>Call Now: {siteConfig.contact.phone}</span>
              </a>
            </div>

            {/* Trust Indicators Pill Row */}
            <div className="pt-6 border-t border-navy-800/90 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Certified QuickBooks ProAdvisor</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Trusted Licensed US CPA Partner</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Globe2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Serving Businesses Nationwide</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Secure Financial Data (256-Bit)</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Financial Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <InteractiveDashboardVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

