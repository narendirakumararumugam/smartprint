package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.SavedShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedShopRepository extends JpaRepository<SavedShop, Integer> {
    List<SavedShop> findByUserId(UUID userId);

    Optional<SavedShop> findByUserIdAndShopId(UUID userId, Integer shopId);

    boolean existsByUserIdAndShopId(UUID userId, Integer shopId);
}