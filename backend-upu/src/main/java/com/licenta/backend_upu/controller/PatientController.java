package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.PatientCreateRequest;
import com.licenta.backend_upu.dto.PatientResponse;
import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.mapper.PatientMapper;
import com.licenta.backend_upu.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    private final PatientMapper patientMapper;

    @PostMapping
    public PatientResponse createPatient(@RequestBody PatientCreateRequest request){
        Patient saved=patientService.savePatient(patientMapper.toEntity(request));
        return patientMapper.toResponse(saved);
    }

    @GetMapping
    public List<PatientResponse> getAllPatients() {
        return patientService.getAllPatients()
        .stream()
                .map(patientMapper::toResponse)
                .toList();
    }
}
