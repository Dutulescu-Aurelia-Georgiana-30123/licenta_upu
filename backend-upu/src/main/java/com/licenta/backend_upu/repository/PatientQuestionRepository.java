package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.PatientQuestion;
import com.licenta.backend_upu.entity.QuestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientQuestionRepository extends JpaRepository<PatientQuestion, Long> {

    List<PatientQuestion> findByStatusOrderByCreatedAtDesc(QuestionStatus status);

    List<PatientQuestion> findByPatient_IdOrderByCreatedAtDesc(Long patientId);

    List<PatientQuestion> findAllByOrderByCreatedAtDesc();
}