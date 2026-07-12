package com.smartprint.smartservice.dtos.events;

import com.smartprint.smartservice.dtos.OrderResponse;
import lombok.Getter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import java.util.List;

/**
 * Pushed to /user/{customerEmail}/queue/order-updates whenever an owner
 * changes the status of one of the customer's orders.
 */
@Getter
@Builder
@AllArgsConstructor
public class OrderStatusEvent {

    /** Discriminator for the frontend to know which event type this is. */
    private String type;

    private String orderId;
    private String orderNumber;
    private String status;
    private String statusLabel;
    private int progress;
    private String progressLabel;
    private List<OrderResponse.OrderTimelineDTO> timeline;
}