package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.VisitCreateRequest;
import com.licenta.backend_upu.dto.VisitResponse;
import com.licenta.backend_upu.dto.VisitStatusUpdateRequest;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.entity.VisitStatus;
import com.licenta.backend_upu.mapper.VisitMapper;
import com.licenta.backend_upu.service.VisitService;
import com.licenta.backend_upu.dto.AssignDoctorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;

import java.util.List;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
public class VisitController {
    private final VisitService visitService;
    private final VisitMapper visitMapper;
    private final PreHospitalizationFormRepository preformRepository;

    @PostMapping
    public VisitResponse createVisit(@RequestBody VisitCreateRequest request) {
        Visit saved = visitService.createVisit(request.getPatientId());
        return visitMapper.toResponse(saved);
    }

    @GetMapping
    public List<VisitResponse> getAllVisits() {
        return visitService.getAllVisits()
                .stream()
                .map(this::toResponseWithTriage)
                .toList();
    }

    @PutMapping("/{id}/status")
    public VisitResponse updateVisitStatus(@PathVariable Long id,
                                           @RequestBody VisitStatusUpdateRequest request) {
        Visit updated = visitService.updateVisistStatus(id, request.getStatus());
        return visitMapper.toResponse(updated);
    }
    @GetMapping("/patient/{patientId}")
    public List<VisitResponse> getVisitsByPatient(@PathVariable Long patientId) {
        return visitService.getVisitByPatient(patientId)
                .stream()
                .map(this::toResponseWithTriage)
                .toList();
    }
    @PutMapping("/{id}/assign-doctor")
    public VisitResponse assignDoctorToVisit(@PathVariable Long id,
                                             @RequestBody AssignDoctorRequest request) {
        Visit updated = visitService.assignDoctorToVisit(id, request.getDoctorId());
        return visitMapper.toResponse(updated);
    }
    @GetMapping("/doctor/{doctorId}")
    public List<VisitResponse> getVisitsByDoctor(@PathVariable Long doctorId) {
        return visitService.getVisitsByDoctor(doctorId)
                .stream()
                .map(this::toResponseWithTriage)
                .toList();
    }
    @ExceptionHandler(IllegalStateException.class)
    public org.springframework.http.ResponseEntity<String> handleIllegalState(IllegalStateException e) {
        return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
    }
    private VisitResponse toResponseWithTriage(Visit visit) {
        VisitResponse response = visitMapper.toResponse(visit);

        preformRepository.findByVisitId(visit.getId())
                .ifPresent(preform ->
                        response.setTriageColor(
                                preform.getTriageColor() != null
                                        ? preform.getTriageColor().name()
                                        : null
                        )
                );

        return response;
    }

}
