package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.dtos.shops.ShopDetailsDTO;
import com.smartprint.smartservice.services.RoutingService;
import com.smartprint.smartservice.services.ShopsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shops")
public class ShopsController {
    private final ShopsService shopsService;
    private final RoutingService routingService;

    @GetMapping("/popularShopsNearby")
    public ResponseEntity<List<ShopDetailsDTO>> getPopularShopsNearby(@RequestParam double userLat, @RequestParam double userLon, @RequestParam(defaultValue = "5000") double radius){
        try{
            List<ShopDetailsDTO> popularShopsNearby = shopsService.getPopularShopsNearby(userLat, userLon, radius);
            return ResponseEntity.ok(popularShopsNearby);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


//    @QueryMapping
//    public List<Shop> getPopularShopsNearby(@Argument float userLat, @Argument float userLon){
//        return shopsService.getPopularShopsNearby();
//    }
//
//    @QueryMapping
//    public Optional<Shop> getAllDetailsForShopByID(@Argument long id){
//        return shopsService.getAllDetailsForShopByID(id);
//    }
//
//    @SchemaMapping(typeName="Shop", field = "distanceFromUserLocation")
//    public String distanceFromUserLocation(Shop shop, DataFetchingEnvironment env){
//        double shopLat = shop.getLocation().getLatitude();
//        double shopLon = shop.getLocation().getLongitude();
//
//        double userLat = env.getExecutionStepInfo().getParent().getArgument("userLat");
//        double userLon = env.getExecutionStepInfo().getParent().getArgument("userLon");
//
//        return routingService.calculateDistance(userLat,userLon,shopLat,shopLon,"car") + "km";
//    }
}
