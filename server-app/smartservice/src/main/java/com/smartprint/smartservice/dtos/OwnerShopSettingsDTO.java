package com.smartprint.smartservice.dtos;

import java.util.List;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class OwnerShopSettingsDTO {

    // Profile
    private Integer shopId;
    private String shopName;
    private String shopTagline;
    private String shopPhone;
    private String shopCategory;
    private String shopDescription;
    private String shopMapsLink;
    private String shopAddress;
    private String shopCity;
    private String shopState;
    private String shopPincode;

    // Services
    private List<String> services;
    private List<String> paperSizes;
    private String maxFileSize;

    // Pricing
    private List<PriceRowDTO> priceRows;
    private List<AddonDTO> addOns;
    private List<BulkDiscountDTO> bulkDiscounts;

    // Hours
    private List<HourEntryDTO> hours;
    private Integer minPrepTime;

    // Approval
    private String approvalMode;
    private String defaultPrinter;
    private Integer maxOrderPages;
    private Integer maxDailyOrders;

    // Closure
    private boolean shopOpen;
    private List<ClosureDTO> closures;

    @Data
    @Builder
    public static class PriceRowDTO {
        private String service;
        private String spec;
        private String price;
        private boolean popular;
    }

    @Data
    @Builder
    public static class AddonDTO {
        private String name;
        private double price;
    }

    @Data
    @Builder
    public static class BulkDiscountDTO {
        private int min;
        private int max;
        private int discount;
    }

    @Data
    @Builder
    public static class HourEntryDTO {
        private String day;
        private String open;
        private String close;
        private String breakStart;
        private String breakEnd;
        private boolean closed;
    }

    @Data
    @Builder
    public static class ClosureDTO {
        private String date;
        private String reason;
        private boolean recurring;
    }
}
