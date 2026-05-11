package com.smartprint.smartservice.dtos.shops;

import java.time.LocalDateTime;
import java.util.List;

public record ShopDetailsDTO(
        Long id,
        String name,
        String description,
        Boolean isVerified,
        Boolean isActive,
        String phone,
        String email,
        String coverImage,
        String logo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String address,
        String city,
        double latitude,
        double longitude,
        double distance
//        List<ShopWorkingHourDTO> workingHours,
//        List<ShopPricingDTO> pricing,
//        List<String> services,
//        List<String> tags
) {
}
