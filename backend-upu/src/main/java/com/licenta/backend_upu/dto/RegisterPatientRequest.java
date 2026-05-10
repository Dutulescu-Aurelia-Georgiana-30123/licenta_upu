package com.licenta.backend_upu.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterPatientRequest {

    private String email;
    private String password;
}