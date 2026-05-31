import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Collection, SavedShop } from '../../models/saved-shop.model';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS, RESOURCE_PATHS } from '../constants/api-endpoints';

interface SavedShopApiResponse {
  id: number;
  shop: {
    id: number;
    name: string;
    address: string;
    city: string;
    isOpen?: boolean;
    wait?: string;
    rating?: number;
    reviews?: number;
    gradient?: string;
    icon?: string;
    badges?: string[];
    services?: string[];
    distanceKm?: number;
  };
  savedAt: string;
}

const MOCK_COLLECTIONS: Collection[] = [
  { id: 'all', name: 'All Saved', icon: 'bx bx-border-all' },
  { id: 'favorites', name: 'Favorites', icon: 'bx bxs-heart' },
  { id: 'work', name: 'Work', icon: 'bx bx-briefcase' },
  { id: 'college', name: 'College', icon: 'bx bxs-graduation' },
  { id: 'nearby', name: 'Nearby', icon: 'bx bx-target' },
];

const MOCK_SAVED_SHOPS: SavedShop[] = [
  {
    id: 1,
    shopId: 0,
    name: 'PrintPro Express',
    address: 'F-Block, Connaught Place, New Delhi',
    distance: 0.3,
    rating: 4.8,
    reviews: 312,
    isOpen: true,
    wait: '~5 min',
    gradient: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    icon: '🖨️',
    badge: 'Top Rated',
    badgeStyle: 'background: #dbeafe; color: #1d4ed8',
    services: ['B&W Print', 'Color Print', 'Lamination', 'Scanning', 'Binding'],
    prices: [
      ['B&W (A4)', '₹1.5/page'],
      ['Color (A4)', '₹10/page'],
      ['Spiral Bind', '₹30'],
      ['Hard Bind', '₹180'],
      ['Lamination A4', '₹15'],
    ],
    hours: {
      Mon: '8 AM - 10 PM',
      Tue: '8 AM - 10 PM',
      Wed: '8 AM - 10 PM',
      Thu: '8 AM - 10 PM',
      Fri: '8 AM - 10 PM',
      Sat: '9 AM - 9 PM',
      Sun: '10 AM - 6 PM',
    },
    about:
      'PrintPro Express is the most popular print shop in Connaught Place, known for quick turnaround and premium quality. Serving students and professionals alike.',
    phone: '+91 98100 11223',
    collections: ['All', 'Favorites', 'Work'],
    savedAt: '2026-05-12',
  },
  {
    id: 2,
    shopId: 1,
    name: 'QuickPrint Hub',
    address: 'Janpath Market, New Delhi',
    distance: 0.6,
    rating: 4.5,
    reviews: 198,
    isOpen: true,
    wait: '~10 min',
    gradient: 'linear-gradient(135deg, #d97706, #fbbf24)',
    icon: '⚡',
    badge: 'Fast Delivery',
    badgeStyle: 'background: #fef3c7; color: #92400e',
    services: ['B&W Print', 'Color Print', 'Passport Photos', 'Scanning'],
    prices: [
      ['B&W (A4)', '₹1/page'],
      ['Color (A4)', '₹8/page'],
      ['Passport Photo', '₹40'],
      ['Scanning', '₹5/page'],
    ],
    hours: {
      Mon: '7 AM - 11 PM',
      Tue: '7 AM - 11 PM',
      Wed: '7 AM - 11 PM',
      Thu: '7 AM - 11 PM',
      Fri: '7 AM - 11 PM',
      Sat: '7 AM - 11 PM',
      Sun: '9 AM - 8 PM',
    },
    about:
      'QuickPrint Hub prides itself on the fastest service in Janpath. Walk in and walk out in minutes. Best rates in the area for large bulk prints.',
    phone: '+91 98100 44556',
    collections: ['All', 'Nearby'],
    savedAt: '2026-05-09',
  },
];

@Injectable({
  providedIn: 'root',
})
export class SavedShopService extends BaseApiService {
  protected readonly resourcePath = RESOURCE_PATHS.SHOPS;

  private readonly savedShops$ = new BehaviorSubject<SavedShop[]>([]);
  private readonly collections$ = new BehaviorSubject<Collection[]>(
    MOCK_COLLECTIONS,
  );

  constructor(http: HttpClient) {
    super(http);
  }

  get shops$(): Observable<SavedShop[]> {
    return this.savedShops$.asObservable();
  }

  get collectionsObs$(): Observable<Collection[]> {
    return this.collections$.asObservable();
  }

  get currentShops(): SavedShop[] {
    return this.savedShops$.value;
  }

  loadSavedShops(): Observable<SavedShop[]> {
    return this.apiGet<SavedShopApiResponse[] | SavedShop[]>(
      API_ENDPOINTS.SHOPS.SAVED,
      MOCK_SAVED_SHOPS,
    ).pipe(map(shops => this.normalizeSavedShops(shops)), tap((shops) => this.savedShops$.next(shops)));
  }

  saveShop(shopId: number): Observable<{ saved: boolean; shopId: number }> {
    return this.apiPost<{ saved: boolean; shopId: number }>(
      API_ENDPOINTS.SHOPS.SAVE(shopId),
      {},
      { saved: true, shopId },
    );
  }

  unsaveShop(shopId: number): Observable<{ saved: boolean; shopId: number }> {
    return this.apiPost<{ saved: boolean; shopId: number }>(
      API_ENDPOINTS.SHOPS.SAVE(shopId),
      {},
      { saved: false, shopId },
    ).pipe(
      tap(() => {
        this.savedShops$.next(
          this.savedShops$.value.filter((s) => s.shopId !== shopId),
        );
      }),
    );
  }

  getCollections(): Observable<Collection[]> {
    return this.apiGet<Collection[]>(
      API_ENDPOINTS.SHOPS.COLLECTIONS,
      MOCK_COLLECTIONS,
    ).pipe(tap((cols) => this.collections$.next(cols)));
  }

  private normalizeSavedShops(shops: SavedShopApiResponse[] | SavedShop[]): SavedShop[] {
    if (!shops.length) return [];

    const first = shops[0] as SavedShopApiResponse;
    if (first.shop) {
        return (shops as SavedShopApiResponse[]).map(s => {
            const badge = s.shop.badges?.[0] || 'Saved';
            return {
                id: s.id,
                shopId: s.shop.id,
                name: s.shop.name,
                address: [s.shop.address, s.shop.city].filter(Boolean).join(', '),
                distance: s.shop.distanceKm ?? 0,
                rating: s.shop.rating ?? 0,
                reviews: s.shop.reviews ?? 0,
                isOpen: !!s.shop.isOpen,
                wait: s.shop.wait || '-',
                gradient: s.shop.gradient || 'linear-gradient(135deg,#1e3a8a,#2563eb)',
                icon: s.shop.icon || '🛍️',
                badge,
                badgeStyle: 'background:#dbeafe;color:#1d4ed8',
                services: s.shop.services ?? [],
                prices: [],
                hours: {},
                about: '',
                phone: '',
                collections: ['all'],
                savedAt: s.savedAt || new Date().toISOString(),
            };
        });
    }

    return shops as SavedShop[];
}
}
