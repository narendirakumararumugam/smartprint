package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.ChangePasswordRequest;
import com.smartprint.smartservice.dtos.ProfileResponse;
import com.smartprint.smartservice.dtos.ProfileUpdateRequest;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping(ApiPaths.PROFILE)
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        User user = getUser(authentication);
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest body) {

        User user = getUser(authentication);

        if (body.getFirstName() != null) user.setFirstName(body.getFirstName());
        if (body.getLastName() != null) user.setLastName(body.getLastName());
        if (body.getPhone() != null) user.setPhone(body.getPhone());
        if (body.getWhatsapp() != null) user.setWhatsapp(body.getWhatsapp());
        if (body.getCity() != null) user.setCity(body.getCity());
        if (body.getBio() != null) user.setBio(body.getBio());
        if (body.getAvatar() != null) user.setAvatar(body.getAvatar());

        User saved = userRepository.save(user);
        return ResponseEntity.ok(toResponse(saved));
    }

    @PutMapping("/password")
    @Transactional
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest body) {

        User user = getUser(authentication);
        if (!passwordEncoder.matches(body.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Current password is incorrect"));
        }

        user.setPasswordHash(passwordEncoder.encode(body.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    private User getUser(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(Messages.Auth.USER_NOT_FOUND));
    }

    private ProfileResponse toResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .whatsapp(user.getWhatsapp())
                .city(user.getCity())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .userType(user.getUserType() != null ? user.getUserType().getCode() : null)
                .username(user.getUsername())
                .createdAt(user.getCreatedAt())
                .build();
    }
}