package com.licenta.backend_upu.mapper;

import com.licenta.backend_upu.dto.ArchivedDocumentResponse;
import com.licenta.backend_upu.entity.ArchivedDocument;
import org.springframework.stereotype.Component;

@Component
public class ArchivedDocumentMapper {

    public ArchivedDocumentResponse toResponse(ArchivedDocument d){
        ArchivedDocumentResponse r =new ArchivedDocumentResponse();
        r.setId(d.getId());
        r.setVisitId(d.getVisit().getId());
        r.setPatientId(d.getVisit().getPatient().getId());

        r.setDocumentType(d.getDocumentType().name());
        r.setFileName(d.getFileName());
        r.setContentType(d.getContentType());
        r.setCreatedAt(d.getCreatedAt());
        return r;
    }

}
