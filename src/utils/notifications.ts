import { OrderStatus } from '../types';

export interface OrderStatusNotification {
  id: string; // unique toast id
  orderId: string;
  clientName: string;
  clientPhone?: string;
  title: string;
  oldStatus?: OrderStatus;
  newStatus: OrderStatus;
  note: string;
  finalVideoUrl?: string;
  finalData?: string;
  finalName?: string;
  timestamp: string;
  updatedBy: string;
  isUserOrder?: boolean;
  read?: boolean;
}

const STORAGE_KEY_USER_ORDERS = 'gurudev_my_placed_order_ids';
const STORAGE_KEY_NOTIFICATION_HISTORY = 'gurudev_status_notifications_history';
const STORAGE_KEY_LATEST_NOTIF = 'gurudev_latest_status_notification';
const BROADCAST_CHANNEL_NAME = 'gurudev_order_status_channel';

// Web Audio API gentle sound chime for real-time notification alert
export function playNotificationSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Two-tone harmonic chime: D5 (587.33 Hz) -> A5 (880 Hz) -> D6 (1174.66 Hz)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.22);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Ignore audio policies
  }
}

// Track orders created by current user's session
export function recordUserPlacedOrderId(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_ORDERS);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(orderId)) {
      list.push(orderId);
      localStorage.setItem(STORAGE_KEY_USER_ORDERS, JSON.stringify(list));
    }
  } catch (err) {
    console.error('Error saving user placed order id', err);
  }
}

export function isUserPlacedOrderId(orderId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_ORDERS);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(orderId);
  } catch {
    return false;
  }
}

export function getUserPlacedOrderIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save and retrieve notification history
export function getNotificationHistory(): OrderStatusNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATION_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotificationToHistory(notification: OrderStatusNotification): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getNotificationHistory();
    // Keep last 30 notifications, prevent duplicates by notification id
    const filtered = history.filter((n) => n.id !== notification.id);
    const updated = [notification, ...filtered].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_NOTIFICATION_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving notification history', err);
  }
}

export function clearNotificationHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_NOTIFICATION_HISTORY);
    window.dispatchEvent(new Event('gurudev_notification_history_changed'));
  } catch (err) {
    console.error('Error clearing notification history', err);
  }
}

// Global broadcast trigger
export function notifyOrderStatusUpdated(
  data: Omit<OrderStatusNotification, 'id' | 'timestamp' | 'isUserOrder'> & {
    id?: string;
    timestamp?: string;
    isUserOrder?: boolean;
  }
): OrderStatusNotification {
  const isUserOrder = data.isUserOrder ?? isUserPlacedOrderId(data.orderId);
  const notification: OrderStatusNotification = {
    ...data,
    id: data.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: data.timestamp || new Date().toISOString(),
    isUserOrder,
    read: false,
  };

  // 1. Save to local history
  saveNotificationToHistory(notification);

  // 2. Play sound alert
  playNotificationSound();

  // 3. Dispatch in-window custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<OrderStatusNotification>('gurudev_order_status_updated', {
        detail: notification,
      })
    );

    // 4. Cross-tab storage synchronization
    try {
      localStorage.setItem(
        STORAGE_KEY_LATEST_NOTIF,
        JSON.stringify({ notification, t: Date.now() })
      );
    } catch {}

    // 5. BroadcastChannel support if available
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.postMessage(notification);
        bc.close();
      } catch {}
    }
  }

  return notification;
}

// Listener subscription helper
export function subscribeToOrderStatusNotifications(
  callback: (notification: OrderStatusNotification) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<OrderStatusNotification>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY_LATEST_NOTIF && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed.notification) {
          callback(parsed.notification);
        }
      } catch {}
    }
  };

  window.addEventListener('gurudev_order_status_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  let bc: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data) {
          callback(event.data);
        }
      };
    } catch {}
  }

  return () => {
    window.removeEventListener('gurudev_order_status_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (bc) {
      bc.close();
    }
  };
}

// Status Display Metadata
export interface StatusMeta {
  key: OrderStatus;
  labelGu: string;
  labelEn: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
  iconName: 'Clock' | 'ShieldCheck' | 'Film' | 'Palette' | 'Eye' | 'CheckCircle2';
}

export const STATUS_METADATA: Record<OrderStatus, StatusMeta> = {
  received: {
    key: 'received',
    labelGu: 'ઓર્ડર સ્વીકારાયો',
    labelEn: 'Order Received',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    accentColor: '#6366f1',
    iconName: 'Clock',
  },
  verified: {
    key: 'verified',
    labelGu: 'ફૂટેજ ચકાસણી',
    labelEn: 'Footage Verified',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    accentColor: '#06b6d4',
    iconName: 'ShieldCheck',
  },
  editing: {
    key: 'editing',
    labelGu: 'એડિટિંગ ચાલુ છે',
    labelEn: 'Editing in Progress',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    accentColor: '#f59e0b',
    iconName: 'Film',
  },
  grading: {
    key: 'grading',
    labelGu: 'કલર & ઓડિયો મિક્સિંગ',
    labelEn: 'Color & Audio Grading',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    accentColor: '#a855f7',
    iconName: 'Palette',
  },
  review: {
    key: 'review',
    labelGu: 'અંતિમ ગુણવત્તા તપાસ',
    labelEn: 'Final QA Review',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    accentColor: '#3b82f6',
    iconName: 'Eye',
  },
  completed: {
    key: 'completed',
    labelGu: 'તૈયાર & ડાઉનલોડ ઉપલબ્ધ',
    labelEn: 'Ready for Download',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    borderColor: 'border-emerald-500/40',
    accentColor: '#10b981',
    iconName: 'CheckCircle2',
  },
};
