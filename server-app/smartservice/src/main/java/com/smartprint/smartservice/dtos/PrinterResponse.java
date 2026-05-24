package com.smartprint.smartservice.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Data
@Builder
public class PrinterResponse {
    private Long id;
    private String name;
    private String model;
    private String printerType;
    private String connectionType;
    private String ipAddress;
    private String port;
    private String cloudService;
    private String status;
    private boolean isDefault;
    private int priority;
    private int pagesToday;
    private long pagesTotal;
    private int jobsToday;
    private int maxPagesPerJob;
    private List<String> paperSizes;
    private List<String> jobTypes;
    private List<InkLevel> inkLevels;
    private List<PrintJobResponse> queue;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InkLevel {
        private String label;
        private String color;
        private int percentage;
    }
}
