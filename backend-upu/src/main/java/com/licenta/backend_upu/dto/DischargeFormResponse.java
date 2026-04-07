package com.licenta.backend_upu.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DischargeFormResponse {
    private Long id;
    private Long visitId;

    private String hospitalName;
    private String sectionName;
    private String foNumber;

    private LocalDateTime admissionDateTime;
    private LocalDateTime dischargeDateTime;

    private String firstName;
    private String lastName;
    private String cnp;
    private LocalDate birthDate;
    private String sex;

    private String county;
    private String locality;

    private String occupation;
    private String citizenshipType;
    private String citizenshipCountry;

    private String insuranceStatus;
    private String admissionType;
    private String hospitalizationOutcome;
    private String dischargeType;

    private String diagnosisAtAdmission;
    private String diagnosisAtDischarge;
    private String treatmentAndRecommendations;

    private String details;

    private String doctorName;
    private String doctorSignature;
    private LocalDateTime doctorSignedAt;

    private String nurseName;
    private String nurseSignature;
    private LocalDateTime nurseSignedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}