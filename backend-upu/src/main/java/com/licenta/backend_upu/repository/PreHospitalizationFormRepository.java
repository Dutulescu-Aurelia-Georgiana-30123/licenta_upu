package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.PreHospitalizationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PreHospitalizationFormRepository extends JpaRepository<PreHospitalizationForm, Long> {

    Optional<PreHospitalizationForm> findByVisitId(Long visitId);

    interface VisitTriageRow {
        Long getVisit_id();
        String getTriage_color();
        String getReason();
    }

    @Query(value = """
    SELECT p.visit_id AS visit_id,
           p.triage_color AS triage_color,
           p.reason AS reason
    FROM pre_hospitalization_forms p
    WHERE p.visit_id IN (:visitIds)
    """, nativeQuery = true)
    List<VisitTriageRow> findTriageColorsByVisitIds(@Param("visitIds") List<Long> visitIds);
}