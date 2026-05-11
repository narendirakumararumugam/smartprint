package com.smartprint.smartservice.dtos.shops;

import com.smartprint.smartservice.models.Shops.Shop;
import jakarta.persistence.*;

import java.time.LocalTime;

public record ShopWorkingHourDTO(Long id,
                                 String dayOfWeek,
                                 LocalTime openTime,
                                 LocalTime closeTime,
                                 Boolean isClosed) {
}
