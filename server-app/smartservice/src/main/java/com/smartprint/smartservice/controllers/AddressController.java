package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.AddressRequest;
import com.smartprint.smartservice.dtos.AddressResponse;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.AddressService;
import com.smartprint.smartservice.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.PROFILE + "/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;
    private final JWTService jwtService;

    @GetMapping
    public ResponseEntity<List<
            AddressResponse>> list(Authentication authentication) {
        return ResponseEntity.ok(addressService.list(currentUserId(authentication)));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> create(
            Authentication authentication,
            @Valid @RequestBody AddressRequest body) {
        AddressResponse created = addressService.create(currentUserId(authentication), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> update(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest body) {
        return ResponseEntity.ok(addressService.update(currentUserId(authentication), id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable UUID id) {
        addressService.delete(currentUserId(authentication), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefault(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(addressService.setDefault(currentUserId(authentication), id));
    }

    private UUID currentUserId(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(Messages.Auth.USER_NOT_FOUND));
        return user.getId();
    }
}