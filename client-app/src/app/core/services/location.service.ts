import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserLocation } from '../../models/location.model';

const STORAGE_KEY = 'user_location';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly platformId = inject(PLATFORM_ID);
  private _location$ = new BehaviorSubject<UserLocation | null>(this.loadStored());

  /** Emits the currently confirmed location (null until set) */
  readonly location$ = this._location$.asObservable();

  setLocation(location: UserLocation): void {
    this._location$.next(location);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      } catch {
        /* quota exceeded or private mode – fail silently */
      }
    }
  }

  clearLocation(): void {
    this._location$.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /** Wraps the browser Geolocation API as an Observable */
  requestCurrentPosition(): Observable<GeolocationPosition> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => {
        observer.error({ code: 0, message: 'Geolocation is not available on the server.' });
      });
    }

    return new Observable(observer => {
      if (!('geolocation' in navigator)) {
        observer.error({ code: 0, message: 'Geolocation not supported by this browser.' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => { observer.next(pos); observer.complete(); },
        err => observer.error(err),
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 }
      );
    });
  }

  /** Synchronous snapshot of the current location (for template use) */
  get currentLocation(): UserLocation | null { return this._location$.getValue(); }

  private loadStored(): UserLocation | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserLocation) : null;
    } catch {
      return null;
    }
  }
}