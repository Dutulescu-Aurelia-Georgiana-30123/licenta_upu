package com.licenta.backend_upu.dto;

import lombok.Data;

@Data
public class PatientQuestionCreateRequest {
    private Long patientId;
    private String questionText;
}