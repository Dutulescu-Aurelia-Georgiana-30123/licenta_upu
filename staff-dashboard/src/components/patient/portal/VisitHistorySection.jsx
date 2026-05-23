import Card from "./Card";
import AccordionSection from "./AccordionSection";
import PatientInfoRow from "./PatientInfoRow";
import {
  downloadButtonStyle,
  emptyTextStyle,
  historyCardHeaderStyle,
  historyCardStyle,
  historyDetailsGridStyle,
  historyListStyle,
  noPdfStyle,
  previewButtonStyle,
  statusBoxStyle,
  statusPillStyle,
} from "../../../styles/patientPortalStyles";
import {
  formatDateTime,
  formatVisitStatus,
} from "../../../utils/patientPortalUtils";

export default function VisitHistorySection({
  historyOpen,
  setHistoryOpen,
  visitLoading,
  visitHistory,
  documentsByVisit,
}) {
  return (
    <Card style={{ marginTop: 20 }}>
      <AccordionSection
        title="Istoric vizite"
        open={historyOpen}
        setOpen={setHistoryOpen}
      >
        {visitLoading ? (
          <div style={statusBoxStyle}>Se încarcă istoricul...</div>
        ) : visitHistory.length === 0 ? (
          <p style={emptyTextStyle}>Nu există încă vizite finalizate.</p>
        ) : (
          <div style={historyListStyle}>
            {visitHistory.map((visit) => (
              <div key={visit.id} style={historyCardStyle}>
                <div style={historyCardHeaderStyle}>
                  <div style={{ fontWeight: 950, color: "#102033" }}>
                    {visit.visitCode}
                  </div>

                  <div style={statusPillStyle}>
                    {formatVisitStatus(visit.status)}
                  </div>
                </div>

                <div style={historyDetailsGridStyle}>
                  <PatientInfoRow
                    label="Data"
                    value={formatDateTime(visit.createdAt)}
                  />

                  <PatientInfoRow
                    label="Medic"
                    value={visit.doctorEmail || "Nealocat"}
                  />

                  <PatientInfoRow
                    label="Motiv prezentare"
                    value={visit.presentationReason || "—"}
                  />

                  <PatientInfoRow
                    label="Cod triaj"
                    value={visit.triageColor || "—"}
                  />
                </div>

                {documentsByVisit[visit.id]?.length > 0 ? (
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {documentsByVisit[visit.id].map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          display: "flex",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            window.open(
                              `http://localhost:8081/archived-documents/${doc.id}/view`,
                              "_blank"
                            )
                          }
                          style={previewButtonStyle}
                        >
                          Previzualizează fișa
                        </button>

                        <button
                          onClick={() =>
                            window.open(
                              `http://localhost:8081/archived-documents/${doc.id}/download`,
                              "_blank"
                            )
                          }
                          style={downloadButtonStyle}
                        >
                          Descarcă fișa
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={noPdfStyle}>
                    Nu există încă fișă PDF pentru această vizită.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AccordionSection>
    </Card>
  );
}