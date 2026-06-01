package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnTransformer;

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

    private Integer gcs;
    private Integer respiratoryRate;
    private Integer pulse;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer spo2;

    private Double temperature;
    private Integer glycemia;

    private String sheetNumber;
    private LocalDate presentationDate;
    private String presentationTime;
    private String takenOverBy;

    private Integer age;
    private String phoneNumber;
    private String email;
    private String county;
    private String locality;
    private String street;
    private String streetNumber;
    private String building;
    private String staircase;
    private String floor;
    private String apartment;

    private String patientStateCode;

    private String gcsHour;
    private Integer gcsM;
    private Integer gcsV;
    private Integer gcsO;

    private String broughtByCode;
    private String broughtByOther;

    private String broughtFromCode;
    private String broughtFromOther;

    private Boolean pickupDeceased;
    private Boolean pickupStopCr;
    private Boolean pickupResuscitationInProgress;
    private Boolean pickupTrauma;
    private String resuscitationHour;
    private Boolean resuscitationSuccessful;
    private Boolean resuscitationFailed;
    private String deathHour;
    private String resuscitationNotStartedReason;
    private String trc;

    private Boolean historyCardiac;
    private Boolean historyNeurologic;
    private Boolean historyRenal;
    private Boolean historyPulmonary;
    private Boolean historyTbc;
    private Boolean historyHepatic;
    private Boolean historyGastric;
    private Boolean historyDiabetes;
    private Boolean historyInfectious;
    private Boolean historyStd;
    private String historyOther;

    @Column(columnDefinition = "text")
    private String anamnesis;

    private Integer heightCm;
    private Double weightKg;
    private Boolean triageFever;
    private Boolean triageAsthenia;
    private Boolean triageDizziness;

    private Boolean eyeAcuteVisionLoss;
    private Boolean eyeVisionDisorders;
    private Boolean eyeForeignBody;
    private Boolean eyeOtherManifestations;

    private Boolean burnAirwayAffected;
    private Boolean burnFlame;
    private Boolean burnSolid;
    private Boolean burnLiquid;
    private Boolean burnVaporsGas;
    private Boolean burnChemical;

    private Boolean chestPain;
    private Boolean dyspnea;
    private Boolean hemoptysis;
    private Boolean cough;
    private Boolean expectoration;

    private Boolean psychDepression;
    private Boolean psychBehaviorDisorder;
    private Boolean psychSuicide;
    private Boolean psychHallucinations;
    private Boolean psychDelirium;

    private Boolean giNausea;
    private Boolean giVomiting;
    private Boolean giTransitDisorders;
    private Boolean giRectorrhagia;
    private Boolean giMelena;
    private Boolean giHematemesis;
    private Boolean giAbdominalPain;

    private Boolean neuroConvulsions;
    private Boolean neuroMyoclonus;
    private Boolean neuroHeadache;
    private Boolean neuroParalysis;

    private Boolean guUrinationDisorders;
    private Boolean guDysuria;
    private Boolean guPollakiuria;
    private Boolean guOliguria;
    private Boolean guHematuria;
    private Boolean guVaginalBleeding;
    private Boolean guPregnancy;

    private Boolean skinWarm;
    private Boolean skinCold;
    private Boolean skinWet;
    private Boolean skinPale;
    private Boolean skinCyanotic;
    private Boolean skinJaundice;
    private Boolean skinEcchymosis;
    private Boolean skinRash;
    private Boolean skinPruritus;
    private Boolean skinBurns;

    private Boolean locomotorInflammation;
    private Boolean locomotorSwelling;
    private Boolean locomotorPain;
    private Boolean locomotorFunctionalImpairment;
    private Boolean locomotorHematoma;

    private String allergies;

    @Enumerated(EnumType.STRING)
    private PatientOutcome outcome;

    @Enumerated(EnumType.STRING)
    private HandoverTo handoverTo;

    @Column(columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
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