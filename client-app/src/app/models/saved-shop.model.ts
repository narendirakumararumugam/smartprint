export interface SavedShop{
    id: number;
    shopId: number;
    name: string;
    address: string;
    icon: string;
    badge: string;
    badgeStyle: string;
    gradient: string;
    distance: number; // in km
    rating: number; // out of 5
    reviews: number;
    isOpen: boolean;
    wait: string; // e.g. "5 mins"
    services: string[];
    prices: [string, string][];
    hours: Record<string, string>;
    about: string;
    phone: string;
    collections: string[];
    savedAt: string;
}

export interface Collection{
    id: string;
    name: string;
    icon: string;
}

export type SavedFilterType = 'all' | 'open' | 'nearby' | 'top';
export type SavedSortType = 'saved' | 'rating' | 'distance' | 'name';
export type SavedViewType = 'list' | 'grid';