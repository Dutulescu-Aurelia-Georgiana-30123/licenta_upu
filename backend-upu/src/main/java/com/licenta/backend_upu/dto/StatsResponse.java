package com.licenta.backend_upu.dto;

import lombok.Data;

@Data

public class StatsResponse {
    private long patientsCount;
    private long visitsCount;
    private long preFormsCount;
    private long dischargeFormsCount;
    private long archivedDocumentsCount;
}
