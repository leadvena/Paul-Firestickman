import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "How long does delivery take?",
      answer: "Most Firesticks are delivered within 2–3 working days. You'll get a message from Paul directly on Facebook Messenger once it has been packed and is on its way to you."
    },
    {
      question: "How do I receive my subscription?",
      answer: "If you ordered the Subscription Only package, Paul will send your custom login credentials and clear activation instructions directly via Facebook Messenger — usually within a few hours of confirming your completed order."
    },
    {
      question: "What areas do you deliver to?",
      answer: "Paul delivers across the whole of the United Kingdom! Wherever you are based, from Scotland down to Cornwall, we've got you fully covered."
    },
    {
      question: "How do I set up my Firestick?",
      answer: "It's dead easy! Simply plug the Firestick into your television's HDMI port, connect it to your home Wi-Fi network, and you're ready to go. Paul also sends simple setup guides and is always there to walk you through it if you need help."
    },
    {
      question: "What if I have an issue or need support?",
      answer: "No stress! Just drop Paul a direct message on Messenger. He's proud to look after his customers and keeps himself on hand to troubleshoot, answer questions, or sort thing out if you face a hiccup."
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section id="faq" className="bg-[#0f0f0f] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B00]">COMMON QUESTIONS</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mt-1 leading-none">
            FAQ & Help
          </h2>
          <p className="mt-4 text-[#a0a0a0] text-sm">
            Everything you need to know about delivery, setup, and support in plain English.
          </p>
        </div>

        {/* ACCORDION ITEMS */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-[#141414] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-white focus:outline-none focus:bg-white/5 focus:ring-1 focus:ring-[#FF6B00]/40"
                >
                  <span className="font-heading text-lg font-bold tracking-wider flex items-center gap-3 pr-4">
                    <HelpCircle className="h-5 w-5 text-[#FF6B00] shrink-0" />
                    {item.question}
                  </span>
                  <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FF6B00]' : 'text-[#a0a0a0]'}`}>
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </button>

                {/* Animated Body height/fade */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-60 border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-5 text-sm sm:text-base text-[#a0a0a0] leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
