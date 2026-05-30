package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.AdminDashboardResponse;
import com.licenta.backend_upu.dto.AdminUserResponse;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.service.AdminService;
import com.licenta.backend_upu.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.licenta.backend_upu.dto.AdminCreateUserRequest;
import com.licenta.backend_upu.dto.AdminUpdateUserRequest;
import com.licenta.backend_upu.dto.AdminResetPasswordRequest;
import com.licenta.backend_upu.dto.VisitResponse;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.mapper.VisitMapper;
import com.licenta.backend_upu.dto.AuditLogResponse;
import com.licenta.backend_upu.mapper.AuditLogMapper;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final VisitMapper visitMapper;
    private final AuditLogService auditLogService;
    private final AuditLogMapper auditLogMapper;

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/users/{role}")
    public List<AdminUserResponse> getUsersByRole(
            @PathVariable Role role
    ) {
        return adminService.getUsersByRole(role);
    }
    @PostMapping("/users")
    public AdminUserResponse createUser(@RequestBody AdminCreateUserRequest request) {
        return adminService.createUser(request);
    }

    @PutMapping("/users/{userId}/toggle-active")
    public AdminUserResponse toggleUserActive(
            @PathVariable Long userId
    ) {
        return adminService.toggleUserActive(userId);
    }

    @PutMapping("/users/{userId}")
    public AdminUserResponse updateUser(
            @PathVariable Long userId,
            @RequestBody AdminUpdateUserRequest request
    ) {
        return adminService.updateUser(userId, request);
    }
    @PutMapping("/users/{userId}/reset-password")
    public void resetPassword(
            @PathVariable Long userId,
            @RequestBody AdminResetPasswordRequest request
    ) {
        adminService.resetPassword(userId, request);
    }
    @GetMapping("/active-visits")
    public List<VisitResponse> getActiveVisits() {
        return adminService.getActiveVisits()
                .stream()
                .map(visitMapper::toResponse)
                .toList();
    }

    @PutMapping("/visits/{visitId}/cancel")
    public VisitResponse cancelVisit(@PathVariable Long visitId) {
        return visitMapper.toResponse(adminService.cancelVisit(visitId));
    }

    @PutMapping("/visits/{visitId}/force-discharge")
    public VisitResponse forceDischargeVisit(@PathVariable Long visitId) {
        return visitMapper.toResponse(adminService.forceDischargeVisit(visitId));
    }
    @GetMapping("/audit")
    public List<AuditLogResponse> getAuditLogs() {
        return auditLogService.getLatestLogs()
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @DeleteMapping("/patients/{patientId}")
    public void deletePatient(@PathVariable Long patientId) {
        adminService.deletePatient(patientId);
    }
}