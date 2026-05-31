import { MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

export default function Header() {
  const scrollToForm = () => {
    const element = document.getElementById('order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO AREA */}
        <div className="flex items-center gap-2.5">
          <img
            src="public/logo.png"
            alt="PaulFirestickMan Logo"
            className="h-14 w-14 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <span id="logo-text" className="font-heading text-xl font-bold tracking-wider text-white sm:text-2xl">
              Paul<span className="text-[#FF6B00]">Firestick</span>Man
            </span>
            <div className="flex items-center gap-1 text-[10px] text-[#a0a0a0]">
              <MapPin className="h-3 w-3 text-[#FF6B00]" />
              <span>Saint Helens, UK</span>
            </div>
          </div>
        </div>

        {/* TRUST BADGE AND BUTTON */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 xl:flex">
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
            <span>4 Years in Business</span>
          </div>

          <button
            onClick={scrollToForm}
            id="header-cta"
            className="rounded-lg bg-[#FF6B00] px-4 py-2 font-heading text-sm font-bold tracking-wider text-white transition-colors duration-200 hover:bg-[#E05E00]"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </header>
  );
}
