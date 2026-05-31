/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Packages from './components/Packages';
import HowItWorks from './components/HowItWorks';
import OrderForm from './components/OrderForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  // State to hold the chosen package type for automatic dropdown sync
  const [selectedPackage, setSelectedPackage] = useState<string>('Loaded Fire TV Stick 4K — £70');

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] font-sans antialiased text-white selection:bg-[#FF6B00] selection:text-white">
      {/* GLOWING AMBIENT BACKGROUND ACCENTS */}
      <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/5 blur-[120px]" />
      
      {/* 1. STICKY GLASSMORPHIC HEADER */}
      <Header />

      {/* 2. PERSUASIVE HERO SECTION */}
      <Hero />

      {/* 3. MAIN PRODUCT PACKAGES */}
      <Packages onSelectPackage={setSelectedPackage} />

      {/* 4. CLEAR TIMELINE OF THE LOGISTICAL FLOW */}
      <HowItWorks />

      {/* 5. ENGAGING CONFIGURE & ORDER SECURE FORM */}
      <OrderForm selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />

      {/* 6. TRANSPARENT ACCORDION FOR FREQUENTLY ASKED QUESTIONS */}
      <FAQ />

      {/* 7. DETAILED TRUST FOOTER */}
      <Footer />
    </div>
  );
}
