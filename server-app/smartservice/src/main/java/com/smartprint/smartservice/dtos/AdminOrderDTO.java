package com.smartprint.smartservice.dtos;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminOrderDTO {
    private UUID id;
    private String orderNumber;
    private String customerName;
    private String shopName;
    private String status;
    private BigDecimal total;
    private LocalDateTime createdAt;
}
