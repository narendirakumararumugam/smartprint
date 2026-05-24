package com.smartprint.smartservice.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String whatsapp;
    private String city;
    private String bio;
    private String avatar;
}
