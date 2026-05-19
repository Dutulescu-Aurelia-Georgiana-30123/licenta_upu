package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByCnp(String cnp);
    boolean existsByCnp(String cnp);
}