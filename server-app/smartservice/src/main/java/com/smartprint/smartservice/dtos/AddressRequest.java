package com.smartprint.smartservice.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddressRequest {

    @NotBlank
    private String type;

    @NotBlank
    private String name;

    @NotBlank
    private String line1;

    private String line2;

    @NotBlank
    private String city;

    @NotBlank
    @Pattern(regexp = "^\\d{6}$", message = "PIN code must be 6 digits")
    private String pincode;

    @NotBlank
    private String phone;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private Boolean isDefault;
}
