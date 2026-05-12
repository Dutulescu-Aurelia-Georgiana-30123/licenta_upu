package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.LoginRequest;
import com.licenta.backend_upu.dto.LoginResponse;
import com.licenta.backend_upu.dto.UpdateAvailabilityRequest;
import com.licenta.backend_upu.entity.AvailabilityStatus;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.User;
import com.licenta.backend_upu.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.licenta.backend_upu.dto.RegisterPatientRequest;
import com.licenta.backend_upu.dto.UpdateMedicalProfileRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email invalid"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Parola invalida");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Cont inactiv");
        }

        return toLoginResponse(user);

    }
    public long countAvailableDoctors() {
        return userRepository.countByRoleAndAvailabilityStatus(
                Role.DOCTOR,
                AvailabilityStatus.AVAILABLE
        );
    }
    public void updateAvailability(Long userId, UpdateAvailabilityRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu exista"));

        user.setAvailabilityStatus(request.getAvailabilityStatus());
        userRepository.save(user);
    }

    public LoginResponse registerPatient(RegisterPatientRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email deja folosit");
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.PATIENT);
        user.setIsActive(true);
        user.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);

        User saved = userRepository.save(user);

        return toLoginResponse(saved);
    }
    private LoginResponse toLoginResponse(User user) {
        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getProfileImage(),
                user.getSpecialization(),
                user.getProfessionalGrade(),
                user.getAvailabilityStatus() != null ? user.getAvailabilityStatus().name() : null,
                user.getProfileSignature(),
                user.getProfileSignedAt()

        );

    }
    public LoginResponse updateMedicalProfile(Long userId, UpdateMedicalProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu exista"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfileImage(request.getProfileImage());
        user.setSpecialization(request.getSpecialization());
        user.setProfessionalGrade(request.getProfessionalGrade());
        user.setProfileSignature(request.getProfileSignature());
        user.setProfileSignedAt(request.getProfileSignedAt());

        User saved = userRepository.save(user);

        return toLoginResponse(saved);
    }

}