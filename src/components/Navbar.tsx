import React from 'react';
import { Video, Shield, PlusCircle, Globe, Search } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onOpenOrderModal: () => void;
  onOpenTrackModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  isAdmin,
  onOpenAdmin,
  onOpenOrderModal,
  onOpenTrackModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Zone 1: Brand Wordmark (Single text element in display face, no pill badges) */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-neutral-100">
            Gurudev Creative<span className="text-amber-400">_002</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links (single-line, clean text links) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-neutral-400">
          <a
            href="#services"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'gu' ? 'અમારી સેવાઓ' : 'Our Services'}
          </a>
          <a
            href="#pricing"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'gu' ? 'ભાવ અને પેકેજ' : 'Pricing & Plans'}
          </a>
          <a
            href="#showcase"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'gu' ? 'સેમ્પલ વર્ક' : 'Portfolio'}
          </a>
          <a
            href="#estimator"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'gu' ? 'ભાવ કેલ્ક્યુલેટર' : 'Price Calculator'}
          </a>
          <a
            href="#support"
            className="hover:text-emerald-400 text-neutral-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{lang === 'gu' ? 'WhatsApp સપોર્ટ' : 'Support'}</span>
          </a>
          <button
            onClick={onOpenTrackModal}
            className="hover:text-amber-400 text-neutral-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'gu' ? 'ઓર્ડર ટ્રેકિંગ' : 'Track Order'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action + Utility Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 border border-neutral-800 rounded-md hover:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
            title="ભાષા બદલો / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums font-medium">
              {lang === 'gu' ? 'ENG' : 'ગુજ'}
            </span>
          </button>

          {/* Admin Login / Admin Panel Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
              isAdmin
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
            title="ફક્ત એડમિન લોગિન / Admin Portal"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdmin ? (lang === 'gu' ? 'એડમિન કન્સોલ' : 'Admin Panel') : (lang === 'gu' ? 'એડમિન' : 'Admin')}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'gu' ? 'ઓર્ડર આપો' : 'New Order'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
