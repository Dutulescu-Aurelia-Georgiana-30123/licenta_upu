package com.licenta.backend_upu.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class PdfExportService {

    public void createSimplePdf(File outputFile, String title, String[] lines) throws IOException {
        outputFile.getParentFile().mkdirs();

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                content.beginText();
                content.setFont(PDType1Font.HELVETICA_BOLD, 16);
                content.newLineAtOffset(50, 750);
                content.showText(title);

                content.setFont(PDType1Font.HELVETICA, 12);
                float y = 720;

                for (String line : lines) {
                    if (line == null) line = "";
                    content.newLineAtOffset(0, -18);
                    y -= 18;
                    if (y < 60) break;
                    content.showText(line);
                }

                content.endText();
            }

            document.save(outputFile);
        }
    }

    public void createMultiPagePdf(File outputFile, String[][] pages, String[] pageTitles) throws IOException {
        outputFile.getParentFile().mkdirs();

        try (PDDocument document = new PDDocument()) {
            for (int i = 0; i < pages.length; i++) {
                addSectionWithAutoPages(document, pageTitles[i], pages[i]);
            }

            document.save(outputFile);
        }
    }

    private void addSectionWithAutoPages(PDDocument document, String title, String[] lines) throws IOException {
        PDPage page = new PDPage();
        document.addPage(page);

        PDPageContentStream content = new PDPageContentStream(document, page);
        content.beginText();
        content.setFont(PDType1Font.HELVETICA_BOLD, 16);
        content.newLineAtOffset(50, 750);
        content.showText(title);

        content.setFont(PDType1Font.HELVETICA, 12);
        float y = 720;

        for (String line : lines) {
            if (line == null) line = "";

            if (y < 60) {
                content.endText();
                content.close();

                page = new PDPage();
                document.addPage(page);
                content = new PDPageContentStream(document, page);
                content.beginText();
                content.setFont(PDType1Font.HELVETICA_BOLD, 16);
                content.newLineAtOffset(50, 750);
                content.showText(title + " (continuare)");

                content.setFont(PDType1Font.HELVETICA, 12);
                y = 720;
            }

            content.newLineAtOffset(0, -18);
            y -= 18;
            content.showText(line);
        }

        content.endText();
        content.close();
    }
}