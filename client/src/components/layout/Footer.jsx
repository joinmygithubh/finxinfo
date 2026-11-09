import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { siteConfig } from '../../config/siteConfig';
import api from '../../services/api';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState(null);
  const [subscribeError, setSubscribeError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setSubscribeError('Please enter a valid email.');
      return;
    }
    setSubscribing(true);
    setSubscribeMessage(null);
    setSubscribeError(null);

    try {
      const res = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      if (res.data.success) {
        setSubscribeMessage(res.data.message);
        setNewsletterEmail('');
      } else {
        setSubscribeError(res.data.message || 'Subscription failed.');
      }
    } catch (err) {
      setSubscribeError(
        err.response?.data?.message || 'Subscription service temporarily unavailable.'
      );
    } finally {
      setSubscribing(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800 relative z-20">
      {/* Newsletter Strip */}
      <div className="border-b border-navy-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-navy-900 to-navy-850 rounded-2xl border border-navy-700/80 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="text-xs font-bold text-americanRed uppercase tracking-wider">
                Monthly Executive Financial Briefing
              </span>
              <h3 className="text-2xl font-bold font-heading text-white mt-1">
                Stay Ahead of IRS Guidelines & Cash Flow Strategies
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Join over 4,500 US business owners and accounting professionals receiving our monthly QuickBooks and tax deduction insights.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter business email..."
                  className="px-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-americanRed w-full sm:w-72"
                  disabled={subscribing}
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="py-3 px-6 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white text-sm font-bold shadow-cta transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {subscribeMessage && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{subscribeMessage}</span>
                </div>
              )}
              {subscribeError && (
                <div className="mt-2 text-xs text-americanRed flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{subscribeError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              FinXinfo is a premium financial services platform staffed by Certified QuickBooks ProAdvisors. We deliver comprehensive ledger management, payroll, and financial reporting, with official tax preparation and filing executed through accredited, licensed US CPA partner firms.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC-2 Compliant &bull; 256-Bit Data Security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider mb-4 border-l-2 border-americanRed pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  Financial Solutions
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('industries')} className="hover:text-americanRed transition-colors">
                  Industries We Serve
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('cpa-outsourcing')} className="hover:text-americanRed transition-colors">
                  CPA Outsourcing
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="hover:text-americanRed transition-colors">
                  Monthly Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('why-us')} className="hover:text-americanRed transition-colors">
                  Why Choose FinXinfo
                </button>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-slate-100 text-slate-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider mb-4 border-l-2 border-americanRed pl-2.5">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  Monthly Bookkeeping
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  QuickBooks Clean-Up
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  Full-Cycle Payroll
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  CPA Tax Preparation
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  IRS & State Tax Filing
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-americanRed transition-colors">
                  Financial Reporting & P&L
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider mb-4 border-l-2 border-americanRed pl-2.5">
              Contact & Hours
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-americanRed flex-shrink-0 mt-0.5" />
                <a href={`tel:${siteConfig.contact.phoneRaw}`} className="hover:text-white font-semibold">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-americanRed flex-shrink-0 mt-0.5" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-americanRed flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-americanRed flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-14 pt-8 border-t border-navy-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} FinXinfo. All rights reserved. Intuit and QuickBooks are registered trademarks of Intuit Inc. FinXinfo is an independent entity. Official CPA services executed through licensed US partners.
          </p>

          <div className="flex items-center gap-6">
            <a href="#contact" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#contact" className="hover:text-slate-200 transition-colors">
              Terms & Conditions
            </a>
            <Link to="/admin/login" className="hover:text-americanRed transition-colors font-medium">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

