package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.ArchivedDocumentResponse;
import com.licenta.backend_upu.entity.ArchivedDocument;
import com.licenta.backend_upu.mapper.ArchivedDocumentMapper;
import com.licenta.backend_upu.service.ArchivedDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/archived-documents")
@RequiredArgsConstructor
public class ArchivedDocumentController {

    private final ArchivedDocumentService archivedDocumentService;
    private final ArchivedDocumentMapper archivedDocumentMapper;

    @GetMapping("/visit/{visitId}")
    public List<ArchivedDocumentResponse> getByVisit(@PathVariable Long visitId) {
        return archivedDocumentService.getByVisit(visitId)
                .stream()
                .map(archivedDocumentMapper::toResponse)
                .toList();
    }

    @GetMapping("/patient/{patientId}")
    public List<ArchivedDocumentResponse> getByPatient(@PathVariable Long patientId) {
        return archivedDocumentService.getByPatient(patientId)
                .stream()
                .map(archivedDocumentMapper::toResponse)
                .toList();
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long documentId) {
        ArchivedDocument doc = archivedDocumentService.getById(documentId);
        Resource resource = archivedDocumentService.loadFile(doc);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        doc.getContentType() != null ? doc.getContentType() : "application/octet-stream"
                ))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }
    @PostMapping("/upload")
    public void upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("visitId") Long visitId
    ) {
        archivedDocumentService.saveUploadedFile(file, visitId);
    }

    @GetMapping("/{documentId}/view")
    public ResponseEntity<Resource> view(@PathVariable Long documentId) {
        ArchivedDocument doc = archivedDocumentService.getById(documentId);

        Resource resource = archivedDocumentService.loadFile(doc);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        doc.getContentType() != null
                                ? doc.getContentType()
                                : "application/pdf"
                ))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }
}