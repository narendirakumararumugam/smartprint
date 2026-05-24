package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.PrintSide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrintSideRepository extends JpaRepository<PrintSide, Integer> {
    List<PrintSide> findAllByOrderBySortOrderAsc();
    Optional<PrintSide> findByCode(String code);
}