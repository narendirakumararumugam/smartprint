package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.PrinterStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrinterStatusRepository extends JpaRepository<PrinterStatus, Integer> {
    List<PrinterStatus> findAllByOrderBySortOrderAsc();
    Optional<PrinterStatus> findByCode(String code);
}