package com.smartprint.smartservice.services;

import com.smartprint.smartservice.dtos.events.NewOrderEvent;
import com.smartprint.smartservice.dtos.events.OrderStatusEvent;
import com.smartprint.smartservice.dtos.events.ShopStatusEvent;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private static final Logger log = LoggerFactory.getLogger(WebSocketNotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Notify the customer that one of their orders changed status.
     * Destination: /user/{customerEmail}/queue/order-updates
     */
    public void pushOrderStatusToCustomer(String customerEmail, OrderStatusEvent event) {
        try {
            messagingTemplate.convertAndSendToUser(customerEmail, "/queue/order-updates", event);
            log.debug("Pushed ORDER_STATUS_CHANGED({}) to customer {}", event.getOrderNumber(), customerEmail);
        } catch (Exception e) {
            log.warn("Failed to push order status to customer {}: {}", customerEmail, e.getMessage());
        }
    }

    /**
     * Notify the shop owner that a new order has arrived.
     * Destination: /user/{ownerEmail}/queue/notifications
     */
    public void pushNewOrderToOwner(String ownerEmail, NewOrderEvent event) {
        try {
            messagingTemplate.convertAndSendToUser(ownerEmail, "/queue/notifications", event);
            log.debug("Pushed NEW_ORDER({}) to owner {}", event.getOrderNumber(), ownerEmail);
        } catch (Exception e) {
            log.warn("Failed to push new order to owner {}: {}", ownerEmail, e.getMessage());
        }
    }

    /**
     * Broadcast a shop open/close change to all subscribers.
     * Destination: /topic/shops/{shopId}/status
     */
    public void pushShopStatusChange(ShopStatusEvent event) {
        try {
            messagingTemplate.convertAndSend("/topic/shops/" + event.getShopId() + "/status", event);
            log.debug("Pushed SHOP_STATUS_CHANGED({}, open={}) to topic", event.getShopId(), event.isOpen());
        } catch (Exception e) {
            log.warn("Failed to push shop status for shop {}: {}", event.getShopId(), e.getMessage());
        }
    }
}