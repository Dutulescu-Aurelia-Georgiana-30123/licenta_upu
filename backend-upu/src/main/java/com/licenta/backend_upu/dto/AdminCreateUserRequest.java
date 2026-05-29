package com.licenta.backend_upu.dto;

import com.licenta.backend_upu.entity.AvailabilityStatus;
import com.licenta.backend_upu.entity.Role;

public record AdminCreateUserRequest(
        String email,
        String password,
        Role role,
        String firstName,
        String lastName,
        String phoneNumber,
        AvailabilityStatus availabilityStatus
) {
}