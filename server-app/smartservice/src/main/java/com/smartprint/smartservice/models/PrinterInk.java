package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "printer_ink_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrinterInk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    @Builder.Default
    private int percentage = 100;
}