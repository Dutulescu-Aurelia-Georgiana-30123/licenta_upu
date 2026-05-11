package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.entity.VisitStatus;
import com.licenta.backend_upu.repository.PatientRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import com.licenta.backend_upu.entity.AvailabilityStatus;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.User;
import com.licenta.backend_upu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitService {
    private final VisitRepository visitRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public Visit createVisit(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Pacientul nu a fost gasit cu id: " + patientId));

        Visit visit = new Visit();
        visit.setPatient(patient);
        visit.setStatus(VisitStatus.REGISTERED);
        visit.setCreatedAt(LocalDateTime.now());

        visit = visitRepository.save(visit);

        visit.setVisitCode(generateVisitCode(visit.getId()));

        return visitRepository.save(visit);
    }

    private String generateVisitCode(Long id) {
        return "UPU-" + String.format("%04d", id);
    }

    public List<Visit> getAllVisits() {
        return visitRepository.findAll();
    }

    public Visit updateVisistStatus(Long visitId, String status) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu a fost gasita cu id " + visitId));

        try {
            VisitStatus newStatus = VisitStatus.valueOf(status.toUpperCase());
            visit.setStatus(newStatus);

            Visit savedVisit = visitRepository.save(visit);

            if (savedVisit.getDoctor() != null &&
                    (newStatus == VisitStatus.DISCHARGED ||
                            newStatus == VisitStatus.ADMITTED ||
                            newStatus == VisitStatus.TRANSFERRED)) {

                User doctor = savedVisit.getDoctor();

                long activeVisits = visitRepository.countByDoctor_IdAndStatusNotIn(
                        doctor.getId(),
                        List.of(
                                VisitStatus.DISCHARGED,
                                VisitStatus.ADMITTED,
                                VisitStatus.TRANSFERRED
                        )
                );

                if (activeVisits == 0) {
                    doctor.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
                    userRepository.save(doctor);
                }
            }

            return savedVisit;

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status invalid: " + status);
        }
    }

    public List<Visit> getVisitByPatient(Long patientId) {
        return visitRepository.findByPatient_IdOrderByCreatedAtDesc(patientId);
    }
    public Visit assignDoctorToVisit(Long visitId, Long doctorId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu a fost gasita cu id: " + visitId));

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost gasit cu id: " + doctorId));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Utilizatorul selectat nu este medic");
        }

        boolean hasActiveVisit = visitRepository.existsByDoctor_IdAndStatusNotIn(
                doctorId,
                List.of(
                        VisitStatus.DISCHARGED,
                        VisitStatus.ADMITTED,
                        VisitStatus.TRANSFERRED
                )
        );

        if (hasActiveVisit) {
            throw new IllegalStateException("Medicul are deja un pacient activ");
        }

        visit.setDoctor(doctor);
        doctor.setAvailabilityStatus(AvailabilityStatus.BUSY);

        userRepository.save(doctor);
        return visitRepository.save(visit);
    }
    public List<Visit> getVisitsByDoctor(Long doctorId) {
        return visitRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId);
    }
}