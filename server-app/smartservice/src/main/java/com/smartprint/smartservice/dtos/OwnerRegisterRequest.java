package com.smartprint.smartservice.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerRegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String whatsapp;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    private String tagline;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "PIN code is required")
    @Pattern(regexp = "^\\d{6}$", message = "PIN code must be 6 digits")
    private String pinCode;

    private Double latitude;
    private Double longitude;

    @NotEmpty(message = "At least one service is required")
    private List<String> services;

    private List<ShopHourEntry> hours;
    private ShopPricingDTO pricing;
    private String approvalMode;
    private PrinterConfigDTO printer;
    private String maxFileSize;
    private NotificationPrefsDTO notifications;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShopHourEntry {
        private String day;
        private String open;
        private String close;
        private boolean isClosed;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShopPricingDTO {
        private double a4BWSingle;
        private double a4ColorSingle;
        private double a4BWDouble;
        private double a4ColorDouble;
        private double a3BW;
        private double a3Color;
        private double photoBW;
        private double photoColor;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrinterConfigDTO {
        private String model;
        private String connectionType;
        private String ipAddress;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationPrefsDTO {
        private boolean email;
        private boolean whatsapp;
        private boolean push;
        private boolean dailySummary;
    }
}