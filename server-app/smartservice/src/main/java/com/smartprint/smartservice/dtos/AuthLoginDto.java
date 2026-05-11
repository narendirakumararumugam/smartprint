package com.smartprint.smartservice.dtos;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthLoginDto {
    String userName;
    String password;
}
