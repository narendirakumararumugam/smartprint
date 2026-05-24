package com.smartprint.smartservice.services;

import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.*;
import com.smartprint.smartservice.mappers.ShopMapper;
import com.smartprint.smartservice.models.Review;
import com.smartprint.smartservice.models.SavedShop;
import com.smartprint.smartservice.models.Shop;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.repository.ReviewRepository;
import com.smartprint.smartservice.repository.SavedShopRepository;
import com.smartprint.smartservice.repository.ShopRepository;
import com.smartprint.smartservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final SavedShopRepository savedShopRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ShopMapper shopMapper;

    public List<ShopListDTO> getAllShops() {
        return shopRepository.findAll().stream()
                .map(shopMapper::toShopListDTO)
                .collect(Collectors.toList());
    }

    public List<ShopListDTO> getShopsByCity(String city) {
        return shopRepository.findByCity(city).stream()
                .map(shopMapper::toShopListDTO)
                .collect(Collectors.toList());
    }

    public List<ShopListDTO> getOpenShops() {
        return shopRepository.findOpenShops().stream()
                .map(shopMapper::toShopListDTO)
                .collect(Collectors.toList());
    }

    public List<ShopListDTO> getTopRatedShops() {
        return shopRepository.findTopRatedShops().stream()
                .map(shopMapper::toShopListDTO)
                .collect(Collectors.toList());
    }

    public List<ShopListDTO> searchShops(String query) {
        return shopRepository.searchShops(query).stream()
                .map(shopMapper::toShopListDTO)
                .collect(Collectors.toList());
    }

    public List<ShopListDTO> getShopsByService(String serviceName) {
        return shopRepository.findByServiceName(serviceName).stream()
                .map(shopMapper::toShopListDTO)
                .collect(Collectors.toList());
    }

    /**
     * Finds shops within `radiusKm` of (lat,lng) using Haversine SQL,
     * then hydrates them into full DTOs (with distanceKm).
     */
    public List<ShopListDTO> getNearbyShops(double Lat, double Lng, double radiusKm) {
        List<Object[]> rows = shopRepository.findNearby(Lat, Lng, radiusKm);
        return rows.stream()
                .map(r -> {
                    Integer shopId = ((Number) r[0]).intValue();
                    Double distanceKm2 = ((Number) r[1]).doubleValue();
                    Shop shop = shopRepository.findById(shopId).orElse(null);
                    if (shop == null) return null;
                    ShopListDTO dto = shopMapper.toShopListDTO(shop);
                    dto.setDistanceKm(Math.round(distanceKm2 * 100.0) / 100.0);
                    return dto;
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    public ShopDetailDTO getShopDetail(Integer id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.SHOP_NOT_FOUND));
        return shopMapper.toShopDetailDTO(shop);
    }

    // — Saved Shops —

    public List<SavedShopDTO> getSavedShops(UUID userId) {
        return savedShopRepository.findByUserId(userId).stream()
                .map(shopMapper::toSavedShopDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleSaveShop(UUID userId, Integer shopId) {
        shopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.SHOP_NOT_FOUND));

        var existing = savedShopRepository.findByUserIdAndShopId(userId, shopId);
        if (existing.isPresent()) {
            savedShopRepository.delete(existing.get());
            return false; // unsaved
        } else {
            SavedShop savedShop = SavedShop.builder()
                    .userId(userId)
                    .shop(shopRepository.getReferenceById(shopId))
                    .build();
            savedShopRepository.save(savedShop);
            return true; // saved
        }
    }

    public boolean isShopSaved(UUID userId, Integer shopId) {
        return savedShopRepository.existsByUserIdAndShopId(userId, shopId);
    }

    // — Reviews —

    public List<ReviewDTO> getShopReviews(Integer shopId) {
        return reviewRepository.findByShopIdOrderByCreatedAtDesc(shopId).stream()
                .map((review) -> {
                    User user = userRepository.findById(review.getUserId()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    return shopMapper.toReviewDTO(review, user);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO addReview(UUID userId, Integer shopId, ReviewRequest request) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.SHOP_NOT_FOUND));

        if (reviewRepository.existsByUserIdAndShopId(userId, shopId)) {
            throw new IllegalArgumentException("You have already reviewed this shop");
        }

        Review review = Review.builder()
                .userId(userId)
                .shop(shop)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        reviewRepository.save(review);

        // Update shop rating
        List<Review> allReviews = reviewRepository.findByShopIdOrderByCreatedAtDesc(shopId);
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0);
        shop.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
        shop.setReviewCount(allReviews.size());
        shopRepository.save(shop);

        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return shopMapper.toReviewDTO(review, user);
    }
}
