import { Injectable } from "@angular/core";
import { BaseApiService } from "./base-api.service";
import { API_ENDPOINTS, RESOURCE_PATHS } from "../constants/api-endpoints";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  statusLabel: string;
  customer: CustomerSummary;
  shop: ShopSummary;
  items: OrderItemDTO[];
  addons?: OrderAddonDTO[];
  timeline?: OrderTimelineDTO[];
  subtotal: number;
  tax: number;
  total: number;
  specialNote?: string;
  pickupTime?: string;
  progress: number;
  progressLabel: string;
  canCancel: boolean;
  canReorder: boolean;
  createdAt: string; // ISO date string
}

export interface CustomerSummary {
  id: number;
  name: string;
  phone: string;
  avatar?:string;
  email?: string;
}

export interface ShopSummary {
  id: number;
  name: string;
  icon?: string;
  gradient?: string;
  address: string;
  phone: string;
}

export interface OrderItemDTO {
  fileName: string;
  pages: number;
  copies: number;
  colorMode: string;
  sides: string;
  paperSize: string;
  rate: number;
  total: number;
}

export interface OrderAddonDTO {
  addonId: string;
  addonName: string;
  price: number;
}

export interface OrderTimelineDTO {
  label: string;
  description: string;
  state: string;
  eventTime: string; // ISO date string
}

const MOCK_ORDERS: OrderResponse[] = [
  // {
  //   id: 'uuid-1',
  //   orderNumber: 'PH-2026-0044',
  //   status: 'PENDING',
  //   statusLabel: 'Pending',
  //   shop: { id: 1, name: 'My Print Shop', address: '123 Main St', phone: '+91 98765 43210' },
  //   items: [{ fileName: 'Thesis_Final.pdf', pages: 42, copies: 1, colorMode: 'BW', sides: 'single', paperSize: 'A4', rate: 3, total: 126 }],
  //   subtotal: 126,
  //   tax: 0,
  //   total: 126,
  //   progress: 20,
  //   progressLabel: 'Order received',
  //   canCancel: true,
  //   canReorder: false,
  //   createdAt: '2026-01-15T10:30:00Z',
  // },
];

@Injectable({ providedIn: 'root' })
export class OwnerOrdersService extends BaseApiService {
  protected readonly resourcePath = RESOURCE_PATHS.OWNER_ORDERS;

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Fetch orders for a specific shop.
   * Backend requires shopId as a query parameter.
   */
  getShopOrders(shopId: number, status?: string): Observable<OrderResponse[]> {
    let endpoint = `${this.baseUrl}${API_ENDPOINTS.OWNER_ORDERS.LIST}?shopId=${shopId}`;
    console.log(endpoint)
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.http.get<OrderResponse[]>(endpoint, { withCredentials: true });
  }

  updateOrderStatus(orderId: string, newStatus: string): Observable<OrderResponse> {
    const endpoint = `${this.baseUrl}${API_ENDPOINTS.OWNER_ORDERS.UPDATE_STATUS}/${orderId}`;
    return this.apiPost<OrderResponse>(`${orderId}/status`, { status: newStatus }, MOCK_ORDERS[0]);
  }
}