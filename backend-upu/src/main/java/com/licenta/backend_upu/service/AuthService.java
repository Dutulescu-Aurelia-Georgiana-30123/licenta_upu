package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.LoginRequest;
import com.licenta.backend_upu.dto.LoginResponse;
import com.licenta.backend_upu.dto.RegisterPatientRequest;
import com.licenta.backend_upu.dto.UpdateAvailabilityRequest;
import com.licenta.backend_upu.dto.UpdateMedicalProfileRequest;
import com.licenta.backend_upu.entity.AvailabilityStatus;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.User;
import com.licenta.backend_upu.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user;

        boolean isPatientLogin =
                request.getCnp() != null && !request.getCnp().isBlank();

        if (isPatientLogin) {
            String inputCnp = request.getCnp().trim();
            String inputName = normalizeName(request.getFullName());

            user = userRepository.findByCnp(inputCnp)
                    .orElseThrow(() -> new RuntimeException("Date pacient invalide"));

            if (user.getRole() != Role.PATIENT) {
                throw new RuntimeException("Contul nu este de pacient");
            }

            String firstLast = normalizeName(user.getFirstName() + " " + user.getLastName());
            String lastFirst = normalizeName(user.getLastName() + " " + user.getFirstName());

            if (!inputName.equals(firstLast) && !inputName.equals(lastFirst)) {
                throw new RuntimeException("Nume pacient invalid");
            }

        } else {
            user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email invalid"));

            if (user.getRole() == Role.PATIENT) {
                throw new RuntimeException("Pacienții trebuie să se autentifice cu nume și CNP");
            }
        }

        String inputPassword = request.getPassword() != null
                ? request.getPassword().trim()
                : "";

        if (!user.getPassword().equals(inputPassword)) {
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
        if (request.getGdprAccepted() == null || !request.getGdprAccepted()) {
            throw new RuntimeException("Acordul GDPR este obligatoriu");
        }

        if (userRepository.existsByCnp(request.getCnp().trim())) {
            throw new RuntimeException("Există deja un cont pentru acest CNP");
        }

        User user = new User();

        user.setEmail(null);
        user.setPassword(request.getPassword().trim());
        user.setRole(Role.PATIENT);

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setCnp(request.getCnp().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());

        user.setGdprAccepted(true);
        user.setGdprAcceptedAt(java.time.LocalDateTime.now().toString());

        user.setIsActive(true);
        user.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);

        User saved = userRepository.save(user);

        return toLoginResponse(saved);
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

    private LoginResponse toLoginResponse(User user) {
        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getCnp(),
                user.getGdprAccepted(),
                user.getProfileImage(),
                user.getSpecialization(),
                user.getProfessionalGrade(),
                user.getAvailabilityStatus() != null ? user.getAvailabilityStatus().name() : null,
                user.getProfileSignature(),
                user.getProfileSignedAt()
        );
    }

    private String normalizeName(String value) {
        if (value == null) {
            return "";
        }

        return value
                .trim()
                .replaceAll("\\s+", " ")
                .toLowerCase();
    }
}