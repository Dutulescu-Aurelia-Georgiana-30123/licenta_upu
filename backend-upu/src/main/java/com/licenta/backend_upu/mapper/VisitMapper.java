package com.licenta.backend_upu.mapper;

import com.licenta.backend_upu.dto.VisitResponse;
import com.licenta.backend_upu.entity.Visit;
import org.springframework.stereotype.Component;

@Component
public class VisitMapper {
    public VisitResponse toResponse(Visit visit) {
        VisitResponse response = new VisitResponse();

        response.setId(visit.getId());
        response.setVisitCode(visit.getVisitCode());

        response.setPatientId(visit.getPatient().getId());
        response.setPatientFirstName(visit.getPatient().getFirstName());
        response.setPatientLastName(visit.getPatient().getLastName());

        response.setStatus(visit.getStatus().name());
        response.setCreatedAt(visit.getCreatedAt());

        if (visit.getDoctor() != null) {
            response.setDoctorId(visit.getDoctor().getId());
            response.setDoctorEmail(visit.getDoctor().getEmail());
            response.setDoctorFirstName(visit.getDoctor().getFirstName());
            response.setDoctorLastName(visit.getDoctor().getLastName());
        }

        if (visit.getNurse() != null) {
            response.setNurseId(visit.getNurse().getId());
            response.setNurseEmail(visit.getNurse().getEmail());
            response.setNurseFirstName(visit.getNurse().getFirstName());
            response.setNurseLastName(visit.getNurse().getLastName());
        }

        return response;
    }
}