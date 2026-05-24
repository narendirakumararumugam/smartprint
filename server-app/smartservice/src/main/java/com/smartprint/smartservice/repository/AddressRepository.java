package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(UUID userId);

    @Modifying
    @Query("update Address set isDefault  = false where userId = :userId")
    void clearDefault(UUID userId);
}
