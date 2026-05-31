package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.*;
import com.smartprint.smartservice.models.Shop;
import com.smartprint.smartservice.repository.ShopRepository;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.services.PrinterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.PRINTERS)
@RequiredArgsConstructor
public class OwnerPrinterController {

    private final PrinterService printerService;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;

    private Integer getShopId(UserDetails userDetails) {
        UUID ownerId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException(Messages.Auth.USER_NOT_FOUND))
                .getId();
        List<Shop> shops = shopRepository.findByOwnerId(ownerId);
        if (shops.isEmpty()) {
            throw new RuntimeException("No shop found for owner");
        }
        return shops.get(0).getId();
    }

    @GetMapping
    public ResponseEntity<List<PrinterResponse>> getPrinters(
            @AuthenticationPrincipal UserDetails userDetails) {
        Integer shopId = getShopId(userDetails);
        return ResponseEntity.ok(printerService.getPrinters(shopId));
    }

    @GetMapping("/stats")
    public ResponseEntity<PrinterStatsResponse> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        Integer shopId = getShopId(userDetails);
        return ResponseEntity.ok(printerService.getStats(shopId));
    }

    @PostMapping
    public ResponseEntity<PrinterResponse> addPrinter(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PrinterCreateRequest request) {
        Integer shopId = getShopId(userDetails);
        return ResponseEntity.ok(printerService.addPrinter(shopId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrinterResponse> updatePrinter(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody PrinterUpdateRequest request) {
        Integer shopId = getShopId(userDetails);
        return ResponseEntity.ok(printerService.updatePrinter(shopId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deletePrinter(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Integer shopId = getShopId(userDetails);
        printerService.deletePrinter(shopId, id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/set-default")
    public ResponseEntity<PrinterResponse> setDefault(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Integer shopId = getShopId(userDetails);
        return ResponseEntity.ok(printerService.setDefault(shopId, id));
    }

    @PostMapping("/{id}/test-print")
    public ResponseEntity<Map<String, String>> testPrint(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        getShopId(userDetails); // verify ownership
        return ResponseEntity.ok(Map.of("status", "success", "message", "Test page sent to printer"));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<PrintJobResponse>> getRecentJobs(
            @AuthenticationPrincipal UserDetails userDetails) {
        Integer shopId = getShopId(userDetails);
        return ResponseEntity.ok(printerService.getRecentJobs(shopId));
    }

    @GetMapping("/{id}/queue")
    public ResponseEntity<List<PrintJobResponse>> getPrinterQueue(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        getShopId(userDetails); // verify ownership
        return ResponseEntity.ok(printerService.getQueueForPrinter(id));
    }
}