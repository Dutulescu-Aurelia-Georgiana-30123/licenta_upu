package com.licenta.backend_upu.dto;

import lombok.Data;

@Data
public class PatientCreateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String cnp;
}
