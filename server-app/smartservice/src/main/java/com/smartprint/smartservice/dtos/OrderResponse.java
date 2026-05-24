package com.smartprint.smartservice.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private String id;
    private String orderNumber;
    private String status;
    private String statusLabel;
    private ShopSummary shop;
    private List<OrderItemDTO> items;
    private List<OrderAddonDTO> addons;
    private List<OrderTimelineDTO> timeline;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private String specialNote;
    private String pickupTime;
    private int progress;
    private String progressLabel;
    private boolean canCancel;
    private boolean canReorder;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ShopSummary {
        private Integer id;
        private String name;
        private String icon;
        private String gradient;
        private String address;
        private String phone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDTO {
        private String fileName;
        private int pages;
        private int copies;
        private String colorMode;
        private String sides;
        private String paperSize;
        private BigDecimal rate;
        private BigDecimal total;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderAddonDTO {
        private String addonId;
        private String addonName;
        private BigDecimal price;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderTimelineDTO {
        private String label;
        private String description;
        private String state;
        private LocalDateTime eventTime;
    }
}
