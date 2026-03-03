package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.ArchivedDocumentResponse;
import com.licenta.backend_upu.entity.ArchivedDocument;
import com.licenta.backend_upu.mapper.ArchivedDocumentMapper;
import com.licenta.backend_upu.service.ArchivedDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ArchivedDocumentController {
    private final ArchivedDocumentService service;
    private final ArchivedDocumentMapper mapper;

    @GetMapping("/patients/{patientId}/documents")
    public List<ArchivedDocumentResponse> getPatientDocuments(@PathVariable Long patientId) {
        return service.getByPatient(patientId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @GetMapping("/visits/{visitId}/documents")
    public List<ArchivedDocumentResponse> getVisitDocuments(@PathVariable Long visitId) {
        return service.getByVisit(visitId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long documentId) {
        ArchivedDocument doc = service.getById(documentId);
        Resource resource = service.loadFile(doc);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, doc.getContentType())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }
}
