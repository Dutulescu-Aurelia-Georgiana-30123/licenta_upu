package com.licenta.backend_upu.repository;

import com.licenta.backend_upu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.licenta.backend_upu.entity.Role;
import com.licenta.backend_upu.entity.AvailabilityStatus;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRoleAndAvailabilityStatus(
            Role role,
            AvailabilityStatus availabilityStatus
    );
}