import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';

// —- Event types (must match backend DTOs) ——————————————————————————

export interface OrderStatusEvent {
    type: 'ORDER_STATUS_CHANGED';
    orderId: string;
    orderNumber: string;
    status: string;
    statusLabel: string;
    progress: number;
    progressLabel: string;
    timeline: Array<{
      label: string;
      description: string;
      state: string;
      eventTime?: string;
    }>;
}

export interface NewOrderEvent {
    type: 'NEW_ORDER';
    orderId: string;
    orderNumber: string;
    customerName: string;
    total: number;
    itemCount: number;
    createdAt: string;
}

export interface ShopStatusEvent {
    type: 'SHOP_STATUS_CHANGED';
    shopId: number;
    shopName: string;
    open: boolean;
}
// —- Service ——————————————————————————

/**
 * Typed wrapper around WebSocketsService.
 * * Consumers inject this service and call the specific watch() methods they
 * need. The underlying transport is managed by WebSocketsService.
 */
@Injectable({ providedIn: 'root' })
export class OrderRealtimeService {
    private readonly ws = inject(WebSocketService);

    /**
     * Subscribe to order-status updates for the currently logged-in customer.
     * The server routes events to /user/queue/order-updates using their email
     * as the STOMP principal.
     */
    watchOrderUpdates(): Observable<OrderStatusEvent> {
        return this.ws.watch<OrderStatusEvent>('/user/queue/order-updates');
    }

    /**
     * Subscribe to new-order notifications for the currently logged-in owner.
     * The server routes events to /user/queue/notifications.
     */
    watchOwnerNotifications(): Observable<NewOrderEvent> {
        return this.ws.watch<NewOrderEvent>('/user/queue/notifications');
    }

    watchShopStatus(shopId: number): Observable<ShopStatusEvent> {
        return this.ws.watch<ShopStatusEvent>(`/topic/shop/${shopId}/status`);
    }
}