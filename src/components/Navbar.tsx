import React, { useState, useEffect } from 'react';
import { Video, Shield, PlusCircle, Globe, Search, Bell, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { Language } from '../types';
import { LogoState, DEFAULT_LOGO_URL, getLogoState } from '../utils/logoManager';
import { LogoModal } from './LogoModal';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onOpenOrderModal: () => void;
  onOpenTrackModal: () => void;
  onOpenNotifications?: () => void;
  notificationCount?: number;
  onOpenUpdatesModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  isAdmin,
  onOpenAdmin,
  onOpenOrderModal,
  onOpenTrackModal,
  onOpenNotifications,
  notificationCount = 0,
  onOpenUpdatesModal,
}) => {
  const [logoState, setLogoState] = useState<LogoState>(getLogoState);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  useEffect(() => {
    const handleLogoUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<LogoState>;
      if (customEvent.detail) {
        setLogoState(customEvent.detail);
      } else {
        setLogoState(getLogoState());
      }
    };
    window.addEventListener('gurudev:logo_updated', handleLogoUpdated);
    return () => window.removeEventListener('gurudev:logo_updated', handleLogoUpdated);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
          
          {/* Zone 1: Brand Wordmark (Single text element in display face, no pill badges) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 group"
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLogoModalOpen(true);
              }}
              title={
                lang === 'gu'
                  ? 'લોગો બદલો અથવા કાઢી નાખો (Click to Add / Remove Logo)'
                  : 'Click to Add / Change or Remove Logo'
              }
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-900 border border-amber-500/40 shadow-sm shadow-amber-500/10 flex items-center justify-center overflow-hidden cursor-pointer group-hover:border-amber-400 group-hover:scale-105 transition-all"
            >
              {logoState.mode === 'none' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-amber-500/80 hover:text-amber-400 transition-colors">
                  <PlusCircle className="w-4 h-4" />
                  <span className="text-[6px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">
                    + LOGO
                  </span>
                </div>
              ) : logoState.mode === 'custom' && logoState.customUrl ? (
                <img
                  src={logoState.customUrl}
                  alt="Gurudev Creative Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src={DEFAULT_LOGO_URL}
                  alt="Gurudev Creative Official Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Quick edit hint overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[7px] font-bold text-amber-300">
                <span>{lang === 'gu' ? 'બદલો' : 'EDIT'}</span>
              </div>
            </div>
            <span className="font-extrabold text-neutral-100 flex items-center gap-1">
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
          {onOpenUpdatesModal && (
            <button
              onClick={onOpenUpdatesModal}
              className="hover:text-amber-400 text-neutral-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 group"
              title={lang === 'gu' ? 'વેબસાઇટ લાઇવ અપડેટ્સ' : 'Website Live Updates'}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>{lang === 'gu' ? 'લાઇવ અપડેટ્સ' : 'Updates'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action + Utility Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Updates button on small screens */}
          {onOpenUpdatesModal && (
            <button
              onClick={onOpenUpdatesModal}
              className="md:hidden relative p-2 text-neutral-400 hover:text-amber-400 border border-neutral-800 hover:border-neutral-700 rounded-md transition-colors whitespace-nowrap shrink-0"
              title={lang === 'gu' ? 'વેબસાઇટ લાઇવ અપડેટ્સ' : 'Website Live Updates'}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>
          )}

          {/* Notifications Bell */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-neutral-400 hover:text-amber-400 border border-neutral-800 hover:border-neutral-700 rounded-md transition-colors whitespace-nowrap shrink-0"
              title={lang === 'gu' ? 'ઓર્ડર સ્ટેટસ સૂચનાઓ' : 'Order Status Alerts'}
            >
              <Bell className="w-3.5 h-3.5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-amber-400 text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          )}

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

    {/* Brand Logo Add / Remove / Change Modal */}
    <LogoModal
      isOpen={isLogoModalOpen}
      onClose={() => setIsLogoModalOpen(false)}
      lang={lang}
      logoState={logoState}
    />
  </>
  );
};
