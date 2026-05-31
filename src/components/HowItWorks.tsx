import { FileText, MessageSquareQuote, Gift } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: FileText,
      title: "Fill in the order form below",
      desc: "Choose your deal, type your UK shipping/contact details into the form and press the send button.",
    },
    {
      num: "02",
      icon: MessageSquareQuote,
      title: "Paul confirms your details",
      desc: "You'll auto-redirect to Messenger or your order text will open. Paul will quickly confirm the details with you.",
    },
    {
      num: "03",
      icon: Gift,
      title: "Receive your loaded access",
      desc: "For physical loaded sticks, yours will be shipped within 2-3 days. Subscriptions are sent in a few hours!",
    },
  ];

  return (
    <section className="bg-[#0a0a0a] py-20 relative overflow-hidden">
      {/* Background Soft Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B00]">SIMPLE PROCESS</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mt-1 leading-none">
            How It Works
          </h2>
          <p className="mt-4 text-[#a0a0a0] text-base">
            Ordering is simple, transparent, and built on trust. No complicated signup flows.
          </p>
        </div>

        {/* TIMELINE STEPS ROW */}
        <div className="relative mt-8">
          
          {/* Connector Line for Desktop */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-16 bg-white/5 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  
                  {/* Step Hex/Circle */}
                  <div className="relative flex items-center justify-center mb-6">
                    {/* Big background step number */}
                    <span className="absolute -top-6 -left-6 font-heading text-7xl font-black text-white/[0.03] select-none tracking-widest">
                      {step.num}
                    </span>

                    {/* Circle Icon Body */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#141414] border border-white/10 text-[#FF6B00] transition-colors duration-300 group-hover:border-[#FF6B00] group-hover:bg-[#1f1f1f]">
                      <IconComponent className="h-9 w-9" />
                      
                      {/* Step Badge */}
                      <span className="absolute -bottom-2 right-[-4px] flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B00] font-heading font-bold text-xs text-white shadow-md">
                        {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-heading text-xl font-bold tracking-wide text-white mt-2 group-hover:text-[#FF6B00] transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#a0a0a0] leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
