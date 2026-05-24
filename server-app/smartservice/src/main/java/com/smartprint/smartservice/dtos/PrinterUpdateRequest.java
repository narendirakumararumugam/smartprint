package com.smartprint.smartservice.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrinterUpdateRequest {
    private String name;
    private String model;
    private String printerType;
    private String connectionType;
    private String ipAddress;
    private String port;
    private String cloudService;
    private Integer priority;
    private Integer maxPagesPerJob;
    private List<String> paperSizes;
    private List<String> jobTypes;
    private Boolean isDefault;
}
