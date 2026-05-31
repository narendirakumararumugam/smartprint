import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { RESOURCE_PATHS } from '../constants/api-endpoints';
import { environment } from '../../environment/environment';
import { FilterType, Shop, SortType } from '../../models/shop.model';

// Mock data fallback reference placeholder
const SHOPS: Shop[] = [];

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/${RESOURCE_PATHS.PUBLIC_SHOPS}`;

  private allShops: Shop[] = environment.useMockData ? SHOPS : [];
  private shopsLoaded = false;

  private searchQuery$ = new BehaviorSubject<string>('');
  private activeFilter$ = new BehaviorSubject<FilterType>('all');
  private sortBy$ = new BehaviorSubject<SortType>('recommended');
  private serviceFilter$ = new BehaviorSubject<string>('');

  readonly filteredShops$: Observable<Shop[]> = combineLatest([
    this.searchQuery$,
    this.activeFilter$,
    this.sortBy$,
    this.serviceFilter$,
  ]).pipe(map(([q, f, s, svc]) => this.filterAndSort(q, f, s, svc)));

  readonly resultCount$: Observable<number> = this.filteredShops$.pipe(
    map((s) => s.length),
  );

  /** Fetch shops from API. Falls back to mock data if useMockData is true. */
  loadShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl).pipe(
      tap((shops) => {
        if (shops && shops.length) {
          this.allShops = shops;
          this.shopsLoaded = true;
          this.refreshFiltered();
        }
      }),
      catchError(() => {
        if (environment.useMockData) {
          this.allShops = SHOPS;
          this.refreshFiltered();
          return of(SHOPS);
        }
        return of([]);
      }),
    );
  }

  // From the first and second images (ShopService)
  loadShopsNearby(lat: number, lng: number, radiusKm = 5): Observable<Shop[]> {
    if (environment.useMockData) {
      this.allShops = SHOPS.map((s) => {
        const km = this.haversineKm(
          lat,
          lng,
          s.latitude ?? 0,
          s.longitude ?? 0,
        );
        return { ...s, distanceKm: km, distance: this.formatDistance(km) };
      }).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
      this.refreshFiltered();
      return of(this.allShops);
    }

    const url = `${this.apiUrl}/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`;
    return this.http.get<Shop[]>(url).pipe(
      tap((shops) => {
        if (shops?.length) {
          this.allShops = shops;
          this.shopsLoaded = true;
          this.refreshFiltered();
        }
      }),
      catchError(() => of(this.allShops)),
    );
  }

  /** Trigger filteredShops$ to re-emit with the current allShops state. */
  private refreshFiltered(): void {
    this.searchQuery$.next(this.searchQuery$.getValue());
  }

  private haversineKm(
    Lat1: number,
    Lng1: number,
    Lat2: number,
    Lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(Lat2 - Lat1);
    const dLng = this.toRad(Lng2 - Lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(Lat1)) *
        Math.cos(this.toRad(Lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(v: number): number {
    return (v * Math.PI) / 180;
  }

  private formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  }

  setSearch(q: string): void {
    this.searchQuery$.next(q.toLowerCase().trim());
  }
  setFilter(f: FilterType): void {
    this.activeFilter$.next(f);
  }
  setSort(s: SortType): void {
    this.sortBy$.next(s);
  }
  setServiceFilter(svc: string): void {
    this.serviceFilter$.next(svc);
  }

  getById(id: number): Shop | undefined {
    return this.allShops.find((s) => s.id === id);
  }

  getShopDetail(id: number): Observable<Shop> {
    if (environment.useMockData) {
      const found =
        SHOPS.find((s) => s.id === id) ??
        this.allShops.find((s) => s.id === id);
      return found ? of(found) : of({} as Shop);
    }
    return this.http.get<Shop>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const cached = this.allShops.find((s) => s.id === id);
        return cached ? of(cached) : of({} as Shop);
      }),
    );
  }

  getFeatured(): Shop[] {
    if (!this.allShops.length) return [];
    return [0, 4, 3, 1, 2].map((id) => this.allShops[id]).filter(Boolean);
  }

  lowestPrice(shop: Shop): number | null {
    if (!shop.prices?.length) return null;
    const nums = shop.prices
      .map((p) => parseFloat(p.price.replace(/[^\d.]/g, '')))
      .filter((n) => !isNaN(n) && n > 0);
    if (!nums.length) return null;
    const min = Math.min(...nums);
    return isFinite(min) ? min : null;
  }

  private filterAndSort(
    query: string,
    filter: FilterType,
    sort: SortType,
    serviceFilter: string,
  ): Shop[] {
    let result = this.allShops.filter((s) => {
      if (filter === 'open' && !s.isOpen) return false;
      if (filter === 'top' && s.rating < 4) return false;
      if (filter === 'nearby') {
        const km =
          s.distanceKm !== undefined ? s.distanceKm : parseFloat(s.distance);
        if (km > 1) return false;
      }
      if (filter === 'color' && !(s.services ?? []).includes('Color Print'))
        return false;
      if (filter === 'bind' && !(s.services ?? []).some((x) => x.includes('Binding')))
        return false;
      if (
        filter === 'large' &&
        !(s.services ?? []).some((x) =>
          ['Format', 'Flex', 'Banner', 'A0', 'A1'].some((k) => x.includes(k)),
        )
      )
        return false;

      if (
        serviceFilter &&
        !(s.services ?? []).some((x) =>
          x.toLowerCase().includes(serviceFilter.toLowerCase()),
        )
      )
        return false;

      if (
        query &&
        !s.name.toLowerCase().includes(query) &&
        !(s.services ?? []).join(' ').toLowerCase().includes(query) &&
        !s.address.toLowerCase().includes(query)
      )
        return false;

      return true;
    });

    if (sort === 'rating')
      result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === 'distance')
      result = [...result].sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
      );
    if (sort === 'price')
      result = [...result].sort(
        (a, b) => (this.lowestPrice(a) ?? 0) - (this.lowestPrice(b) ?? 0),
      );
    if (sort === 'wait')
      result = [...result].sort((a, b) => parseInt(a.wait) - parseInt(b.wait));

    return result;
  }
}
