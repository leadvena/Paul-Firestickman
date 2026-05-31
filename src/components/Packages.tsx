import { motion } from 'motion/react';
import { Check, Tv, Send, Flame, Sparkles } from 'lucide-react';

interface PackagesProps {
  onSelectPackage: (packageName: string) => void;
}

export default function Packages({ onSelectPackage }: PackagesProps) {
  const handleSelect = (packageName: string) => {
    onSelectPackage(packageName);
    const element = document.getElementById('order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Staggered scroll container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Individual card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <section id="packages" className="bg-[#0f0f0f] py-20 border-t border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B00]">OUR OFFERS</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mt-2 leading-none">
            Choose Your Firestick Deal
          </h2>
          <p className="mt-4 text-[#a0a0a0] text-base sm:text-lg">
            Super fast delivery across the UK. Select the bundle that’s right for you.
          </p>
        </div>

        {/* PACKAGE CARDS GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch"
        >
          
          {/* CARD 1 - LOADED FIRE TV STICK 4K */}
          <motion.div
            variants={cardVariants}
            className="relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#121212] p-8 border border-[#FF6B00]/40 shadow-2xl shadow-[#FF6B00]/5 hover:border-[#FF6B00] transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* MOST POPULAR BADGE */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6B00] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-lg">
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex justify-between items-start mt-2">
                <div>
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                    <Tv className="h-5 w-5 text-[#FF6B00]" />
                    Loaded Fire TV Stick 4K
                  </h3>
                  <p className="text-sm text-[#a0a0a0]">Complete package - Plug & Play</p>
                </div>
                <div className="text-right">
                  <div className="font-heading text-4xl font-extrabold text-[#FF6B00] leading-none">£70</div>
                  <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider mt-1">One-Off Payment</div>
                </div>
              </div>

              {/* STAT DETAILS */}
              <div className="mt-6 space-y-3 border-t border-b border-white/5 py-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#a0a0a0]">Included:</span>
                  <span className="text-white font-medium">Physical Fire TV Stick + 12 Mo Subscription</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#a0a0a0]">Delivery method:</span>
                  <span className="text-[#FF6B00] font-semibold">Shipped safely to your address</span>
                </div>
              </div>

              {/* FEATURES LIST */}
              <ul className="mt-6 space-y-3.5">
                {[
                  "Brand New Amazon Fire TV Stick 4K, fresh in box",
                  "Loaded 12 Month Subscription fully setup by Paul",
                  "All apps preconfigured - zero tech knowledge needed",
                  "Dead easy Plug-and-Play (plug into HDMI and enter Wi-Fi)",
                  "Automatic free system & server updates, no manual tweaks",
                  "Ongoing dedicated Messenger support from Paul himself"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-white/90">
                    <Check className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleSelect("Loaded Fire TV Stick 4K — £70")}
                className="w-full rounded-xl bg-[#FF6B00] py-4 text-center font-heading text-lg font-bold tracking-wider text-white transition-colors duration-200 hover:bg-[#E05E00]"
              >
                ORDER THIS
              </button>
            </div>
          </motion.div>

          {/* CARD 2 - SUBSCRIPTION ONLY */}
          <motion.div
            variants={cardVariants}
            className="relative flex flex-col justify-between rounded-2xl bg-[#141414] p-8 border border-white/5 hover:border-white/15 transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
          >
            {/* BADGE */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1 border border-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              <span>For Stick Owners</span>
            </div>

            <div>
              <div className="flex justify-between items-start mt-2">
                <div>
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                    <Send className="h-5 w-5 text-[#FF6B00]" />
                    Subscription Only
                  </h3>
                  <p className="text-sm text-[#a0a0a0]">Use your existing device</p>
                </div>
                <div className="text-right">
                  <div className="font-heading text-4xl font-extrabold text-white leading-none">£50</div>
                  <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider mt-1">One-Off Payment</div>
                </div>
              </div>

              {/* STAT DETAILS */}
              <div className="mt-6 space-y-3 border-t border-b border-white/5 py-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#a0a0a0]">For:</span>
                  <span className="text-white font-medium">Existing Firestick / Smart Device owners</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#a0a0a0]">Delivery method:</span>
                  <span className="text-[#FF6B00] font-semibold">Sent fast via Facebook Messenger</span>
                </div>
              </div>

              {/* FEATURES LIST */}
              <ul className="mt-6 space-y-3.5">
                {[
                  "12 Months premium loaded active subscription access",
                  "Paul's straightforward, step-by-step installation guides",
                  "Works on Apple, Android, Smart TVs or any Fire TV Stick",
                  "Login details sent directly to your Messenger/Email inbox",
                  "Quick setup completed easily on your own TV or device",
                  "Ongoing dedicated Messenger support from Paul himself"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-white/90">
                    <Check className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleSelect("Subscription Only — £50")}
                className="w-full rounded-xl bg-white/5 border border-white/10 hover:border-white/20 py-4 text-center font-heading text-lg font-bold tracking-wider text-white transition-colors duration-200 hover:bg-white/10"
              >
                ORDER THIS
              </button>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
