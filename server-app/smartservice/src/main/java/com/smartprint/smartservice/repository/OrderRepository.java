package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.status.code = :statusCode ORDER BY o.createdAt DESC")
    List<Order> findByUserIdAndStatusCodeOrderByCreatedAtDesc(UUID userId, String statusCode);

    Optional<Order> findByIdAndUserId(UUID id, UUID userId);

    Optional<Order> findByOrderNumberAndUserId(String orderNumber, UUID userId);

    List<Order> findByShopIdOrderByCreatedAtDesc(Integer shopId);

    @Query("SELECT o FROM Order o WHERE o.shop.id = :shopId AND o.status.code = :statusCode ORDER BY o.createdAt DESC")
    List<Order> findByShopIdAndStatusCodeOrderByCreatedAtDesc(Integer shopId, String statusCode);
}