package com.licenta.backend_upu.mapper;

import com.licenta.backend_upu.dto.DischargeFormResponse;
import com.licenta.backend_upu.dto.DischargeFormUpsertRequest;
import com.licenta.backend_upu.entity.*;
import org.springframework.stereotype.Component;

@Component
public class DischargeFormMapper {
    public void applyToEntity(DischargeFormUpsertRequest req, DischargeForm e){
        e.setHospitalName(req.getHospitalName());
        e.setSectionName(req.getSectionName());
        e.setFoNumber(req.getFoNumber());

        e.setAdmissionDateTime(req.getAdmissionDateTime());
        e.setDischargeDateTime(req.getDischargeDateTime());

        e.setFirstName(req.getFirstName());
        e.setLastName(req.getLastName());
        e.setCnp(req.getCnp());
        e.setBirthDate(req.getBirthDate());
        e.setSex(req.getSex());

        e.setCounty(req.getCounty());
        e.setLocality(req.getLocality());

        e.setOccupation(req.getOccupation());

        if(req.getCitizenshipType()!=null){
            e.setCitizenshipType(CitizenshipType.valueOf(req.getCitizenshipType().toUpperCase()));
        }
        e.setCitizenshipCountry(req.getCitizenshipCountry());

        if(req.getInsuranceStatus()!=null){
            e.setInsuranceStatus(InsuranceStatus.valueOf(req.getInsuranceStatus().toUpperCase()));
        }
        if(req.getAdmissionType()!=null){
            e.setAdmissionType(AdmissionType.valueOf(req.getAdmissionType().toUpperCase()));
        }
        if (req.getHospitalizationOutcome() != null) {
            e.setHospitalizationOutcome(HospitalizationOutcome.valueOf(req.getHospitalizationOutcome().toUpperCase()));
        }
        if (req.getDischargeType() != null) {
            e.setDischargeType(DischargeType.valueOf(req.getDischargeType().toUpperCase()));
        }
        e.setDiagnosisAtAdmission(req.getDiagnosisAtAdmission());
        e.setDiagnosisAtDischarge(req.getDiagnosisAtDischarge());
        e.setTreatmentAndRecommendations(req.getTreatmentAndRecommendations());

        e.setDetails(req.getDetails());
    }
    public DischargeFormResponse toResponse(DischargeForm e){
        DischargeFormResponse r=new DischargeFormResponse();
        r.setId(e.getId());
        r.setVisitId(e.getVisit().getId());

        r.setHospitalName(e.getHospitalName());
        r.setSectionName(e.getSectionName());
        r.setFoNumber(e.getFoNumber());

        r.setAdmissionDateTime(e.getAdmissionDateTime());
        r.setDischargeDateTime(e.getDischargeDateTime());

        r.setFirstName(e.getFirstName());
        r.setLastName(e.getLastName());
        r.setCnp(e.getCnp());
        r.setBirthDate(e.getBirthDate());
        r.setSex(e.getSex());

        r.setCounty(e.getCounty());
        r.setLocality(e.getLocality());

        r.setOccupation(e.getOccupation());

        r.setCitizenshipType(e.getCitizenshipType() != null ? e.getCitizenshipType().name() : null);
        r.setCitizenshipCountry(e.getCitizenshipCountry());

        r.setInsuranceStatus(e.getInsuranceStatus() != null ? e.getInsuranceStatus().name() : null);
        r.setAdmissionType(e.getAdmissionType() != null ? e.getAdmissionType().name() : null);
        r.setHospitalizationOutcome(e.getHospitalizationOutcome() != null ? e.getHospitalizationOutcome().name() : null);
        r.setDischargeType(e.getDischargeType() != null ? e.getDischargeType().name() : null);

        r.setDiagnosisAtAdmission(e.getDiagnosisAtAdmission());
        r.setDiagnosisAtDischarge(e.getDiagnosisAtDischarge());
        r.setTreatmentAndRecommendations(e.getTreatmentAndRecommendations());

        r.setDetails(e.getDetails());

        r.setCreatedAt(e.getCreatedAt());
        r.setUpdatedAt(e.getUpdatedAt());
        return r;

    }

}
