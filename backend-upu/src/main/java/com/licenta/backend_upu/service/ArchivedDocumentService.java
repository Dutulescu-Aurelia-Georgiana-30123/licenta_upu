package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.ArchivedDocument;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.repository.ArchivedDocumentRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import jakarta.persistence.Entity;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import com.licenta.backend_upu.entity.DocumentType;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArchivedDocumentService {
    private final ArchivedDocumentRepository repo;
    private final VisitRepository visitRepository;

    public List<ArchivedDocument> getByPatient(Long patientId) {
        return repo.findByVisitPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<ArchivedDocument> getByVisit(Long visitId) {
        return repo.findByVisitIdOrderByCreatedAtDesc(visitId);
    }

    public ArchivedDocument getById(Long documentId) {
        return repo.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Documentul nu exista: " + documentId));
    }

    public Resource loadFile(ArchivedDocument doc) {
        File file = new File(doc.getStoragePath());
        if (!file.exists()) {
            throw new RuntimeException("Fisierul nu exista pe disc: " + doc.getStoragePath());
        }
        return new FileSystemResource(file);
    }

    public ArchivedDocument saveDocument(Visit visit,
                                         DocumentType type,
                                         String fileName,
                                         String contentType,
                                         String storagePath) {
        ArchivedDocument doc = new ArchivedDocument();
        doc.setVisit(visit);
        doc.setDocumentType(type);
        doc.setFileName(fileName);
        doc.setContentType(contentType);
        doc.setStoragePath(storagePath);
        doc.setCreatedAt(LocalDateTime.now());
        return repo.save(doc);
    }

    public void saveUploadedFile(MultipartFile file, Long visitId) {
        try {
            Visit visit = visitRepository.findById(visitId)
                    .orElseThrow(() -> new RuntimeException("Vizita nu exista"));

            String fileName = "visit_" + visitId + "_" + System.currentTimeMillis() + ".pdf";

            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            String filePath = uploadDir + fileName;

            Files.copy(file.getInputStream(), Paths.get(filePath));

            ArchivedDocument doc = new ArchivedDocument();
            doc.setVisit(visit);
            doc.setDocumentType(DocumentType.COMBINED_VISIT_PDF);
            doc.setFileName(fileName);
            doc.setContentType("application/pdf");
            doc.setStoragePath(filePath);
            doc.setCreatedAt(LocalDateTime.now());

            repo.save(doc);

        } catch (Exception e) {
            throw new RuntimeException("Eroare salvare document: " + e.getMessage(), e);
        }
    }
}
