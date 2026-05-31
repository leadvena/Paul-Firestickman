import { motion } from 'motion/react';
import { ArrowRight, Star, ShoppingBag, Shield } from 'lucide-react';

export default function Hero() {
  const scrollToForm = () => {
    const element = document.getElementById('order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-16 lg:py-24">
      {/* Background soft orange ambient lights */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-[#FF6B00]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Main Copy Area */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex max-w-max items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 text-xs text-[#FF6B00] mb-6"
            >
              <Star className="h-3 w-3 fill-current" />
              <span className="font-medium tracking-wider uppercase text-[11px]">Saint Helens' #1 Firestick Supplier</span>
            </motion.div>

            {/* Bold Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-none"
            >
              Your Favourite <span className="text-[#FF6B00]">Firestick Guy</span> in Saint Helens
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base text-[#a0a0a0] sm:text-lg md:text-xl leading-relaxed max-w-2xl"
            >
              Loaded 4K Firesticks & Subscriptions — Delivered to Your Door. No complex setup, no monthly contracts. Just plug and play.
            </motion.p>

            {/* CTA and Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                onClick={scrollToForm}
                id="hero-cta"
                className="group flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-8 py-4 font-heading text-lg font-bold tracking-wider text-white transition-all duration-200 hover:bg-[#E05E00]"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <a
                href="#packages"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-heading text-lg font-bold tracking-wider text-white transition-all duration-200 hover:bg-white/10"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>VIEW PACKAGES</span>
              </a>
            </motion.div>

            {/* Trust Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/5 pt-8 text-[#a0a0a0] text-sm"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[#FF6B00]" />
                <span className="font-semibold text-white">4 Years in Business</span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  <Star className="h-4 w-4 fill-current text-[#FF6B00]" />
                  <Star className="h-4 w-4 fill-current text-[#FF6B00]" />
                  <Star className="h-4 w-4 fill-current text-[#FF6B00]" />
                  <Star className="h-4 w-4 fill-current text-[#FF6B00]" />
                  <Star className="h-4 w-4 fill-current text-[#FF6B00]" />
                </div>
                <span>100s of Happy Customers</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Showcase Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-2 shadow-2xl shadow-[#FF6B00]/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img
                src="/src/assets/images/firestick_setup_1780205436173.png"
                alt="Paul's Loaded Firestick TV Setup"
                referrerPolicy="no-referrer"
                className="w-full object-cover aspect-[4/3] rounded-xl hover:scale-105 transition-transform duration-700"
              />
              
              {/* Image Floating Highlights */}
              <div className="absolute bottom-6 left-6 z-20 text-left">
                <span className="rounded bg-[#FF6B00] px-2 py-0.5 font-heading text-xs font-bold uppercase text-white">
                  Super Easy Setup
                </span>
                <p className="mt-1 text-sm font-semibold text-white">Plug into any TV HDMI port</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
