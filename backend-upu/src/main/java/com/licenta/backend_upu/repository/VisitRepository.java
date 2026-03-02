package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VisitRepository extends JpaRepository<Visit,Long> {
    List<Visit> findByPatient_IdOrderByCreatedAtDesc(Long patientId);

}
