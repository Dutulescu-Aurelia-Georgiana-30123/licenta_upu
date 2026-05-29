package com.licenta.backend_upu.dto;

import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.AvailabilityStatus;

public record AdminUserResponse(
        Long id,
        String email,
        Role role,
        String firstName,
        String lastName,
        String phoneNumber,
        Boolean isActive,
        AvailabilityStatus availabilityStatus
) {
}