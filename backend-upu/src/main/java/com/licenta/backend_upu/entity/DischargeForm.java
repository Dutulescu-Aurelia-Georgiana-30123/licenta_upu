package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnTransformer;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="discharge_forms")
@Data
public class DischargeForm {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name="visit_id",nullable = false,unique = true)
    private Visit visit;

    private String hospitalName;
    private String sectionName;
    private String foNumber;

    private LocalDateTime admissionDateTime;
    private LocalDateTime dischargeDateTime;

    private String firstName;
    private String lastName;
    private String cnp;
    private LocalDate birthDate;

    @Column(length=1)
    private String sex;

    private String county;
    private String locality;

    private String occupation;

    @Enumerated(EnumType.STRING)
    private CitizenshipType citizenshipType;
    private String citizenshipCountry;

    @Enumerated(EnumType.STRING)
    private InsuranceStatus insuranceStatus;

    @Enumerated(EnumType.STRING)
    private AdmissionType admissionType;

    @Enumerated(EnumType.STRING)
    private HospitalizationOutcome hospitalizationOutcome;

    @Enumerated(EnumType.STRING)
    private DischargeType dischargeType;

    @Column(columnDefinition = "text")
    private String diagnosisAtAdmission;

    @Column(columnDefinition = "text")
    private String diagnosisAtDischarge;

    @Column(columnDefinition = "text")
    private String treatmentAndRecommendations;

    @Column(columnDefinition = "jsonb")
    @ColumnTransformer(write="?::jsonb")
    private String details;

    @Column(columnDefinition = "text")
    private String doctorName;

    @Column(columnDefinition = "text")
    private String doctorSignature;

    private LocalDateTime doctorSignedAt;

    @Column(columnDefinition = "text")
    private String nurseName;

    @Column(columnDefinition = "text")
    private String nurseSignature;

    private LocalDateTime nurseSignedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}