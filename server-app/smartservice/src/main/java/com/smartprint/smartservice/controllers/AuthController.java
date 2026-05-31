package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.dtos.AuthResponse;
import com.smartprint.smartservice.dtos.LoginRequest;
import com.smartprint.smartservice.dtos.RefreshTokenRequest;
import com.smartprint.smartservice.dtos.SignupRequest;
import com.smartprint.smartservice.security.AuthCookieService;
import com.smartprint.smartservice.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(ApiPaths.AUTH)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse){
        AuthResponse authResponse = authService.login(request);
        authCookieService.addAuthCookies(httpResponse, authResponse.getAccessToken(), authResponse.getRefreshToken(), httpRequest.isSecure());

//        ResponseCookie resCookie = ResponseCookie.from("jwtToken", authResponse.getAccessToken())
//                .httpOnly(true)
//                .path("/")
//                .maxAge(3600)
//                .sameSite("Strict")
//                .build();
//        response.setHeader(HttpHeaders.SET_COOKIE, resCookie.toString());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignupRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse){
        AuthResponse authResponse = authService.signup(request);
        authCookieService.addAuthCookies(httpResponse, authResponse.getAccessToken(), authResponse.getRefreshToken(), httpRequest.isSecure());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody(required=false) RefreshTokenRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse){
        String tokenFromBody = request != null ? request.getRefreshToken() : null;
        String token = tokenFromBody != null ? tokenFromBody : authCookieService.extractRefreshToken(httpRequest);
        AuthResponse authResponse = authService.refresh(token);
        authCookieService.addAuthCookies(httpResponse, authResponse.getAccessToken(), authResponse.getRefreshToken(), httpRequest.isSecure());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response){
        authCookieService.clearAuthCookies(response, request.isSecure());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
