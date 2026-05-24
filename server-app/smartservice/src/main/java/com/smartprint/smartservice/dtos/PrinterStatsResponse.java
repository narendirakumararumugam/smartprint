package com.smartprint.smartservice.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrinterStatsResponse {
    private int totalPrinters;
    private int online;
    private int printing;
    private int pagesToday;
}
