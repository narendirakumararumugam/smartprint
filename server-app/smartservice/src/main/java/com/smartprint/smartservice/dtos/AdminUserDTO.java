package com.smartprint.smartservice.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminUserDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String city;
    private String userType;
    private boolean verified;
    private boolean active;
    private LocalDateTime createdAt;
}
