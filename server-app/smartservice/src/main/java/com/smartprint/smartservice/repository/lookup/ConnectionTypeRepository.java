package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.ConnectionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionTypeRepository extends JpaRepository<ConnectionType, Integer> {
    List<ConnectionType> findAllByOrderBySortOrderAsc();
    Optional<ConnectionType> findByCode(String code);
}