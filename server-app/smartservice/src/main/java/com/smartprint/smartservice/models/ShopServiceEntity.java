package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_services", uniqueConstraints = {@UniqueConstraint(columnNames = {"shop_id", "service_name"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;
}