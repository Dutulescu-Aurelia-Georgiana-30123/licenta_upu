package com.licenta.backend_upu.dto;

import lombok.Data;

@Data
public class PatientQuestionAnswerRequest {
    private Long userId;
    private String answerText;
}