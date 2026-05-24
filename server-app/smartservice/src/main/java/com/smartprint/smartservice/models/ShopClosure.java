package com.smartprint.smartservice.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "shop_closures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopClosure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(name = "closure_date", nullable = false)
    private LocalDate closureDate;

    @Column(nullable = false)
    private String reason;

    @Column(name = "is_recurring")
    @Builder.Default
    private Boolean recurring = false;
}