package com.smartprint.smartservice.utils;

/**
 * Utility class to manage and maintain complex SQL queries.
 * Keeps queries organized and reusable across the application.
 */
public class ShopQueryConstants {

    /**
     * Native SQL query to find nearby popular shops with scoring algorithm.
     *
     * Algorithm:
     * - Fetches 20 closest shops within radius
     * - Calculates multi-factor score:
     *   - Distance Score (40%): Normalized by radius
     *   - Rating Score (30%): rating * 20
     *   - Review Score (15%): MIN(total_reviews / 10, 100)
     *   - Open Score (10%): 100 if open, 0 if closed
     *   - Fast Service Score (5%): Based on turnaround_time_hours
     * - Final Score: Weighted average of all scores
     *
     * Returns only columns needed for ShopDetailsDTO.
     */
    public static final String FIND_POPULAR_SHOPS_NEARBY = """
        WITH closest_shops AS (
            SELECT
                s.id,
                s.name,
                s.description,
                s.is_verified,
                s.is_active,
                s.phone,
                s.email,
                s.cover_image,
                s.logo,
                s.created_at,
                s.updated_at,
                sl.address,
                sl.city,
                sl.latitude,
                sl.longitude,
                s.turnaround_time_hours,
                ST_Distance(sl.location, ST_MakePoint(:lon, :lat)::geography) as distance_meters,
                COALESCE(AVG(sr.rating)::numeric, 0) as avg_rating,
                COUNT(sr.id) as total_reviews,
                CASE
                    WHEN swh.close_time > CURRENT_TIME
                        AND swh.open_time <= CURRENT_TIME
                        AND NOT COALESCE(swh.is_closed, false)
                    THEN true
                    ELSE false
                END as is_open
            FROM shops s
            LEFT JOIN shop_locations sl ON s.id = sl.shop_id
            LEFT JOIN shop_reviews sr ON s.id = sr.shop_id
            LEFT JOIN shop_working_hours swh ON s.id = swh.shop_id
                AND swh.day_of_week = TO_CHAR(CURRENT_DATE, 'Day')
            WHERE sl.location IS NOT NULL
                AND ST_DWithin(sl.location, ST_MakePoint(:lon, :lat)::geography, :radius)
            GROUP BY s.id, s.name, s.description, s.is_verified, s.is_active, s.phone,
                     s.email, s.cover_image, s.logo, s.created_at, s.updated_at,
                     sl.address, sl.city, sl.latitude, sl.longitude, s.turnaround_time_hours,
                     sl.location, swh.close_time, swh.open_time, swh.is_closed
            ORDER BY distance_meters ASC
            LIMIT 20
        )
        SELECT
            cs.id,
            cs.name,
            cs.description,
            cs.is_verified,
            cs.is_active,
            cs.phone,
            cs.email,
            cs.cover_image,
            cs.logo,
            cs.created_at,
            cs.updated_at,
            cs.address,
            cs.city,
            cs.latitude,
            cs.longitude,
            cs.distance_meters as distance,
            -- Calculate final composite score
            ROUND(CAST(
                (
                    (((:radius - cs.distance_meters) / :radius * 100) * 0.40) +
                    ((cs.avg_rating * 20) * 0.30) +
                    (LEAST(cs.total_reviews::numeric / 10, 100) * 0.15) +
                    (CASE WHEN cs.is_open THEN 100 ELSE 0 END * 0.10) +
                    (CASE
                        WHEN cs.turnaround_time_hours IS NULL THEN 50
                        WHEN cs.turnaround_time_hours <= 1 THEN 100
                        WHEN cs.turnaround_time_hours <= 4 THEN 90
                        WHEN cs.turnaround_time_hours <= 24 THEN 70
                        ELSE 30
                    END * 0.05)
                ) AS numeric
            ), 2) as final_score
        FROM closest_shops cs
        ORDER BY final_score DESC
        """;
}

