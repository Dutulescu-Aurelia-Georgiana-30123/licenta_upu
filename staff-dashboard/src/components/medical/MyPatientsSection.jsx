import { theme } from "../../styles/theme";

function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        background: theme.colors.primarySoft,
        color: theme.colors.primaryDark,
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {status || "-"}
    </span>
  );
}

export default function MyPatientsSection({ myVisits }) {
  return (
    <div style={theme.card.base}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: theme.colors.text }}>
          Pacienții mei
        </div>
        <div style={{ color: theme.colors.muted, marginTop: 4, fontSize: 13, fontWeight: 700 }}>
          {myVisits.length} pacienți asignați
        </div>
      </div>

      {myVisits.length === 0 ? (
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
          Nu ai pacienți asignați.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {myVisits.map((v) => (
            <div
              key={v.id}
              style={{
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
                  <div style={{ color: theme.colors.muted, fontSize: 13, marginTop: 4, fontWeight: 700 }}>
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