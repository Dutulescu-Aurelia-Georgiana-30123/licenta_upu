package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnTransformer;
//import org.hibernate.annotations.JdbcTypeCode;
//import org.hibernate.type.SqlTypes;
//import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pre_hospitalization_forms")
@Data
public class PreHospitalizationForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "visit_id", nullable = false, unique = true)
    private Visit visit;

    private String firstName;
    private String lastName;
    private String cnp;

    private LocalDate birthDate;

    @Column(length = 1)
    private String sex;

    @Enumerated(EnumType.STRING)
    private TriageColor triageColor;

    @Enumerated(EnumType.STRING)
    private ArrivalMode arrivalMode;

    @Column(columnDefinition = "text")
    private String reason;

    //functii vitale la preluare

    private Integer gcs;
    private Integer respiratoryRate;
    private Integer pulse;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer spo2;

    private Double temperature;
    private Integer glycemia;

    @Enumerated(EnumType.STRING)
    private PatientOutcome outcome;

    @Enumerated(EnumType.STRING)
    private HandoverTo handoverTo;

   // @JdbcTypeCode(SqlTypes.JSON)
   @Column(columnDefinition = "jsonb")
   @ColumnTransformer(write = "?::jsonb")
   private String details;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;



}
