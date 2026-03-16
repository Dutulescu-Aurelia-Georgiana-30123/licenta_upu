package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.StatsResponse;
import com.licenta.backend_upu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StatsController {
    private final PatientRepository patientRepository;
    private final VisitRepository visitRepository;
    private final PreHospitalizationFormRepository preRepo;
    private final DischargeFormRepository dischargeRepo;
    private final ArchivedDocumentRepository archivedRepo;

    @GetMapping("/stats")
    public StatsResponse getStart(){
        StatsResponse s= new StatsResponse();
        s.setPatientsCount(patientRepository.count());
        s.setVisitsCount(visitRepository.count());
        s.setPreFormsCount(preRepo.count());
        s.setDischargeFormsCount(dischargeRepo.count());
        s.setArchivedDocumentsCount(archivedRepo.count());
        return s;
    }


}
