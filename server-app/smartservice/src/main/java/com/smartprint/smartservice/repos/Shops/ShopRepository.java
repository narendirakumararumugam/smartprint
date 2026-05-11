package com.smartprint.smartservice.repos.Shops;

import com.smartprint.smartservice.models.Shops.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    @Query(value = """
        SELECT s.* FROM shops s
        JOIN shop_locations sl ON s.id = sl.shop_id
        WHERE ST_DWithin(sl.location, ST_MakePoint(:lon, :lat)::geography, :radius)
        ORDER BY sl.location <-> ST_MakePoint(:lon, :lat)::geography
        LIMIT 20
    """, nativeQuery = true)
    List<Shop> findClosestShops(@Param("lat") double lat,
                                @Param("lon") double lon,
                                @Param("radius") double radiusInMeters);
}