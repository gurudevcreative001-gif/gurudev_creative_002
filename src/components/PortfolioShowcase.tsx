import React from 'react';
import { Play, Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { PORTFOLIO_SAMPLES } from '../data/initialData';
import { Language } from '../types';

interface PortfolioShowcaseProps {
  lang: Language;
  onSelectSample: (sampleTitle: string) => void;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  lang,
  onSelectSample,
}) => {
  return (
    <section id="showcase" className="py-16 md:py-24 border-b border-neutral-800 bg-neutral-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            {lang === 'gu' ? 'અમારું કામ અને ક્વોલિટી' : 'STUDIO PORTFOLIO & WORK'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'gu' ? 'સિનેમેટિક અને વાયરલ એડિટ્સ' : 'Precision Editing, High Production Value'}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            {lang === 'gu'
              ? 'દરેક વિડિયો માટે પ્રીમિયમ કલર ગ્રેડિંગ, ડાયનેમિક સાઉન્ડ ડિઝાઇન અને વાયરલ ટ્રાન્ઝિશન.'
              : 'Cinematic color science, dynamic sound design, and viral retention editing.'}
          </p>
        </div>

        {/* 3 Large Showcase Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PORTFOLIO_SAMPLES.map((sample) => (
            <div
              key={sample.id}
              className="group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Slot with Scrim and Fallback */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                  <img
                    src={sample.image}
                    alt={sample.titleEn}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/20" />
                  
                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400">
                    {lang === 'gu' ? sample.categoryLabelGu : sample.categoryLabelEn}
                  </div>

                  {/* Turnaround Badge */}
                  <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded-md text-[11px] font-mono text-neutral-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{sample.turnaround}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {lang === 'gu' ? sample.titleGu : sample.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {sample.descriptionGu}
                  </p>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">
                      {lang === 'gu' ? 'અંદાજિત ભાવ:' : 'Estimated Price:'}
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {sample.priceEstimate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order This Style Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectSample(sample.titleEn)}
                  className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'gu' ? 'આવી સ્ટાઇલ ઓર્ડર કરો' : 'Order This Style'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
