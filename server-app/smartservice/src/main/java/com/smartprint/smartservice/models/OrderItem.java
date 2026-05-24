package com.smartprint.smartservice.models;

import com.smartprint.smartservice.models.lookup.ColorMode;
import com.smartprint.smartservice.models.lookup.PaperSize;
import com.smartprint.smartservice.models.lookup.PrintSide;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Builder.Default
    @Column(nullable = false)
    private Integer pages = 1;

    @Builder.Default
    @Column(nullable = false)
    private Integer copies = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_mode_id")
    private ColorMode colorMode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sides_id")
    private PrintSide sides;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_size_id")
    private PaperSize paperSize;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
}