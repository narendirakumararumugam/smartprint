package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.PrintJobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrintJobStatusRepository extends JpaRepository<PrintJobStatus, Integer> {
    List<PrintJobStatus> findAllByOrderBySortOrderAsc();
    Optional<PrintJobStatus> findByCode(String code);
}