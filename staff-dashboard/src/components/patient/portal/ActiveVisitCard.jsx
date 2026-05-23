import Card from "./Card";
import PatientInfoRow from "./PatientInfoRow";
import {
  activeInfoGridStyle,
  activeStatusTextStyle,
  activeVisitGridStyle,
  activeVisitMainStyle,
  singleColumnGridStyle,
  statusBoxStyle,
  triageBoxBaseStyle,
} from "../../../styles/patientPortalStyles";
import {
  formatDateTime,
  formatVisitStatus,
  getTriageBackground,
  getTriageColor,
} from "../../../utils/patientPortalUtils";

export default function ActiveVisitCard({ activeVisit, visitLoading, isMobile }) {
  return (
    <Card
      title="Status vizită actuală"
      subtitle="Informațiile vizibile pentru vizita activă"
      style={{ marginTop: 20 }}
    >
      {visitLoading ? (
        <div style={statusBoxStyle}>Se încarcă vizita...</div>
      ) : activeVisit ? (
        <div style={isMobile ? singleColumnGridStyle : activeVisitGridStyle}>
          <div style={activeVisitMainStyle}>
            <div style={{ color: "#667085", fontWeight: 800, fontSize: 13 }}>
              Status curent
            </div>

            <div style={activeStatusTextStyle}>
              {formatVisitStatus(activeVisit.status)}
            </div>
          </div>

          <div
            style={{
              ...triageBoxBaseStyle,
              background: getTriageBackground(activeVisit.triageColor),
              border: `2px solid ${getTriageColor(activeVisit.triageColor)}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                marginBottom: 6,
                color: getTriageColor(activeVisit.triageColor),
              }}
            >
              COD DE TRIAJ
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 950,
                color: getTriageColor(activeVisit.triageColor),
              }}
            >
              {activeVisit.triageColor || "Neatribuit"}
            </div>
          </div>

          <div style={isMobile ? singleColumnGridStyle : activeInfoGridStyle}>
            <PatientInfoRow label="Cod vizită" value={activeVisit.visitCode} />
            <PatientInfoRow
              label="Data înregistrării"
              value={formatDateTime(activeVisit.createdAt)}
            />
            <PatientInfoRow
              label="Motiv prezentare"
              value={activeVisit.presentationReason}
            />
            <PatientInfoRow label="Medic" value={activeVisit.doctorEmail} />
          </div>
        </div>
      ) : (
        <div style={statusBoxStyle}>Nu există momentan o vizită activă.</div>
      )}
    </Card>
  );
}