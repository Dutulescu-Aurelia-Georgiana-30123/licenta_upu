package com.licenta.backend_upu.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterPatientRequest {

    private String firstName;
    private String lastName;

    private String cnp;

    private String phoneNumber;

    private String password;

    private Boolean gdprAccepted;
}