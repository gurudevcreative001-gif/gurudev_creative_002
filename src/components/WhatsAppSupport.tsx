import React, { useState } from 'react';
import { MessageSquare, Phone, Copy, Check, ExternalLink, Headset, Sparkles, X } from 'lucide-react';
import { Language } from '../types';
import { WHATSAPP_SUPPORT_NUMBERS } from '../data/initialData';

interface WhatsAppSupportProps {
  lang: Language;
}

export const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<'general' | 'order' | 'custom'>('general');

  const getCustomMessage = () => {
    if (selectedTopic === 'order') {
      return lang === 'gu'
        ? 'નમસ્તે Gurudev Creative! મારે ચાલુ ઓર્ડર સ્ટેટસ વિશે પૂછપરછ કરવી છે.'
        : 'Hello Gurudev Creative! I have an inquiry regarding my ongoing video order.';
    }
    if (selectedTopic === 'custom') {
      return lang === 'gu'
        ? 'નમસ્તે Gurudev Creative! મારે સ્પેશિયલ કસ્ટમ વિડિયો / ડિઝાઇન પ્રોજેક્ટ કરાવવો છે.'
        : 'Hello Gurudev Creative! I would like to discuss a custom video or design project.';
    }
    return lang === 'gu'
      ? 'નમસ્તે Gurudev Creative! મને વિડિયો એડિટિંગ સર્વિસ (₹150 - ₹2000) વિશે માહિતી જોઈએ છે.'
      : 'Hello Gurudev Creative! I would like to know more about your video editing services (₹150 - ₹2000).';
  };

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <>
      {/* Floating WhatsApp Support Launcher */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Quick tooltip bubble if closed */}
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/95 border border-emerald-500/40 text-emerald-400 text-xs font-medium shadow-xl backdrop-blur-md animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{lang === 'gu' ? 'WhatsApp સપોર્ટ (3 હેલ્પલાઇન)' : 'WhatsApp Support (3 Lines)'}</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="WhatsApp Support"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 active:scale-95 transition-all border border-emerald-400/40"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-white/20" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-700" />
          </div>
          <span className="font-bold tracking-wide">
            {lang === 'gu' ? 'WhatsApp સપોર્ટ' : 'WhatsApp Support'}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-800/80 border border-emerald-400/30 text-emerald-200">
            3 Nos
          </span>
        </button>
      </div>

      {/* Floating Support Modal / Popover */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-5 z-50 flex items-end sm:items-center justify-center p-3 sm:p-0 pointer-events-auto">
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/60 sm:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full sm:w-[420px] max-h-[85vh] overflow-y-auto rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl shadow-black p-5 text-neutral-200 z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Headset className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{lang === 'gu' ? 'WhatsApp સપોર્ટ હેલ્પલાઇન' : 'WhatsApp Support Desk'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Gurudev Creative_002 · 24x7 Quick Assistance
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Topic selector */}
            <div className="pt-3 pb-2">
              <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
                {lang === 'gu' ? 'તમારો વિષય પસંદ કરો (મેસેજ ઓટોમેટિક બનશે):' : 'Select Inquiry Topic:'}
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => setSelectedTopic('general')}
                  className={`px-2 py-1.5 rounded-lg border text-center transition-colors ${
                    selectedTopic === 'general'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'gu' ? 'સામાન્ય / ભાવ' : 'General / Rates'}
                </button>
                <button
                  onClick={() => setSelectedTopic('order')}
                  className={`px-2 py-1.5 rounded-lg border text-center transition-colors ${
                    selectedTopic === 'order'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'gu' ? 'ઓર્ડર સ્ટેટસ' : 'Order Status'}
                </button>
                <button
                  onClick={() => setSelectedTopic('custom')}
                  className={`px-2 py-1.5 rounded-lg border text-center transition-colors ${
                    selectedTopic === 'custom'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'gu' ? 'કસ્ટમ કામ' : 'Custom Work'}
                </button>
              </div>
            </div>

            {/* 3 WhatsApp Numbers List */}
            <div className="space-y-2.5 pt-2">
              {WHATSAPP_SUPPORT_NUMBERS.map((contact, index) => {
                const message = getCustomMessage();
                const waUrl = `${contact.waLink}?text=${encodeURIComponent(message)}`;

                return (
                  <div
                    key={contact.number}
                    className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/40 transition-colors flex flex-col gap-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-mono text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {contact.displayNumber}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {lang === 'gu' ? contact.labelGu : contact.labelEn}
                          </div>
                        </div>
                      </div>

                      {contact.primary && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Primary
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/60">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white/20" />
                        <span>{lang === 'gu' ? 'WhatsApp ચેટ' : 'Chat on WhatsApp'}</span>
                        <ExternalLink className="w-3 h-3 text-emerald-200" />
                      </a>

                      <button
                        onClick={() => handleCopy(contact.number)}
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                        title={lang === 'gu' ? 'નંબર કોપી કરો' : 'Copy Number'}
                      >
                        {copiedNumber === contact.number ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`tel:${contact.number}`}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                        title={lang === 'gu' ? 'કોલ કરો' : 'Call'}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-neutral-400 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'gu'
                  ? 'ઓર્ડર વિશે વિગત મોકલવા અથવા પેમેન્ટ રિસિપ્ટ શેર કરવા માટે ઉપરોક્ત કોઈપણ WhatsApp નંબર પર સીધો સંપર્ક કરી શકો છો.'
                  : 'You can contact any of the above WhatsApp numbers directly to share footage links, payment receipts or project briefs.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const WhatsAppSupportSection: React.FC<WhatsAppSupportProps> = ({ lang }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <section id="support" className="py-12 sm:py-16 border-t border-neutral-800 bg-neutral-950 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'સત્તાવાર WhatsApp સપોર્ટ' : 'Official WhatsApp Support Desk'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'gu' ? (
              <>
                કોઈપણ સહાય કે ઓર્ડર માટે <span className="text-emerald-400">WhatsApp પર સંપર્ક કરો</span>
              </>
            ) : (
              <>
                Need Help or Quick Edit? <span className="text-emerald-400">Connect on WhatsApp</span>
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            {lang === 'gu'
              ? 'અમારી પાસે 3 ડેડિકેટેડ WhatsApp સપોર્ટ લાઇન્સ છે. ઇન્સ્ટન્ટ રિસ્પોન્સ, ફૂટેજ અપલોડ સહાય અને ઓર્ડર સ્ટેટસ માટે 24x7 ઉપલબ્ધ.'
              : 'Direct access to 3 dedicated WhatsApp support helplines. Instant assistance for video uploads, pricing queries, and delivery status.'}
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {WHATSAPP_SUPPORT_NUMBERS.map((contact, index) => {
            const defaultMsg = lang === 'gu'
              ? 'નમસ્તે Gurudev Creative! મારે વિડિયો એડિટિંગ સર્વિસ વિશે પૂછપરછ છે.'
              : 'Hello Gurudev Creative! I have an inquiry about video editing services.';
            const waUrl = `${contact.waLink}?text=${encodeURIComponent(defaultMsg)}`;

            return (
              <div
                key={contact.number}
                className="relative p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg shadow-black/40 hover:-translate-y-1"
              >
                {contact.primary && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-neutral-950 shadow-md">
                    Primary Hotline
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Support Line 0{index + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {lang === 'gu' ? contact.labelGu : contact.labelEn}
                      </h4>
                    </div>
                  </div>

                  <div className="py-2">
                    <div className="font-mono text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                      {contact.displayNumber}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {lang === 'gu' ? 'ઓનલાઇન ચેટ અને કૉલિંગ' : 'Online Chat & Calls Supported'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/40 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>{lang === 'gu' ? 'WhatsApp ચેટ' : 'Chat on WhatsApp'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                  </a>

                  <button
                    onClick={() => handleCopy(contact.number)}
                    className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title={lang === 'gu' ? 'નંબર કોપી કરો' : 'Copy Number'}
                  >
                    {copiedNumber === contact.number ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Assistance Note */}
        <div className="mt-8 text-center text-xs text-neutral-400">
          {lang === 'gu'
            ? 'નવા વિડિયો ઓર્ડર, સ્પેશિયલ પ્રોજેક્ટ (₹150 - ₹2000), રિવિઝન અથવા પેમેન્ટ ક્વેરી માટે કોઈપણ નંબર પર સીધો સંપર્ક કરી શકો છો.'
            : 'For new orders, special custom edits (₹150 - ₹2000), delivery updates, or payment confirmation, reach out to any line above.'}
        </div>
      </div>
    </section>
  );
};
