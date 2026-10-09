export interface WebsiteUpdateItem {
  id: string;
  type: 'announcement' | 'offer' | 'notice' | 'urgent';
  badgeGu: string;
  badgeEn: string;
  headlineGu: string;
  headlineEn: string;
  subTextGu?: string;
  subTextEn?: string;
  isActive: boolean;
  publishedAt: string; // ISO date string
  publishedBy: string;
  actionUrl?: string;
  actionTextGu?: string;
  actionTextEn?: string;
}

export interface WebsiteSettings {
  currentUpdate: WebsiteUpdateItem;
  updateHistory: WebsiteUpdateItem[];
  studioWorkingStatus: 'open' | 'busy' | 'closing_soon';
  supportPhones: string[];
  lastSyncedAt: string;
}

const STORAGE_KEY_WEBSITE_UPDATES = 'gurudev_website_updates_v1';
const BROADCAST_CHANNEL_NAME = 'gurudev_website_sync_channel';

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  currentUpdate: {
    id: 'update-initial',
    type: 'announcement',
    badgeGu: '🔴 લાઇવ અપડેટ',
    badgeEn: '🔴 Live Update',
    headlineGu: 'Gurudev Creative_002: તમામ વિડિયો એડિટિંગ અને ગ્રાફિક ડિઝાઈનિંગ ઓર્ડર ચાલુ છે!',
    headlineEn: 'Gurudev Creative_002: All video editing and graphic designing orders are open!',
    subTextGu: 'રીલ્સ, યુટ્યુબ વ્લોગ્સ, વેડિંગ ટીઝર અને ડિઝાઇન માત્ર ₹150 થી ₹2000. 24 કલાકમાં ફાસ્ટ ડિલિવરી.',
    subTextEn: 'Reels, YouTube vlogs, wedding teasers & designs from ₹150 to ₹2000. Fast 24-hour delivery.',
    isActive: true,
    publishedAt: new Date().toISOString(),
    publishedBy: 'Gurudev Creative Admin',
    actionTextGu: 'નવો ઓર્ડર નોંધાવો',
    actionTextEn: 'Book New Order',
  },
  updateHistory: [
    {
      id: 'update-history-1',
      type: 'offer',
      badgeGu: '✨ ઓફર',
      badgeEn: '✨ Special Offer',
      headlineGu: 'Instagram Reels એડિટિંગ માત્ર ₹150 થી શરૂ! મ્યુઝિક, ટેક્સ્ટ અને કટ સાથે.',
      headlineEn: 'Instagram Reels editing starting at just ₹150! Includes music, subtitles & cuts.',
      subTextGu: 'તમારા સોશિયલ મીડિયા બિઝનેસને આગળ વધારવા માટે ઉચ્ચ ગુણવત્તાનું એડિટિંગ.',
      subTextEn: 'High quality video edits to grow your social media & brand presence.',
      isActive: true,
      publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      publishedBy: 'Admin',
    },
    {
      id: 'update-history-2',
      type: 'notice',
      badgeGu: '⚡ સુવિધા',
      badgeEn: '⚡ Feature',
      headlineGu: 'ઓનલાઇન Razorpay પેમેન્ટ અને લાઇવ ઓર્ડર ટ્રેકિંગ સક્રિય છે.',
      headlineEn: 'Online Razorpay payment and live order tracking are active.',
      subTextGu: 'UPI, Google Pay, PhonePe અથવા કાર્ડ દ્વારા સુરક્ષિત ચુકવણી કરો.',
      subTextEn: 'Make secure payments via UPI, Google Pay, PhonePe, or Cards.',
      isActive: true,
      publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      publishedBy: 'Admin',
    },
  ],
  studioWorkingStatus: 'open',
  supportPhones: ['6353894486', '990940414', '9714171301'],
  lastSyncedAt: new Date().toISOString(),
};

// Singleton broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'GURUDEV_WEBSITE_UPDATED') {
        window.dispatchEvent(
          new CustomEvent('gurudev_website_updated', {
            detail: event.data.payload,
          })
        );
      }
    };
  } catch {
    // BroadcastChannel unsupported or restricted
  }
}

export function getWebsiteSettings(): WebsiteSettings {
  if (typeof window === 'undefined') return DEFAULT_WEBSITE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEBSITE_UPDATES);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY_WEBSITE_UPDATES,
        JSON.stringify(DEFAULT_WEBSITE_SETTINGS)
      );
      return DEFAULT_WEBSITE_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...parsed,
      currentUpdate: {
        ...DEFAULT_WEBSITE_SETTINGS.currentUpdate,
        ...(parsed.currentUpdate || {}),
      },
      updateHistory: Array.isArray(parsed.updateHistory)
        ? parsed.updateHistory
        : DEFAULT_WEBSITE_SETTINGS.updateHistory,
    };
  } catch (err) {
    console.error('Error reading website updates from storage', err);
    return DEFAULT_WEBSITE_SETTINGS;
  }
}

export function saveWebsiteSettings(settings: Partial<WebsiteSettings>): WebsiteSettings {
  if (typeof window === 'undefined') return DEFAULT_WEBSITE_SETTINGS;
  try {
    const current = getWebsiteSettings();
    const updated: WebsiteSettings = {
      ...current,
      ...settings,
      lastSyncedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_WEBSITE_UPDATES, JSON.stringify(updated));

    // Broadcast across windows and tabs
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'GURUDEV_WEBSITE_UPDATED',
          payload: updated,
        });
      } catch {
        // Fallback
      }
    }

    // Local custom event
    window.dispatchEvent(
      new CustomEvent('gurudev_website_updated', {
        detail: updated,
      })
    );

    return updated;
  } catch (err) {
    console.error('Error saving website updates to storage', err);
    return DEFAULT_WEBSITE_SETTINGS;
  }
}

export function publishWebsiteUpdate(update: Omit<WebsiteUpdateItem, 'id' | 'publishedAt'>): WebsiteSettings {
  const current = getWebsiteSettings();
  const newId = `update-${Date.now()}`;
  const now = new Date().toISOString();

  const newUpdateItem: WebsiteUpdateItem = {
    ...update,
    id: newId,
    publishedAt: now,
  };

  const updatedHistory = [
    newUpdateItem,
    ...(current.updateHistory || []).filter((item) => item.id !== newId),
  ].slice(0, 20); // Keep last 20 updates

  return saveWebsiteSettings({
    currentUpdate: newUpdateItem,
    updateHistory: updatedHistory,
  });
}

export function toggleWebsiteUpdateActive(isActive: boolean): WebsiteSettings {
  const current = getWebsiteSettings();
  const updatedCurrent: WebsiteUpdateItem = {
    ...current.currentUpdate,
    isActive,
  };
  return saveWebsiteSettings({
    currentUpdate: updatedCurrent,
  });
}
