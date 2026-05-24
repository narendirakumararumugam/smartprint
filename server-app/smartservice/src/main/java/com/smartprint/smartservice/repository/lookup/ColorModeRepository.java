package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.ApprovalMode;
import com.smartprint.smartservice.models.lookup.ColorMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorModeRepository extends JpaRepository<ColorMode, Integer> {
    List<ColorMode> findAllByOrderBySortOrderAsc();
    Optional<ColorMode> findByCode(String code);
}