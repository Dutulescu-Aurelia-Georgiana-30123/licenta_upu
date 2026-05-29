package com.licenta.backend_upu.service;

import com.licenta.backend_upu.dto.AdminDashboardResponse;
import com.licenta.backend_upu.dto.AdminUserResponse;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.User;
import com.licenta.backend_upu.entity.Visit;
import com.licenta.backend_upu.entity.VisitStatus;
import com.licenta.backend_upu.repository.UserRepository;
import com.licenta.backend_upu.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.licenta.backend_upu.dto.AdminCreateUserRequest;
import com.licenta.backend_upu.dto.AdminUpdateUserRequest;
import com.licenta.backend_upu.dto.AdminResetPasswordRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final VisitRepository visitRepository;
    private final VisitService visitService;

    public AdminDashboardResponse getDashboard() {
        List<VisitStatus> activeStatuses = List.of(
                VisitStatus.REGISTERED,
                VisitStatus.WAITING_CONSULT,
                VisitStatus.IN_CONSULT
        );

        return new AdminDashboardResponse(
                userRepository.countByRole(Role.DOCTOR),
                userRepository.countByRole(Role.NURSE),
                userRepository.countByRole(Role.RECEPTION),
                userRepository.countByIsActive(true),
                userRepository.countByIsActive(false),
                visitRepository.countTodayVisits(),
                visitRepository.countByStatusIn(activeStatuses)
        );
    }

    public List<AdminUserResponse> getUsersByRole(Role role) {
        return userRepository.findByRoleOrderByLastNameAscFirstNameAsc(role)
                .stream()
                .map(this::toAdminUserResponse)
                .toList();
    }



    public AdminUserResponse createUser(AdminCreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Există deja un utilizator cu acest email.");
        }

        User user = new User();

        user.setEmail(request.email());
        user.setPassword(request.password());

        user.setRole(request.role());

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());

        user.setAvailabilityStatus(request.availabilityStatus());

        user.setIsActive(true);

        User saved = userRepository.save(user);

        return toAdminUserResponse(saved);
    }

    public AdminUserResponse toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există."));

        user.setIsActive(!user.getIsActive());

        User saved = userRepository.save(user);

        return toAdminUserResponse(saved);
    }

    public AdminUserResponse updateUser(
            Long userId,
            AdminUpdateUserRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există."));

        user.setEmail(request.email());
        user.setRole(request.role());

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        user.setPhoneNumber(request.phoneNumber());

        user.setAvailabilityStatus(request.availabilityStatus());

        User saved = userRepository.save(user);

        return toAdminUserResponse(saved);
    }

    public void resetPassword(
            Long userId,
            AdminResetPasswordRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există."));

        user.setPassword(request.newPassword());

        userRepository.save(user);
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getIsActive(),
                user.getAvailabilityStatus()
        );
    }

    public List<Visit> getActiveVisits() {
        List<VisitStatus> activeStatuses = List.of(
                VisitStatus.REGISTERED,
                VisitStatus.WAITING_CONSULT,
                VisitStatus.IN_CONSULT
        );

        return visitRepository.findAll()
                .stream()
                .filter(visit -> activeStatuses.contains(visit.getStatus()))
                .toList();
    }

    public Visit cancelVisit(Long visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Vizita nu există."));

        visit.setStatus(VisitStatus.CANCELLED);

        return visitRepository.save(visit);
    }

    public Visit forceDischargeVisit(Long visitId) {
        return visitService.updateVisistStatus(
                visitId,
                "DISCHARGED"
        );
    }
}