package com.licenta.backend_upu.service;

import com.licenta.backend_upu.entity.AuditLog;
import com.licenta.backend_upu.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(
            String action,
            String details,
            Long performedByUserId,
            String performedByName
    ) {
        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setDetails(details);
        auditLog.setPerformedByUserId(performedByUserId);
        auditLog.setPerformedByName(performedByName);
        auditLog.setCreatedAt(LocalDateTime.now());

        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getLatestLogs() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }
}