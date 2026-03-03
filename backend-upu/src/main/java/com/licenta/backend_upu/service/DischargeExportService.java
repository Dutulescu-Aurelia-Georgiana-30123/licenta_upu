package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.*;
import com.licenta.backend_upu.repository.DischargeFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import com.licenta.backend_upu.util.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class DischargeExportService {

    @Value("${app.storage.base-path:storage}")
    private String basePath;

    private final VisitRepository visitRepository;
    private final DischargeFormRepository dischargeFormRepository;
    private final PdfExportService pdfExportService;
    private final ArchivedDocumentService archivedDocumentService;


    public ArchivedDocument exportDischargePdf(Long visitId) throws IOException {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu exista: " + visitId));

        DischargeForm form = dischargeFormRepository.findByVisitId(visitId)
                .orElseThrow(() -> new RuntimeException("Nu exista fisa de externare pentru vizita: " + visitId));

        String fileName = "discharge_visit_" + visitId + ".pdf";
        String storagePath = basePath + "/visit-" + visitId + "/" + fileName;
        File outputFile = new File(storagePath);

        String[] lines = new String[] {
                "Spital: " + safe(form.getHospitalName()),
                "Sectia: " + safe(form.getSectionName()),
                "Nr. F.O.: " + safe(form.getFoNumber()),
                "",
                "Pacient: " + safe(form.getFirstName()) + " " + safe(form.getLastName()),
                "CNP: " + safe(form.getCnp()),
                "Data nasterii: " + (form.getBirthDate() != null ? form.getBirthDate().toString() : ""),
                "Sex: " + safe(form.getSex()),
                "Domiciliu: " + safe(form.getCounty()) + ", " + safe(form.getLocality()),
                "",
                "Diagnostic la internare: " + safe(form.getDiagnosisAtAdmission()),
                "Diagnostic la externare: " + safe(form.getDiagnosisAtDischarge()),
                "",
                "Tratament/Recomandari: " + safe(form.getTreatmentAndRecommendations())
        };

        pdfExportService.createSimplePdf(outputFile, "Fisa de externare (export PDF)", lines);

        return archivedDocumentService.saveDocument(
                visit,
                DocumentType.DISCHARGE_FORM_PDF,
                fileName,
                "application/pdf",
                storagePath
        );
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}