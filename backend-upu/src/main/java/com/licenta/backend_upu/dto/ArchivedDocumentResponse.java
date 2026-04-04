package com.licenta.backend_upu.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ArchivedDocumentResponse {
    private Long id;
    private Long visitId;
    private String documentType;
    private String fileName;
    private String contentType;
    private LocalDateTime createdAt;
}