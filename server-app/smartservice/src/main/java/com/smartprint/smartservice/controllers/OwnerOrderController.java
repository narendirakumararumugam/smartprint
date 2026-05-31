package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.OrderResponse;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.OWNER_ORDERS)
@RequiredArgsConstructor
public class OwnerOrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getShopOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Integer shopId,
            @RequestParam(required = false) String status) {
        UUID ownerId = getUserId(userDetails);
        List<OrderResponse> orders = orderService.getShopOrders(ownerId, shopId, status);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> body) {
        UUID ownerId = getUserId(userDetails);
        String newStatus = body.get("status");
        OrderResponse response = orderService.updateOrderStatus(ownerId, orderId, newStatus);
        return ResponseEntity.ok(response);
    }

    private UUID getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(Messages.Auth.USER_NOT_FOUND))
                .getId();
    }
}