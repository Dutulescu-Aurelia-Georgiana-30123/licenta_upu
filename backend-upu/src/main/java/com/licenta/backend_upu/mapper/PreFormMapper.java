package com.licenta.backend_upu.mapper;

import com.licenta.backend_upu.dto.PreFormResponse;
import com.licenta.backend_upu.dto.PreFormUpsertRequest;
import com.licenta.backend_upu.entity.*;
import org.springframework.stereotype.Component;

@Component
public class PreFormMapper {
    public void applyToEntity(PreFormUpsertRequest req, PreHospitalizationForm e) {
        e.setFirstName(req.getFirstName());
        e.setLastName(req.getLastName());
        e.setCnp(req.getCnp());
        e.setBirthDate(req.getBirthDate());
        e.setSex(req.getSex());

        if (req.getTriageColor() != null) {
            e.setTriageColor(TriageColor.valueOf(req.getTriageColor().toUpperCase()));
        }
        if (req.getArrivalMode() != null) {
            e.setArrivalMode(ArrivalMode.valueOf(req.getArrivalMode().toUpperCase()));
        }

        e.setReason(req.getReason());

        e.setGcs(req.getGcs());
        e.setRespiratoryRate(req.getRespiratoryRate());
        e.setPulse(req.getPulse());
        e.setSystolicBp(req.getSystolicBp());
        e.setDiastolicBp(req.getDiastolicBp());
        e.setSpo2(req.getSpo2());
        e.setTemperature(req.getTemperature());
        e.setGlycemia(req.getGlycemia());

        if (req.getOutcome() != null) {
            e.setOutcome(PatientOutcome.valueOf(req.getOutcome().toUpperCase()));
        }
        if (req.getHandoverTo() != null) {
            e.setHandoverTo(HandoverTo.valueOf(req.getHandoverTo().toUpperCase()));
        }

        e.setDetails(req.getDetails());
    }

    public PreFormResponse toResponse(PreHospitalizationForm e) {
        PreFormResponse r = new PreFormResponse();
        r.setId(e.getId());
        r.setVisitId(e.getVisit().getId());

        r.setFirstName(e.getFirstName());
        r.setLastName(e.getLastName());
        r.setCnp(e.getCnp());
        r.setBirthDate(e.getBirthDate());
        r.setSex(e.getSex());

        r.setTriageColor(e.getTriageColor() != null ? e.getTriageColor().name() : null);
        r.setArrivalMode(e.getArrivalMode() != null ? e.getArrivalMode().name() : null);


        r.setReason(e.getReason());

        r.setGcs(e.getGcs());
        r.setRespiratoryRate(e.getRespiratoryRate());
        r.setPulse(e.getPulse());
        r.setSystolicBp(e.getSystolicBp());
        r.setDiastolicBp(e.getDiastolicBp());
        r.setSpo2(e.getSpo2());
        r.setTemperature(e.getTemperature());
        r.setGlycemia(e.getGlycemia());

        r.setOutcome(e.getOutcome() != null ? e.getOutcome().name() : null);
        r.setHandoverTo(e.getHandoverTo() != null ? e.getHandoverTo().name() : null);
        r.setDetails(e.getDetails());

        r.setCreatedAt(e.getCreatedAt());
        r.setUpdatedAt(e.getUpdatedAt());
        return r;
    }

}
