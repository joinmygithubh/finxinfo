import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../sections/HeroSection';
import TrustCredibilitySection from '../sections/TrustCredibilitySection';
import ServicesSection from '../sections/ServicesSection';
import WhyChooseUsSection from '../sections/WhyChooseUsSection';
import IndustriesSection from '../sections/IndustriesSection';
import CpaOutsourcingSection from '../sections/CpaOutsourcingSection';
import PricingSection from '../sections/PricingSection';
import FaqSection from '../sections/FaqSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/layout/Footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-light text-darkText selection:bg-americanRed-light selection:text-americanRed-900">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustCredibilitySection />
        <ServicesSection />
        <WhyChooseUsSection />
        <IndustriesSection />
        <CpaOutsourcingSection />
        <PricingSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

