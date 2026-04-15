package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.licenta.backend_upu.entity.VisitStatus;

import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByPatient_IdOrderByCreatedAtDesc(Long patientId);

    interface TriageCountRow {
        String getTriage_color();
        Long getCnt();
    }
    @Query(value = """
        SELECT COUNT(*)
        FROM visits v
        WHERE v.status IN (:statuses)
        """, nativeQuery = true)
    long countByStatuses(@Param("statuses") List<String> statuses);

    @Query(value = """
        SELECT COALESCE(p.triage_color, 'NESETAT') AS triage_color,
               COUNT(*) AS cnt
        FROM visits v
        LEFT JOIN pre_hospitalization_forms p ON p.visit_id = v.id
        WHERE v.status IN (:statuses)
        GROUP BY COALESCE(p.triage_color, 'NESETAT')
        """, nativeQuery = true)
    List<TriageCountRow> countWaitingByTriage(@Param("statuses") List<String> statuses);

    @Query(value = """
        SELECT COUNT(*)
        FROM visits v
        WHERE DATE(v.created_at) = CURRENT_DATE
        """, nativeQuery = true)
    long countTodayVisits();
    @Query(value = """
        SELECT COUNT(*)
        FROM visits v
        WHERE v.status IN (:statuses)
          AND v.created_at <= (NOW() - INTERVAL '30 minutes')
        """, nativeQuery = true)
    long countWaitingTooLong(@Param("statuses") List<String> statuses);
    @Query(value = """
        SELECT COUNT(*)
        FROM visits v
        LEFT JOIN pre_hospitalization_forms p ON p.visit_id = v.id
        WHERE v.status IN (:statuses)
          AND p.id IS NULL
        """, nativeQuery = true)
    long countMissingPreform(@Param("statuses") List<String> statuses);
    @Query(value = """
        SELECT COUNT(*)
        FROM visits v
        LEFT JOIN discharge_forms d ON d.visit_id = v.id
        WHERE v.status IN (:statuses)
          AND d.id IS NULL
        """, nativeQuery = true)
    long countMissingDischarge(@Param("statuses") List<String> statuses);

    interface PriorityPatientRow {
        Long getVisit_id();
        String getVisit_code();
        Long getPatient_id();
        String getFirst_name();
        String getLast_name();
        String getTriage_color();
        String getStatus();
        Long getWaiting_minutes();
    }
    @Query(value = """
        SELECT
            v.id AS visit_id,
            v.visit_code AS visit_code,
            pt.id AS patient_id,
            pt.first_name AS first_name,
            pt.last_name AS last_name,
            COALESCE(p.triage_color, 'NESETAT') AS triage_color,
            v.status AS status,
            FLOOR(EXTRACT(EPOCH FROM (NOW() - v.created_at)) / 60) AS waiting_minutes
        FROM visits v
        JOIN patients pt ON pt.id = v.patient_id
        LEFT JOIN pre_hospitalization_forms p ON p.visit_id = v.id
        WHERE v.status IN (:statuses)
        ORDER BY
            CASE COALESCE(p.triage_color, 'NESETAT')
                WHEN 'ROSU' THEN 1
                WHEN 'GALBEN' THEN 2
                WHEN 'VERDE' THEN 3
                ELSE 4
            END,
            v.created_at ASC
        LIMIT 5
        """, nativeQuery = true)
    List<PriorityPatientRow> findPriorityPatients(@Param("statuses") List<String> statuses);
    List<Visit> findByDoctor_IdOrderByCreatedAtDesc(Long doctorId);
    long countByDoctor_IdAndStatusNotIn(Long doctorId, List<VisitStatus> statuses);
    boolean existsByDoctor_IdAndStatusNotIn(Long doctorId, List<VisitStatus> statuses);

}