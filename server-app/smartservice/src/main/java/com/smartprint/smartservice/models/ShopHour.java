package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_hours", uniqueConstraints = @UniqueConstraint(columnNames ={"shop_id", "day_of_week"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "time_range", nullable = false)
    private String timeRange;

    @Column(name = "break_start")
    private String breakStart;

    @Column(name = "break_end")
    private String breakEnd;

    @Column(name = "is_closed")
    @Builder.Default
    private Boolean closed = false;
}
