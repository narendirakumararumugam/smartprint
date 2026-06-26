package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.dtos.LoginRequest;
import com.smartprint.smartservice.dtos.OwnerRegisterRequest;
import com.smartprint.smartservice.dtos.OwnerRegisterResponse;
import com.smartprint.smartservice.security.AuthCookieService;
import com.smartprint.smartservice.services.OwnerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping(ApiPaths.OWNER_AUTH)
@RequiredArgsConstructor
public class OwnerAuthController {

    private final OwnerService ownerService;
    private final AuthCookieService authCookieService;

    @PostMapping("/register")
    public ResponseEntity<OwnerRegisterResponse> register(
            @Valid @RequestBody OwnerRegisterRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        OwnerRegisterResponse response = ownerService.registerOwner(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        authCookieService.addAuthCookies(httpResponse, response.getAccessToken(), response.getRefreshToken(), httpRequest.isSecure());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<OwnerRegisterResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        OwnerRegisterResponse response = ownerService.loginOwner(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }

        authCookieService.addAuthCookies(
                httpResponse,
                response.getAccessToken(),
                response.getRefreshToken(),
                httpRequest.isSecure());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean available = ownerService.isEmailAvailable(email);
        return ResponseEntity.ok(Map.of("available", available));
    }
}