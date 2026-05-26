package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.licenta.backend_upu.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name="visits")
@Data
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true,unique = true)
    private String visitCode;

    @ManyToOne(optional = false)
    @JoinColumn(name="patient_id",nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;

    @ManyToOne
    @JoinColumn(name = "nurse_id")
    private User nurse;

    @Enumerated(EnumType.STRING)
     @Column(nullable = false)
    private VisitStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;


}
