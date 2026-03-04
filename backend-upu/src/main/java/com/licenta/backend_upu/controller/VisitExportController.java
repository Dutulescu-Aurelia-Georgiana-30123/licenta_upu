package com.licenta.backend_upu.controller;

import com.licenta.backend_upu.dto.ArchivedDocumentResponse;
import com.licenta.backend_upu.mapper.ArchivedDocumentMapper;
import com.licenta.backend_upu.service.CombinedVisitExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/visits/{visitId}/export")
@RequiredArgsConstructor
public class VisitExportController {
    private final CombinedVisitExportService combinedService;
    private final ArchivedDocumentMapper archivedDocumentMapper;

    @PostMapping("/combined")
    public ArchivedDocumentResponse exportCombined(@PathVariable Long visitId) throws Exception{
        return archivedDocumentMapper.toResponse(combinedService.exportCombined(visitId));
    }

}
