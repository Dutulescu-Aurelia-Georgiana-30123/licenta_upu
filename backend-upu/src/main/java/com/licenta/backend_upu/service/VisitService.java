package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.*;
import com.licenta.backend_upu.repository.PatientRepository;
import com.licenta.backend_upu.repository.UserRepository;
import com.licenta.backend_upu.repository.VisitRepository;
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

            boolean isFinalStatus =
                    newStatus == VisitStatus.DISCHARGED ||
                            newStatus == VisitStatus.ADMITTED ||
                            newStatus == VisitStatus.TRANSFERRED;

            if (isFinalStatus && savedVisit.getDoctor() != null) {
                User doctor = savedVisit.getDoctor();

                long activeDoctorVisits = visitRepository.countByDoctor_IdAndStatusNotIn(
                        doctor.getId(),
                        List.of(
                                VisitStatus.DISCHARGED,
                                VisitStatus.ADMITTED,
                                VisitStatus.TRANSFERRED
                        )
                );

                if (activeDoctorVisits == 0) {
                    doctor.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
                    userRepository.save(doctor);
                }
            }

            if (isFinalStatus && savedVisit.getNurse() != null) {
                User nurse = savedVisit.getNurse();

                long activeNurseVisits = visitRepository.countByNurse_IdAndStatusNotIn(
                        nurse.getId(),
                        List.of(
                                VisitStatus.DISCHARGED,
                                VisitStatus.ADMITTED,
                                VisitStatus.TRANSFERRED
                        )
                );

                if (activeNurseVisits == 0) {
                    nurse.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
                    userRepository.save(nurse);
                }
            }

            return savedVisit;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status invalid: " + status);
        }
    }

    public List<Visit> getVisitByPatient(Long patientId) {
        return visitRepository.findByPatient_IdAndStatusInOrderByCreatedAtDesc(
                patientId,
                List.of(
                        VisitStatus.DISCHARGED,
                        VisitStatus.ADMITTED,
                        VisitStatus.TRANSFERRED
                )
        );
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

    public Visit assignNurseToVisit(Long visitId, Long nurseId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu a fost gasita cu id: " + visitId));

        User nurse = userRepository.findById(nurseId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost gasit cu id: " + nurseId));

        if (nurse.getRole() != Role.NURSE) {
            throw new RuntimeException("Utilizatorul selectat nu este asistent");
        }

        boolean hasActiveVisit = visitRepository.existsByNurse_IdAndStatusNotIn(
                nurseId,
                List.of(
                        VisitStatus.DISCHARGED,
                        VisitStatus.ADMITTED,
                        VisitStatus.TRANSFERRED
                )
        );

        if (hasActiveVisit) {
            throw new IllegalStateException("Asistentul are deja un pacient activ");
        }

        visit.setNurse(nurse);
        nurse.setAvailabilityStatus(AvailabilityStatus.BUSY);

        userRepository.save(nurse);
        return visitRepository.save(visit);
    }

    public List<Visit> getVisitsByDoctor(Long doctorId) {
        return visitRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId);
    }

    public List<Visit> getVisitsByNurse(Long nurseId) {
        return visitRepository.findByNurse_IdOrderByCreatedAtDesc(nurseId);
    }

    public Visit getActiveVisitByPatientCnp(String cnp) {
        return visitRepository
                .findFirstByPatient_CnpAndStatusNotInOrderByCreatedAtDesc(
                        cnp,
                        List.of(
                                VisitStatus.DISCHARGED,
                                VisitStatus.ADMITTED,
                                VisitStatus.TRANSFERRED
                        )
                )
                .orElse(null);
    }

    public List<Visit> getVisitsByPatientCnp(String cnp) {
        return visitRepository.findByPatient_CnpAndStatusInOrderByCreatedAtDesc(
                cnp,
                List.of(
                        VisitStatus.DISCHARGED,
                        VisitStatus.ADMITTED,
                        VisitStatus.TRANSFERRED
                )
        );
    }
}