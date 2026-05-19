package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.PatientQuestionAnswerRequest;
import com.licenta.backend_upu.dto.PatientQuestionCreateRequest;
import com.licenta.backend_upu.dto.PatientQuestionResponse;
import com.licenta.backend_upu.service.PatientQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient-questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PatientQuestionController {

    private final PatientQuestionService patientQuestionService;

    @PostMapping
    public PatientQuestionResponse createQuestion(
            @RequestBody PatientQuestionCreateRequest request
    ) {
        return patientQuestionService.createQuestion(request);
    }

    @GetMapping("/open")
    public List<PatientQuestionResponse> getOpenQuestions() {
        return patientQuestionService.getOpenQuestions();
    }

    @GetMapping
    public List<PatientQuestionResponse> getAllQuestions() {
        return patientQuestionService.getAllQuestions();
    }

    @GetMapping("/patient/{patientId}")
    public List<PatientQuestionResponse> getQuestionsByPatient(
            @PathVariable Long patientId
    ) {
        return patientQuestionService.getQuestionsByPatient(patientId);
    }

    @PutMapping("/{questionId}/answer")
    public PatientQuestionResponse answerQuestion(
            @PathVariable Long questionId,
            @RequestBody PatientQuestionAnswerRequest request
    ) {
        return patientQuestionService.answerQuestion(questionId, request);
    }
    @PostMapping("/by-cnp/{cnp}")
    public PatientQuestionResponse createQuestionByCnp(
            @PathVariable String cnp,
            @RequestBody PatientQuestionCreateRequest request
    ) {
        return patientQuestionService.createQuestionByCnp(cnp, request);
    }

    @GetMapping("/by-cnp/{cnp}")
    public List<PatientQuestionResponse> getQuestionsByPatientCnp(
            @PathVariable String cnp
    ) {
        return patientQuestionService.getQuestionsByPatientCnp(cnp);
    }
}