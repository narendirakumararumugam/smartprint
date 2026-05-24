package com.smartprint.smartservice.repository.lookup;

import com.smartprint.smartservice.models.lookup.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTypeRepository extends JpaRepository<UserType, Integer> {
    List<UserType> findAllByOrderBySortOrderAsc();
    Optional<UserType> findByCode(String code);
}