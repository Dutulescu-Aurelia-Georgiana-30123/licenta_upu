package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.LoginRequest;
import com.licenta.backend_upu.dto.LoginResponse;
import com.licenta.backend_upu.dto.UpdateAvailabilityRequest;
import com.licenta.backend_upu.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    @GetMapping("/available-doctors")
    public ResponseEntity<Long> getAvailableDoctors() {
        return ResponseEntity.ok(authService.countAvailableDoctors());
    }

    @PutMapping("/users/{id}/availability")
    public ResponseEntity<String> updateAvailability(
            @PathVariable Long id,
            @RequestBody UpdateAvailabilityRequest request
    ) {
        authService.updateAvailability(id, request);
        return ResponseEntity.ok("Status actualizat");
    }
}