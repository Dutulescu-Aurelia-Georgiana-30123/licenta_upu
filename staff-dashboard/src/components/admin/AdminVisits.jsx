import {
  tealDark,
  cardStyle,
  secondaryButtonStyle,
  tableHeadCellStyle,
  tableCellStyle,
} from "./adminStyles";

export default function AdminVisits({
  activeVisits,
  loadingActiveVisits,
  selectedVisitDetails,
  setSelectedVisitDetails,
  onReloadActiveVisits,
  onForceDischargeVisit,
  onCancelVisit,
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 24 }}>
            Vizite active
          </h2>

          <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
            Vizite care nu sunt încă externate, internate sau transferate
          </div>
        </div>

        <button
          type="button"
          onClick={onReloadActiveVisits}
          style={secondaryButtonStyle}
        >
          Reîncarcă
        </button>
      </div>

      {selectedVisitDetails && (
        <div
          style={{
            marginBottom: 18,
            padding: 18,
            borderRadius: 24,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontWeight: 950, color: "#102033", fontSize: 18 }}>
                Detalii vizită {selectedVisitDetails.visitCode}
              </div>

              <div style={{ color: "#64748b", fontWeight: 700, marginTop: 4 }}>
                Informații administrative despre vizita activă
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedVisitDetails(null)}
              style={secondaryButtonStyle}
            >
              Închide
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <strong>Pacient:</strong>
              <div>
                {selectedVisitDetails.patientFirstName || ""}{" "}
                {selectedVisitDetails.patientLastName || ""}
              </div>
            </div>

            <div>
              <strong>Status:</strong>
              <div>{selectedVisitDetails.status || "-"}</div>
            </div>

            <div>
              <strong>Creată la:</strong>
              <div>
                {selectedVisitDetails.createdAt
                  ? new Date(selectedVisitDetails.createdAt).toLocaleString(
                      "ro-RO"
                    )
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Medic:</strong>
              <div>
                {selectedVisitDetails.doctorFirstName
                  ? `${selectedVisitDetails.doctorFirstName} ${
                      selectedVisitDetails.doctorLastName || ""
                    }`
                  : "Neasignat"}
              </div>
            </div>

            <div>
              <strong>Asistent:</strong>
              <div>
                {selectedVisitDetails.nurseFirstName
                  ? `${selectedVisitDetails.nurseFirstName} ${
                      selectedVisitDetails.nurseLastName || ""
                    }`
                  : "Neasignat"}
              </div>
            </div>

            <div>
              <strong>Triaj:</strong>
              <div>{selectedVisitDetails.triageColor || "Nesetat"}</div>
            </div>
          </div>

          <div>
            <strong>Motiv prezentare:</strong>
            <div style={{ marginTop: 6, color: "#334155", fontWeight: 700 }}>
              {selectedVisitDetails.presentationReason || "Nespecificat"}
            </div>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "#ffffff",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeadCellStyle}>Cod vizită</th>
              <th style={tableHeadCellStyle}>Pacient</th>
              <th style={tableHeadCellStyle}>Status</th>
              <th style={tableHeadCellStyle}>Medic</th>
              <th style={tableHeadCellStyle}>Asistent</th>
              <th style={tableHeadCellStyle}>Creată la</th>
              <th style={tableHeadCellStyle}>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            {loadingActiveVisits && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                  Se încarcă...
                </td>
              </tr>
            )}

            {!loadingActiveVisits &&
              activeVisits.map((visit) => (
                <tr key={visit.id}>
                  <td style={tableCellStyle}>{visit.visitCode || "-"}</td>

                  <td style={tableCellStyle}>
                    {visit.patientFirstName || ""} {visit.patientLastName || ""}
                  </td>

                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#e6fffd",
                        color: tealDark,
                        fontWeight: 900,
                        fontSize: 12,
                      }}
                    >
                      {visit.status}
                    </span>
                  </td>

                  <td style={tableCellStyle}>
                    {visit.doctorFirstName
                      ? `${visit.doctorFirstName} ${visit.doctorLastName || ""}`
                      : "-"}
                  </td>

                  <td style={tableCellStyle}>
                    {visit.nurseFirstName
                      ? `${visit.nurseFirstName} ${visit.nurseLastName || ""}`
                      : "-"}
                  </td>

                  <td style={tableCellStyle}>
                    {visit.createdAt
                      ? new Date(visit.createdAt).toLocaleString("ro-RO")
                      : "-"}
                  </td>

                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedVisitDetails(visit)}
                        style={secondaryButtonStyle}
                      >
                        Vezi
                      </button>

                      <button
                        type="button"
                        onClick={() => onForceDischargeVisit(visit.id)}
                        style={secondaryButtonStyle}
                      >
                        Finalizează forțat
                      </button>

                      <button
                        type="button"
                        onClick={() => onCancelVisit(visit.id)}
                        style={secondaryButtonStyle}
                      >
                        Anulează
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loadingActiveVisits && activeVisits.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 22,
                    color: "#64748b",
                    fontWeight: 800,
                  }}
                >
                  Nu există vizite active momentan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}