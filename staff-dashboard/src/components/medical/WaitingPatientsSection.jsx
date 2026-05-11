import { useState } from "react";
import { theme } from "../../styles/theme";

const LIMIT = 4;

function TriageBadge({ triageColor }) {
  const config = {
    ROSU: { label: "Roșu", bg: "#fee2e2", color: "#991b1b" },
    GALBEN: { label: "Galben", bg: "#fef3c7", color: "#92400e" },
    VERDE: { label: "Verde", bg: "#dcfce7", color: "#166534" },
    CONSULT: { label: "Consult", bg: "#dbeafe", color: "#1d4ed8" },
  };

  const item = config[triageColor] || {
    label: "Netriat",
    bg: "#f1f5f9",
    color: "#64748b",
  };

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {item.label}
    </span>
  );
}

export default function WaitingPatientsSection({ visits, onTakePatient }) {
  const [expanded, setExpanded] = useState(false);

  const waitingVisits = visits.filter((v) => !v.doctorEmail);
  const visibleVisits = expanded ? waitingVisits : waitingVisits.slice(0, LIMIT);
  const hasMore = waitingVisits.length > LIMIT;

  return (
    <div style={theme.card.base}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: theme.colors.text }}>
          Pacienți în așteptare
        </div>
        <div style={subTextStyle}>
          {waitingVisits.length} pacienți disponibili pentru preluare
        </div>
      </div>

      {waitingVisits.length === 0 ? (
        <div style={emptyStyle}>Nu există pacienți în așteptare.</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {visibleVisits.map((v) => (
              <div key={v.id} style={rowStyle}>
                <div style={{ minWidth: 220, flex: 1 }}>
                  <div style={{ fontWeight: 950, color: theme.colors.text }}>
                    {v.patientFirstName} {v.patientLastName}
                  </div>

                  <div style={subTextStyle}>Cod vizită: {v.visitCode || "-"}</div>

                  <div style={reasonStyle}>
                    Motiv: {v.presentationReason || "necompletat"}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 6, minWidth: 140 }}>
                  <TriageBadge triageColor={v.triageColor} />
                  <div style={subTextStyle}>Status: {v.status || "-"}</div>
                </div>

                <button onClick={() => onTakePatient(v.id)} style={theme.button.primary}>
                  Preia pacient
                </button>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              style={{
                ...theme.button.secondary,
                width: "100%",
                marginTop: 14,
              }}
            >
              {expanded
                ? "Restrânge lista ↑"
                : `Vezi încă ${waitingVisits.length - LIMIT} pacienți ↓`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

const emptyStyle = {
  padding: 22,
  borderRadius: 22,
  background: "#f8fafc",
  border: `1px dashed ${theme.colors.border}`,
  color: theme.colors.muted,
  fontWeight: 800,
  textAlign: "center",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
  padding: 16,
  borderRadius: 22,
  background: "#f8fafc",
  border: `1px solid ${theme.colors.border}`,
};

const subTextStyle = {
  color: theme.colors.muted,
  fontSize: 13,
  marginTop: 4,
  fontWeight: 700,
};

const reasonStyle = {
  color: "#334155",
  fontSize: 13,
  marginTop: 6,
  fontWeight: 800,
  lineHeight: 1.35,
};