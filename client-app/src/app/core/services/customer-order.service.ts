import { Injectable } from "@angular/core";
import { environment } from "../../environment/environment";
import { API_ENDPOINTS, RESOURCE_PATHS } from "../constants/api-endpoints";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface OrderFileItem {
  fileName: string;
  pages: number;
  copies: number;
  color: boolean;
  sides?: string;
  paperSize?: string;
}

export interface OrderCreateRequest {
  shopId: number;
  files: OrderFileItem[];
  addonIds?: string[];
  specialNote?: string;
}

export interface OrderTimelineEntry {
  label: string;
  description: string;
  state: string;
  eventTime?: string;
}

export interface OrderItemResponse {
  fileName: string;
  pages: number;
  copies: number;
  colorMode: string;
  sides: string;
  paperSize: string;
  rate: number;
  total: number;
}

export interface OrderAddonResponse {
  addonId: string;
  addonName: string;
  price: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  shopName: string;
  shopId: number;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  specialNote?: string;
  pickupTime?: string;
  items: OrderItemResponse[];
  addons: OrderAddonResponse[];
  timeline: OrderTimelineEntry[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerOrderService {
  private readonly baseUrl = `${environment.apiBaseUrl}/${RESOURCE_PATHS.ORDERS}`;

  constructor(private readonly http: HttpClient) {}

  createOrder(request: OrderCreateRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, request);
  }

  getOrders(status?: string): Observable<OrderResponse[]> {
    const params = status && status !== 'all' ? `?status=${status}` : '';
    return this.http.get<OrderResponse[]>(`${this.baseUrl}${params}`);
  }

  getOrderDetails(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${API_ENDPOINTS.ORDERS.DETAIL(orderId)}`);
  }

  cancelOrder(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/${API_ENDPOINTS.ORDERS.CANCEL(orderId)}`, {});
  }

  confirmPickup(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/${API_ENDPOINTS.ORDERS.CONFIRM_PICKUP(orderId)}`, {});
  }
}