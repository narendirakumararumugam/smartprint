package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.PrintJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PrintJobRepository extends JpaRepository<PrintJob, Long> {
    List<PrintJob> findByShopIdOrderByCreatedAtDesc(Integer shopId);
    List<PrintJob> findTop20ByShopIdOrderByCreatedAtDesc(Integer shopId);

    @Query("SELECT pj FROM PrintJob pj WHERE pj.printerId = :printerId AND pj.status.code = :statusCode ORDER BY pj.createdAt ASC")
    List<PrintJob> findByPrinterIdAndStatusCodeOrderByCreatedAtAsc(long printerId, String statusCode);

    @Query("SELECT COALESCE(SUM(pj.pages), 0) FROM PrintJob pj WHERE pj.shopId = :shopId AND pj.createdAt >= :since")
    int sumPagesByShopIdSince(Integer shopId, LocalDateTime since);
}