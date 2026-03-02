package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.DischargeFormResponse;
import com.licenta.backend_upu.dto.DischargeFormUpsertRequest;
import com.licenta.backend_upu.entity.DischargeForm;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.mapper.DischargeFormMapper;
import com.licenta.backend_upu.repository.DischargeFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DischargeFormService {
    private final DischargeFormRepository repo;
    private final VisitRepository visitRepo;
    private final DischargeFormMapper mapper;

    public DischargeForm upsert(Long visitId, DischargeFormUpsertRequest req) {
        Visit visit = visitRepo.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu exista " + visitId));


        DischargeForm form=repo.findByVisitId(visitId).orElseGet(()-> {
            DischargeForm f=new DischargeForm();
            f.setVisit(visit);
            f.setCreatedAt(LocalDateTime.now());
            return f;
        });

        mapper.applyToEntity(req,form);
        form.setUpdatedAt(LocalDateTime.now());
        return repo.save(form);
    }

    public DischargeForm getByVisitId(Long visitId) {
        return repo.findByVisitId(visitId)
                .orElseThrow(()->new RuntimeException("Nu exista fisa de externare pentru vizita: " + visitId));
    }

}
