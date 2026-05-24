package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_paper_sizes", uniqueConstraints = @UniqueConstraint(columnNames ={"shop_id", "size_name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopPaperSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(name = "size_name", nullable = false)
    private String sizeName;
}
