package com.smartprint.smartservice.dtos;

import lombok.*;

@Data
@Builder
public class OwnerRegisterResponse {
    private boolean success;
    private Integer shopId;
    private String shopName;
    private String message;
    private String accessToken;
    private String refreshToken;
}
