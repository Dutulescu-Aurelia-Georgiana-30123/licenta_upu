package com.licenta.backend_upu.mapper;


import com.licenta.backend_upu.dto.PatientCreateRequest;
import com.licenta.backend_upu.dto.PatientResponse;
import com.licenta.backend_upu.entity.Patient;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {
    public Patient toEntity(PatientCreateRequest request) {
        Patient p = new Patient();
        p.setFirstName(request.getFirstName());
        p.setLastName(request.getLastName());
        p.setPhoneNumber(request.getPhoneNumber());
        p.setCnp(request.getCnp());
        return p;
    }

    public PatientResponse toResponse(Patient patient) {
        PatientResponse r = new PatientResponse();
        r.setId(patient.getId());
        r.setFirstName(patient.getFirstName());
        r.setLastName(patient.getLastName());
        r.setPhoneNumber(patient.getPhoneNumber());
        return r;
    }
}

