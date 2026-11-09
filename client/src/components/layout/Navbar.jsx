import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { siteConfig } from '../../config/siteConfig';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Industries', href: '/#industries' },
    { name: 'CPA Outsourcing', href: '/#cpa-outsourcing' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Why Us', href: '/#why-us' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate(href);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notification / Trust Bar */}
      <div className="bg-navy-950 text-white text-xs border-b border-navy-800/80 hidden sm:block py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">
              Accepting New Clients Nationwide &bull; Free QuickBooks Consultation
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-americanRed" />
              Licensed US CPA Partners
            </span>
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="text-white hover:text-americanRed transition-colors font-bold flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-americanRed" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-appBorder py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* FinXinfo Brand Logo + Text */}
          <div className="flex items-center flex-shrink-0">
            <BrandLogo variant="dark" showText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-sm font-medium text-darkText hover:text-navy-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="hidden xl:flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-americanRed transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-americanRed">
                <Phone className="w-4 h-4" />
              </div>
              <span>{siteConfig.contact.phone}</span>
            </a>

            <button
              onClick={() => handleNavClick('/#contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-americanRed hover:bg-americanRed-hover text-white text-sm font-semibold shadow-cta transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('/#contact')}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold rounded-md bg-americanRed text-white"
            >
              Book Call
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-x-0 top-[65px] bg-white border-b border-appBorder shadow-2xl z-40 overflow-hidden"
          >
            <div className="px-5 pt-3 pb-6 space-y-2">
              <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between sm:hidden">
                <BrandLogo variant="dark" showText={true} />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</span>
              </div>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-darkText hover:text-navy-900 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-navy-50 text-navy-900 font-bold text-sm"
                >
                  <Phone className="w-4 h-4 text-americanRed" />
                  <span>Call {siteConfig.contact.phone}</span>
                </a>

                <button
                  onClick={() => handleNavClick('/#contact')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-americanRed hover:bg-americanRed-hover text-white font-bold text-sm shadow-md"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

