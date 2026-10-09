import React, { useState } from 'react';
import { Check, Sliders, Zap, Film, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/initialData';
import { Language, PricingPlan, VideoCategory } from '../types';
import { calculateEstimatedPrice } from '../utils/storage';

interface PricingTiersProps {
  lang: Language;
  onSelectPlan: (plan: PricingPlan) => void;
  onSelectCustomConfig: (config: {
    category: VideoCategory;
    durationMinutes: number;
    rushDelivery: boolean;
    includeSubtitles: boolean;
    soundDesign: boolean;
    colorGrading: boolean;
    estimatedPrice: number;
  }) => void;
}

export const PricingTiers: React.FC<PricingTiersProps> = ({
  lang,
  onSelectPlan,
  onSelectCustomConfig,
}) => {
  // Estimator State
  const [estCategory, setEstCategory] = useState<VideoCategory>('reels_shorts');
  const [estDuration, setEstDuration] = useState<number>(0.5); // in minutes
  const [estSubtitles, setEstSubtitles] = useState<boolean>(true);
  const [estSoundDesign, setEstSoundDesign] = useState<boolean>(true);
  const [estColorGrading, setEstColorGrading] = useState<boolean>(true);
  const [estRushDelivery, setEstRushDelivery] = useState<boolean>(false);

  const calculatedPrice = calculateEstimatedPrice({
    category: estCategory,
    durationMinutes: estDuration,
    rushDelivery: estRushDelivery,
    includeSubtitles: estSubtitles,
    soundDesign: estSoundDesign,
    colorGrading: estColorGrading,
  });

  const handleOrderWithEstimate = () => {
    onSelectCustomConfig({
      category: estCategory,
      durationMinutes: estDuration,
      rushDelivery: estRushDelivery,
      includeSubtitles: estSubtitles,
      soundDesign: estSoundDesign,
      colorGrading: estColorGrading,
      estimatedPrice: calculatedPrice,
    });
  };

  return (
    <section id="pricing" className="py-16 md:py-24 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            {lang === 'gu' ? 'પારદર્શક ભાવ પત્રક' : 'TRANSPARENT PRICING'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'gu' ? '₹150 થી ₹2000 ના પોસાય તેવા ભાવ' : 'Professional Edits from ₹150 to ₹2,000'}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            {lang === 'gu'
              ? 'કોઈ છૂપા ચાર્જીસ વગર. દરેક ક્રિએટર અને બિઝનેસ માટે યોગ્ય પેકેજ.'
              : 'Zero hidden fees. High-impact editing tailored for creators, startups, and events.'}
          </p>
        </div>

        {/* 4 Core Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-xl p-6 transition-all border ${
                  isPopular
                    ? 'bg-neutral-900 border-amber-500/50 shadow-xl shadow-amber-500/10'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === 'gu' ? 'સૌથી લોકપ્રિય' : 'Most Popular'}
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {lang === 'gu' ? plan.nameGu : plan.nameEn}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                      {lang === 'gu' ? plan.taglineGu : plan.taglineEn}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="py-4 border-y border-neutral-800 mb-5">
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                      {plan.priceLabel}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      {lang === 'gu' ? 'પ્રતિ વિડિયો · 100% ક્વોલિટી ગેરંટી' : 'Per video edit · 100% Quality Guaranteed'}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 mb-6 text-xs text-neutral-300">
                    {(lang === 'gu' ? plan.featuresGu : plan.featuresEn).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isPopular
                      ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300 active:scale-95'
                      : 'bg-neutral-800 text-white hover:bg-neutral-700'
                  }`}
                >
                  <span>{lang === 'gu' ? 'આ પેકેજ પસંદ કરો' : 'Choose Package'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Custom Price Estimator */}
        <div id="estimator" className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <Sliders className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ઇન્ટરેક્ટિવ કેલ્ક્યુલેટર' : 'LIVE PRICE CALCULATOR'}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {lang === 'gu' ? 'તમારા વિડિયો જરૂરિયાત મુજબ લાઇવ ભાવ ગણો' : 'Custom Video Price Estimator'}
              </h3>
            </div>
            <div className="text-xs text-neutral-400 max-w-xs">
              {lang === 'gu'
                ? 'દરેક વિડિયો માટે બજેટ ₹150 થી ₹2000 ની મર્યાદામાં રહેશે.'
                : 'All custom options are strictly calibrated between ₹150 and ₹2000.'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Options Controls */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  {lang === 'gu' ? 'વિડિયો કેટેગરી પસંદ કરો:' : 'Select Video Category:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'reels_shorts', gu: 'રીલ્સ / શોર્ટ્સ', en: 'Reels / Shorts' },
                    { id: 'youtube_vlog', gu: 'યૂટ્યુબ વ્લોગ', en: 'YouTube Vlog' },
                    { id: 'brand_commercial', gu: 'બિઝનેસ એડ', en: 'Commercial Ad' },
                    { id: 'cinematic_wedding', gu: 'વેડિંગ સિનેમેટિક', en: 'Wedding Video' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setEstCategory(cat.id as VideoCategory)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                        estCategory === cat.id
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {lang === 'gu' ? cat.gu : cat.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-2">
                  <span>{lang === 'gu' ? 'લંબાઈ (Duration):' : 'Estimated Duration:'}</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {estDuration < 1
                      ? `${Math.round(estDuration * 60)} Seconds`
                      : `${estDuration} Minutes`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="10"
                  step="0.25"
                  value={estDuration}
                  onChange={(e) => setEstDuration(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-neutral-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                  <span>15s (Reel)</span>
                  <span>1 Min</span>
                  <span>5 Min</span>
                  <span>10 Min (Vlog)</span>
                </div>
              </div>

              {/* Addon Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 cursor-pointer hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={estSubtitles}
                    onChange={(e) => setEstSubtitles(e.target.checked)}
                    className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {lang === 'gu' ? 'એનિમેટેડ સબટાઈટલ્સ' : 'Animated Captions'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang === 'gu' ? 'વાયરલ એલેક્સ હોર્મોઝી / ગુજરાતી ફોન્ટ' : 'Viral bold animated typography'}
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 cursor-pointer hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={estSoundDesign}
                    onChange={(e) => setEstSoundDesign(e.target.checked)}
                    className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {lang === 'gu' ? 'સાઉન્ડ એફએક્સ અને મ્યુઝિક' : 'SFX & Sound Mixing'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang === 'gu' ? 'હૂશ, પોપ અને બીટ-મેચ્ડ ગીતો' : 'Whooshes, riser, & vocal leveling'}
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 cursor-pointer hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={estColorGrading}
                    onChange={(e) => setEstColorGrading(e.target.checked)}
                    className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {lang === 'gu' ? 'પ્રો કલર ગ્રેડિંગ' : 'Color Grading (LUTs)'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang === 'gu' ? 'સિનેમેટિક વાઇબ્રન્ટ ટોનિંગ' : 'Cinematic tone correction & LUTs'}
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 cursor-pointer hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={estRushDelivery}
                    onChange={(e) => setEstRushDelivery(e.target.checked)}
                    className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'gu' ? '24 કલાક એક્સપ્રેસ ડિલિવરી' : '24-Hour Rush Delivery'}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang === 'gu' ? 'પ્રાથમિકતા સાથે ઝડપી રેન્ડર' : 'Priority rendering within 24h'}
                    </div>
                  </div>
                </label>
              </div>

            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-4 p-6 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between text-center space-y-5">
              <div>
                <div className="text-xs text-neutral-400 mb-1 font-medium">
                  {lang === 'gu' ? 'અંદાજિત ભાવ (Estimated Cost)' : 'Estimated Price'}
                </div>
                <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                  ₹{calculatedPrice}
                </div>
                <div className="text-[11px] text-neutral-400 mt-2">
                  {lang === 'gu'
                    ? '100% ફાઇનલ વિડિયો ડિલિવરી સાથે'
                    : 'Includes full master render & 1 revision'}
                </div>
              </div>

              <div className="space-y-2 text-left text-xs text-neutral-400 border-t border-neutral-800 pt-4">
                <div className="flex justify-between">
                  <span>{lang === 'gu' ? 'ન્યૂનતમ ભાવ:' : 'Min Price:'}</span>
                  <span className="font-mono text-neutral-300">₹150</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'gu' ? 'મહત્તમ ભાવ:' : 'Max Price:'}</span>
                  <span className="font-mono text-neutral-300">₹2000</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'gu' ? 'ડિલિવરી સમય:' : 'Est. Delivery:'}</span>
                  <span className="font-mono text-amber-400">{estRushDelivery ? '24 Hours' : '48-72 Hours'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOrderWithEstimate}
                className="w-full py-3 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <Film className="w-4 h-4" />
                <span>{lang === 'gu' ? 'આ અંદાજ સાથે ઓર્ડર કરો' : 'Book with this Estimate'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
