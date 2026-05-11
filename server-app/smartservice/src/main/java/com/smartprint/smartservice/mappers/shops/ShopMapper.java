package com.smartprint.smartservice.mappers.shops;

import com.smartprint.smartservice.dtos.shops.ShopDetailsDTO;
import com.smartprint.smartservice.models.Shops.Shop;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ShopMapper {
    Shop toEntity(ShopDetailsDTO shopDetailsDTO);

    @Mapping(target = "address", source = "shop.location.address")
    @Mapping(target = "city", source = "shop.location.city")
    @Mapping(target = "latitude", source = "shop.location.latitude")
    @Mapping(target = "longitude", source = "shop.location.longitude")
    @Mapping(target = "distance", source = "calculatedDistance")
    ShopDetailsDTO fromEntityToDto(Shop shop, double calculatedDistance);

//    List<ShopDetailsDTO> fromEntityListToDtoList(List<Shop> shops);
}
