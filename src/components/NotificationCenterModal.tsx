import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  Film,
  Palette,
  Eye,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Sparkles,
  Download,
  ArrowRight,
} from 'lucide-react';
import { Language, OrderStatus } from '../types';
import {
  OrderStatusNotification,
  STATUS_METADATA,
  getNotificationHistory,
  clearNotificationHistory,
  notifyOrderStatusUpdated,
} from '../utils/notifications';
import { getStoredOrders } from '../utils/storage';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onViewOrder: (orderId: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  lang,
  onViewOrder,
}) => {
  const [history, setHistory] = useState<OrderStatusNotification[]>([]);

  const reloadHistory = () => {
    setHistory(getNotificationHistory());
  };

  useEffect(() => {
    if (isOpen) {
      reloadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => reloadHistory();
    window.addEventListener('gurudev_order_status_updated', handleUpdate);
    window.addEventListener('gurudev_notification_history_changed', handleUpdate);
    return () => {
      window.removeEventListener('gurudev_order_status_updated', handleUpdate);
      window.removeEventListener('gurudev_notification_history_changed', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleClear = () => {
    clearNotificationHistory();
    setHistory([]);
  };

  // Helper to trigger a demo update for testing the toast alert immediately
  const handleSimulateDemoUpdate = () => {
    const orders = getStoredOrders();
    const targetOrder = orders[0] || {
      id: 'GC-2026-8801',
      clientName: 'શ્યામ પટેલ',
      title: 'Instagram Viral Reel',
      status: 'editing',
    };

    const statuses: OrderStatus[] = ['received', 'verified', 'editing', 'grading', 'review', 'completed'];
    const currentIdx = statuses.indexOf(targetOrder.status as OrderStatus);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];

    notifyOrderStatusUpdated({
      orderId: targetOrder.id,
      clientName: targetOrder.clientName,
      title: targetOrder.title,
      oldStatus: targetOrder.status as OrderStatus,
      newStatus: nextStatus,
      note:
        lang === 'gu'
          ? `એડિટર દ્વારા ઓર્ડરનું સ્ટેટસ સફળતાપૂર્વક ${nextStatus} કરવામાં આવ્યું.`
          : `Editor updated order status to ${nextStatus}.`,
      finalVideoUrl:
        nextStatus === 'completed'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : undefined,
      finalData:
        nextStatus === 'completed'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : undefined,
      finalName: `${targetOrder.id}-Edited-Video.mp4`,
      updatedBy: 'Admin (Demo Simulation)',
      isUserOrder: true,
    });
  };

  const renderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <Clock className="w-3.5 h-3.5 text-indigo-400" />;
      case 'verified':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'editing':
        return <Film className="w-3.5 h-3.5 text-amber-400" />;
      case 'grading':
        return <Palette className="w-3.5 h-3.5 text-purple-400" />;
      case 'review':
        return <Eye className="w-3.5 h-3.5 text-blue-400" />;
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'gu' ? 'ઓર્ડર સ્ટેટસ સૂચનાઓ' : 'Order Status Notifications'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-800 text-neutral-300">
                  {history.length}
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                {lang === 'gu'
                  ? 'એડમિન દ્વારા કરવામાં આવેલા તમામ લાઇવ સ્ટેટસ અપડેટ્સ'
                  : 'Real-time updates published by studio admins'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-neutral-900/40 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <button
            onClick={handleSimulateDemoUpdate}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'ટેસ્ટ સ્ટેટસ અપડેટ ટ્રિગર કરો' : 'Simulate Status Update Toast'}</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-neutral-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'બધું સાફ કરો' : 'Clear History'}</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 space-y-3">
              <Bell className="w-8 h-8 mx-auto opacity-30 text-amber-400" />
              <div className="text-xs">
                {lang === 'gu'
                  ? 'હજુ સુધી કોઈ નવી સ્ટેટસ સૂચના નથી. જ્યારે એડમિન ઓર્ડર અપડેટ કરશે ત્યારે અહીં દેખાશે.'
                  : 'No status notifications yet. When an admin updates an order, alerts appear here.'}
              </div>
              <button
                onClick={handleSimulateDemoUpdate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-amber-400 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'ટેસ્ટ નોટિફિકેશન જુઓ' : 'Preview Demo Notification'}</span>
              </button>
            </div>
          ) : (
            history.map((item) => {
              const meta = STATUS_METADATA[item.newStatus] || STATUS_METADATA.received;
              const isCompleted = item.newStatus === 'completed';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.isUserOrder
                      ? 'bg-neutral-900/90 border-amber-500/40'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md border ${meta.badgeBg} ${meta.borderColor}`}>
                        {renderStatusIcon(item.newStatus)}
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {item.orderId}
                      </span>
                      {item.isUserOrder && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {lang === 'gu' ? 'તમારો ઓર્ડર' : 'Your Order'}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-neutral-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-xs text-white font-medium mb-1">
                    {item.clientName} · <span className="text-neutral-400 font-normal">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] mb-2">
                    <span className="text-neutral-400">{lang === 'gu' ? 'નવું સ્ટેટસ:' : 'Status:'}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}>
                      {lang === 'gu' ? meta.labelGu : meta.labelEn}
                    </span>
                  </div>

                  {item.note && (
                    <p className="text-[11px] text-neutral-300 italic mb-2.5 bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/60">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/60">
                    <button
                      onClick={() => {
                        onClose();
                        onViewOrder(item.orderId);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'gu' ? 'ઓર્ડર વિગત જુઓ' : 'Track Order'}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </button>

                    {isCompleted && (item.finalData || item.finalVideoUrl) && (
                      <a
                        href={item.finalData || item.finalVideoUrl}
                        download={item.finalName || `${item.orderId}-Edited-Video.mp4`}
                        style={{ background: '#6554d9' }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-[11px] font-bold shadow hover:brightness-110 transition-all"
                      >
                        <Download className="w-3 h-3" />
                        <span>{lang === 'gu' ? 'ડાઉનલોડ' : 'Download'}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
