import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface ShopSettingsResponse {
  shopId: number;
  shopName: string;
  shopTagline: string;
  shopPhone: string;
  shopCategory: string;
  shopDescription: string;
  shopMapsLink: string;
  shopAddress: string;
  shopCity: string;
  shopState: string;
  shopPincode: string;
  services: string[];
  paperSizes: string[];
  maxFileSize: string;
  priceRows: PriceRowDTO[];
  addOns: AddonDTO[];
  bulkDiscounts: BulkDiscountDTO[];
  hours: HourEntryDTO[];
  minPrepTime: number;
  approvalMode: string;
  defaultPrinter: string;
  maxOrderPages: number;
  maxDailyOrders: number;
  shopOpen: boolean;
  closures: ClosureDTO[];
}

export interface PriceRowDTO {
  service: string;
  spec: string;
  price: string;
  popular: boolean;
}

export interface AddonDTO {
  name: string;
  price: number;
}

export interface BulkDiscountDTO {
  min: number;
  max: number;
  discount: number;
}

export interface HourEntryDTO {
  day: string;
  open: string;
  close: string;
  breakStart: string;
  breakEnd: string;
  closed: boolean;
}

export interface ClosureDTO {
  date: string;
  reason: string;
  recurring: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OwnerShopService {
  private readonly baseUrl = `${environment.apiBaseUrl}/owner/shop`;

  constructor(private readonly http: HttpClient) {}

  getSettings(): Observable<ShopSettingsResponse> {
    return this.http.get<ShopSettingsResponse>(`${this.baseUrl}/settings`);
  }

  updateSettings(payload: Partial<ShopSettingsResponse>): Observable<ShopSettingsResponse> {
    return this.http.put<ShopSettingsResponse>(`${this.baseUrl}/settings`, payload);
  }

  deactivateShop(): Observable<ShopSettingsResponse> {
    return this.http.patch<ShopSettingsResponse>(`${this.baseUrl}/deactivate`, {});
  }

  deleteShop(): Observable<void> {
    return this.http.delete<void>(this.baseUrl);
  }
}