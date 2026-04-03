package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.DischargeFormResponse;
import com.licenta.backend_upu.dto.DischargeFormUpsertRequest;
import com.licenta.backend_upu.entity.DischargeForm;
import com.licenta.backend_upu.mapper.DischargeFormMapper;
import com.licenta.backend_upu.service.DischargeFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/visits/{visitId}/discharge")
@RequiredArgsConstructor
public class DischargeFormController {

    private final DischargeFormMapper mapper;
    private final DischargeFormService service;

    @PutMapping
    public DischargeFormResponse upsert(@PathVariable Long visitId, @RequestBody DischargeFormUpsertRequest req) {
        return mapper.toResponse(service.upsert(visitId, req));
    }

    @GetMapping
    public ResponseEntity<DischargeFormResponse> get(@PathVariable Long visitId) {
        DischargeForm form = service.getByVisitId(visitId);

        if (form == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.toResponse(form));
    }
}