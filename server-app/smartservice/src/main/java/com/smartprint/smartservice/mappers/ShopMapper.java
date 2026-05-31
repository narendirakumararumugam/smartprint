package com.smartprint.smartservice.mappers;

import com.smartprint.smartservice.dtos.ReviewDTO;
import com.smartprint.smartservice.dtos.SavedShopDTO;
import com.smartprint.smartservice.dtos.ShopDetailDTO;
import com.smartprint.smartservice.dtos.ShopListDTO;
import com.smartprint.smartservice.models.*;
import org.mapstruct.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ShopMapper {
    @Mapping(source = "waitTime", target = "wait")
    @Mapping(source = "reviewCount", target = "reviews")
    @Mapping(source = "badges", target = "badges", qualifiedByName = "mapBadgesToStringList")
    @Mapping(source = "services", target = "services", qualifiedByName = "mapServicesToStringList")
    @Mapping(target = "distanceKm", ignore = true)
    ShopListDTO toShopListDTO(Shop shop);

    @Mapping(source = "waitTime", target = "wait")
    @Mapping(source = "reviewCount", target = "reviews")
    @Mapping(source = "badges", target = "badges", qualifiedByName = "mapBadgesToStringList")
    @Mapping(source = "services", target = "services", qualifiedByName = "mapServicesToStringList")
    @Mapping(source = "gallery", target = "gallery", qualifiedByName = "mapGalleryToStringList")
    @Mapping(source = "prices", target = "prices")
    @Mapping(source = "hours", target = "hours")
    ShopDetailDTO toShopDetailDTO(Shop shop);

    SavedShopDTO toSavedShopDTO(SavedShop savedShop);

    @Mapping(source = "review.id", target = "id")
    @Mapping(source = "review.rating", target = "rating")
    @Mapping(source = "review.comment", target = "comment")
    @Mapping(source = "review.createdAt", target = "createdAt")
    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "user.avatar", target = "userAvatar")
    ReviewDTO toReviewDTO(Review review, User user);

    @Mapping(source = "popular", target = "popular")
    ShopDetailDTO.PriceDTO toPriceDTO(ShopPrice shopPrice);

    @Mapping(source = "dayOfWeek", target = "day")
    @Mapping(source = "timeRange", target = "time")
    ShopDetailDTO.WorkingHourDTO toWorkingHourDTO(ShopHour shopHour);

    @Named("mapBadgesToStringList")
    default List<String> mapBadgesToStringList(List<ShopBadge> badges) {
        if (badges == null) {
            return Collections.emptyList();
        }
        return badges.stream()
                .map(ShopBadge::getBadgeLabel)
                .collect(Collectors.toList());
    }

    @Named("mapServicesToStringList")
    default List<String> mapServicesToStringList(List<ShopServiceEntity> services) {
        if (services == null) {
            return Collections.emptyList();
        }
        return services.stream()
                .map(ShopServiceEntity::getServiceName)
                .collect(Collectors.toList());
    }

    @Named("mapGalleryToStringList")
    default List<String> mapGalleryToStringList(List<ShopGallery> galleryList) {
        if (galleryList == null) {
            return Collections.emptyList();
        }

        return galleryList.stream()
                .map(gallery -> gallery.getImageUrl() != null ? gallery.getImageUrl() : gallery.getGradient())
                .collect(Collectors.toList());
    }
}
