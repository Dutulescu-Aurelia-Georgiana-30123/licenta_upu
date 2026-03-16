package com.licenta.backend_upu.dto;

import lombok.Data;

@Data
public class PriorityPatientDto {
    private Long visitId;
    private String visitCode;
    private Long patientId;
    private String patientName;
    private String triageColor;
    private String status;
    private Long waitingMinutes;
}