package com.licenta.backend_upu.dto;

public class AssignDoctorRequest {

    private Long doctorId;

    public AssignDoctorRequest() {
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
}