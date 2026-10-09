import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  ChevronRight,
  X,
  Volume2,
  RefreshCw,
  Clock,
  ArrowRight,
  Flame,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { Language } from '../types';
import {
  WebsiteSettings,
  WebsiteUpdateItem,
  getWebsiteSettings,
} from '../utils/websiteUpdates';

interface LiveUpdatesBannerProps {
  lang: Language;
  onOpenOrderModal: () => void;
  onOpenUpdatesModal?: () => void;
}

export const LiveUpdatesBanner: React.FC<LiveUpdatesBannerProps> = ({
  lang,
  onOpenOrderModal,
  onOpenUpdatesModal,
}) => {
  const [settings, setSettings] = useState<WebsiteSettings>(getWebsiteSettings);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [justUpdatedPulse, setJustUpdatedPulse] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WebsiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getWebsiteSettings());
      }
      setIsDismissed(false); // Un-dismiss when new update arrives!
      setJustUpdatedPulse(true);
      setTimeout(() => setJustUpdatedPulse(false), 4000);
    };

    window.addEventListener('gurudev_website_updated', handleUpdate);

    // Cross-tab storage listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gurudev_website_updates_v1') {
        setSettings(getWebsiteSettings());
        setJustUpdatedPulse(true);
        setTimeout(() => setJustUpdatedPulse(false), 4000);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Periodic check every 10 seconds to ensure freshest data
    const interval = setInterval(() => {
      const latest = getWebsiteSettings();
      if (latest.lastSyncedAt !== settings.lastSyncedAt) {
        setSettings(latest);
      }
    }, 10000);

    return () => {
      window.removeEventListener('gurudev_website_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [settings.lastSyncedAt]);

  const update = settings.currentUpdate;

  if (!update || !update.isActive || isDismissed) {
    return null;
  }

  const badgeText = lang === 'gu' ? update.badgeGu : update.badgeEn;
  const headline = lang === 'gu' ? update.headlineGu : update.headlineEn;
  const subText = lang === 'gu' ? update.subTextGu : update.subTextEn;
  const actionText =
    (lang === 'gu' ? update.actionTextGu : update.actionTextEn) ||
    (lang === 'gu' ? 'ઓર્ડર બુક કરો' : 'Order Now');

  const getTypeStyle = () => {
    switch (update.type) {
      case 'offer':
        return {
          bg: 'bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-orange-500/15 border-amber-500/30 text-amber-300',
          badgeBg: 'bg-amber-400 text-neutral-950',
          dot: 'bg-amber-400',
        };
      case 'urgent':
        return {
          bg: 'bg-gradient-to-r from-red-500/15 via-rose-500/10 to-amber-500/15 border-red-500/30 text-rose-300',
          badgeBg: 'bg-red-500 text-white',
          dot: 'bg-red-500',
        };
      case 'notice':
        return {
          bg: 'bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-amber-500/15 border-blue-500/30 text-blue-300',
          badgeBg: 'bg-blue-400 text-neutral-950',
          dot: 'bg-blue-400',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-amber-500/15 via-neutral-900 to-amber-500/10 border-amber-500/30 text-amber-200',
          badgeBg: 'bg-amber-400 text-neutral-950',
          dot: 'bg-emerald-400',
        };
    }
  };

  const style = getTypeStyle();

  return (
    <aside
      aria-label="Website live updates banner"
      className={`relative w-full border-b transition-all duration-300 ${style.bg} ${
        justUpdatedPulse ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-neutral-950' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Live indicator & Headline */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[260px]">
            {/* Live pulsing indicator */}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-tight uppercase shadow-sm shrink-0 font-sans border border-amber-400/40 bg-neutral-950 text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>{badgeText || (lang === 'gu' ? 'લાઇવ અપડેટ' : 'Live Update')}</span>
            </div>

            {/* Headline text */}
            <div className="text-xs sm:text-[13px] font-medium text-neutral-100 flex-1 truncate">
              <span className="font-semibold text-white mr-1.5">{headline}</span>
              {subText && (
                <span className="hidden md:inline text-neutral-400 text-xs">
                  — {subText}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Full Details Button */}
            {onOpenUpdatesModal && (
              <button
                type="button"
                onClick={onOpenUpdatesModal}
                className="text-[11px] font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                {lang === 'gu' ? 'બધી સૂચનાઓ' : 'All Updates'}
              </button>
            )}

            {/* CTA Order Button */}
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center gap-1 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Expand / Collapse toggle for subText on mobile */}
            {subText && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1 text-neutral-400 hover:text-white rounded transition-colors md:hidden cursor-pointer"
              >
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
            )}

            {/* Close / Dismiss */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              title={lang === 'gu' ? 'બેનર બંધ કરો' : 'Dismiss banner'}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded subText on small screens */}
        {isExpanded && subText && (
          <div className="mt-2 pt-2 border-t border-neutral-800/80 text-xs text-neutral-300 leading-relaxed md:hidden animate-fadeIn">
            {subText}
          </div>
        )}
      </div>
    </aside>
  );
};
