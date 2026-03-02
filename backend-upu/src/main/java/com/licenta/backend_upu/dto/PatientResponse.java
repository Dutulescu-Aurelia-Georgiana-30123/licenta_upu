package com.licenta.backend_upu.dto;

import lombok.Data;

@Data
public class PatientResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
