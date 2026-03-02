package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.PreFormUpsertRequest;
import com.licenta.backend_upu.entity.PreHospitalizationForm;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.mapper.PreFormMapper;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PreHospitalizationFormService {
    private final PreHospitalizationFormRepository repo;
    private final VisitRepository visitRepo;
    private final PreFormMapper mapper;

    public PreHospitalizationForm upsert(Long visitId, PreFormUpsertRequest req){
        Visit visit=visitRepo.findById(visitId)
                .orElseThrow(()->new RuntimeException("Vizita nu exista: "+visitId));

        PreHospitalizationForm form=repo.findByVisitId(visitId).orElseGet(()-> {
            PreHospitalizationForm f = new PreHospitalizationForm();
            f.setVisit(visit);
            f.setCreatedAt(LocalDateTime.now());
            return f;
        });

        mapper.applyToEntity(req, form);
        form.setUpdatedAt(LocalDateTime.now());
        return repo.save(form);
    }
    public PreHospitalizationForm getByVisitId(Long visitId) {
        return repo.findByVisitId(visitId)
                .orElseThrow(()-> new RuntimeException("Nu exista fisa de pre-spitalizare pentru vizita: " + visitId));
    }

}
