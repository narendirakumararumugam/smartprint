package com.smartprint.smartservice.models;

import com.smartprint.smartservice.models.lookup.ConnectionType;
import com.smartprint.smartservice.models.lookup.PrinterStatus;
import com.smartprint.smartservice.models.lookup.PrinterType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "printers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Printer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_id", nullable = false)
    private Integer shopId;

    @Column(nullable = false)
    private String name;

    private String model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printer_type_id")
    private PrinterType printerType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connection_type_id")
    private ConnectionType connectionType;

    @Column(name = "ip_address")
    private String ipAddress;

    private String port;

    @Column(name = "cloud_service")
    private String cloudService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private PrinterStatus status;

    @Column(name = "is_default")
    @Builder.Default
    private boolean isDefault = false;

    @Builder.Default
    private int priority = 3;

    @Column(name = "pages_today")
    @Builder.Default
    private int pagesToday = 0;

    @Column(name = "pages_total")
    @Builder.Default
    private Long pagesTotal = 0L;

    @Column(name = "jobs_today")
    @Builder.Default
    private int jobsToday = 0;

    @Column(name = "max_pages_per_job")
    @Builder.Default
    private int maxPagesPerJob = 500;

    @Column(name = "paper_sizes")
    @Builder.Default
    private String paperSizes = "A4";

    @Column(name = "job_types")
    @Builder.Default
    private String jobTypes = "B&W";

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "printer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PrinterInk> inkLevels = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastSeen = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}