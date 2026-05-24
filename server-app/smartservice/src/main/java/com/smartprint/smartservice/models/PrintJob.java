package com.smartprint.smartservice.models;

import com.smartprint.smartservice.models.lookup.PrintJobStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "print_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrintJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_number", nullable = false, unique = true)
    private String jobNumber;

    @Column(name = "printer_id", nullable = false)
    private Long printerId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "shop_id", nullable = false)
    private Integer shopId;

    @Column(name = "customer_name")
    private String customerName;

    private int pages;

    @Column(name = "print_type")
    @Builder.Default
    private String printType = "B&W";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private PrintJobStatus status;

    private String duration;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}