package com.licenta.backend_upu.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientQuestionResponse {
    private Long id;

    private Long patientId;
    private String patientFirstName;
    private String patientLastName;
    private String patientEmail;

    private String questionText;
    private String answerText;

    private Long answeredByUserId;
    private String answeredByName;
    private String answeredByEmail;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
}