package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.DischargeForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DischargeFormRepository extends JpaRepository<DischargeForm, Long> {
    Optional<DischargeForm> findByVisitId(Long visitId);
}
