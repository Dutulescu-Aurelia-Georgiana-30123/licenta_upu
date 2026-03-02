package com.licenta.backend_upu.dto;

import lombok.Data;
//import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PreFormResponse {
    private Long id;
    private Long visitId;

    private String firstName;
    private String lastName;
    private String cnp;
    private LocalDate birthDate;
    private String sex;

    private String triageColor;
    private String arrivalMode;

    private String reason;

    private Integer gcs;
    private Integer respiratoryRate;
    private Integer pulse;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer spo2;
    private Double temperature;
    private Integer glycemia;

    private String outcome;
    private String handoverTo;

    private String details;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
