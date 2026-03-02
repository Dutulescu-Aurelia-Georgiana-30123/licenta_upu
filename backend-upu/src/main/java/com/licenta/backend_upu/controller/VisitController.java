package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.VisitCreateRequest;
import com.licenta.backend_upu.dto.VisitResponse;
import com.licenta.backend_upu.dto.VisitStatusUpdateRequest;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.entity.VisitStatus;
import com.licenta.backend_upu.mapper.VisitMapper;
import com.licenta.backend_upu.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
public class VisitController {
    private final VisitService visitService;
    private final VisitMapper visitMapper;

    @PostMapping
    public VisitResponse createVisit(@RequestBody VisitCreateRequest request) {
        Visit saved = visitService.createVisit(request.getPatientId());
        return visitMapper.toResponse(saved);
    }

    @GetMapping
    public List<VisitResponse> getAllVisits() {
        return visitService.getAllVisits()
                .stream()
                .map(visitMapper::toResponse)
                .toList();
    }



    @PatchMapping("/{id}/status")
    public VisitResponse updateVisitStatus(@PathVariable Long id,
                                           @RequestBody VisitStatusUpdateRequest request) {
        Visit updated = visitService.updateVisistStatus(id, request.getStatus());
        return visitMapper.toResponse(updated);
    }





    @GetMapping("/patient/{patientId}")
    public List<VisitResponse> getVisitsByPatient(@PathVariable Long patientId) {
        return visitService.getVisitByPatient(patientId)
                .stream()
                .map(visitMapper::toResponse)
                .toList();
    }

}
