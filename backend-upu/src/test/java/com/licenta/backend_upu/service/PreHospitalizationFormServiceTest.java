package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.PreFormUpsertRequest;
import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.entity.PreHospitalizationForm;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.entity.VisitStatus;
import com.licenta.backend_upu.mapper.PreFormMapper;
import com.licenta.backend_upu.repository.PreHospitalizationFormRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PreHospitalizationFormServiceTest {

    @Mock
    private PreHospitalizationFormRepository repo;

    @Mock
    private VisitRepository visitRepo;

    @Mock
    private PreFormMapper mapper;

    @InjectMocks
    private PreHospitalizationFormService service;

    @Test
    void upsertCreatesPreHospitalizationFormForVisit() {
        Long visitId = 1L;

        Patient patient = createPatient();
        Visit visit = createVisit(visitId, patient);
        PreFormUpsertRequest request = new PreFormUpsertRequest();

        PreHospitalizationForm savedForm = new PreHospitalizationForm();
        savedForm.setId(100L);
        savedForm.setVisit(visit);
        savedForm.setCreatedAt(LocalDateTime.now());
        savedForm.setUpdatedAt(LocalDateTime.now());

        when(visitRepo.findById(visitId)).thenReturn(Optional.of(visit));
        when(repo.findByVisitId(visitId)).thenReturn(Optional.empty());
        when(repo.save(any(PreHospitalizationForm.class))).thenReturn(savedForm);

        PreHospitalizationForm result = service.upsert(visitId, request);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals(visit, result.getVisit());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        verify(visitRepo).findById(visitId);
        verify(repo).findByVisitId(visitId);
        verify(mapper).applyToEntity(eq(request), any(PreHospitalizationForm.class));
        verify(repo).save(any(PreHospitalizationForm.class));
    }

    @Test
    void upsertThrowsExceptionWhenVisitDoesNotExist() {
        Long visitId = 1L;
        PreFormUpsertRequest request = new PreFormUpsertRequest();

        when(visitRepo.findById(visitId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.upsert(visitId, request)
        );

        assertEquals("Vizita nu exista: 1", exception.getMessage());

        verify(visitRepo).findById(visitId);
        verify(repo, never()).findByVisitId(anyLong());
        verify(mapper, never()).applyToEntity(any(), any());
        verify(repo, never()).save(any(PreHospitalizationForm.class));
    }

    private Patient createPatient() {
        Patient patient = new Patient();
        patient.setId(5L);
        patient.setFirstName("Andrei");
        patient.setLastName("Dutu");
        patient.setCnp("1990101123456");
        patient.setPhoneNumber("0712345678");
        return patient;
    }

    private Visit createVisit(Long visitId, Patient patient) {
        Visit visit = new Visit();
        visit.setId(visitId);
        visit.setPatient(patient);
        visit.setStatus(VisitStatus.WAITING_CONSULT);
        visit.setCreatedAt(LocalDateTime.now());
        return visit;
    }
}