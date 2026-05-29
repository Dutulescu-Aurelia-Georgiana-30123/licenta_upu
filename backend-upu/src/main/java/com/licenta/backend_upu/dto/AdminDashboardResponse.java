package com.licenta.backend_upu.dto;

public record AdminDashboardResponse(
        long totalDoctors,
        long totalNurses,
        long totalReceptionUsers,
        long activeUsers,
        long inactiveUsers,
        long todayVisits,
        long activeVisits
) {
}