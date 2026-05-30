package com.licenta.backend_upu.mapper;

import com.licenta.backend_upu.dto.AuditLogResponse;
import com.licenta.backend_upu.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogResponse toResponse(AuditLog log) {

        AuditLogResponse response = new AuditLogResponse();

        response.setId(log.getId());
        response.setAction(log.getAction());
        response.setDetails(log.getDetails());

        response.setPerformedByUserId(log.getPerformedByUserId());
        response.setPerformedByName(log.getPerformedByName());

        response.setCreatedAt(log.getCreatedAt());

        return response;
    }
}