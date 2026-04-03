package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.PreFormResponse;
import com.licenta.backend_upu.dto.PreFormUpsertRequest;
import com.licenta.backend_upu.entity.PreHospitalizationForm;
import com.licenta.backend_upu.mapper.PreFormMapper;
import com.licenta.backend_upu.service.PreHospitalizationFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/visits/{visitId}/preform")
@RequiredArgsConstructor
public class PreHospitalizationFormController {

    private final PreHospitalizationFormService service;
    private final PreFormMapper mapper;

    @PutMapping
    public PreFormResponse upsert(@PathVariable Long visitId, @RequestBody PreFormUpsertRequest req) {
        return mapper.toResponse(service.upsert(visitId, req));
    }

    @GetMapping
    public ResponseEntity<PreFormResponse> get(@PathVariable Long visitId) {
        PreHospitalizationForm form = service.getByVisitId(visitId);

        if (form == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.toResponse(form));
    }
}