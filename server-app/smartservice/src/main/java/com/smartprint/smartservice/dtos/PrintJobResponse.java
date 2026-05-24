package com.smartprint.smartservice.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrintJobResponse {
    private Long id;
    private String jobNumber;
    private Long printerId;
    private String customerName;
    private int pages;
    private String printType;
    private String status;
    private String duration;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
