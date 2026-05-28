package com.licenta.backend_upu.dto;

public record AdminDashboardResponse(
        long totalDoctors,
        long totalNurses,
        long totalReceptionists,
        long activeUsers,
        long inactiveUsers,
        long todayPatients,
        long activeVisits
) {
}