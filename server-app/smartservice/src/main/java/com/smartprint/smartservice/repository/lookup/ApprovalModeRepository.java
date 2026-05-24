package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.ApprovalMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalModeRepository extends JpaRepository<ApprovalMode, Integer> {
    List<ApprovalMode> findAllByOrderBySortOrderAsc();
    Optional<ApprovalMode> findByCode(String code);
}