package com.smartprint.smartservice.models;

import com.smartprint.smartservice.models.lookup.ConnectionType;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "shop_printers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopPrinter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Shop shop;

    @Column(name = "printer_model", length = 200)
    private String printerModel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connection_type_id")
    private ConnectionType connectionType;

    @Column(name = "ip_address", length = 100)
    private String ipAddress;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "last_ping")
    private OffsetDateTime lastPing;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = OffsetDateTime.now(); }
}