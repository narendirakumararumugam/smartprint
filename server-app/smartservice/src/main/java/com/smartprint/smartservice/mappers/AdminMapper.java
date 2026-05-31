package com.smartprint.smartservice.mappers;

import com.smartprint.smartservice.dtos.AdminOrderDTO;
import com.smartprint.smartservice.dtos.AdminShopDTO;
import com.smartprint.smartservice.dtos.AdminUserDTO;
import com.smartprint.smartservice.models.Order;
import com.smartprint.smartservice.models.Shop;
import com.smartprint.smartservice.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AdminMapper {
    @Mapping(target = "userType", source = "userType.code", defaultValue = "Unknown user type")
    AdminUserDTO toAdminUserDTOFromUserModel(User user);

    @Mapping(target = "status", source = "order.status.code", defaultValue = "Unknown status")
    @Mapping(target = "shopName", source = "order.shop.name", defaultValue = "Unknown shop")
    @Mapping(target = "customerName", source = "user.fullName")
    @Mapping(target = "id", source = "order.id")
    @Mapping(target = "createdAt", source = "order.createdAt")
    AdminOrderDTO toAdminOrderDTOFromOrderModel(Order order, User user);

    @Mapping(target = "ownerName", source = "user.fullName", defaultValue = "Unknown owner")
    @Mapping(target = "ownerEmail", source = "user.email", defaultValue = "")
    @Mapping(target = "id", source = "shop.id")
    @Mapping(target = "createdAt", source = "shop.createdAt")
    @Mapping(target = "city", source = "shop.city")
    @Mapping(target = "verified", source = "shop.verified")
    AdminShopDTO toAdminShopDTOFromShopModel(Shop shop, User user);
}
