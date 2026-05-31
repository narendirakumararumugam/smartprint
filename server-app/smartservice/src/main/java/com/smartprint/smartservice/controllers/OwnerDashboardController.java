package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.OwnerDashboardStatsDTO;
import com.smartprint.smartservice.models.Order;
import com.smartprint.smartservice.models.Shop;
import com.smartprint.smartservice.repository.OrderRepository;
import com.smartprint.smartservice.repository.ShopRepository;
import com.smartprint.smartservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.OWNER_DASHBOARD)
@RequiredArgsConstructor
public class OwnerDashboardController {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<OwnerDashboardStatsDTO> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID ownerId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException(Messages.Auth.USER_NOT_FOUND))
                .getId();

        List<Shop> shops = shopRepository.findByOwnerId(ownerId);
        if (shops.isEmpty()) {
            return ResponseEntity.ok(OwnerDashboardStatsDTO.builder()
                    .todayOrders(0).totalOrders(0).pendingOrders(0)
                    .todayRevenue(BigDecimal.ZERO).totalRevenue(BigDecimal.ZERO)
                    .avgRating(0).reviewCount(0).build());
        }

        Shop shop = shops.get(0);
        List<Order> allOrders = orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        long todayOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(todayStart))
                .count();

        long pendingOrders = allOrders.stream()
                .filter(o -> "processing".equals(o.getStatus().getCode()))
                .count();

        BigDecimal todayRevenue = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(todayStart))
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(OwnerDashboardStatsDTO.builder()
                .todayOrders(todayOrders)
                .totalOrders(allOrders.size())
                .pendingOrders(pendingOrders)
                .todayRevenue(todayRevenue)
                .totalRevenue(todayRevenue)
                .avgRating(shop.getRating() != null ? shop.getRating().doubleValue() : 0)
                .reviewCount(shop.getReviewCount())
                .build());
    }
}