package com.smartprint.smartservice.dtos;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminShopDTO {
    private Integer id;
    private String name;
    private String city;
    private String ownerName;
    private String ownerEmail;
    private boolean verified;
    private boolean open;
    private BigDecimal rating;
    private int reviewCount;
    private LocalDateTime createdAt;
}
