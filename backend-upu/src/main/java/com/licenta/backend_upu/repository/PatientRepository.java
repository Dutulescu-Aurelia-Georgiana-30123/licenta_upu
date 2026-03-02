package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient,Long> {
}
