package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.LoginRequest;
import com.licenta.backend_upu.dto.LoginResponse;
import com.licenta.backend_upu.dto.UpdateAvailabilityRequest;
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
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email invalid"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Parola invalida");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Cont inactiv");
        }

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

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
}