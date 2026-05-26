package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.AssignDoctorRequest;
import com.licenta.backend_upu.dto.VisitCreateRequest;
import com.licenta.backend_upu.dto.VisitResponse;
import com.licenta.backend_upu.dto.VisitStatusUpdateRequest;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.mapper.VisitMapper;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;
import com.licenta.backend_upu.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        return toResponsesWithTriage(visitService.getAllVisits());
    }

    @PutMapping("/{id}/status")
    public VisitResponse updateVisitStatus(
            @PathVariable Long id,
            @RequestBody VisitStatusUpdateRequest request
    ) {
        Visit updated = visitService.updateVisistStatus(id, request.getStatus());
        return visitMapper.toResponse(updated);
    }

    @GetMapping("/patient/{patientId}")
    public List<VisitResponse> getVisitsByPatient(@PathVariable Long patientId) {
        return toResponsesWithTriage(visitService.getVisitByPatient(patientId));
    }

    @PutMapping("/{id}/assign-doctor")
    public VisitResponse assignDoctorToVisit(
            @PathVariable Long id,
            @RequestBody AssignDoctorRequest request
    ) {
        Visit updated = visitService.assignDoctorToVisit(id, request.getDoctorId());
        return visitMapper.toResponse(updated);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<VisitResponse> getVisitsByDoctor(@PathVariable Long doctorId) {
        return toResponsesWithTriage(visitService.getVisitsByDoctor(doctorId));
    }

    @GetMapping("/by-cnp/{cnp}/active")
    public VisitResponse getActiveVisitByCnp(@PathVariable String cnp) {
        Visit visit = visitService.getActiveVisitByPatientCnp(cnp);

        if (visit == null) {
            return null;
        }

        List<VisitResponse> responses = toResponsesWithTriage(List.of(visit));

        return responses.isEmpty() ? null : responses.get(0);
    }

    @GetMapping("/by-cnp/{cnp}")
    public List<VisitResponse> getVisitsByCnp(@PathVariable String cnp) {
        return toResponsesWithTriage(visitService.getVisitsByPatientCnp(cnp));
    }

    @ExceptionHandler(IllegalStateException.class)
    public org.springframework.http.ResponseEntity<String> handleIllegalState(IllegalStateException e) {
        return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
    }

    @PutMapping("/{id}/assign-nurse")
    public VisitResponse assignNurseToVisit(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request
    ) {
        Visit updated = visitService.assignNurseToVisit(id, request.get("nurseId"));
        return visitMapper.toResponse(updated);
    }

    @GetMapping("/nurse/{nurseId}")
    public List<VisitResponse> getVisitsByNurse(@PathVariable Long nurseId) {
        return toResponsesWithTriage(visitService.getVisitsByNurse(nurseId));
    }

    private List<VisitResponse> toResponsesWithTriage(List<Visit> visits) {
        if (visits == null || visits.isEmpty()) {
            return List.of();
        }

        List<Long> visitIds = visits.stream()
                .map(Visit::getId)
                .toList();

        Map<Long, PreHospitalizationFormRepository.VisitTriageRow> preformByVisitId =
                preformRepository.findTriageColorsByVisitIds(visitIds)
                        .stream()
                        .collect(Collectors.toMap(
                                PreHospitalizationFormRepository.VisitTriageRow::getVisit_id,
                                row -> row
                        ));

        return visits.stream()
                .map(visit -> {
                    VisitResponse response = visitMapper.toResponse(visit);

                    PreHospitalizationFormRepository.VisitTriageRow row =
                            preformByVisitId.get(visit.getId());

                    if (row != null) {
                        response.setTriageColor(row.getTriage_color());
                        response.setPresentationReason(row.getReason());
                    }

                    return response;
                })
                .toList();
    }
}