package com.licenta.backend_upu.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class HomeStatsResponse {
    private long waitingTotal;
    private Map<String, Long> waitingByTriage;

    private long inConsultTotal;
    private long dischargedTotal;
    private long todayTotal;

    private long waitingTooLong;
    private long missingPreform;
    private long missingDischarge;

    private List<PriorityPatientDto> priorityPatients;
}