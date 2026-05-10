import { theme } from "../../styles/theme";

export default function WaitingPatientsSection({ visits, onTakePatient }) {
  const waitingVisits = visits.filter((v) => !v.doctorEmail);

  return (
    <div style={theme.card.base}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: theme.colors.text }}>
          Pacienți în așteptare
        </div>
        <div style={{ color: theme.colors.muted, marginTop: 4, fontSize: 13, fontWeight: 700 }}>
          {waitingVisits.length} pacienți disponibili pentru preluare
        </div>
      </div>

      {waitingVisits.length === 0 ? (
        <div
          style={{
            padding: 22,
            borderRadius: 22,
            background: "#f8fafc",
            border: `1px dashed ${theme.colors.border}`,
            color: theme.colors.muted,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          Nu există pacienți în așteptare.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {waitingVisits.map((v) => (
            <div
              key={v.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                padding: 16,
                borderRadius: 22,
                background: "#f8fafc",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div>
                <div style={{ fontWeight: 950, color: theme.colors.text }}>
                  {v.patientFirstName} {v.patientLastName}
                </div>
                <div style={{ color: theme.colors.muted, fontSize: 13, marginTop: 4, fontWeight: 700 }}>
                  Cod vizită: {v.visitCode || "-"}
                </div>
              </div>

              <button
                onClick={() => onTakePatient(v.id)}
                style={theme.button.primary}
              >
                Preia pacient
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}