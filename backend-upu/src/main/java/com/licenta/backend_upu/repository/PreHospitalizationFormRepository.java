package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.PreHospitalizationForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreHospitalizationFormRepository extends JpaRepository<PreHospitalizationForm,Long> {
    Optional<PreHospitalizationForm> findByVisitId(Long visitId);
}
