package com.licenta.backend_upu.dto;

import lombok.Data;

@Data
public class UpdateMedicalProfileRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profileImage;
    private String specialization;
    private String professionalGrade;
    private String profileSignature;
    private String profileSignedAt;
    private String email;
}