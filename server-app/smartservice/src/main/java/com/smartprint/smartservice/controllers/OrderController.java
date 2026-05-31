package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.OrderCreateRequest;
import com.smartprint.smartservice.dtos.OrderResponse;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.ORDERS)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderCreateRequest request) {
        UUID userId = getUserId(userDetails);
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status) {
        UUID userId = getUserId(userDetails);
        List<OrderResponse> orders = orderService.getUserOrders(userId, status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId) {
        UUID userId = getUserId(userDetails);
        OrderResponse response = orderService.getOrderDetail(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId) {
        UUID userId = getUserId(userDetails);
        OrderResponse response = orderService.cancelOrder(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{orderId}/confirm-pickup")
    public ResponseEntity<OrderResponse> confirmPickup(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId) {
        UUID userId = getUserId(userDetails);
        OrderResponse response = orderService.confirmPickup(userId, orderId);
        return ResponseEntity.ok(response);
    }

    private UUID getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(Messages.Auth.USER_NOT_FOUND))
                .getId();
    }
}