import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinates, NominatimResult, UserLocation } from '../../models/location.model';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly base = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) {}

  /** Forward geocoding: text -> list of places */
  searchAddress(query: string): Observable<NominatimResult[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('limit', '6');

    return this.http.get<NominatimResult[]>(`${this.base}/search`, {
      params,
      headers: { 'Accept-Language': 'en' },
    });
  }

  /** Reverse geocoding: coords -> UserLocation */
  reverseGeocode(coords: Coordinates): Observable<UserLocation> {
    const params = new HttpParams()
      .set('lat', coords.lat.toString())
      .set('lon', coords.lng.toString())
      .set('format', 'json')
      .set('addressdetails', '1');

    return this.http.get<NominatimResult>(`${this.base}/reverse`, { params }).pipe(
      map(r => this.toUserLocation(r))
    );
  }

  toUserLocation(r: NominatimResult): UserLocation {
    const a = r.address;
    const parts = r.display_name.split(',');
    const shortAddress = parts.slice(0, 2).join(',').trim();
    const city = a.city ?? a.town ?? a.village ?? '';

    return {
      coordinates: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) },
      shortAddress,
      fullAddress: r.display_name,
      city,
      state: a.state ?? '',
      pincode: a.postcode ?? '',
    };
  }
}