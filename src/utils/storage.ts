import { INITIAL_ORDERS } from '../data/initialData';
import { OrderStatus, PaymentStatus, StatusLog, VideoCategory, VideoOrder } from '../types';
import {
  notifyOrderStatusUpdated,
  recordUserPlacedOrderId,
  isUserPlacedOrderId,
} from './notifications';

const STORAGE_KEY_ORDERS = 'gurudev_creative_orders_v1';
const STORAGE_KEY_ADMIN = 'gurudev_creative_admin_auth';

export function getStoredOrders(): VideoOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
  } catch (err) {
    console.error('Error loading orders from localStorage', err);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: VideoOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('gurudev_orders_updated'));
  } catch (err) {
    console.error('Error saving orders to localStorage', err);
  }
}

export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `GC-${year}-${randomNum}`;
}

export function calculateEstimatedPrice(options: {
  category: VideoCategory;
  durationMinutes: number;
  rushDelivery: boolean;
  includeSubtitles: boolean;
  soundDesign: boolean;
  colorGrading: boolean;
}): number {
  let basePrice = 150;

  switch (options.category) {
    case 'reels_shorts':
      basePrice = 180;
      if (options.durationMinutes > 0.5) basePrice += 70;
      break;
    case 'youtube_vlog':
      basePrice = 450;
      if (options.durationMinutes > 3) {
        basePrice += Math.min(350, Math.floor((options.durationMinutes - 3) * 50));
      }
      break;
    case 'brand_commercial':
      basePrice = 950;
      if (options.durationMinutes > 1) {
        basePrice += Math.min(450, Math.floor(options.durationMinutes * 100));
      }
      break;
    case 'cinematic_wedding':
      basePrice = 1300;
      if (options.durationMinutes > 2) {
        basePrice += Math.min(600, Math.floor(options.durationMinutes * 150));
      }
      break;
    case 'podcast_interview':
      basePrice = 500;
      if (options.durationMinutes > 5) basePrice += 250;
      break;
    default:
      basePrice = 300;
  }

  if (options.includeSubtitles && options.category !== 'reels_shorts') {
    basePrice += 80;
  }
  if (options.soundDesign && options.category !== 'reels_shorts') {
    basePrice += 90;
  }
  if (options.colorGrading && options.category !== 'cinematic_wedding') {
    basePrice += 100;
  }
  if (options.rushDelivery) {
    basePrice += 150;
  }

  // Strictly enforce user's brief range: ₹150 to ₹2000
  return Math.min(2000, Math.max(150, Math.round(basePrice / 10) * 10));
}

export function addOrder(newOrderData: Omit<VideoOrder, 'id' | 'createdAt' | 'updatedAt' | 'statusLogs'>): VideoOrder {
  const current = getStoredOrders();
  const id = generateOrderId();
  const now = new Date().toISOString();
  
  const initialLog: StatusLog = {
    id: `log-${Date.now()}`,
    status: newOrderData.status || 'received',
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    note: 'ઓર્ડર સફળતાપૂર્વક નોંધાયો. કાચી ફૂટેજની સમીક્ષા ટૂંક સમયમાં શરૂ થશે.',
    updatedBy: 'System'
  };

  const newOrder: VideoOrder = {
    ...newOrderData,
    id,
    createdAt: now,
    updatedAt: now,
    status: newOrderData.status || 'received',
    statusLogs: [initialLog],
    revisionCount: 0
  };

  const updated = [newOrder, ...current];
  saveOrders(updated);
  recordUserPlacedOrderId(id);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  logNote: string,
  additionalData?: Partial<VideoOrder>
): VideoOrder | null {
  const current = getStoredOrders();
  const index = current.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const oldStatus = current[index].status;
  const now = new Date().toISOString();
  const noteText = logNote || `ઓર્ડર સ્ટેટસ અપડેટ: ${newStatus}`;
  const newLog: StatusLog = {
    id: `log-${Date.now()}`,
    status: newStatus,
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    note: noteText,
    updatedBy: 'Admin'
  };

  const updatedOrder: VideoOrder = {
    ...current[index],
    status: newStatus,
    updatedAt: now,
    statusLogs: [newLog, ...(current[index].statusLogs || [])],
    ...additionalData
  };

  current[index] = updatedOrder;
  saveOrders([...current]);

  // Alert users via real-time toast notification system
  notifyOrderStatusUpdated({
    orderId,
    clientName: updatedOrder.clientName,
    clientPhone: updatedOrder.clientPhone,
    title: updatedOrder.title,
    oldStatus,
    newStatus,
    note: noteText,
    finalVideoUrl: updatedOrder.finalVideoUrl,
    finalData: updatedOrder.finalData,
    finalName: updatedOrder.finalName,
    updatedBy: 'Admin'
  });

  return updatedOrder;
}

export function updateOrderDetails(orderId: string, updates: Partial<VideoOrder>): VideoOrder | null {
  const current = getStoredOrders();
  const index = current.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const updatedOrder: VideoOrder = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  current[index] = updatedOrder;
  saveOrders([...current]);
  return updatedOrder;
}

export function deleteOrder(orderId: string): boolean {
  const current = getStoredOrders();
  const filtered = current.filter(o => o.id !== orderId);
  if (filtered.length === current.length) return false;
  saveOrders(filtered);
  return true;
}

export function resetDemoOrders(): void {
  saveOrders(INITIAL_ORDERS);
}

export interface DeleteAllOrdersResult {
  success?: boolean;
  deletedCount?: number;
  error?: string;
}

export function deleteAllOrders(confirmText: string): DeleteAllOrdersResult {
  if (!isAdminAuthenticated()) {
    return { error: 'Admin login જરૂરી છે.' };
  }

  if (confirmText !== 'DELETE_ALL_ORDERS') {
    return { error: 'કન્ફર્મેશન જરૂરી છે.' };
  }

  const current = getStoredOrders();
  const deletedCount = current.length;
  saveOrders([]);
  return {
    success: true,
    deletedCount,
  };
}

// Admin Authentication
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
}

export function setAdminAuthenticated(status: boolean): void {
  if (typeof window === 'undefined') return;
  if (status) {
    localStorage.setItem(STORAGE_KEY_ADMIN, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN);
  }
  window.dispatchEvent(new Event('gurudev_admin_auth_changed'));
}

export function checkAdminPassword(pass: string): boolean {
  // Configured studio password or simple variants for flexibility
  const cleaned = pass.trim().toLowerCase();
  return (
    cleaned === 'gurudev@002' ||
    cleaned === 'gurudev002' ||
    cleaned === 'admin123' ||
    cleaned === 'gurudev'
  );
}
