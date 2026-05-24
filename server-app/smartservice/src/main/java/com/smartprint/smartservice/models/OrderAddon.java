package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_addons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderAddon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;

    @Column(name = "addon_id", nullable = false, length = 50)
    private String addonId;

    @Column(name = "addon_name", nullable = false, length = 100)
    private String addonName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}