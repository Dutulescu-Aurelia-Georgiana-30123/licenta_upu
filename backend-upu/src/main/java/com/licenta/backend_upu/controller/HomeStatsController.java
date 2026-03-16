package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.HomeStatsResponse;
import com.licenta.backend_upu.dto.PriorityPatientDto;
import com.licenta.backend_upu.repository.VisitRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HomeStatsController {

    private final VisitRepository visitRepository;

    public HomeStatsController(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    @GetMapping("/stats/home")
    public HomeStatsResponse homeStats() {

        List<String> WAITING = List.of(
                "REGISTERED",
                "WAITING_TRIAGE",
                "TRIAGE_DONE",
                "WAITING_CONSULT"
        );

        List<String> IN_CONSULT = List.of(
                "IN_CONSULT",
                "IN_INVESTIGATION",
                "OBSERVATION"
        );

        List<String> DISCHARGED = List.of(
                "DISCHARGED",
                "ADMITTED",
                "TRANSFERRED"
        );

        long waitingTotal = visitRepository.countByStatuses(WAITING);
        long inConsultTotal = visitRepository.countByStatuses(IN_CONSULT);
        long dischargedTotal = visitRepository.countByStatuses(DISCHARGED);
        long todayTotal = visitRepository.countTodayVisits();

        long waitingTooLong = visitRepository.countWaitingTooLong(WAITING);
        long missingPreform = visitRepository.countMissingPreform(WAITING);
        long missingDischarge = visitRepository.countMissingDischarge(DISCHARGED);

        Map<String, Long> byTriage = new LinkedHashMap<>();
        byTriage.put("ROSU", 0L);
        byTriage.put("GALBEN", 0L);
        byTriage.put("VERDE", 0L);
        byTriage.put("NESETAT", 0L);

        for (VisitRepository.TriageCountRow row : visitRepository.countWaitingByTriage(WAITING)) {
            String key = row.getTriage_color();
            Long cnt = row.getCnt();
            if (key == null) key = "NESETAT";
            byTriage.put(key, cnt);
        }

        List<PriorityPatientDto> priorityPatients = visitRepository.findPriorityPatients(WAITING)
                .stream()
                .map(row -> {
                    PriorityPatientDto dto = new PriorityPatientDto();
                    dto.setVisitId(row.getVisit_id());
                    dto.setVisitCode(row.getVisit_code());
                    dto.setPatientId(row.getPatient_id());
                    dto.setPatientName((row.getFirst_name() == null ? "" : row.getFirst_name()) +
                            " " +
                            (row.getLast_name() == null ? "" : row.getLast_name()));
                    dto.setTriageColor(row.getTriage_color());
                    dto.setStatus(row.getStatus());
                    dto.setWaitingMinutes(row.getWaiting_minutes());
                    return dto;
                })
                .toList();

        HomeStatsResponse r = new HomeStatsResponse();
        r.setWaitingTotal(waitingTotal);
        r.setWaitingByTriage(byTriage);
        r.setInConsultTotal(inConsultTotal);
        r.setDischargedTotal(dischargedTotal);
        r.setTodayTotal(todayTotal);
        r.setWaitingTooLong(waitingTooLong);
        r.setMissingPreform(missingPreform);
        r.setMissingDischarge(missingDischarge);
        r.setPriorityPatients(priorityPatients);

        return r;
    }
}