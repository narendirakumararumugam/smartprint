package com.smartprint.smartservice.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
