package com.licenta.backend_upu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String phoneNumber;

    @Column(unique = true)
    private String cnp;

    @Column
    private Boolean gdprAccepted = false;

    @Column
    private String gdprAcceptedAt;

    @Column(columnDefinition = "TEXT")
    private String profileImage;

    @Column
    private String specialization;

    @Column
    private String professionalGrade;

    @Column(columnDefinition = "TEXT")
    private String profileSignature;

    @Column
    private String profileSignedAt;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;
}