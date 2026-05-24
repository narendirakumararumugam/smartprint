package com.smartprint.smartservice.dtos;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ShopDetailDTO {
    private Integer id;
    private String name;
    private String tagline;
    private String about;
    private String address;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private boolean isOpen;
    private String closesAt;
    private String wait;
    private BigDecimal rating;
    private int reviews;
    private String phone;
    private String whatsapp;
    private String email;
    private String gradient;
    private String icon;
    private boolean isVerified;
    private List<String> badges;
    private List<String> services;
    private List<String> gallery;
    private List<PriceDTO> prices;
    private List<WorkingHourDTO> hours;

    @Data
    @Builder
    public static class PriceDTO {
        private String service;
        private String spec;
        private String price;
        private boolean popular;
    }

    @Data
    @Builder
    public static class WorkingHourDTO {
        private String day;
        private String time;
        private boolean closed;
    }
}
