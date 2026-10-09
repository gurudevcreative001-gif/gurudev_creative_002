import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ShieldCheck,
  Film,
  Palette,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  Download,
  Sparkles,
  ArrowRight,
  Bell,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Language, OrderStatus } from '../types';
import {
  OrderStatusNotification,
  STATUS_METADATA,
  subscribeToOrderStatusNotifications,
  getNotificationHistory,
  clearNotificationHistory,
  playNotificationSound,
} from '../utils/notifications';

interface OrderStatusToastContainerProps {
  lang: Language;
  onViewOrder: (orderId: string) => void;
}

interface ActiveToastItem {
  notification: OrderStatusNotification;
  remainingMs: number;
  totalMs: number;
  paused: boolean;
}

const DEFAULT_TOAST_DURATION = 8000; // 8 seconds

export const OrderStatusToastContainer: React.FC<OrderStatusToastContainerProps> = ({
  lang,
  onViewOrder,
}) => {
  const [activeToasts, setActiveToasts] = useState<ActiveToastItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Subscribe to real-time status update broadcasts
  useEffect(() => {
    const unsubscribe = subscribeToOrderStatusNotifications((notif) => {
      if (soundEnabled) {
        playNotificationSound();
      }

      setActiveToasts((prev) => {
        // Prevent duplicate toasts by id
        const filtered = prev.filter((t) => t.notification.id !== notif.id);
        const newToast: ActiveToastItem = {
          notification: notif,
          remainingMs: DEFAULT_TOAST_DURATION,
          totalMs: DEFAULT_TOAST_DURATION,
          paused: false,
        };
        // Keep at most 4 simultaneous toasts
        return [newToast, ...filtered].slice(0, 4);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [soundEnabled]);

  // Interval timer for countdown bars and auto-dismiss
  useEffect(() => {
    if (activeToasts.length === 0) return;

    const interval = setInterval(() => {
      setActiveToasts((prev) =>
        prev
          .map((t) => {
            if (t.paused) return t;
            return {
              ...t,
              remainingMs: Math.max(0, t.remainingMs - 100),
            };
          })
          .filter((t) => t.remainingMs > 0)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [activeToasts.length]);

  const handleDismiss = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.notification.id !== id));
  };

  const handleDismissAll = () => {
    setActiveToasts([]);
  };

  const handlePause = (id: string, isPaused: boolean) => {
    setActiveToasts((prev) =>
      prev.map((t) => (t.notification.id === id ? { ...t, paused: isPaused } : t))
    );
  };

  const renderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <Clock className="w-4 h-4 text-indigo-400" />;
      case 'verified':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'editing':
        return <Film className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />;
      case 'grading':
        return <Palette className="w-4 h-4 text-purple-400" />;
      case 'review':
        return <Eye className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  if (activeToasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-3 sm:right-6 z-50 flex flex-col gap-3 w-[calc(100vw-24px)] sm:w-[420px] max-w-[420px] pointer-events-none"
    >
      {/* Top Controls bar when multiple toasts appear */}
      {activeToasts.length > 1 && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-400 backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-white">
              {lang === 'gu'
                ? `${activeToasts.length} નવા ઓર્ડર અપડેટ્સ`
                : `${activeToasts.length} Order Updates`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-neutral-400 hover:text-white transition-colors"
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
            </button>
            <button
              onClick={handleDismissAll}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              {lang === 'gu' ? 'બધા બંધ કરો' : 'Clear All'}
            </button>
          </div>
        </div>
      )}

      {/* Render active toasts */}
      {activeToasts.map((toastItem) => {
        const notif = toastItem.notification;
        const meta = STATUS_METADATA[notif.newStatus] || STATUS_METADATA.received;
        const oldMeta = notif.oldStatus ? STATUS_METADATA[notif.oldStatus] : null;
        const progressPercent = (toastItem.remainingMs / toastItem.totalMs) * 100;
        const isCompleted = notif.newStatus === 'completed';

        return (
          <div
            key={notif.id}
            onMouseEnter={() => handlePause(notif.id, true)}
            onMouseLeave={() => handlePause(notif.id, false)}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-neutral-950/95 border backdrop-blur-xl shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-4 ${
              notif.isUserOrder
                ? 'border-amber-400/80 shadow-amber-500/10 ring-1 ring-amber-400/30'
                : isCompleted
                ? 'border-emerald-500/60 shadow-emerald-500/10'
                : 'border-neutral-800 hover:border-neutral-700 shadow-black/80'
            }`}
          >
            {/* Top Accent line & Progress bar */}
            <div className="w-full h-1 bg-neutral-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ease-linear ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : notif.isUserOrder
                    ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                    : 'bg-gradient-to-r from-neutral-500 to-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="p-4 sm:p-4.5 space-y-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${meta.badgeBg} ${meta.borderColor}`}
                  >
                    {renderStatusIcon(notif.newStatus)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-amber-400 tracking-wider">
                        {notif.orderId}
                      </span>

                      {notif.isUserOrder ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{lang === 'gu' ? 'તમારો ઓર્ડર' : 'Your Order'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {lang === 'gu' ? 'લાઇવ એડિટર અપડેટ' : 'Live Studio Update'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-white truncate max-w-[220px]">
                      {notif.clientName} · <span className="text-neutral-400 font-normal">{notif.title}</span>
                    </div>
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => handleDismiss(notif.id)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Transition Display */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800/80 text-xs">
                {oldMeta ? (
                  <>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${oldMeta.badgeBg} ${oldMeta.badgeText} ${oldMeta.borderColor}`}>
                      {lang === 'gu' ? oldMeta.labelGu : oldMeta.labelEn}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor} flex items-center gap-1`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      <span>{lang === 'gu' ? meta.labelGu : meta.labelEn}</span>
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[11px]">
                      {lang === 'gu' ? 'નવું સ્ટેટસ:' : 'Current Status:'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}>
                      {lang === 'gu' ? meta.labelGu : meta.labelEn}
                    </span>
                  </div>
                )}
              </div>

              {/* Admin Note if provided */}
              {notif.note && (
                <div className="text-[11px] text-neutral-300 italic bg-neutral-900/40 px-3 py-1.5 rounded-lg border border-neutral-800/50">
                  &ldquo;{notif.note}&rdquo;
                </div>
              )}

              {/* Special Completed & Download Banner */}
              {isCompleted && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {lang === 'gu'
                        ? '🎉 એડિટિંગ પૂર્ણ! ફાઇનલ વિડિયો ડાઉનલોડ ઉપલબ્ધ.'
                        : '🎉 Edit Complete! Final video ready for download.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {/* 1. Track / View Order Details */}
                <button
                  onClick={() => {
                    handleDismiss(notif.id);
                    onViewOrder(notif.orderId);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-neutral-950 text-xs font-bold transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'gu'
                      ? 'ઓર્ડર વિગત અને સ્ટેટસ જુઓ'
                      : 'Track & View Order'}
                  </span>
                  <ExternalLink className="w-3 h-3 ml-0.5 text-neutral-800" />
                </button>

                {/* 2. Direct Download Button if Completed and video available */}
                {isCompleted && (notif.finalData || notif.finalVideoUrl) && (
                  <a
                    href={notif.finalData || notif.finalVideoUrl}
                    download={notif.finalName || `${notif.orderId}-Edited-Video.mp4`}
                    onClick={() => handleDismiss(notif.id)}
                    style={{ background: '#6554d9' }}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? 'ડાઉનલોડ' : 'Download'}</span>
                  </a>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
