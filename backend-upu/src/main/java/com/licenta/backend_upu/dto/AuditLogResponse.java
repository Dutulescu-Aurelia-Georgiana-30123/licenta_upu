package com.licenta.backend_upu.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLogResponse {

    private Long id;

    private String action;

    private String details;

    private Long performedByUserId;

    private String performedByName;

    private LocalDateTime createdAt;
}