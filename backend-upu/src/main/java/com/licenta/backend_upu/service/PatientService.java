package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;

    public Patient savePatient(Patient patient) {
        String cnp = patient.getCnp().trim();

        if (patientRepository.existsByCnp(cnp)) {
            throw new RuntimeException("Există deja un pacient cu acest CNP");
        }

        patient.setCnp(cnp);
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients(){
        return patientRepository.findAll();
    }
    public Patient getById(Long id){
        return patientRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Pacientul nu a fost gasit cu id: " + id));
    }
    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pacientul nu a fost gasit cu id: " + id));

        existing.setFirstName(updatedPatient.getFirstName());
        existing.setLastName(updatedPatient.getLastName());
        String newCnp = updatedPatient.getCnp().trim();

        patientRepository.findByCnp(newCnp).ifPresent(patientWithSameCnp -> {
            if (!patientWithSameCnp.getId().equals(id)) {
                throw new RuntimeException("Există deja un pacient cu acest CNP");
            }
        });
        existing.setCnp(newCnp);
        existing.setCnp(updatedPatient.getCnp());
        existing.setPhoneNumber(updatedPatient.getPhoneNumber());
        existing.setEmail(updatedPatient.getEmail());

        return patientRepository.save(existing);
    }
}
