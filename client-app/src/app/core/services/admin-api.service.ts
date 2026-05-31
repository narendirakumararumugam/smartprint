import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment/environment';
import { API_ENDPOINTS, RESOURCE_PATHS } from '../constants/api-endpoints';

export interface AdminStats {
  totalUsers: number;
  totalShops: number;
  totalOrders: number;
  pendingVerifications: number;
  activeUsers: number;
  verifiedShops: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  userType: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
}

export interface AdminShop {
  id: number;
  name: string;
  city: string;
  ownerName: string;
  ownerEmail: string;
  verified: boolean;
  open: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  shopName: string;
  status: string;
  total: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/${RESOURCE_PATHS.ADMIN}`;

  getStats(): Observable<AdminStats> {
    if (environment.useMockData) {
      return of({ totalUsers: 0, totalShops: 0, totalOrders: 0, pendingVerifications: 0, activeUsers: 0, verifiedShops: 0 });
    }
    return this.http.get<AdminStats>(`${this.baseUrl}/${API_ENDPOINTS.ADMIN.STATS}`);
  }

  getUsers(): Observable<AdminUser[]> {
    if (environment.useMockData) {
      return of([]);
    }
    return this.http.get<AdminUser[]>(`${this.baseUrl}/${API_ENDPOINTS.ADMIN.USERS}`);
  }

  updateUserStatus(userId: string, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${API_ENDPOINTS.ADMIN.USER_STATUS(userId)}`, { active });
  }

  getShops(): Observable<AdminShop[]> {
    if (environment.useMockData) {
      return of([]);
    }
    return this.http.get<AdminShop[]>(`${this.baseUrl}/${API_ENDPOINTS.ADMIN.SHOPS}`);
  }

  toggleShopVerification(shopId: number, verified: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${API_ENDPOINTS.ADMIN.SHOP_VERIFY(shopId)}`, { verified });
  }

  getOrders(): Observable<AdminOrder[]> {
    if (environment.useMockData) {
      return of([]);
    }
    return this.http.get<AdminOrder[]>(`${this.baseUrl}/${API_ENDPOINTS.ADMIN.ORDERS}`);
  }
}