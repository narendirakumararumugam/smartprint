package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.PrinterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrinterTypeRepository extends JpaRepository<PrinterType, Integer> {
    List<PrinterType> findAllByOrderBySortOrderAsc();
    Optional<PrinterType> findByCode(String code);
}