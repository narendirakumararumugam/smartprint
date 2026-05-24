package com.smartprint.smartservice.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SavedShopDTO {
    private Integer id;
    private ShopListDTO shop;
    private LocalDateTime savedAt;
}
