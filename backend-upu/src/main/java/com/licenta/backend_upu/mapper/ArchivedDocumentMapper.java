package com.licenta.backend_upu.mapper;

import com.licenta.backend_upu.dto.ArchivedDocumentResponse;
import com.licenta.backend_upu.entity.ArchivedDocument;
import org.springframework.stereotype.Component;

@Component
public class ArchivedDocumentMapper {

    public ArchivedDocumentResponse toResponse(ArchivedDocument doc) {
        ArchivedDocumentResponse r = new ArchivedDocumentResponse();
        r.setId(doc.getId());
        r.setVisitId(doc.getVisit() != null ? doc.getVisit().getId() : null);
        r.setDocumentType(doc.getDocumentType() != null ? doc.getDocumentType().name() : null);
        r.setFileName(doc.getFileName());
        r.setContentType(doc.getContentType());
        r.setStoragePath(doc.getStoragePath());
        r.setCreatedAt(doc.getCreatedAt());
        return r;
    }
}