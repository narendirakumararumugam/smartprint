package com.smartprint.smartservice.models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopGallery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    private String gradient;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "sort_order")
    @Builder.Default
    private int sortOrder = 0;
}