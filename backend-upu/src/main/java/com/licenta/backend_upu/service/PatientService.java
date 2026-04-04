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
        existing.setCnp(updatedPatient.getCnp());
        existing.setPhoneNumber(updatedPatient.getPhoneNumber());
        existing.setEmail(updatedPatient.getEmail());

        return patientRepository.save(existing);
    }
}
