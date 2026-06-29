package com.licenta.backend_upu.integration;

import com.licenta.backend_upu.dto.DischargeFormUpsertRequest;
import com.licenta.backend_upu.dto.PreFormUpsertRequest;
import com.licenta.backend_upu.entity.DischargeForm;
import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.entity.PreHospitalizationForm;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.repository.DischargeFormRepository;
import com.licenta.backend_upu.repository.PatientRepository;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import com.licenta.backend_upu.service.DischargeFormService;
import com.licenta.backend_upu.service.PreHospitalizationFormService;
import com.licenta.backend_upu.service.VisitService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class EmergencyFlowIntegrationTest {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private PreHospitalizationFormRepository preformRepository;

    @Autowired
    private DischargeFormRepository dischargeFormRepository;

    @Autowired
    private VisitService visitService;

    @Autowired
    private PreHospitalizationFormService preHospitalizationFormService;

    @Autowired
    private DischargeFormService dischargeFormService;

    @Test
    void completeEmergencyFlowCreatesPatientVisitPreformAndDischargeForm() {
        Patient patient = createPatient();

        Patient savedPatient = patientRepository.save(patient);

        assertNotNull(savedPatient.getId());
        assertEquals("Andrei", savedPatient.getFirstName());
        assertEquals("Dutu", savedPatient.getLastName());

        Visit savedVisit = visitService.createVisit(savedPatient.getId());

        assertNotNull(savedVisit.getId());
        assertNotNull(savedVisit.getVisitCode());
        assertEquals(savedPatient.getId(), savedVisit.getPatient().getId());

        PreFormUpsertRequest preformRequest = new PreFormUpsertRequest();

        PreHospitalizationForm savedPreform =
                preHospitalizationFormService.upsert(savedVisit.getId(), preformRequest);

        assertNotNull(savedPreform.getId());
        assertNotNull(savedPreform.getCreatedAt());
        assertNotNull(savedPreform.getUpdatedAt());
        assertEquals(savedVisit.getId(), savedPreform.getVisit().getId());

        DischargeFormUpsertRequest dischargeRequest = new DischargeFormUpsertRequest();

        DischargeForm savedDischargeForm =
                dischargeFormService.upsert(savedVisit.getId(), dischargeRequest);

        assertNotNull(savedDischargeForm.getId());
        assertNotNull(savedDischargeForm.getCreatedAt());
        assertNotNull(savedDischargeForm.getUpdatedAt());
        assertEquals(savedVisit.getId(), savedDischargeForm.getVisit().getId());

        Optional<Visit> visitFromDb = visitRepository.findById(savedVisit.getId());
        Optional<PreHospitalizationForm> preformFromDb =
                preformRepository.findByVisitId(savedVisit.getId());
        Optional<DischargeForm> dischargeFormFromDb =
                dischargeFormRepository.findByVisitId(savedVisit.getId());

        assertTrue(visitFromDb.isPresent());
        assertTrue(preformFromDb.isPresent());
        assertTrue(dischargeFormFromDb.isPresent());

        assertEquals(savedPatient.getId(), visitFromDb.get().getPatient().getId());
        assertEquals(savedVisit.getId(), preformFromDb.get().getVisit().getId());
        assertEquals(savedVisit.getId(), dischargeFormFromDb.get().getVisit().getId());
    }

    private Patient createPatient() {
        String uniqueSuffix = String.format("%06d", Math.abs(System.nanoTime()) % 1_000_000);
        String uniqueCnp = "1990101" + uniqueSuffix;

        Patient patient = new Patient();
        patient.setFirstName("Andrei");
        patient.setLastName("Dutu");
        patient.setCnp(uniqueCnp);
        patient.setPhoneNumber("07" + uniqueSuffix + "00");
        patient.setEmail("andrei.dutu." + uniqueSuffix + "@test.ro");

        return patient;
    }
}