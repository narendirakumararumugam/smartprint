package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    private Integer id;

    @Column(name = "owner_id")
    private UUID ownerId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 300)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(name = "maps_link", length = 500)
    private String mapsLink;

    @Column(length = 50)
    private String category;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(length = 20)
    private String phone;

    @Column(length = 20)
    private String whatsapp;

    @Column(length = 255)
    private String email;

    @Column(length = 200)
    private String gradient;

    @Column(length = 10)
    private String icon;

    @Builder.Default
    @Column(name = "approval_mode", length = 20)
    private String approvalMode = "manual";

    @Column(name = "default_printer", length = 100)
    private String defaultPrinter;

    @Builder.Default
    @Column(name = "max_order_pages")
    private Integer maxOrderPages = 500;

    @Builder.Default
    @Column(name = "max_daily_orders")
    private Integer maxDailyOrders = 50;

    @Builder.Default
    @Column(name = "min_prep_time")
    private Integer minPrepTime = 15;

    @Builder.Default
    @Column(name = "max_file_size", length = 20)
    private String maxFileSize = "50 MB";

    @Builder.Default
    @Column(name = "is_open")
    private Boolean open = true;

    @Column(name = "closes_at", length = 20)
    private String closesAt;

    @Column(name = "wait_time", length = 20)
    private String waitTime;

    @Builder.Default
    @Column(name = "is_verified")
    private Boolean verified = false;

    @Builder.Default
    @Column(precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopServiceEntity> services = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopBadge> badges = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopPrice> prices = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopHour> hours = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopGallery> gallery = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopClosure> closures = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopAddon> addOns = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopBulkDiscount> bulkDiscounts = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShopPaperSize> paperSizes = new ArrayList<>();

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}