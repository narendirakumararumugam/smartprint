import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Collection, SavedShop } from '../../models/saved-shop.model';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS, RESOURCE_PATHS } from '../constants/api-endpoints';

const MOCK_COLLECTIONS: Collection[] = [
    { id: 'all', name: 'All Saved', icon: 'bx bx-border-all' },
    { id: 'favorites', name: 'Favorites', icon: 'bx bxs-heart' },
    { id: 'work', name: 'Work', icon: 'bx bx-briefcase' },
    { id: 'college', name: 'College', icon: 'bx bxs-graduation' },
    { id: 'nearby', name: 'Nearby', icon: 'bx bx-current-location' },
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
        prices: [['B&W (A4)', '₹1.5/page'], ['Color (A4)', '₹10/page'], ['Spiral Bind', '₹30'], ['Hard Bind', '₹180'], ['Lamination A4', '₹15']],
        hours: { Mon: '8 AM - 10 PM', Tue: '8 AM - 10 PM', Wed: '8 AM - 10 PM', Thu: '8 AM - 10 PM', Fri: '8 AM - 10 PM', Sat: '9 AM - 9 PM', Sun: '10 AM - 6 PM' },
        about: 'PrintPro Express is the most popular print shop in Connaught Place, known for quick turnaround and premium quality. Serving students and professionals alike.',
        phone: '+91 98100 11223',
        collections: ['All', 'Favorites', 'Work'],
        savedAt: '2026-05-12'
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
        prices: [['B&W (A4)', '₹1/page'], ['Color (A4)', '₹8/page'], ['Passport Photo', '₹40'], ['Scanning', '₹5/page']],
        hours: { Mon: '7 AM - 11 PM', Tue: '7 AM - 11 PM', Wed: '7 AM - 11 PM', Thu: '7 AM - 11 PM', Fri: '7 AM - 11 PM', Sat: '7 AM - 11 PM', Sun: '9 AM - 8 PM' },
        about: 'QuickPrint Hub prides itself on the fastest service in Janpath. Walk in and walk out in minutes. Best rates in the area for large bulk prints.',
        phone: '+91 98100 44556',
        collections: ['All', 'Nearby'],
        savedAt: '2026-05-09'
    },
    {
        id: 3,
        shopId: 3,
        name: 'Campus Prints',
        address: 'GTB Nagar, North Campus, Delhi',
        distance: 0.5,
        rating: 4.6,
        reviews: 421,
        isOpen: true,
        wait: '~8 min',
        gradient: 'linear-gradient(135deg, #059669, #34d399)',
        icon: '🎓',
        badge: 'Student Discount',
        badgeStyle: 'background: #d1fae5; color: #065f46',
        services: ['B&W Print', 'Color Print', 'Binding', 'Lamination', 'Photocopy'],
        prices: [['B&W (A4)', '₹1/page'], ['Color (A4)', '₹7/page'], ['Photocopy', '₹0.80/page'], ['Binding', '₹25'], ['Student B&W', '₹0.80/page']],
        hours: { Mon: '7 AM - 11 PM', Tue: '7 AM - 11 PM', Wed: '7 AM - 11 PM', Thu: '7 AM - 11 PM', Fri: '7 AM - 11 PM', Sat: '8 AM - 10 PM', Sun: 'Closed' },
        about: 'Campus Prints has been the go-to shop for Delhi University students for over a decade. Special student discounts available with valid ID.',
        phone: '+91 98100 77889',
        collections: ['All', 'Favorites', 'College'],
        savedAt: '2026-05-05'
    },
    {
        id: 4,
        shopId: 4,
        name: 'Xerox World',
        address: 'Nehru Place, Ground Floor, New Delhi',
        distance: 0.8,
        rating: 4.7,
        reviews: 276,
        isOpen: false,
        wait: '~20 min',
        gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
        icon: '🖥️',
        badge: 'Large Format',
        badgeStyle: 'background: #ede9fe; color: #5b21b6',
        services: ['Large Format', 'Banner Print', 'Canvas Print', 'Color Print', 'Mounting'],
        prices: [['A4 Color', '₹10/page'], ['A3 Color', '₹20/page'], ['Banner (per sqft)', '₹80'], ['Canvas Print', '₹150+'], ['Mounting A4', '₹50']],
        hours: { Mon: '9 AM - 9 PM', Tue: '9 AM - 9 PM', Wed: '9 AM - 9 PM', Thu: '9 AM - 9 PM', Fri: '9 AM - 9 PM', Sat: '9 AM - 8 PM', Sun: '10 AM - 5 PM' },
        about: 'Xerox World specializes in large-format industrial printing, banners, and canvas artwork. Professional-grade equipment ensures stunning results.',
        phone: '+91 98100 22334',
        collections: ['All', 'Work'],
        savedAt: '2026-04-28'
    }
];

@Injectable({
    providedIn: 'root'
})
export class SavedShopService extends BaseApiService {
    protected readonly resourcePath = RESOURCE_PATHS.SHOPS;

    private readonly savedShops$ = new BehaviorSubject<SavedShop[]>([]);
    private readonly collections$ = new BehaviorSubject<Collection[]>(MOCK_COLLECTIONS);

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
        return this.apiGet<SavedShop[]>(API_ENDPOINTS.SHOPS.SAVED, MOCK_SAVED_SHOPS).pipe(
            tap(shops => this.savedShops$.next(shops))
        );
    }

    saveShop(shopId: number): Observable<{ saved: boolean; shopId: number }> {
        return this.apiPost<{ saved: boolean; shopId: number }>(API_ENDPOINTS.SHOPS.SAVE(shopId), {}, { saved: true, shopId });
    }

    unsaveShop(shopId: number): Observable<{ saved: boolean; shopId: number }> {
        return this.apiPost<{ saved: boolean; shopId: number }>(API_ENDPOINTS.SHOPS.SAVE(shopId), {}, { saved: false, shopId }).pipe(
            tap(() => {
                this.savedShops$.next(this.savedShops$.value.filter(s => s.shopId !== shopId));
            })
        );
    }

    getCollections(): Observable<Collection[]> {
        return this.apiGet<Collection[]>(API_ENDPOINTS.SHOPS.COLLECTIONS, MOCK_COLLECTIONS).pipe(
            tap(cols => this.collections$.next(cols))
        );
    }
}