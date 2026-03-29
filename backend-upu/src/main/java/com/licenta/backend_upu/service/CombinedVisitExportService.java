package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.*;
import com.licenta.backend_upu.repository.DischargeFormRepository;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import com.licenta.backend_upu.util.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CombinedVisitExportService {
    @Value("${app.storage.base-path:storage}")
    private String basePath;

    private final VisitRepository visitRepository;
    private final PreHospitalizationFormRepository preRepo;
    private final DischargeFormRepository dischargeRepo;
    private final PdfExportService pdfExportService;
    private final ArchivedDocumentService archivedDocumentService;
    private final ObjectMapper objectMapper = new ObjectMapper();


    public ArchivedDocument exportCombined(Long visitId) throws IOException {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu exista: " + visitId));

        PreHospitalizationForm pre = preRepo.findByVisitId(visitId)
                .orElseThrow(() -> new RuntimeException("Nu exista fisa pre-spitalizare pentru vizita: " + visitId));

        DischargeForm dis = dischargeRepo.findByVisitId(visitId)
                .orElseThrow(() -> new RuntimeException("Nu exista fisa de externare pentru vizita: " + visitId));

        String fileName = "combined_visit_" + visitId + ".pdf";
        String storagePath = basePath + "/visit-" + visitId + "/" + fileName;
        File outputFile = new File(storagePath);

        Map<String, Object> preDetails = readDetails(pre.getDetails());
        Map<String, Object> disDetails = readDetails(dis.getDetails());

        List<String> preLinesList = new ArrayList<>();

        preLinesList.add("=== DATE GENERALE ===");
        preLinesList.add("Pacient: " + safe(pre.getFirstName()) + " " + safe(pre.getLastName()));
        preLinesList.add("CNP: " + safe(pre.getCnp()));
        preLinesList.add("Data nasterii: " + (pre.getBirthDate() != null ? pre.getBirthDate().toString() : ""));
        preLinesList.add("Sex: " + safe(pre.getSex()));
        preLinesList.add("Varsta: " + safeInt(pre.getAge()));
        preLinesList.add("Telefon: " + safe(pre.getPhoneNumber()));
        preLinesList.add("Email: " + safe(pre.getEmail()));
        preLinesList.add("Nr. fisa: " + safe(pre.getSheetNumber()));
        preLinesList.add("Data prezentarii: " + (pre.getPresentationDate() != null ? pre.getPresentationDate().toString() : ""));
        preLinesList.add("Ora prezentarii: " + safe(pre.getPresentationTime()));
        preLinesList.add("Preluat de: " + safe(pre.getTakenOverBy()));
        preLinesList.add("");

        preLinesList.add("=== ADRESA ===");
        preLinesList.add("Judet: " + safe(pre.getCounty()));
        preLinesList.add("Localitate: " + safe(pre.getLocality()));
        preLinesList.add("Strada: " + safe(pre.getStreet()));
        preLinesList.add("Nr: " + safe(pre.getStreetNumber()));
        preLinesList.add("Bloc: " + safe(pre.getBuilding()));
        preLinesList.add("Scara: " + safe(pre.getStaircase()));
        preLinesList.add("Etaj: " + safe(pre.getFloor()));
        preLinesList.add("Apartament: " + safe(pre.getApartment()));
        preLinesList.add("");

        preLinesList.add("=== STARE PACIENT ===");
        preLinesList.add("Cod stare pacient: " + safe(pre.getPatientStateCode()));
        preLinesList.add("Cod urgenta: " + (pre.getTriageColor() != null ? pre.getTriageColor().name() : ""));
        preLinesList.add("Arrival mode: " + (pre.getArrivalMode() != null ? pre.getArrivalMode().name() : ""));
        preLinesList.add("Motiv prezentare: " + safe(pre.getReason()));
        preLinesList.add("");

        preLinesList.add("=== GCS ===");
        preLinesList.add("Ora GCS: " + safe(pre.getGcsHour()));
        preLinesList.add("M: " + safeInt(pre.getGcsM()));
        preLinesList.add("V: " + safeInt(pre.getGcsV()));
        preLinesList.add("O: " + safeInt(pre.getGcsO()));
        preLinesList.add("GCS total: " + safeInt(pre.getGcs()));
        preLinesList.add("");

        preLinesList.add("=== ADUS DE ===");
        preLinesList.add("BroughtByCode: " + safe(pre.getBroughtByCode()));
        preLinesList.add("BroughtByOther: " + safe(pre.getBroughtByOther()));
        preLinesList.add("BroughtFromCode: " + safe(pre.getBroughtFromCode()));
        preLinesList.add("BroughtFromOther: " + safe(pre.getBroughtFromOther()));
        preLinesList.add("");

        preLinesList.add("=== FUNCTII VITALE LA PRELUARE ===");
        preLinesList.add("Pickup deceased: " + yesNo(pre.getPickupDeceased()));
        preLinesList.add("Pickup stop CR: " + yesNo(pre.getPickupStopCr()));
        preLinesList.add("Pickup resuscitation in progress: " + yesNo(pre.getPickupResuscitationInProgress()));
        preLinesList.add("Pickup trauma: " + yesNo(pre.getPickupTrauma()));
        preLinesList.add("Resuscitation hour: " + safe(pre.getResuscitationHour()));
        preLinesList.add("Resuscitation successful: " + yesNo(pre.getResuscitationSuccessful()));
        preLinesList.add("Resuscitation failed: " + yesNo(pre.getResuscitationFailed()));
        preLinesList.add("Death hour: " + safe(pre.getDeathHour()));
        preLinesList.add("Resuscitation not started reason: " + safe(pre.getResuscitationNotStartedReason()));
        preLinesList.add("");

        preLinesList.add("=== PARAMETRI ===");
        preLinesList.add("FR: " + safeInt(pre.getRespiratoryRate()));
        preLinesList.add("AV: " + safe(pre.getAv()));
        preLinesList.add("Puls: " + safeInt(pre.getPulse()));
        preLinesList.add("TA sistolica: " + safeInt(pre.getSystolicBp()));
        preLinesList.add("TA diastolica: " + safeInt(pre.getDiastolicBp()));
        preLinesList.add("SpO2: " + safeInt(pre.getSpo2()));
        preLinesList.add("Temperatura: " + safeDouble(pre.getTemperature()));
        preLinesList.add("Glicemie: " + safeInt(pre.getGlycemia()));
        preLinesList.add("TRC: " + safe(pre.getTrc()));
        preLinesList.add("");

        preLinesList.add("=== ANTECEDENTE ===");
        preLinesList.add("Cardiace: " + yesNo(pre.getHistoryCardiac()));
        preLinesList.add("Neurologice: " + yesNo(pre.getHistoryNeurologic()));
        preLinesList.add("Renale: " + yesNo(pre.getHistoryRenal()));
        preLinesList.add("Pulmonare: " + yesNo(pre.getHistoryPulmonary()));
        preLinesList.add("TBC: " + yesNo(pre.getHistoryTbc()));
        preLinesList.add("Hepatice: " + yesNo(pre.getHistoryHepatic()));
        preLinesList.add("Gastrice: " + yesNo(pre.getHistoryGastric()));
        preLinesList.add("Diabet: " + yesNo(pre.getHistoryDiabetes()));
        preLinesList.add("Infectioase: " + yesNo(pre.getHistoryInfectious()));
        preLinesList.add("STD: " + yesNo(pre.getHistoryStd()));
        preLinesList.add("Alte antecedente: " + safe(pre.getHistoryOther()));
        preLinesList.add("Anamneza: " + safe(pre.getAnamnesis()));
        preLinesList.add("");

        preLinesList.add("=== TRIAJ ===");
        preLinesList.add("Talie cm: " + safeInt(pre.getHeightCm()));
        preLinesList.add("Greutate kg: " + safeDouble(pre.getWeightKg()));
        preLinesList.add("Febra: " + yesNo(pre.getTriageFever()));
        preLinesList.add("Astenie: " + yesNo(pre.getTriageAsthenia()));
        preLinesList.add("Ameteli: " + yesNo(pre.getTriageDizziness()));
        preLinesList.add("");

        preLinesList.add("=== SIMPTOME VECHI ===");
        preLinesList.add("Eye acute vision loss: " + yesNo(pre.getEyeAcuteVisionLoss()));
        preLinesList.add("Eye vision disorders: " + yesNo(pre.getEyeVisionDisorders()));
        preLinesList.add("Eye foreign body: " + yesNo(pre.getEyeForeignBody()));
        preLinesList.add("Eye other manifestations: " + yesNo(pre.getEyeOtherManifestations()));

        preLinesList.add("Burn airway affected: " + yesNo(pre.getBurnAirwayAffected()));
        preLinesList.add("Burn flame: " + yesNo(pre.getBurnFlame()));
        preLinesList.add("Burn solid: " + yesNo(pre.getBurnSolid()));
        preLinesList.add("Burn liquid: " + yesNo(pre.getBurnLiquid()));
        preLinesList.add("Burn vapors gas: " + yesNo(pre.getBurnVaporsGas()));
        preLinesList.add("Burn chemical: " + yesNo(pre.getBurnChemical()));

        preLinesList.add("Chest pain: " + yesNo(pre.getChestPain()));
        preLinesList.add("Dyspnea: " + yesNo(pre.getDyspnea()));
        preLinesList.add("Hemoptysis: " + yesNo(pre.getHemoptysis()));
        preLinesList.add("Cough: " + yesNo(pre.getCough()));
        preLinesList.add("Expectoration: " + yesNo(pre.getExpectoration()));

        preLinesList.add("Psych depression: " + yesNo(pre.getPsychDepression()));
        preLinesList.add("Psych behavior disorder: " + yesNo(pre.getPsychBehaviorDisorder()));
        preLinesList.add("Psych suicide: " + yesNo(pre.getPsychSuicide()));
        preLinesList.add("Psych hallucinations: " + yesNo(pre.getPsychHallucinations()));
        preLinesList.add("Psych delirium: " + yesNo(pre.getPsychDelirium()));

        preLinesList.add("GI nausea: " + yesNo(pre.getGiNausea()));
        preLinesList.add("GI vomiting: " + yesNo(pre.getGiVomiting()));
        preLinesList.add("GI transit disorders: " + yesNo(pre.getGiTransitDisorders()));
        preLinesList.add("GI rectorrhagia: " + yesNo(pre.getGiRectorrhagia()));
        preLinesList.add("GI melena: " + yesNo(pre.getGiMelena()));
        preLinesList.add("GI hematemesis: " + yesNo(pre.getGiHematemesis()));
        preLinesList.add("GI abdominal pain: " + yesNo(pre.getGiAbdominalPain()));

        preLinesList.add("Neuro convulsions: " + yesNo(pre.getNeuroConvulsions()));
        preLinesList.add("Neuro myoclonus: " + yesNo(pre.getNeuroMyoclonus()));
        preLinesList.add("Neuro headache: " + yesNo(pre.getNeuroHeadache()));
        preLinesList.add("Neuro paralysis: " + yesNo(pre.getNeuroParalysis()));

        preLinesList.add("GU urination disorders: " + yesNo(pre.getGuUrinationDisorders()));
        preLinesList.add("GU dysuria: " + yesNo(pre.getGuDysuria()));
        preLinesList.add("GU pollakiuria: " + yesNo(pre.getGuPollakiuria()));
        preLinesList.add("GU oliguria: " + yesNo(pre.getGuOliguria()));
        preLinesList.add("GU hematuria: " + yesNo(pre.getGuHematuria()));
        preLinesList.add("GU vaginal bleeding: " + yesNo(pre.getGuVaginalBleeding()));
        preLinesList.add("GU pregnancy: " + yesNo(pre.getGuPregnancy()));

        preLinesList.add("Skin warm: " + yesNo(pre.getSkinWarm()));
        preLinesList.add("Skin cold: " + yesNo(pre.getSkinCold()));
        preLinesList.add("Skin wet: " + yesNo(pre.getSkinWet()));
        preLinesList.add("Skin pale: " + yesNo(pre.getSkinPale()));
        preLinesList.add("Skin cyanotic: " + yesNo(pre.getSkinCyanotic()));
        preLinesList.add("Skin jaundice: " + yesNo(pre.getSkinJaundice()));
        preLinesList.add("Skin ecchymosis: " + yesNo(pre.getSkinEcchymosis()));
        preLinesList.add("Skin rash: " + yesNo(pre.getSkinRash()));
        preLinesList.add("Skin pruritus: " + yesNo(pre.getSkinPruritus()));
        preLinesList.add("Skin burns: " + yesNo(pre.getSkinBurns()));

        preLinesList.add("Locomotor inflammation: " + yesNo(pre.getLocomotorInflammation()));
        preLinesList.add("Locomotor swelling: " + yesNo(pre.getLocomotorSwelling()));
        preLinesList.add("Locomotor pain: " + yesNo(pre.getLocomotorPain()));
        preLinesList.add("Locomotor functional impairment: " + yesNo(pre.getLocomotorFunctionalImpairment()));
        preLinesList.add("Locomotor hematoma: " + yesNo(pre.getLocomotorHematoma()));

        preLinesList.add("Allergii: " + safe(pre.getAllergies()));
        preLinesList.add("Outcome: " + (pre.getOutcome() != null ? pre.getOutcome().name() : ""));
        preLinesList.add("HandoverTo: " + (pre.getHandoverTo() != null ? pre.getHandoverTo().name() : ""));
        preLinesList.add("");

        preLinesList.add("=== DETAILS JSON - EXAMEN OBIECTIV / CAMPURI NOI ===");
        addDetail(preLinesList, "objectiveGeneralState", preDetails);
        addDetail(preLinesList, "headNormal", preDetails);
        addDetail(preLinesList, "headTraumaMark", preDetails);
        addDetail(preLinesList, "headOralLesions", preDetails);
        addDetail(preLinesList, "headDentalLesions", preDetails);
        addDetail(preLinesList, "neckNormal", preDetails);
        addDetail(preLinesList, "neckTraumaMark", preDetails);
        addDetail(preLinesList, "neckPalpableFormations", preDetails);
        addDetail(preLinesList, "neckOther", preDetails);
        addDetail(preLinesList, "noseNostrilsNormal", preDetails);
        addDetail(preLinesList, "noseMucosaNormal", preDetails);
        addDetail(preLinesList, "noseOther", preDetails);
        addDetail(preLinesList, "noseEpistaxisLeft", preDetails);
        addDetail(preLinesList, "noseEpistaxisRight", preDetails);
        addDetail(preLinesList, "noseForeignBodyLeft", preDetails);
        addDetail(preLinesList, "noseForeignBodyRight", preDetails);
        addDetail(preLinesList, "noseTraumaLeft", preDetails);
        addDetail(preLinesList, "noseTraumaRight", preDetails);
        addDetail(preLinesList, "earTympanicMembraneNormal", preDetails);
        addDetail(preLinesList, "earExternalCanalsNormal", preDetails);
        addDetail(preLinesList, "earAuricleNormal", preDetails);
        addDetail(preLinesList, "earOther", preDetails);
        addDetail(preLinesList, "earOtorrhagiaLeft", preDetails);
        addDetail(preLinesList, "earOtorrhagiaRight", preDetails);
        addDetail(preLinesList, "earForeignBodyLeft", preDetails);
        addDetail(preLinesList, "earForeignBodyRight", preDetails);
        addDetail(preLinesList, "earHemotympanumLeft", preDetails);
        addDetail(preLinesList, "earHemotympanumRight", preDetails);
        addDetail(preLinesList, "earTraumaLeft", preDetails);
        addDetail(preLinesList, "earTraumaRight", preDetails);
        addDetail(preLinesList, "eyeMobilityNormal", preDetails);
        addDetail(preLinesList, "eyePupilsNormal", preDetails);
        addDetail(preLinesList, "eyeExamOther", preDetails);
        addDetail(preLinesList, "eyeConjunctivitisLeft", preDetails);
        addDetail(preLinesList, "eyeConjunctivitisRight", preDetails);
        addDetail(preLinesList, "eyeMydriasisLeft", preDetails);
        addDetail(preLinesList, "eyeMydriasisRight", preDetails);
        addDetail(preLinesList, "eyeMiosisLeft", preDetails);
        addDetail(preLinesList, "eyeMiosisRight", preDetails);
        addDetail(preLinesList, "eyeNystagmusLeft", preDetails);
        addDetail(preLinesList, "eyeNystagmusRight", preDetails);
        addDetail(preLinesList, "eyeDeviationLeft", preDetails);
        addDetail(preLinesList, "eyeDeviationRight", preDetails);
        addDetail(preLinesList, "eyeTraumaExamLeft", preDetails);
        addDetail(preLinesList, "eyeTraumaExamRight", preDetails);
        addDetail(preLinesList, "cvRhythmNormal", preDetails);
        addDetail(preLinesList, "cvPeripheralPulseNormal", preDetails);
        addDetail(preLinesList, "cvHeartAuscultationNormal", preDetails);
        addDetail(preLinesList, "cvIrregularPulse", preDetails);
        addDetail(preLinesList, "cvFiliformPeripheralPulse", preDetails);
        addDetail(preLinesList, "cvPulseDeficit", preDetails);
        addDetail(preLinesList, "cvArrhythmicSounds", preDetails);
        addDetail(preLinesList, "cvMuffledSounds", preDetails);
        addDetail(preLinesList, "cvPericardialRub", preDetails);
        addDetail(preLinesList, "cvJugularTurgor", preDetails);
        addDetail(preLinesList, "cvSystolicMurmur", preDetails);
        addDetail(preLinesList, "cvDiastolicMurmur", preDetails);
        addDetail(preLinesList, "cvAorticMurmur", preDetails);
        addDetail(preLinesList, "cvGallop", preDetails);
        addDetail(preLinesList, "cvCarotidMurmur", preDetails);
        addDetail(preLinesList, "cvObservations", preDetails);
        addDetail(preLinesList, "respThoraxAspectNormal", preDetails);
        addDetail(preLinesList, "respThoraxPercussionNormal", preDetails);
        addDetail(preLinesList, "respVesicularBilateralNormal", preDetails);
        addDetail(preLinesList, "respOropharynxNormal", preDetails);
        addDetail(preLinesList, "respDiminishedMurmurLeft", preDetails);
        addDetail(preLinesList, "respDiminishedMurmurRight", preDetails);
        addDetail(preLinesList, "respAbsentMurmurLeft", preDetails);
        addDetail(preLinesList, "respAbsentMurmurRight", preDetails);
        addDetail(preLinesList, "respWheezingRalesLeft", preDetails);
        addDetail(preLinesList, "respWheezingRalesRight", preDetails);
        addDetail(preLinesList, "respCrepitantRalesLeft", preDetails);
        addDetail(preLinesList, "respCrepitantRalesRight", preDetails);
        addDetail(preLinesList, "respSubcrepitantRalesLeft", preDetails);
        addDetail(preLinesList, "respSubcrepitantRalesRight", preDetails);
        addDetail(preLinesList, "respIntercostalRetractionLeft", preDetails);
        addDetail(preLinesList, "respIntercostalRetractionRight", preDetails);
        addDetail(preLinesList, "respSubcutaneousEmphysemaLeft", preDetails);
        addDetail(preLinesList, "respSubcutaneousEmphysemaRight", preDetails);
        addDetail(preLinesList, "respTracheaDeviationLeft", preDetails);
        addDetail(preLinesList, "respTracheaDeviationRight", preDetails);
        addDetail(preLinesList, "respWheezing", preDetails);
        addDetail(preLinesList, "respOther", preDetails);
        addDetail(preLinesList, "abdomenNormal", preDetails);
        addDetail(preLinesList, "abdomenPalpation", preDetails);
        addDetail(preLinesList, "abdomenPercussion", preDetails);
        addDetail(preLinesList, "abdomenBowelTransit", preDetails);
        addDetail(preLinesList, "abdomenRectalExam", preDetails);
        addDetail(preLinesList, "abdomenDistended", preDetails);
        addDetail(preLinesList, "abdomenTransitAbsent", preDetails);
        addDetail(preLinesList, "abdomenHepatomegaly", preDetails);
        addDetail(preLinesList, "abdomenSplenomegaly", preDetails);
        addDetail(preLinesList, "abdomenPalpableMass", preDetails);
        addDetail(preLinesList, "abdomenTenderness", preDetails);
        addDetail(preLinesList, "abdomenRectalPositive", preDetails);
        addDetail(preLinesList, "abdomenPeritonealIrritation", preDetails);
        addDetail(preLinesList, "abdomenObservations", preDetails);
        addDetail(preLinesList, "skinExamNormal", preDetails);
        addDetail(preLinesList, "skinExamWarm", preDetails);
        addDetail(preLinesList, "skinExamCold", preDetails);
        addDetail(preLinesList, "skinExamWet", preDetails);
        addDetail(preLinesList, "skinExamDry", preDetails);
        addDetail(preLinesList, "skinExamPruritus", preDetails);
        addDetail(preLinesList, "skinExamExcoriations", preDetails);
        addDetail(preLinesList, "skinExamEcchymosis", preDetails);
        addDetail(preLinesList, "skinExamPetechiae", preDetails);
        addDetail(preLinesList, "skinExamPurpura", preDetails);
        addDetail(preLinesList, "skinExamJaundice", preDetails);
        addDetail(preLinesList, "skinExamWounds", preDetails);
        addDetail(preLinesList, "skinExamPale", preDetails);
        addDetail(preLinesList, "skinExamCyanosis", preDetails);
        addDetail(preLinesList, "skinExamSweaty", preDetails);
        addDetail(preLinesList, "skinExamOther", preDetails);
        addDetail(preLinesList, "skinExamLocation", preDetails);
        addDetail(preLinesList, "guExamNormal", preDetails);
        addDetail(preLinesList, "guExternalGenitals", preDetails);
        addDetail(preLinesList, "guRegularMenstruation", preDetails);
        addDetail(preLinesList, "guRectalExam", preDetails);
        addDetail(preLinesList, "guLastMenstruationDate", preDetails);
        addDetail(preLinesList, "guBloodyVaginalDischarge", preDetails);
        addDetail(preLinesList, "guLeucorrhea", preDetails);
        addDetail(preLinesList, "guCervixSensitivity", preDetails);
        addDetail(preLinesList, "guEnlargedUterus", preDetails);
        addDetail(preLinesList, "guLateroUterineMass", preDetails);
        addDetail(preLinesList, "guGiordanoLeft", preDetails);
        addDetail(preLinesList, "guGiordanoRight", preDetails);
        addDetail(preLinesList, "guTesticularSwellingLeft", preDetails);
        addDetail(preLinesList, "guTesticularSwellingRight", preDetails);
        addDetail(preLinesList, "guTesticularPainLeft", preDetails);
        addDetail(preLinesList, "guTesticularPainRight", preDetails);
        addDetail(preLinesList, "guBreastMassLeft", preDetails);
        addDetail(preLinesList, "guBreastMassRight", preDetails);
        addDetail(preLinesList, "guTraumaLeft", preDetails);
        addDetail(preLinesList, "guTraumaRight", preDetails);
        addDetail(preLinesList, "guExamHematuria", preDetails);
        addDetail(preLinesList, "guExamOther", preDetails);
        addDetail(preLinesList, "locomotorExamNormal", preDetails);
        addDetail(preLinesList, "locomotorHead", preDetails);
        addDetail(preLinesList, "locomotorNeck", preDetails);
        addDetail(preLinesList, "locomotorTrunk", preDetails);
        addDetail(preLinesList, "locomotorUpperLimbs", preDetails);
        addDetail(preLinesList, "locomotorLowerLimbs", preDetails);
        addDetail(preLinesList, "locomotorPulseCarotidLeft", preDetails);
        addDetail(preLinesList, "locomotorPulseCarotidRight", preDetails);
        addDetail(preLinesList, "locomotorPulseBrachialLeft", preDetails);
        addDetail(preLinesList, "locomotorPulseBrachialRight", preDetails);
        addDetail(preLinesList, "locomotorPulseRadialLeft", preDetails);
        addDetail(preLinesList, "locomotorPulseRadialRight", preDetails);
        addDetail(preLinesList, "locomotorPulseFemoralLeft", preDetails);
        addDetail(preLinesList, "locomotorPulseFemoralRight", preDetails);
        addDetail(preLinesList, "locomotorPulsePoplitealLeft", preDetails);
        addDetail(preLinesList, "locomotorPulsePoplitealRight", preDetails);
        addDetail(preLinesList, "locomotorPulsePedialLeft", preDetails);
        addDetail(preLinesList, "locomotorPulsePedialRight", preDetails);
        addDetail(preLinesList, "locomotorExamPain", preDetails);
        addDetail(preLinesList, "locomotorExamSwelling", preDetails);
        addDetail(preLinesList, "locomotorExamEdema", preDetails);
        addDetail(preLinesList, "locomotorExamFunctionalImpairment", preDetails);
        addDetail(preLinesList, "locomotorExamCyanosis", preDetails);
        addDetail(preLinesList, "locomotorExamOpenFracture", preDetails);
        addDetail(preLinesList, "locomotorExamClosedFracture", preDetails);
        addDetail(preLinesList, "locomotorExamObservations", preDetails);
        addDetail(preLinesList, "neuroPsychNormal", preDetails);
        addDetail(preLinesList, "neuroPsychOriented", preDetails);
        addDetail(preLinesList, "neuroPsychCranialNerves", preDetails);
        addDetail(preLinesList, "neuroPsychMotor", preDetails);
        addDetail(preLinesList, "neuroPsychSensitive", preDetails);
        addDetail(preLinesList, "neuroPsychRot", preDetails);
        addDetail(preLinesList, "neuroPsychHallucinations", preDetails);
        addDetail(preLinesList, "neuroPsychDelirium", preDetails);
        addDetail(preLinesList, "neuroPsychBehaviorDisorders", preDetails);
        addDetail(preLinesList, "neuroPsychAgitated", preDetails);
        addDetail(preLinesList, "neuroPsychObnubilated", preDetails);
        addDetail(preLinesList, "neuroPsychConfused", preDetails);
        addDetail(preLinesList, "neuroPsychPhotophobia", preDetails);
        addDetail(preLinesList, "neuroPsychNeckStiffness", preDetails);
        addDetail(preLinesList, "neuroPsychParesthesia", preDetails);
        addDetail(preLinesList, "neuroPsychAtaxia", preDetails);
        addDetail(preLinesList, "neuroPsychAphasia", preDetails);
        addDetail(preLinesList, "neuroPsychMyoclonus", preDetails);
        addDetail(preLinesList, "neuroPsychConvulsions", preDetails);
        addDetail(preLinesList, "neuroPsychPlegiaLeft", preDetails);
        addDetail(preLinesList, "neuroPsychPlegiaRight", preDetails);
        addDetail(preLinesList, "neuroPsychParesisLeft", preDetails);
        addDetail(preLinesList, "neuroPsychParesisRight", preDetails);
        addDetail(preLinesList, "neuroPsychAnesthesiaLeft", preDetails);
        addDetail(preLinesList, "neuroPsychAnesthesiaRight", preDetails);
        addDetail(preLinesList, "neuroPsychBabinskiLeft", preDetails);
        addDetail(preLinesList, "neuroPsychBabinskiRight", preDetails);
        addDetail(preLinesList, "neuroPsychOther", preDetails);
        addDetail(preLinesList, "neuroPsychObservations", preDetails);
        addDetail(preLinesList, "proceduresO2Mask", preDetails);
        addDetail(preLinesList, "proceduresO2MaskValue", preDetails);
        addDetail(preLinesList, "proceduresGuedelCannula", preDetails);
        addDetail(preLinesList, "proceduresOralCavityAspiration", preDetails);
        addDetail(preLinesList, "proceduresIotTubeAspiration", preDetails);
        addDetail(preLinesList, "proceduresIotTubeAspirationValue", preDetails);
        addDetail(preLinesList, "proceduresIotWithInduction", preDetails);
        addDetail(preLinesList, "proceduresIotWithoutInduction", preDetails);
        addDetail(preLinesList, "proceduresIntWithInduction", preDetails);
        addDetail(preLinesList, "proceduresCombitube", preDetails);
        addDetail(preLinesList, "proceduresLaryngealMask", preDetails);
        addDetail(preLinesList, "proceduresNeedleThoracicDecompression", preDetails);
        addDetail(preLinesList, "proceduresChestDrain", preDetails);
        addDetail(preLinesList, "proceduresChestDrainValue", preDetails);
        addDetail(preLinesList, "proceduresMiniCricothyrotomy", preDetails);
        addDetail(preLinesList, "proceduresTracheostomy", preDetails);
        addDetail(preLinesList, "proceduresNonInvasiveVentilation", preDetails);
        addDetail(preLinesList, "proceduresMechanicalVentilation", preDetails);
        addDetail(preLinesList, "proceduresPeripheralVenousAccess", preDetails);
        addDetail(preLinesList, "proceduresPeripheralVenousAccessCount", preDetails);
        addDetail(preLinesList, "proceduresIntraosseousAccess", preDetails);
        addDetail(preLinesList, "proceduresIntraosseousAccessCount", preDetails);
        addDetail(preLinesList, "proceduresCentralVenousAccess", preDetails);
        addDetail(preLinesList, "proceduresCentralVenousAccessValue", preDetails);
        addDetail(preLinesList, "proceduresPvcMeasurement", preDetails);
        addDetail(preLinesList, "proceduresThrombolysisAmi", preDetails);
        addDetail(preLinesList, "proceduresThrombolysisStroke", preDetails);
        addDetail(preLinesList, "proceduresThrombolysisPep", preDetails);
        addDetail(preLinesList, "proceduresArterialAccess", preDetails);
        addDetail(preLinesList, "proceduresIntramuscularInjection", preDetails);
        addDetail(preLinesList, "proceduresSubcutaneousInjection", preDetails);
        addDetail(preLinesList, "proceduresIntradermalInjection", preDetails);
        addDetail(preLinesList, "proceduresIntranasalAdministration", preDetails);
        addDetail(preLinesList, "proceduresNebulization", preDetails);
        addDetail(preLinesList, "proceduresExternalChestCompressions", preDetails);
        addDetail(preLinesList, "proceduresInvasiveBpMeasurement", preDetails);
        addDetail(preLinesList, "proceduresEkgMonitoring", preDetails);
        addDetail(preLinesList, "proceduresO2SatMonitoring", preDetails);
        addDetail(preLinesList, "proceduresCapnometry", preDetails);
        addDetail(preLinesList, "proceduresOtherMonitoring", preDetails);
        addDetail(preLinesList, "proceduresManualDefibrillation", preDetails);
        addDetail(preLinesList, "proceduresAutomaticDefibrillation", preDetails);
        addDetail(preLinesList, "proceduresCardioversion", preDetails);
        addDetail(preLinesList, "proceduresTranscutaneousPm", preDetails);
        addDetail(preLinesList, "proceduresTranscutaneousPmValue", preDetails);
        addDetail(preLinesList, "proceduresTransvenousPm", preDetails);
        addDetail(preLinesList, "proceduresTransvenousPmValue", preDetails);
        addDetail(preLinesList, "proceduresAnalgosedation", preDetails);
        addDetail(preLinesList, "proceduresLocalAnesthesia", preDetails);
        addDetail(preLinesList, "proceduresShortIvAnesthesia", preDetails);
        addDetail(preLinesList, "proceduresPericardialPuncture", preDetails);
        addDetail(preLinesList, "proceduresPeritonealDiagnosticLavage", preDetails);
        addDetail(preLinesList, "proceduresActiveRewarming", preDetails);
        addDetail(preLinesList, "proceduresPassiveRewarming", preDetails);
        addDetail(preLinesList, "proceduresGastricLavage", preDetails);
        addDetail(preLinesList, "proceduresGastricLavageValue", preDetails);
        addDetail(preLinesList, "proceduresNasogastricTube", preDetails);
        addDetail(preLinesList, "proceduresNasogastricTubeValue", preDetails);
        addDetail(preLinesList, "proceduresUrinaryCatheter", preDetails);
        addDetail(preLinesList, "proceduresUrinaryCatheterValue", preDetails);
        addDetail(preLinesList, "proceduresCervicalCollar", preDetails);
        addDetail(preLinesList, "proceduresScoopStretcher", preDetails);
        addDetail(preLinesList, "proceduresSpineBoard", preDetails);
        addDetail(preLinesList, "proceduresLimbImmobilization", preDetails);
        addDetail(preLinesList, "proceduresSplint", preDetails);
        addDetail(preLinesList, "proceduresSplintValue", preDetails);
        addDetail(preLinesList, "proceduresCastDevice", preDetails);
        addDetail(preLinesList, "proceduresWoundCleaning", preDetails);
        addDetail(preLinesList, "proceduresSuture", preDetails);
        addDetail(preLinesList, "proceduresMessage", preDetails);
        addDetail(preLinesList, "proceduresNasalPacking", preDetails);
        addDetail(preLinesList, "proceduresShortSedation", preDetails);
        addDetail(preLinesList, "proceduresProceduralSedation", preDetails);
        addDetail(preLinesList, "proceduresLongSedation", preDetails);
        addDetail(preLinesList, "proceduresArterialPuncture", preDetails);
        addDetail(preLinesList, "proceduresOther", preDetails);
        addDetail(preLinesList, "proceduresObservations", preDetails);

        String[] preLines = preLinesList.toArray(new String[0]);

        List<String> disLinesList = new ArrayList<>();
        disLinesList.add("Spital: " + safe(dis.getHospitalName()));
        disLinesList.add("Sectia: " + safe(dis.getSectionName()));
        disLinesList.add("Nr. F.O.: " + safe(dis.getFoNumber()));
        disLinesList.add("");
        disLinesList.add("Pacient: " + safe(dis.getFirstName()) + " " + safe(dis.getLastName()));
        disLinesList.add("CNP: " + safe(dis.getCnp()));
        disLinesList.add("");
        disLinesList.add("Diagnostic la internare: " + safe(dis.getDiagnosisAtAdmission()));
        disLinesList.add("Diagnostic la externare: " + safe(dis.getDiagnosisAtDischarge()));
        disLinesList.add("");
        disLinesList.add("Tratament/Recomandari: " + safe(dis.getTreatmentAndRecommendations()));
        addIfPresent(disLinesList, "Manevre/proceduri aplicate", disDetails.get("appliedProcedures"));
        addIfPresent(disLinesList, "Stare pacient la externare", disDetails.get("patientStateAtDischarge"));
        addIfPresent(disLinesList, "Externat la ora", disDetails.get("dischargeHour"));
        addIfPresent(disLinesList, "Internat sectia", disDetails.get("admittedSection"));
        addIfPresent(disLinesList, "Transferat sectie", disDetails.get("transferredSection"));
        addIfPresent(disLinesList, "Pleaca cu recomandari", disDetails.get("leavesWithRecommendations"));

        String[] disLines = disLinesList.toArray(new String[0]);

        pdfExportService.createMultiPagePdf(
                outputFile,
                new String[][]{ preLines, disLines },
                new String[]{ "Fisa pre-spitalizare", "Fisa de externare" }
        );

        return archivedDocumentService.saveDocument(
                visit,
                DocumentType.COMBINED_VISIT_PDF,
                fileName,
                "application/pdf",
                storagePath
        );
    }

    private String safe(String s) {
        if (s == null) return "";
        return s
                .replace("ă", "a")
                .replace("â", "a")
                .replace("î", "i")
                .replace("ș", "s")
                .replace("ţ", "t")
                .replace("ț", "t")
                .replace("Ș", "S")
                .replace("Ț", "T")
                .replace("Ă", "A")
                .replace("Â", "A")
                .replace("Î", "I");
    }
    private String safeInt(Integer v) { return v == null ? "" : v.toString(); }
    private String safeDouble(Double v) { return v == null ? "" : v.toString(); }

    private Map<String, Object> readDetails(String details) {
        if (details == null || details.isBlank()) {
            return Map.of();
        }

        try {
            return objectMapper.readValue(details, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }

    private void addIfPresent(List<String> lines, String label, Object value) {
        if (value == null) return;

        String text = String.valueOf(value).trim();
        if (text.isBlank()) return;

        lines.add(label + ": " + safe(text));
    }

    private void addDetail(List<String> lines, String key, Map<String, Object> details) {
        if (details == null || !details.containsKey(key)) {
            lines.add(key + ": ");
            return;
        }

        Object value = details.get(key);
        if (value == null) {
            lines.add(key + ": ");
            return;
        }

        if (value instanceof Boolean boolValue) {
            lines.add(key + ": " + (boolValue ? "Da" : "Nu"));
            return;
        }

        lines.add(key + ": " + safe(String.valueOf(value)));
    }

    private String yesNo(Boolean value) {
        return Boolean.TRUE.equals(value) ? "Da" : "Nu";
    }
}

