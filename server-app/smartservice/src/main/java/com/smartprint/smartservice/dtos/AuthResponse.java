package com.smartprint.smartservice.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String fullName;
    private String userType;
    private String username;
    private String avatar;
    private LocalDateTime createdAt;
}
