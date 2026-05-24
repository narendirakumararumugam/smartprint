package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByShopIdOrderByCreatedAtDesc(Integer shopId);

    boolean existsByUserIdAndShopId(UUID userId, Integer shopId);
}