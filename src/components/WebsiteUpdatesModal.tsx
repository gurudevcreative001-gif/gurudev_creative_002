import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Clock,
  Sparkles,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Film,
  Phone,
} from 'lucide-react';
import { Language } from '../types';
import {
  WebsiteSettings,
  WebsiteUpdateItem,
  getWebsiteSettings,
} from '../utils/websiteUpdates';

interface WebsiteUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenOrderModal: () => void;
}

export const WebsiteUpdatesModal: React.FC<WebsiteUpdatesModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenOrderModal,
}) => {
  const [settings, setSettings] = useState<WebsiteSettings>(getWebsiteSettings);

  useEffect(() => {
    if (!isOpen) return;
    setSettings(getWebsiteSettings());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WebsiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getWebsiteSettings());
      }
    };

    window.addEventListener('gurudev_website_updated', handleUpdate);
    return () => window.removeEventListener('gurudev_website_updated', handleUpdate);
  }, [isOpen]);

  if (!isOpen) return null;

  const current = settings.currentUpdate;
  const history = settings.updateHistory || [];

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(lang === 'gu' ? 'gu-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'વેબસાઇટ લાઇવ અપડેટ્સ & સૂચનાઓ' : 'Live Website Updates & Notices'}
                </h2>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {lang === 'gu'
                  ? 'Gurudev Creative_002 તરફથી તાજા સમાચાર અને ઓફર'
                  : 'Real-time studio announcements, offers & updates'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Highlight Banner */}
          {current && current.isActive && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-neutral-950 to-neutral-900 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-neutral-950">
                  {lang === 'gu' ? current.badgeGu : current.badgeEn}
                </span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {formatDate(current.publishedAt)}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'gu' ? current.headlineGu : current.headlineEn}
              </h3>

              {(current.subTextGu || current.subTextEn) && (
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {lang === 'gu' ? current.subTextGu : current.subTextEn}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400">
                  {lang === 'gu' ? 'પ્રકાશક:' : 'By:'} <span className="text-neutral-200">{current.publishedBy}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOrderModal();
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 transition-colors shadow"
                >
                  {lang === 'gu'
                    ? current.actionTextGu || 'નવો ઓર્ડર નોંધાવો'
                    : current.actionTextEn || 'Place Order'}
                </button>
              </div>
            </div>
          )}

          {/* Updates History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'અગાઉના અપડેટ્સ (Updates History)' : 'Past Announcements'}</span>
            </h4>

            {history.length > 0 ? (
              <div className="space-y-2.5">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs space-y-1.5 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {lang === 'gu' ? item.badgeGu : item.badgeEn}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    <div className="font-semibold text-neutral-100">
                      {lang === 'gu' ? item.headlineGu : item.headlineEn}
                    </div>

                    {(item.subTextGu || item.subTextEn) && (
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        {lang === 'gu' ? item.subTextGu : item.subTextEn}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-neutral-500">
                {lang === 'gu' ? 'કોઈ જૂની સૂચનાઓ નથી.' : 'No past updates found.'}
              </div>
            )}
          </div>

          {/* Quick Studio Support Info */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? '24x7 હેલ્પલાઇન & સંપર્ક' : '24x7 Helpline & Support'}</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              {lang === 'gu'
                ? 'કોઈપણ ઓર્ડર કે પૂછપરછ માટે અમારા વોટ્સએપ પર સીધો સંપર્ક કરી શકો છો:'
                : 'For any urgent questions, reach our editors directly on WhatsApp:'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://wa.me/916353894486"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors font-mono"
              >
                +91 6353894486 (Main)
              </a>
              <a
                href="https://wa.me/91990940414"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg hover:text-white transition-colors font-mono"
              >
                990940414
              </a>
              <a
                href="https://wa.me/919714171301"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg hover:text-white transition-colors font-mono"
              >
                9714171301
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
          >
            {lang === 'gu' ? 'બંધ કરો' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
