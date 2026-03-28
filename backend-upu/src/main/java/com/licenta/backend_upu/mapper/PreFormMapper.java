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
        e.setSheetNumber(req.getSheetNumber());
        e.setPresentationDate(req.getPresentationDate());
        e.setPresentationTime(req.getPresentationTime());
        e.setTakenOverBy(req.getTakenOverBy());

        e.setAge(req.getAge());
        e.setPhoneNumber(req.getPhoneNumber());
        e.setEmail(req.getEmail());
        e.setCounty(req.getCounty());
        e.setLocality(req.getLocality());
        e.setStreet(req.getStreet());
        e.setStreetNumber(req.getStreetNumber());
        e.setBuilding(req.getBuilding());
        e.setStaircase(req.getStaircase());
        e.setFloor(req.getFloor());
        e.setApartment(req.getApartment());

        e.setPatientStateCode(req.getPatientStateCode());

        e.setGcsHour(req.getGcsHour());
        e.setGcsM(req.getGcsM());
        e.setGcsV(req.getGcsV());
        e.setGcsO(req.getGcsO());

        e.setBroughtByCode(req.getBroughtByCode());
        e.setBroughtByOther(req.getBroughtByOther());

        e.setBroughtFromCode(req.getBroughtFromCode());
        e.setBroughtFromOther(req.getBroughtFromOther());

        e.setPickupDeceased(req.getPickupDeceased());
        e.setPickupStopCr(req.getPickupStopCr());
        e.setPickupResuscitationInProgress(req.getPickupResuscitationInProgress());
        e.setPickupTrauma(req.getPickupTrauma());
        e.setResuscitationHour(req.getResuscitationHour());
        e.setResuscitationSuccessful(req.getResuscitationSuccessful());
        e.setResuscitationFailed(req.getResuscitationFailed());
        e.setDeathHour(req.getDeathHour());
        e.setResuscitationNotStartedReason(req.getResuscitationNotStartedReason());

        e.setAv(req.getAv());
        e.setTrc(req.getTrc());
        e.setHistoryCardiac(req.getHistoryCardiac());
        e.setHistoryNeurologic(req.getHistoryNeurologic());
        e.setHistoryRenal(req.getHistoryRenal());
        e.setHistoryPulmonary(req.getHistoryPulmonary());
        e.setHistoryTbc(req.getHistoryTbc());
        e.setHistoryHepatic(req.getHistoryHepatic());
        e.setHistoryGastric(req.getHistoryGastric());
        e.setHistoryDiabetes(req.getHistoryDiabetes());
        e.setHistoryInfectious(req.getHistoryInfectious());
        e.setHistoryStd(req.getHistoryStd());
        e.setHistoryOther(req.getHistoryOther());

        e.setAnamnesis(req.getAnamnesis());

        e.setHeightCm(req.getHeightCm());
        e.setWeightKg(req.getWeightKg());
        e.setTriageFever(req.getTriageFever());
        e.setTriageAsthenia(req.getTriageAsthenia());
        e.setTriageDizziness(req.getTriageDizziness());

        e.setEyeAcuteVisionLoss(req.getEyeAcuteVisionLoss());
        e.setEyeVisionDisorders(req.getEyeVisionDisorders());
        e.setEyeForeignBody(req.getEyeForeignBody());
        e.setEyeOtherManifestations(req.getEyeOtherManifestations());

        e.setBurnAirwayAffected(req.getBurnAirwayAffected());
        e.setBurnFlame(req.getBurnFlame());
        e.setBurnSolid(req.getBurnSolid());
        e.setBurnLiquid(req.getBurnLiquid());
        e.setBurnVaporsGas(req.getBurnVaporsGas());
        e.setBurnChemical(req.getBurnChemical());

        e.setChestPain(req.getChestPain());
        e.setDyspnea(req.getDyspnea());
        e.setHemoptysis(req.getHemoptysis());
        e.setCough(req.getCough());
        e.setExpectoration(req.getExpectoration());

        e.setPsychDepression(req.getPsychDepression());
        e.setPsychBehaviorDisorder(req.getPsychBehaviorDisorder());
        e.setPsychSuicide(req.getPsychSuicide());
        e.setPsychHallucinations(req.getPsychHallucinations());
        e.setPsychDelirium(req.getPsychDelirium());

        e.setGiNausea(req.getGiNausea());
        e.setGiVomiting(req.getGiVomiting());
        e.setGiTransitDisorders(req.getGiTransitDisorders());
        e.setGiRectorrhagia(req.getGiRectorrhagia());
        e.setGiMelena(req.getGiMelena());
        e.setGiHematemesis(req.getGiHematemesis());
        e.setGiAbdominalPain(req.getGiAbdominalPain());

        e.setNeuroConvulsions(req.getNeuroConvulsions());
        e.setNeuroMyoclonus(req.getNeuroMyoclonus());
        e.setNeuroHeadache(req.getNeuroHeadache());
        e.setNeuroParalysis(req.getNeuroParalysis());

        e.setGuUrinationDisorders(req.getGuUrinationDisorders());
        e.setGuDysuria(req.getGuDysuria());
        e.setGuPollakiuria(req.getGuPollakiuria());
        e.setGuOliguria(req.getGuOliguria());
        e.setGuHematuria(req.getGuHematuria());
        e.setGuVaginalBleeding(req.getGuVaginalBleeding());
        e.setGuPregnancy(req.getGuPregnancy());

        e.setSkinWarm(req.getSkinWarm());
        e.setSkinCold(req.getSkinCold());
        e.setSkinWet(req.getSkinWet());
        e.setSkinPale(req.getSkinPale());
        e.setSkinCyanotic(req.getSkinCyanotic());
        e.setSkinJaundice(req.getSkinJaundice());
        e.setSkinEcchymosis(req.getSkinEcchymosis());
        e.setSkinRash(req.getSkinRash());
        e.setSkinPruritus(req.getSkinPruritus());
        e.setSkinBurns(req.getSkinBurns());

        e.setLocomotorInflammation(req.getLocomotorInflammation());
        e.setLocomotorSwelling(req.getLocomotorSwelling());
        e.setLocomotorPain(req.getLocomotorPain());
        e.setLocomotorFunctionalImpairment(req.getLocomotorFunctionalImpairment());
        e.setLocomotorHematoma(req.getLocomotorHematoma());

        e.setAllergies(req.getAllergies());

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
        r.setSheetNumber(e.getSheetNumber());
        r.setPresentationDate(e.getPresentationDate());
        r.setPresentationTime(e.getPresentationTime());
        r.setTakenOverBy(e.getTakenOverBy());

        r.setAge(e.getAge());
        r.setPhoneNumber(e.getPhoneNumber());
        r.setEmail(e.getEmail());
        r.setCounty(e.getCounty());
        r.setLocality(e.getLocality());
        r.setStreet(e.getStreet());
        r.setStreetNumber(e.getStreetNumber());
        r.setBuilding(e.getBuilding());
        r.setStaircase(e.getStaircase());
        r.setFloor(e.getFloor());
        r.setApartment(e.getApartment());

        r.setPatientStateCode(e.getPatientStateCode());

        r.setGcsHour(e.getGcsHour());
        r.setGcsM(e.getGcsM());
        r.setGcsV(e.getGcsV());
        r.setGcsO(e.getGcsO());

        r.setBroughtByCode(e.getBroughtByCode());
        r.setBroughtByOther(e.getBroughtByOther());

        r.setBroughtFromCode(e.getBroughtFromCode());
        r.setBroughtFromOther(e.getBroughtFromOther());

        r.setPickupDeceased(e.getPickupDeceased());
        r.setPickupStopCr(e.getPickupStopCr());
        r.setPickupResuscitationInProgress(e.getPickupResuscitationInProgress());
        r.setPickupTrauma(e.getPickupTrauma());
        r.setResuscitationHour(e.getResuscitationHour());
        r.setResuscitationSuccessful(e.getResuscitationSuccessful());
        r.setResuscitationFailed(e.getResuscitationFailed());
        r.setDeathHour(e.getDeathHour());
        r.setResuscitationNotStartedReason(e.getResuscitationNotStartedReason());

        r.setAv(e.getAv());
        r.setTrc(e.getTrc());
        r.setHistoryCardiac(e.getHistoryCardiac());
        r.setHistoryNeurologic(e.getHistoryNeurologic());
        r.setHistoryRenal(e.getHistoryRenal());
        r.setHistoryPulmonary(e.getHistoryPulmonary());
        r.setHistoryTbc(e.getHistoryTbc());
        r.setHistoryHepatic(e.getHistoryHepatic());
        r.setHistoryGastric(e.getHistoryGastric());
        r.setHistoryDiabetes(e.getHistoryDiabetes());
        r.setHistoryInfectious(e.getHistoryInfectious());
        r.setHistoryStd(e.getHistoryStd());
        r.setHistoryOther(e.getHistoryOther());

        r.setAnamnesis(e.getAnamnesis());

        r.setHeightCm(e.getHeightCm());
        r.setWeightKg(e.getWeightKg());
        r.setTriageFever(e.getTriageFever());
        r.setTriageAsthenia(e.getTriageAsthenia());
        r.setTriageDizziness(e.getTriageDizziness());

        r.setEyeAcuteVisionLoss(e.getEyeAcuteVisionLoss());
        r.setEyeVisionDisorders(e.getEyeVisionDisorders());
        r.setEyeForeignBody(e.getEyeForeignBody());
        r.setEyeOtherManifestations(e.getEyeOtherManifestations());

        r.setBurnAirwayAffected(e.getBurnAirwayAffected());
        r.setBurnFlame(e.getBurnFlame());
        r.setBurnSolid(e.getBurnSolid());
        r.setBurnLiquid(e.getBurnLiquid());
        r.setBurnVaporsGas(e.getBurnVaporsGas());
        r.setBurnChemical(e.getBurnChemical());

        r.setChestPain(e.getChestPain());
        r.setDyspnea(e.getDyspnea());
        r.setHemoptysis(e.getHemoptysis());
        r.setCough(e.getCough());
        r.setExpectoration(e.getExpectoration());

        r.setPsychDepression(e.getPsychDepression());
        r.setPsychBehaviorDisorder(e.getPsychBehaviorDisorder());
        r.setPsychSuicide(e.getPsychSuicide());
        r.setPsychHallucinations(e.getPsychHallucinations());
        r.setPsychDelirium(e.getPsychDelirium());

        r.setGiNausea(e.getGiNausea());
        r.setGiVomiting(e.getGiVomiting());
        r.setGiTransitDisorders(e.getGiTransitDisorders());
        r.setGiRectorrhagia(e.getGiRectorrhagia());
        r.setGiMelena(e.getGiMelena());
        r.setGiHematemesis(e.getGiHematemesis());
        r.setGiAbdominalPain(e.getGiAbdominalPain());

        r.setNeuroConvulsions(e.getNeuroConvulsions());
        r.setNeuroMyoclonus(e.getNeuroMyoclonus());
        r.setNeuroHeadache(e.getNeuroHeadache());
        r.setNeuroParalysis(e.getNeuroParalysis());

        r.setGuUrinationDisorders(e.getGuUrinationDisorders());
        r.setGuDysuria(e.getGuDysuria());
        r.setGuPollakiuria(e.getGuPollakiuria());
        r.setGuOliguria(e.getGuOliguria());
        r.setGuHematuria(e.getGuHematuria());
        r.setGuVaginalBleeding(e.getGuVaginalBleeding());
        r.setGuPregnancy(e.getGuPregnancy());

        r.setSkinWarm(e.getSkinWarm());
        r.setSkinCold(e.getSkinCold());
        r.setSkinWet(e.getSkinWet());
        r.setSkinPale(e.getSkinPale());
        r.setSkinCyanotic(e.getSkinCyanotic());
        r.setSkinJaundice(e.getSkinJaundice());
        r.setSkinEcchymosis(e.getSkinEcchymosis());
        r.setSkinRash(e.getSkinRash());
        r.setSkinPruritus(e.getSkinPruritus());
        r.setSkinBurns(e.getSkinBurns());

        r.setLocomotorInflammation(e.getLocomotorInflammation());
        r.setLocomotorSwelling(e.getLocomotorSwelling());
        r.setLocomotorPain(e.getLocomotorPain());
        r.setLocomotorFunctionalImpairment(e.getLocomotorFunctionalImpairment());
        r.setLocomotorHematoma(e.getLocomotorHematoma());

        r.setAllergies(e.getAllergies());
        return r;
    }

}
