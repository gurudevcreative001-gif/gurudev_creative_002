export type OrderStatus =
  | 'received'
  | 'verified'
  | 'editing'
  | 'grading'
  | 'review'
  | 'completed';

export type PaymentStatus = 'pending' | 'advance_paid' | 'paid';

export type MainCategory = 'video' | 'design';

export interface ServiceItem {
  name: string;
  price: number;
  category: MainCategory;
}

export interface SupportContact {
  number: string;
  displayNumber: string;
  waLink: string;
  labelGu: string;
  labelEn: string;
  primary?: boolean;
}

export type VideoCategory =
  | 'reels_shorts'
  | 'youtube_vlog'
  | 'cinematic_wedding'
  | 'brand_commercial'
  | 'podcast_interview'
  | 'other';

export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:5';

export interface StatusLog {
  id: string;
  status: OrderStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface RawFileItem {
  id?: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface VideoOrder {
  id: string; // e.g. "GC-2026-1042"
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  city?: string;
  mainCategory?: MainCategory;
  serviceName?: string;
  category: VideoCategory;
  title: string;
  description: string;
  aspectRatio: AspectRatioType;
  durationMinutes: number; // e.g. 0.5 (30s) to 10
  rushDelivery: boolean; // 24h
  includeSubtitles: boolean;
  soundDesign: boolean;
  colorGrading: boolean;
  
  // Footage
  uploadMethod: 'file' | 'cloud_link';
  cloudFootageUrl?: string;
  rawFilesCount?: number;
  rawFilesNames?: string[];
  fileData?: string; // ગ્રાહકે મોકલેલો મૂળ ફોટો / વિડિયો ડેટા URL
  fileName?: string; // ગ્રાહકની મૂળ ફાઇલનું નામ
  rawFiles?: RawFileItem[];
  
  // Pricing
  estimatedPrice: number; // ₹150 - ₹2000
  finalPrice?: number;
  paymentStatus: PaymentStatus;
  
  // Status
  status: OrderStatus;
  statusLogs: StatusLog[];
  
  // Delivery
  finalData?: string; // ફાઇનલ એડિટ વિડિયો ડાઉનલોડ URL (finalData)
  finalName?: string; // ફાઇનલ વિડિયો ફાઇલ નામ (finalName)
  finalVideoUrl?: string; // Direct link or preview
  finalVideoDownloadUrl?: string; // High res download link
  finalVideoResolution?: string; // e.g. "4K UHD (3840x2160)" or "1080p FHD"
  finalVideoFileSize?: string; // e.g. "145 MB"
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // Revision
  revisionCount?: number;
  revisionNotes?: string;
}

export interface PricingPlan {
  id: string;
  nameGu: string;
  nameEn: string;
  priceMin: number;
  priceMax: number;
  priceLabel: string;
  taglineGu: string;
  taglineEn: string;
  featuresGu: string[];
  featuresEn: string[];
  popular?: boolean;
  category: VideoCategory;
}

export type Language = 'gu' | 'en';
