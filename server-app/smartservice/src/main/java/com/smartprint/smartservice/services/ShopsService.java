package com.smartprint.smartservice.services;

import com.smartprint.smartservice.dtos.shops.ShopDetailsDTO;
import com.smartprint.smartservice.mappers.shops.ShopMapper;
import com.smartprint.smartservice.models.Shops.Shop;
import com.smartprint.smartservice.repos.Shops.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShopsService {
    private final ShopRepository shopRepository;
    private final ShopMapper shopMapper;
    private final RoutingService routingService;

    public List<ShopDetailsDTO> getPopularShopsNearby(double userLat, double userLon, double radius) {
        List<Shop> popularShopsNearby =  shopRepository.findClosestShops(userLat, userLon, radius);

        return popularShopsNearby.stream().map(shop -> {
            double dist = routingService.calculateDistance(userLat, userLon, shop.getLocation().getLatitude(), shop.getLocation().getLongitude(), "car") / 1000.0;
            return shopMapper.fromEntityToDto(shop, dist);
        }).toList();
    }

    public Optional<Shop> getAllDetailsForShopByID(long id){
        return shopRepository.findById(id);
    }
}
