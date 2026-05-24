package com.smartprint.smartservice.dtos;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerDashboardStatsDTO {
    private long todayOrders;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal todayRevenue;
    private BigDecimal totalRevenue;
    private double avgRating;
    private int reviewCount;
}
