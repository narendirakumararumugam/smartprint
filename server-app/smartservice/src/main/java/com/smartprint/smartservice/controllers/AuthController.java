package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.dtos.AuthResponse;
import com.smartprint.smartservice.dtos.LoginRequest;
import com.smartprint.smartservice.dtos.RefreshTokenRequest;
import com.smartprint.smartservice.dtos.SignupRequest;
import com.smartprint.smartservice.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPaths.AUTH)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response){
        AuthResponse authResponse = authService.login(request);
        ResponseCookie resCookie = ResponseCookie.from("jwtToken", authResponse.getAccessToken())
                .httpOnly(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Strict")
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, resCookie.toString());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignupRequest request){
        AuthResponse authResponse = authService.signup(request);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request){
        AuthResponse authResponse = authService.refresh(request);
        return ResponseEntity.ok(authResponse);
    }
}
