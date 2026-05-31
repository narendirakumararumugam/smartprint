package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.dtos.AdminOrderDTO;
import com.smartprint.smartservice.dtos.AdminShopDTO;
import com.smartprint.smartservice.dtos.AdminStatsDTO;
import com.smartprint.smartservice.dtos.AdminUserDTO;
import com.smartprint.smartservice.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.ADMIN)
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        adminService.updateUserStatus(id, active);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shops")
    public ResponseEntity<List<AdminShopDTO>> getShops() {
        return ResponseEntity.ok(adminService.getAllShops());
    }

    @PatchMapping("/shops/{id}/verify")
    public ResponseEntity<Void> toggleShopVerification(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {
        boolean verified = body.getOrDefault("verified", true);
        adminService.toggleShopVerification(id, verified);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderDTO>> getOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }
}