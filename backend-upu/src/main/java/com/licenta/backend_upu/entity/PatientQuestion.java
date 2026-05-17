package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient_questions")
@Data
public class PatientQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    @ManyToOne
    @JoinColumn(name = "answered_by_user_id")
    private User answeredBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status = QuestionStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime answeredAt;
}