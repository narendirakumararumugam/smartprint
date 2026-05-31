export interface OwnerRegisterRequest {
  // Step 1: Account
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  password: string;

  // Step 2: Shop Details
  shopName: string;
  tagline?: string;
  address: string;
  city: string;
  pinCode: string;
  latitude?: number;
  longitude?: number;
  services: string[];
  hours: ShopHourEntry[];
  pricing: ShopPricing;

  // Step 3: Setup
  approvalMode: 'manual' | 'auto';
  printer?: PrinterConfig;
  maxFileSize: string;
  notifications: NotificationPreferences;
}

export interface ShopHourEntry {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface ShopPricing {
  a4BWSingle: number;
  a4ColorSingle: number;
  a4BWDouble: number;
  a4ColorDouble: number;
  a3BW: number;
  a3Color: number;
  photoBW: number;
  photoColor: number;
}

export interface PrinterConfig {
  model: string;
  connectionType: string;
  ipAddress?: string;
}

export interface NotificationPreferences {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  dailySummary: boolean;
}

export interface OwnerRegisterResponse {
  success: boolean;
  shopId?: number;
  shopName?: string;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ServiceOption {
  icon: string;
  label: string;
  selected: boolean;
}

export const AVAILABLE_SERVICES: ServiceOption[] = [
  { icon: 'bx bx-printer', label: 'B&W Printing', selected: true },
  { icon: 'bx bxs-palette', label: 'Color Printing', selected: true },
  { icon: 'bx bx-copy', label: 'Photocopying', selected: true },
  { icon: 'bx bx-book', label: 'Binding', selected: false },
  { icon: 'bx bx-cut', label: 'Lamination', selected: false },
  { icon: 'bx bx-image', label: 'Photo Prints', selected: false },
  { icon: 'bx bx-scan', label: 'Scanning', selected: false },
  { icon: 'bx bx-address-book', label: 'ID / Passport Photos', selected: false },
  { icon: 'bx bx-landscape', label: 'Banner / Poster', selected: false },
  { icon: 'bx bx-package', label: 'Courier Services', selected: false },
];

export const DEFAULT_HOURS: ShopHourEntry[] = [
  { day: 'Monday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'Tuesday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'Wednesday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'Thursday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'Friday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'Saturday', open: '10:00', close: '18:00', isClosed: false },
  { day: 'Sunday', open: '', close: '', isClosed: true },
];

export const DEFAULT_PRICING: ShopPricing = {
  a4BWSingle: 2,
  a4ColorSingle: 8,
  a4BWDouble: 3,
  a4ColorDouble: 14,
  a3BW: 5,
  a3Color: 18,
  photoBW: 10, 
  photoColor: 25
};

export const MAX_FILE_SIZE_OPTIONS = ['50MB', '100MB', '200MB', '500MB', 'Unlimited'];