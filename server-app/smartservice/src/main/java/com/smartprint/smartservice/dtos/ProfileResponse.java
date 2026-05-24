package com.smartprint.smartservice.dtos;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String whatsapp;
    private String city;
    private String bio;
    private String avatar;
    private String userType;
    private String username;
    private java.time.LocalDateTime createdAt;
}
