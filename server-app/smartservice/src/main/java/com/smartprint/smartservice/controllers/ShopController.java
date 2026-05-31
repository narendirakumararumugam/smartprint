package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.*;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final UserRepository userRepository;

    // — Public Endpoints —

    @GetMapping(ApiPaths.PUBLIC_SHOPS)
    public ResponseEntity<List<ShopListDTO>> getShops(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String q) {

        List<ShopListDTO> shops;

        if (q != null && !q.isBlank()) {
            shops = shopService.searchShops(q.trim());
        } else if (city != null && !city.isBlank()) {
            shops = shopService.getShopsByCity(city.trim());
        } else if ("open".equals(filter)) {
            shops = shopService.getOpenShops();
        } else if ("top".equals(filter)) {
            shops = shopService.getTopRatedShops();
        } else if (service != null && !service.isBlank()) {
            shops = shopService.getShopsByService(service.trim());
        } else {
            shops = shopService.getAllShops();
        }

        return ResponseEntity.ok(shops);
    }

    @GetMapping(ApiPaths.PUBLIC_SHOPS + "/nearby")
    public ResponseEntity<List<ShopListDTO>> getNearbyShops(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radiusKm) {
        return ResponseEntity.ok(shopService.getNearbyShops(lat, lng, radiusKm));
    }

    @GetMapping(ApiPaths.PUBLIC_SHOPS + "/{id}")
    public ResponseEntity<ShopDetailDTO> getShopDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(shopService.getShopDetail(id));
    }

    @GetMapping(ApiPaths.PUBLIC_SHOPS + "/{id}/reviews")
    public ResponseEntity<List<ReviewDTO>> getShopReviews(@PathVariable Integer id) {
        return ResponseEntity.ok(shopService.getShopReviews(id));
    }

    // — Authenticated Endpoints —

    @GetMapping(ApiPaths.SHOPS + "/saved")
    public ResponseEntity<List<SavedShopDTO>> getSavedShops(Authentication auth) {
        UUID userId = resolveUserId(auth);
        return ResponseEntity.ok(shopService.getSavedShops(userId));
    }

    @PostMapping(ApiPaths.SHOPS + "/{id}/save")
    public ResponseEntity<Map<String, Object>> toggleSaveShop(
            @PathVariable Integer id,
            Authentication auth) {
        UUID userId = resolveUserId(auth);
        boolean saved = shopService.toggleSaveShop(userId, id);
        return ResponseEntity.ok(Map.of("saved", saved, "shopId", id));
    }

    @GetMapping(ApiPaths.SHOPS + "/{id}/saved")
    public ResponseEntity<Map<String, Boolean>> isShopSaved(
            @PathVariable Integer id,
            Authentication auth) {
        UUID userId = resolveUserId(auth);
        return ResponseEntity.ok(Map.of("saved", shopService.isShopSaved(userId, id)));
    }

    @PostMapping(ApiPaths.SHOPS + "/{id}/reviews")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Integer id,
            @Valid @RequestBody ReviewRequest request,
            @Valid Authentication auth) {
        UUID userId = resolveUserId(auth);
        ReviewDTO review = shopService.addReview(userId, id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    // — Helper —

    private UUID resolveUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Auth.USER_NOT_FOUND));
        return user.getId();
    }
}
