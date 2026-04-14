package com.licenta.backend_upu.dto;

import com.licenta.backend_upu.entity.AvailabilityStatus;

public class UpdateAvailabilityRequest {

    private AvailabilityStatus availabilityStatus;

    public UpdateAvailabilityRequest() {
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
}