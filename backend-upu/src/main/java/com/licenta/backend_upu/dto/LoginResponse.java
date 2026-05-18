package com.licenta.backend_upu.dto;

import com.licenta.backend_upu.entity.Role;

public class LoginResponse {

    private Long id;
    private String email;
    private Role role;

    private String firstName;
    private String lastName;
    private String phoneNumber;

    private String cnp;

    private Boolean gdprAccepted;

    private String profileImage;

    private String specialization;
    private String professionalGrade;

    private String availabilityStatus;

    private String profileSignature;
    private String profileSignedAt;

    public LoginResponse() {
    }

    public LoginResponse(
            Long id,
            String email,
            Role role,
            String firstName,
            String lastName,
            String phoneNumber,
            String cnp,
            Boolean gdprAccepted,
            String profileImage,
            String specialization,
            String professionalGrade,
            String availabilityStatus,
            String profileSignature,
            String profileSignedAt
    ) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.cnp = cnp;
        this.gdprAccepted = gdprAccepted;
        this.profileImage = profileImage;
        this.specialization = specialization;
        this.professionalGrade = professionalGrade;
        this.availabilityStatus = availabilityStatus;
        this.profileSignature = profileSignature;
        this.profileSignedAt = profileSignedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getCnp() {
        return cnp;
    }

    public void setCnp(String cnp) {
        this.cnp = cnp;
    }

    public Boolean getGdprAccepted() {
        return gdprAccepted;
    }

    public void setGdprAccepted(Boolean gdprAccepted) {
        this.gdprAccepted = gdprAccepted;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getProfessionalGrade() {
        return professionalGrade;
    }

    public void setProfessionalGrade(String professionalGrade) {
        this.professionalGrade = professionalGrade;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public String getProfileSignature() {
        return profileSignature;
    }

    public void setProfileSignature(String profileSignature) {
        this.profileSignature = profileSignature;
    }

    public String getProfileSignedAt() {
        return profileSignedAt;
    }

    public void setProfileSignedAt(String profileSignedAt) {
        this.profileSignedAt = profileSignedAt;
    }
}