package com.licenta.backend_upu.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VisitResponse {
private Long id;
private String visitCode;
private Long patientId;
private String patientFirstName;
private String patientLastName;
private String status;
private LocalDateTime createdAt;
}
