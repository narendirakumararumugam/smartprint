package com.smartprint.smartservice.dtos;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ShopListDTO {
    private Integer id;
    private String name;
    private String tagline;
    private String address;
    private String city;
    private boolean isOpen;
    private String closesAt;
    private String wait;
    private BigDecimal rating;
    private int reviews;
    private String gradient;
    private String icon;
    private boolean isVerified;
    private List<String> badges;
    private List<String> services;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Double distanceKm;
}
