export interface PriceItem {
  service: string;
  spec: string;
  price: string;
  popular?: boolean;
}

export interface WorkingHour {
  day: string;
  time: string;
  closed?: boolean;
}

export interface Shop {
  id: number;
  name: string;
  tagline: string;
  about: string;
  address: string;
  city: string;
  distance: string;
  isOpen: boolean;
  closesAt: string;
  wait: string;
  rating: number;
  reviews: number;
  owner: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  gradient: string;
  icon: string;
  badges: string[];
  isVerified: boolean;
  services: string[];
  gallery: string[];
  prices: PriceItem[];
  hours: WorkingHour[];
  latitude?:number;
  longitude?:number;
  distanceKm?:number;
}

export type FilterType = 'all' | 'open' | 'top' | 'nearby' | 'color' | 'bind' | 'large';
export type SortType = 'recommended' | 'rating' | 'distance' | 'price' | 'wait';