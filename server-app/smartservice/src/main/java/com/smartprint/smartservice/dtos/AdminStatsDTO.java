package com.smartprint.smartservice.dtos;

import lombok.*;

@Data
@Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long totalShops;
    private long totalOrders;
    private long pendingVerifications;
    private long activeUsers;
    private long verifiedShops;
}
