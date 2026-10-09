import React, { useState } from 'react';
import { Video, Palette, Check, ArrowRight, Sparkles, Film, Image as ImageIcon } from 'lucide-react';
import { GURUDEV_SERVICES } from '../data/initialData';
import { Language, MainCategory, ServiceItem } from '../types';

interface OurServicesSectionProps {
  lang: Language;
  onSelectService: (service: ServiceItem) => void;
}

export const OurServicesSection: React.FC<OurServicesSectionProps> = ({
  lang,
  onSelectService,
}) => {
  // Cascading dropdown state matching user's exact snippet
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | ''>('video');
  const [selectedServiceName, setSelectedServiceName] = useState<string>('Instagram Reel Editing');
  const [selectedPrice, setSelectedPrice] = useState<number | ''>(150);

  // Active view tab for the showcase grid
  const [activeTab, setActiveTab] = useState<MainCategory>('video');

  const handleCategoryChange = (cat: MainCategory | '') => {
    setSelectedCategory(cat);
    if (!cat) {
      setSelectedServiceName('');
      setSelectedPrice('');
      return;
    }
    // Set to empty service to require selection, or first item if desired
    setSelectedServiceName('');
    setSelectedPrice('');
  };

  const handleServiceChange = (val: string) => {
    if (!val) {
      setSelectedServiceName('');
      setSelectedPrice('');
      return;
    }
    const [name, price] = val.split('|||');
    setSelectedServiceName(name);
    setSelectedPrice(Number(price));
  };

  const handleBookNow = () => {
    if (!selectedCategory || !selectedServiceName || selectedPrice === '') return;
    const serviceItem: ServiceItem = {
      name: selectedServiceName,
      price: Number(selectedPrice),
      category: selectedCategory,
    };
    onSelectService(serviceItem);
  };

  const currentServiceList: ServiceItem[] = selectedCategory
    ? GURUDEV_SERVICES[selectedCategory] || []
    : [];

  return (
    <section id="services" className="py-16 md:py-24 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'અમારી તમામ સેવાઓ' : 'FULL CATALOG & PRICING'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            {lang === 'gu'
              ? 'વિડિયો એડિટિંગ અને ગ્રાફિક ડિઝાઇનિંગ સેવાઓ — નિશ્ચિત અને પોસાય તેવા ભાવે.'
              : 'Official rate card for Video Editing (₹150 - ₹2000) and Graphic Designing (₹100).'}
          </p>
        </div>

        {/* Interactive Selector Card implementing the user's snippet */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'સર્વિસ & પ્રાઈસ કેલ્ક્યુલેટર' : 'Instant Service Selector'}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {lang === 'gu' ? 'કેટેગરી પસંદ કરો અને સીધો ભાવ જાણો' : 'Select category and get instant rate'}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              Gurudev Creative_002
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                સર્વિસ કેટેગરી પસંદ કરો
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as MainCategory | '')}
                className="w-full px-3 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:border-amber-400 focus:outline-none cursor-pointer font-medium"
              >
                <option value="">Select Category</option>
                <option value="video">Video Edit Service</option>
                <option value="design">Designing Service</option>
              </select>
            </div>

            {/* Service List Select */}
            <div>
              <label htmlFor="serviceList" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                સર્વિસ પસંદ કરો
              </label>
              <select
                id="serviceList"
                disabled={!selectedCategory}
                value={selectedServiceName && selectedPrice !== '' ? `${selectedServiceName}|||${selectedPrice}` : ''}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:border-amber-400 focus:outline-none cursor-pointer font-medium disabled:opacity-50"
              >
                {!selectedCategory ? (
                  <option value="">પહેલાં કેટેગરી પસંદ કરો</option>
                ) : (
                  <>
                    <option value="">સર્વિસ પસંદ કરો</option>
                    {currentServiceList.map((item, idx) => (
                      <option key={idx} value={`${item.name}|||${item.price}`}>
                        {item.name} - ₹{item.price}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Price Readonly Input */}
            <div>
              <label htmlFor="servicePrice" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Service Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  id="servicePrice"
                  readOnly
                  value={selectedPrice}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-amber-400 font-mono font-bold text-sm focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

          </div>

          {/* Book Now Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="text-xs text-neutral-400 text-center sm:text-left">
              {selectedServiceName ? (
                <span>
                  {lang === 'gu' ? 'પસંદ કરેલ:' : 'Selected:'}{' '}
                  <strong className="text-white">{selectedServiceName}</strong> —{' '}
                  <span className="text-amber-400 font-mono font-bold">₹{selectedPrice}</span>
                </span>
              ) : (
                <span>{lang === 'gu' ? 'કોઈ સર્વિસ પસંદ કરો' : 'Select a service above'}</span>
              )}
            </div>

            <button
              type="button"
              disabled={!selectedServiceName || selectedPrice === ''}
              onClick={handleBookNow}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{lang === 'gu' ? 'આ સર્વિસ ઓર્ડર કરો' : 'Book Selected Service'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tabbed Full Catalog Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Edit Service ({GURUDEV_SERVICES.video.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'design'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Designing Service ({GURUDEV_SERVICES.design.length})</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GURUDEV_SERVICES[activeTab].map((svc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">
                      #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      ₹{svc.price}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {svc.name}
                  </h4>

                  <p className="text-xs text-neutral-400">
                    {activeTab === 'video'
                      ? 'પ્રોફેશનલ કટિંગ, સાઉન્ડ સિન્ક અને હાઇ-ડેફિનેશન માસ્ટર એક્સપોર્ટ.'
                      : 'સોશિયલ મીડિયા અને પ્રિન્ટ માટે હાઇ-રેઝોલ્યુશન ગ્રાફિક ડિઝાઇન.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(svc)}
                  className="w-full py-2 px-3 rounded-lg bg-neutral-800 group-hover:bg-amber-400 group-hover:text-neutral-950 text-neutral-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'gu' ? 'ઓર્ડર કરો' : 'Order Now'}</span>
                  <span className="font-mono font-bold">₹{svc.price}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
