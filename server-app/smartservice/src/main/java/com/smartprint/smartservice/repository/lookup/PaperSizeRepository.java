package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.ColorMode;
import com.smartprint.smartservice.models.lookup.PaperSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaperSizeRepository extends JpaRepository<PaperSize, Integer> {
    List<PaperSize> findAllByOrderBySortOrderAsc();
    Optional<PaperSize> findByCode(String code);
}