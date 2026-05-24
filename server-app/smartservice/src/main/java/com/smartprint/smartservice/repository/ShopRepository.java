package com.smartprint.smartservice.repository;

import com.smartprint.smartservice.models.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {

    List<Shop> findByCity(String city);

    @Query("SELECT s FROM Shop s WHERE s.open = true")
    List<Shop> findOpenShops();

    @Query("SELECT s FROM Shop s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(s.tagline) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(s.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Shop> searchShops(@Param("query") String query);

    List<Shop> findByOwnerId(UUID ownerId);

    @Query("SELECT s FROM Shop s WHERE s.verified = true ORDER BY s.rating DESC")
    List<Shop> findTopRatedShops();

    @Query("SELECT s FROM Shop s JOIN s.services sv WHERE sv.serviceName = :serviceName")
    List<Shop> findByServiceName(@Param("serviceName") String serviceName);

    Long countByVerified(boolean verified);

    /**
     * Nearby-shops query using the Haversine formula (km).
     * Works on any PostgreSQL without PostGIS. Returns rows of (shop_id, distance_km).
     * radiusKm filters; results ordered by ascending distance.
     */
    @Query(value = "SELECT s.id AS shop_id, " +
            "(6371 * acos( cos(radians(:lat)) * cos(radians(s.latitude)) " +
            "* cos(radians(s.longitude) - radians(:lng)) " +
            "+ sin(radians(:lat)) * sin(radians(s.latitude)) )) AS distance_km " +
            "FROM shops s " +
            "WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL " +
            "AND (6371 * acos( cos(radians(:lat)) * cos(radians(s.latitude)) " +
            "* cos(radians(s.longitude) - radians(:lng)) " +
            "+ sin(radians(:lat)) * sin(radians(s.latitude)) )) <= :radiusKm " +
            "ORDER BY distance_km ASC",
            nativeQuery = true)
    List<Object[]> findNearby(@Param("lat") double lat,
                              @Param("lng") double lng,
                              @Param("radiusKm") double radiusKm);
}