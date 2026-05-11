package com.smartprint.smartservice.models.Shops;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "is_active")
    private Boolean isActive;

    private String phone;

    private String email;

    @Column(name = "cover_image")
    private String coverImage;

    private String logo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "shop", cascade = CascadeType.ALL)
    private ShopLocation location;

    @OneToMany(mappedBy = "shop")
    private List<ShopWorkingHour> workingHours;

    @OneToMany(mappedBy = "shop")
    private List<ShopPricing> pricing;

    @OneToMany(mappedBy = "shop")
    private List<ShopReview> reviews;

    @OneToMany(mappedBy = "shop")
    private List<ShopService> services;

    @OneToMany(mappedBy = "shop")
    private List<ShopTags> tags;
}