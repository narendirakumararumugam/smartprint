package com.smartprint.smartservice.dtos.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Broadcast to /topic/shops/{shopId}/status whenever the shop owner
 * toggles the shop open/closed.
 */
@Getter
@Builder
@AllArgsConstructor
public class ShopStatusEvent {
    private String type;
    private Integer shopId;
    private String shopName;
    private boolean open;
}