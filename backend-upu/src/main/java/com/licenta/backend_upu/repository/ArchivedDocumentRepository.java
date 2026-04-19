package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.ArchivedDocument;
import com.licenta.backend_upu.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArchivedDocumentRepository extends JpaRepository<ArchivedDocument, Long> {
    List<ArchivedDocument> findByVisitIdOrderByCreatedAtDesc(Long visitId);

    List<ArchivedDocument> findByVisitPatientIdOrderByCreatedAtDesc(Long patientId);

    boolean existsByVisit_IdAndDocumentType(Long visitId, DocumentType documentType);
}
