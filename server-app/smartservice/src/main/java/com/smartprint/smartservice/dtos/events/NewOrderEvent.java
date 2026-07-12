package com.smartprint.smartservice.dtos.events;

import lombok.Getter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

/**
 * Pushed to /user/{ownerEmail}/queue/notifications whenever a customer
 * places a new order at the owner's shop.
 */
@Getter
@Builder
@AllArgsConstructor
public class NewOrderEvent {

    private String type;
    private String orderId;
    private String orderNumber;
    private String customerName;
    private BigDecimal total;
    private int itemCount;
    private String createdAt;
}