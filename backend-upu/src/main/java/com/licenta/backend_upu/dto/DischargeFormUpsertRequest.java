package com.licenta.backend_upu.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DischargeFormUpsertRequest {
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

    private String insuranceStatus; //asigurat
    private String admissionType; //criteriul internarii
    private String hospitalizationOutcome; //tipul internarii
    private String dischargeType; //tipul externarii

    private String diagnosisAtAdmission;
    private String diagnosisAtDischarge;
    private String treatmentAndRecommendations;

    private String details;

}
