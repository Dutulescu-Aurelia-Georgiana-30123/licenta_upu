package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.*;
import com.licenta.backend_upu.repository.DischargeFormRepository;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import com.licenta.backend_upu.util.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CombinedVisitExportService {
    @Value("${app.storage.base-path:storage}")
    private String basePath;

    private final VisitRepository visitRepository;
    private final PreHospitalizationFormRepository preRepo;
    private final DischargeFormRepository dischargeRepo;
    private final PdfExportService pdfExportService;
    private final ArchivedDocumentService archivedDocumentService;


    public ArchivedDocument exportCombined(Long visitId) throws IOException {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu exista: " + visitId));

        PreHospitalizationForm pre = preRepo.findByVisitId(visitId)
                .orElseThrow(() -> new RuntimeException("Nu exista fisa pre-spitalizare pentru vizita: " + visitId));

        DischargeForm dis = dischargeRepo.findByVisitId(visitId)
                .orElseThrow(() -> new RuntimeException("Nu exista fisa de externare pentru vizita: " + visitId));

        String fileName = "combined_visit_" + visitId + ".pdf";
        String storagePath = basePath + "/visit-" + visitId + "/" + fileName;
        File outputFile = new File(storagePath);

        String[] preLines = new String[] {
                "Pacient: " + safe(pre.getFirstName()) + " " + safe(pre.getLastName()),
                "CNP: " + safe(pre.getCnp()),
                "Data nasterii: " + (pre.getBirthDate() != null ? pre.getBirthDate().toString() : ""),
                "Sex: " + safe(pre.getSex()),
                "",
                "Cod urgenta: " + (pre.getTriageColor() != null ? pre.getTriageColor().name() : ""),
                "Adus de: " + (pre.getArrivalMode() != null ? pre.getArrivalMode().name() : ""),
                "Motiv: " + safe(pre.getReason()),
                "",
                "FR: " + safeInt(pre.getRespiratoryRate()),
                "Puls: " + safeInt(pre.getPulse()),
                "TA: " + safeInt(pre.getSystolicBp()) + "/" + safeInt(pre.getDiastolicBp()),
                "SpO2: " + safeInt(pre.getSpo2()),
                "Temp: " + safeDouble(pre.getTemperature()),
                "Glicemie: " + safeInt(pre.getGlycemia())
        };

        String[] disLines = new String[] {
                "Spital: " + safe(dis.getHospitalName()),
                "Sectia: " + safe(dis.getSectionName()),
                "Nr. F.O.: " + safe(dis.getFoNumber()),
                "",
                "Pacient: " + safe(dis.getFirstName()) + " " + safe(dis.getLastName()),
                "CNP: " + safe(dis.getCnp()),
                "",
                "Diagnostic la internare: " + safe(dis.getDiagnosisAtAdmission()),
                "Diagnostic la externare: " + safe(dis.getDiagnosisAtDischarge()),
                "",
                "Tratament/Recomandari: " + safe(dis.getTreatmentAndRecommendations())
        };

        pdfExportService.createMultiPagePdf(
                outputFile,
                new String[][]{ preLines, disLines },
                new String[]{ "Fisa pre-spitalizare", "Fisa de externare" }
        );

        return archivedDocumentService.saveDocument(
                visit,
                DocumentType.COMBINED_VISIT_PDF,
                fileName,
                "application/pdf",
                storagePath
        );
    }

    private String safe(String s) { return s == null ? "" : s; }
    private String safeInt(Integer v) { return v == null ? "" : v.toString(); }
    private String safeDouble(Double v) { return v == null ? "" : v.toString(); }
}

