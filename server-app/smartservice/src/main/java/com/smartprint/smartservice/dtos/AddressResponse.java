package com.smartprint.smartservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class AddressResponse {
    private UUID id;
    private String type;
    private String name;
    private String line1;
    private String line2;
    private String city;
    private String pincode;
    private String phone;
    private BigDecimal latitude;
    private BigDecimal longitude;

    @JsonProperty("isDefault")
    private boolean isDefault;
}