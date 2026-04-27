package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.dtos.AuthLoginDto;
import com.smartprint.smartservice.models.Users;
import com.smartprint.smartservice.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthLoginDto loginDetails, HttpServletResponse response){
        String token = authService.login(loginDetails);
        ResponseCookie resCookie = ResponseCookie.from("jwtToken", token)
                .httpOnly(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Strict")
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, resCookie.toString());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public String register(@RequestBody Users userDetails){
        return authService.register(userDetails);
    }
}
