package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_bulk_discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopBulkDiscount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(name = "min_pages", nullable = false)
    private Integer minPages;

    @Column(name = "max_pages")
    private Integer maxPages;

    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent;
}