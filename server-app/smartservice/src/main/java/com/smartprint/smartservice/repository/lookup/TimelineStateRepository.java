package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.TimelineState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimelineStateRepository extends JpaRepository<TimelineState, Integer> {
    List<TimelineState> findAllByOrderBySortOrderAsc();
    Optional<TimelineState> findByCode(String code);
}