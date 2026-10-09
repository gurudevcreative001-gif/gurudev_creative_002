import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, CheckCircle2, Film, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  lang: Language;
  onOpenOrderModal: () => void;
  onSearchOrder: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenOrderModal,
  onSearchOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchOrder(searchQuery.trim());
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-neutral-950 py-12 md:py-20 lg:py-24">
      {/* Background Studio Visual & Ambient Glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/hero_video_editing_studio_1791513305504.jpg"
          alt="Gurudev Creative Studio Workstation"
          className="w-full h-full object-cover object-center filter blur-sm"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Studio Identity Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'gu'
                  ? 'ગુરુદેવ ક્રિએટિવ — પ્રીમિયમ વિડિયો એડિટિંગ સ્ટુડિયો'
                  : 'Gurudev Creative_002 — Professional Post-Production Studio'}
              </span>
            </div>

            {/* Hero Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              {lang === 'gu' ? (
                <>
                  તમારા વીડિયોને બનાવો <span className="text-amber-400">સિનેમેટિક</span> અને વાયરલ.
                </>
              ) : (
                <>
                  Transform Raw Footage Into <span className="text-amber-400">Cinematic Masterpieces</span>.
                </>
              )}
            </h1>

            {/* Subtitle / Value Proposition with explicit pricing mention */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              {lang === 'gu'
                ? 'વાયરલ ઇન્સ્ટાગ્રામ રીલ્સ, યુટ્યુબ વ્લોગ્સ, બ્રાન્ડ એડ્સ અને વેડિંગ સિનેમેટિક હાઇલાઇટ્સ. માત્ર ₹150 થી ₹2000 ના પારદર્શક ભાવે ઝડપી ડિલિવરી સાથે.'
                : 'High-impact Instagram Reels, YouTube Vlogs, Commercial Ads & Wedding Highlights. Transparent rates from ₹150 to ₹2000 with lightning-fast turnaround.'}
            </p>

            {/* Trust and Feature Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'gu' ? '₹150 થી ₹2000 ના ફ્લેટ રેટ' : 'Transparent ₹150 - ₹2000'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'gu' ? 'લાઇવ ઓર્ડર ટ્રેકિંગ' : 'Live Status Tracking'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'gu' ? 'ફાઇનલ HD ડાઉનલોડ' : 'Direct HD Download'}</span>
              </div>
            </div>

            {/* CTAs and Direct Status Tracker Bar */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenOrderModal}
                  className="px-6 py-3 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'ઓર્ડર બુક કરો (₹150+)' : 'Book Video Edit (₹150+)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#pricing"
                  className="px-5 py-3 text-sm font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
                >
                  {lang === 'gu' ? 'ભાવ પત્રક જુઓ' : 'Explore Packages'}
                </a>
              </div>

              {/* Instant Order Status Quick Search */}
              <div className="pt-3 max-w-lg">
                <div className="text-xs text-neutral-400 mb-2 font-medium">
                  {lang === 'gu'
                    ? 'તમારો અગાઉનો ઓર્ડર ટ્રેક કરવો છે? ઓર્ડર ID અથવા મોબાઇલ નંબર લખો:'
                    : 'Track your ongoing order status by Order ID or Mobile Number:'}
                </div>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg focus-within:border-amber-500/50 transition-colors"
                >
                  <Search className="w-4 h-4 text-neutral-400 ml-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'gu'
                        ? 'દા.ત. GC-2026-8801 અથવા 9825145890'
                        : 'e.g. GC-2026-8801 or 9825145890'
                    }
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none px-2"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    {lang === 'gu' ? 'સ્ટેટસ ચેક' : 'Track'}
                  </button>
                </form>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1.5">
                  <span>{lang === 'gu' ? 'ટેસ્ટ કરવા ટ્રાય કરો:' : 'Quick Demo ID:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('GC-2026-8801');
                      onSearchOrder('GC-2026-8801');
                    }}
                    className="text-amber-400 hover:underline font-mono"
                  >
                    GC-2026-8801
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('GC-2026-8802');
                      onSearchOrder('GC-2026-8802');
                    }}
                    className="text-amber-400 hover:underline font-mono"
                  >
                    GC-2026-8802
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Frame Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="/src/assets/images/hero_video_editing_studio_1791513305504.jpg"
                alt="Gurudev Creative Pro Studio"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-xs">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5 font-mono">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Gurudev Studio Pipeline</span>
                  </span>
                  <span>4K 60FPS Timeline</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{lang === 'gu' ? 'ભાવ દર: ₹150 થી ₹2000' : 'Pricing: ₹150 to ₹2000'}</span>
                  <span className="text-amber-400 font-mono">100% Client Satisfaction</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
