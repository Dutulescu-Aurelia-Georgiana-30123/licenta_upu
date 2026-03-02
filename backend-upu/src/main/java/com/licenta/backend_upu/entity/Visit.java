package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="visits")
@Data
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String visitCode;

    @ManyToOne(optional = false)
    @JoinColumn(name="patient_id",nullable = false)
    private Patient patient;

    @Enumerated(EnumType.STRING)
     @Column(nullable = false)
    private VisitStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
