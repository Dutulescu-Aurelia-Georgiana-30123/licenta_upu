package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.PatientQuestionAnswerRequest;
import com.licenta.backend_upu.dto.PatientQuestionCreateRequest;
import com.licenta.backend_upu.dto.PatientQuestionResponse;
import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.entity.PatientQuestion;
import com.licenta.backend_upu.entity.QuestionStatus;
import com.licenta.backend_upu.entity.User;
import com.licenta.backend_upu.repository.PatientQuestionRepository;
import com.licenta.backend_upu.repository.PatientRepository;
import com.licenta.backend_upu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientQuestionService {

    private final PatientQuestionRepository questionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientQuestionResponse createQuestion(PatientQuestionCreateRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Pacientul nu exista"));

        PatientQuestion question = new PatientQuestion();
        question.setPatient(patient);
        question.setQuestionText(request.getQuestionText());
        question.setStatus(QuestionStatus.OPEN);
        question.setCreatedAt(LocalDateTime.now());

        return toResponse(questionRepository.save(question));
    }

    public List<PatientQuestionResponse> getOpenQuestions() {
        return questionRepository.findByStatusOrderByCreatedAtDesc(QuestionStatus.OPEN)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PatientQuestionResponse> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PatientQuestionResponse> getQuestionsByPatient(Long patientId) {
        return questionRepository.findByPatient_IdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PatientQuestionResponse answerQuestion(Long questionId, PatientQuestionAnswerRequest request) {
        PatientQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Intrebarea nu exista"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu exista"));

        question.setAnswerText(request.getAnswerText());
        question.setAnsweredBy(user);
        question.setStatus(QuestionStatus.ANSWERED);
        question.setAnsweredAt(LocalDateTime.now());

        return toResponse(questionRepository.save(question));
    }

    private PatientQuestionResponse toResponse(PatientQuestion question) {
        PatientQuestionResponse response = new PatientQuestionResponse();

        response.setId(question.getId());

        response.setPatientId(question.getPatient().getId());
        response.setPatientFirstName(question.getPatient().getFirstName());
        response.setPatientLastName(question.getPatient().getLastName());
        response.setPatientEmail(question.getPatient().getEmail());

        response.setQuestionText(question.getQuestionText());
        response.setAnswerText(question.getAnswerText());

        if (question.getAnsweredBy() != null) {
            User answeredBy = question.getAnsweredBy();

            response.setAnsweredByUserId(answeredBy.getId());
            response.setAnsweredByEmail(answeredBy.getEmail());

            String fullName = ((answeredBy.getFirstName() != null ? answeredBy.getFirstName() : "") +
                    " " +
                    (answeredBy.getLastName() != null ? answeredBy.getLastName() : "")).trim();

            response.setAnsweredByName(fullName.isBlank() ? answeredBy.getEmail() : fullName);
        }

        response.setStatus(question.getStatus().name());
        response.setCreatedAt(question.getCreatedAt());
        response.setAnsweredAt(question.getAnsweredAt());

        return response;
    }
}