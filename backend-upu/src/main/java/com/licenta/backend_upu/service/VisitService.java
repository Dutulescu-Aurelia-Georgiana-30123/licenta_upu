package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.entity.VisitStatus;
import com.licenta.backend_upu.repository.PatientRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitService {
    private final VisitRepository visitRepository;
    private final PatientRepository patientRepository;

    public Visit createVisit(Long patientId){
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Pacientul nu a fost gasit cu id: "+ patientId));

        Visit visit = new Visit();
        visit.setPatient(patient);
        visit.setVisitCode(generateVisitCode());
        visit.setStatus(VisitStatus.REGISTERED);
        visit.setCreatedAt(LocalDateTime.now());

        return visitRepository.save(visit);
    }

    public List<Visit> getAllVisits(){
        return visitRepository.findAll();
    }

    private String generateVisitCode(){
        return "UPU-" + System.currentTimeMillis();
    }

    public Visit updateVisistStatus(Long visitId, String status){
        Visit visit=visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu a fost gasita cu id"+visitId));
            try
            {
                VisitStatus newStatus=VisitStatus.valueOf(status.toUpperCase());
                visit.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Status invalid: "+status);
            }
            return visitRepository.save(visit);
    }

    public List<Visit> getVisitByPatient(Long patientId){
        return visitRepository.findByPatient_IdOrderByCreatedAtDesc(patientId);
    }

}
