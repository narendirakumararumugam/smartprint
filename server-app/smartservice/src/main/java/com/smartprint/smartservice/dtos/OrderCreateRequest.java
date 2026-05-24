package com.smartprint.smartservice.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    @NotNull(message = "Shop ID is required")
    private Integer shopId;

    @NotEmpty(message = "At least one file item is required")
    private List<OrderFileItem> files;

    private List<String> addonIds;

    private String specialNote;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderFileItem {
        @NotBlank(message = "File name is required")
        private String fileName;

        @Min(value = 1, message = "Pages must be at least 1")
        private int pages;

        @Min(value = 1, message = "Copies must be at least 1")
        private int copies;

        private boolean color;
        private String sides; // single or double
        private String paperSize; // A4, A3, Legal
    }
}