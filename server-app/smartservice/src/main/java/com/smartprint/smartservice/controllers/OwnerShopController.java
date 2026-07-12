package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.OwnerShopSettingsDTO;
import com.smartprint.smartservice.dtos.OwnerShopSettingsRequest;
import com.smartprint.smartservice.dtos.events.ShopStatusEvent;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.OwnerShopSettingsService;
import com.smartprint.smartservice.services.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.OWNER_SHOP)
@RequiredArgsConstructor
public class OwnerShopController {

    private final OwnerShopSettingsService ownerShopSettingsService;
    private final UserRepository userRepository;
    private final WebSocketNotificationService wsNotificationService;

    @GetMapping("/settings")
    public ResponseEntity<OwnerShopSettingsDTO> getSettings(Authentication auth) {
        UUID ownerId = resolveOwnerId(auth);
        OwnerShopSettingsDTO settings = ownerShopSettingsService.getShopSettings(ownerId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<OwnerShopSettingsDTO> updateSettings(
            @Valid @RequestBody OwnerShopSettingsRequest request,
            Authentication auth) {
        UUID ownerId = resolveOwnerId(auth);
        OwnerShopSettingsDTO updated = ownerShopSettingsService.updateShopSettings(ownerId, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/deactivate")
    public ResponseEntity<OwnerShopSettingsDTO> deactivateShop(Authentication auth) {
        UUID ownerId = resolveOwnerId(auth);
        OwnerShopSettingsDTO updated = ownerShopSettingsService.deactivateShop(ownerId);
        //Push shop closed event via websocket
        wsNotificationService.pushShopStatusChange(ShopStatusEvent.builder()
                        .type("SHOP_STATUS_CHANGED")
                        .shopId(updated.getShopId())
                        .shopName(updated.getShopName())
                        .open(false)
                .build());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/toggle-open")
    public ResponseEntity<Map<String, Object>> toggleShopOpen(Authentication auth) {
        UUID ownerId = resolveOwnerId(auth);
        Object[] result = ownerShopSettingsService.toggleShopOpen(ownerId);
        Integer shopId = (Integer) result[0];
        boolean isOpen = (boolean) result[1];
        String shopName = (String) result[2];

        wsNotificationService.pushShopStatusChange(ShopStatusEvent.builder()
                .type("SHOP_STATUS_CHANGED")
                .shopId(shopId)
                .shopName(shopName)
                .open(isOpen)
                .build());

        return ResponseEntity.ok(Map.of("shopId", shopId, "open", isOpen));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteShop(Authentication auth) {
        UUID ownerId = resolveOwnerId(auth);
        ownerShopSettingsService.deleteShop(ownerId);
        return ResponseEntity.noContent().build();
    }

    private UUID resolveOwnerId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Auth.USER_NOT_FOUND));
        return user.getId();
    }
}