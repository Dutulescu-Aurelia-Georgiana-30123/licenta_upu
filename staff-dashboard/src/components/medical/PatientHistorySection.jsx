import { theme } from "../../styles/theme";

function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#f1f5f9",
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {status || "-"}
    </span>
  );
}

export default function PatientHistorySection({
  currentVisit,
  historyVisits,
  onOpenVisit,
}) {
  if (!currentVisit) return null;

  const previousVisits = historyVisits.filter((v) => v.id !== currentVisit.id);

  return (
    <div style={theme.card.base}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: theme.colors.text }}>
          Fișe trecute
        </div>
        <div style={{ color: theme.colors.muted, marginTop: 4, fontSize: 13, fontWeight: 700 }}>
          Istoricul vizitelor pentru pacientul curent
        </div>
      </div>

      {previousVisits.length === 0 ? (
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
          Nu există fișe anterioare pentru acest pacient.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {previousVisits.map((v) => (
            <div
              key={v.id}
              onClick={() => onOpenVisit(v)}
              style={{
                cursor: "pointer",
                padding: 16,
                borderRadius: 22,
                background: "#f8fafc",
                border: `1px solid ${theme.colors.border}`,
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
                  <div style={{ fontWeight: 950, color: theme.colors.text }}>
                    {v.patientFirstName} {v.patientLastName}
                  </div>
                  <div
                    style={{
                      color: theme.colors.muted,
                      fontSize: 13,
                      marginTop: 4,
                      fontWeight: 700,
                    }}
                  >
                    Cod vizită: {v.visitCode || "-"}
                  </div>
                </div>

                <StatusBadge status={v.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}