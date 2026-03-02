package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.PreFormResponse;
import com.licenta.backend_upu.dto.PreFormUpsertRequest;
import com.licenta.backend_upu.mapper.PreFormMapper;
import com.licenta.backend_upu.service.PreHospitalizationFormService;
import lombok.RequiredArgsConstructor;
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
    public PreFormResponse get(@PathVariable Long visitId){
        return mapper.toResponse(service.getByVisitId(visitId));
    }
}
