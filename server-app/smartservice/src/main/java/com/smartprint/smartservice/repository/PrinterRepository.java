package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.Printer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrinterRepository extends JpaRepository<Printer, Long> {

    List<Printer> findByShopIdOrderByPriorityAsc(Integer shopId);

    long countByShopId(Integer shopId);

    @Query("SELECT COUNT(p) FROM Printer p WHERE p.shopId = :shopId AND p.status.code <> :statusCode")
    long countByShopAndStatusCodeNot(Integer shopId, String statusCode);

    @Query("SELECT COUNT(p) FROM Printer p WHERE p.shopId = :shopId AND p.status.code = :statusCode")
    long countByShopAndStatusCode(Integer shopId, String statusCode);
}