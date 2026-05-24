package com.smartprint.smartservice.models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopBadge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(nullable = false, length = 100)
    private String badgeLabel;
}
