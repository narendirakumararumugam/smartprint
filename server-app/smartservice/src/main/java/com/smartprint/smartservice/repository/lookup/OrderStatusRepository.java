package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    List<OrderStatus> findAllByOrderBySortOrderAsc();
    Optional<OrderStatus> findByCode(String code);
}