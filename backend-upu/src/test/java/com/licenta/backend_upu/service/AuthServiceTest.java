package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.LoginRequest;
import com.licenta.backend_upu.dto.LoginResponse;
import com.licenta.backend_upu.dto.RegisterPatientRequest;
import com.licenta.backend_upu.dto.UpdateAvailabilityRequest;
import com.licenta.backend_upu.entity.AvailabilityStatus;
import com.licenta.backend_upu.entity.Patient;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.User;
import com.licenta.backend_upu.repository.PatientRepository;
import com.licenta.backend_upu.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerPatientCreatesPatientAccountSuccessfully() {
        RegisterPatientRequest request = createRegisterPatientRequest();

        Patient existingPatient = createPatient();

        User savedUser = createPatientUser();

        when(userRepository.existsByCnp("1990101123456")).thenReturn(false);
        when(patientRepository.findAll()).thenReturn(List.of(existingPatient));
        when(patientRepository.save(any(Patient.class))).thenReturn(existingPatient);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        LoginResponse response = authService.registerPatient(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("andrei.dutu@test.ro", response.getEmail());
        assertEquals(Role.PATIENT, response.getRole());
        assertEquals("Andrei", response.getFirstName());
        assertEquals("Dutu", response.getLastName());
        assertEquals("1990101123456", response.getCnp());

        verify(userRepository).existsByCnp("1990101123456");
        verify(patientRepository).findAll();
        verify(patientRepository).save(any(Patient.class));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerPatientThrowsExceptionWhenGdprNotAccepted() {
        RegisterPatientRequest request = createRegisterPatientRequest();
        request.setGdprAccepted(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.registerPatient(request)
        );

        assertEquals("Acordul GDPR este obligatoriu", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    void registerPatientThrowsExceptionWhenCnpAlreadyExists() {
        RegisterPatientRequest request = createRegisterPatientRequest();

        when(userRepository.existsByCnp("1990101123456")).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.registerPatient(request)
        );

        assertEquals("Există deja un cont pentru acest CNP", exception.getMessage());

        verify(userRepository).existsByCnp("1990101123456");
        verify(userRepository, never()).save(any(User.class));
        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    void loginReturnsUserWhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("doctor@test.ro");
        request.setPassword("1234");

        User doctor = createDoctorUser();
        doctor.setIsActive(true);
        doctor.setPassword("1234");

        when(userRepository.findByEmail("doctor@test.ro"))
                .thenReturn(Optional.of(doctor));

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("doctor@test.ro", response.getEmail());
        assertEquals(Role.DOCTOR, response.getRole());
        assertEquals("Mihai", response.getFirstName());
        assertEquals("Popescu", response.getLastName());

        verify(userRepository).findByEmail("doctor@test.ro");
    }

    @Test
    void loginThrowsExceptionWhenPasswordIsInvalid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("doctor@test.ro");
        request.setPassword("9999");

        User doctor = createDoctorUser();
        doctor.setIsActive(true);
        doctor.setPassword("1234");

        when(userRepository.findByEmail("doctor@test.ro"))
                .thenReturn(Optional.of(doctor));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(request)
        );

        assertEquals("Parola invalida", exception.getMessage());

        verify(userRepository).findByEmail("doctor@test.ro");
    }

    @Test
    void loginThrowsExceptionWhenAccountIsInactive() {
        LoginRequest request = new LoginRequest();
        request.setEmail("doctor@test.ro");
        request.setPassword("1234");

        User doctor = createDoctorUser();
        doctor.setIsActive(false);
        doctor.setPassword("1234");

        when(userRepository.findByEmail("doctor@test.ro"))
                .thenReturn(Optional.of(doctor));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(request)
        );

        assertEquals("Cont inactiv", exception.getMessage());

        verify(userRepository).findByEmail("doctor@test.ro");
    }

    @Test
    void updateAvailabilityUpdatesUserStatusSuccessfully() {
        User doctor = createDoctorUser();
        doctor.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);

        UpdateAvailabilityRequest request = new UpdateAvailabilityRequest();
        request.setAvailabilityStatus(AvailabilityStatus.BUSY);

        when(userRepository.findById(1L)).thenReturn(Optional.of(doctor));

        authService.updateAvailability(1L, request);

        assertEquals(AvailabilityStatus.BUSY, doctor.getAvailabilityStatus());

        verify(userRepository).findById(1L);
        verify(userRepository).save(doctor);
    }

    @Test
    void updateAvailabilityThrowsExceptionWhenUserDoesNotExist() {
        UpdateAvailabilityRequest request = new UpdateAvailabilityRequest();
        request.setAvailabilityStatus(AvailabilityStatus.BUSY);

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.updateAvailability(1L, request)
        );

        assertEquals("Utilizatorul nu exista", exception.getMessage());

        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }

    private RegisterPatientRequest createRegisterPatientRequest() {
        RegisterPatientRequest request = new RegisterPatientRequest();
        request.setFirstName("Andrei");
        request.setLastName("Dutu");
        request.setCnp("1990101123456");
        request.setPhoneNumber("0712345678");
        request.setEmail("andrei.dutu@test.ro");
        request.setPassword("1234");
        request.setGdprAccepted(true);
        return request;
    }

    private Patient createPatient() {
        Patient patient = new Patient();
        patient.setId(5L);
        patient.setFirstName("Andrei");
        patient.setLastName("Dutu");
        patient.setCnp("1990101123456");
        patient.setPhoneNumber("0712345678");
        patient.setEmail("andrei.dutu@test.ro");
        return patient;
    }

    private User createPatientUser() {
        User user = new User();
        user.setId(10L);
        user.setEmail("andrei.dutu@test.ro");
        user.setPassword("1234");
        user.setRole(Role.PATIENT);
        user.setFirstName("Andrei");
        user.setLastName("Dutu");
        user.setCnp("1990101123456");
        user.setPhoneNumber("0712345678");
        user.setGdprAccepted(true);
        user.setIsActive(true);
        user.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        return user;
    }

    private User createDoctorUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("doctor@test.ro");
        user.setPassword("1234");
        user.setRole(Role.DOCTOR);
        user.setFirstName("Mihai");
        user.setLastName("Popescu");
        user.setPhoneNumber("0700000000");
        user.setIsActive(true);
        user.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        return user;
    }
}