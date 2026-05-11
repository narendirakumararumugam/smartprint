package com.smartprint.smartservice.dtos.shops;

import java.math.BigDecimal;

public record ShopPricingDTO(Long id,
                             String paperSize,
                             String printType,
                             String sides,
                             BigDecimal price) {
}
