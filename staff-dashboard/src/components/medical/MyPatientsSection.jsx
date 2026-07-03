import { useState } from "react";
import { theme } from "../../styles/theme";
import { StatusBadge, TriageBadge } from "./MedicalBadges";

const LIMIT = 3;

function staffName(firstName, lastName, email) {
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  return fullName || email || "Neasignat";
}

export default function MyPatientsSection({ myVisits, onOpenVisit }) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const filteredVisits = myVisits.filter((v) => {
    const q = search.trim().toLowerCase();

    if (!q) return true;

    const patientName = `${v.patientFirstName || ""} ${
      v.patientLastName || ""
    }`.toLowerCase();

    const visitCode = (v.visitCode || "").toLowerCase();
    const reason = (v.presentationReason || "").toLowerCase();

    return (
      patientName.includes(q) ||
      visitCode.includes(q) ||
      reason.includes(q)
    );
  });

  const visibleVisits = expanded
    ? filteredVisits
    : filteredVisits.slice(0, LIMIT);

  const hasMore = filteredVisits.length > LIMIT;

  return (
    <div style={theme.card.base}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: theme.colors.text }}>
          Pacienții mei
        </div>
        <div style={subTextStyle}>{myVisits.length} pacienți asignați</div>
        <input
  type="text"
  placeholder="Caută după nume sau cod vizită"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setExpanded(false);
  }}
  style={searchInputStyle}
/>
      </div>

      {myVisits.length === 0 ? (
        <div style={emptyStyle}>Nu ai pacienți asignați.</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {visibleVisits.map((v) => (
              <div
  key={v.id}
  style={rowStyle}
  onClick={() => onOpenVisit && onOpenVisit(v)}
>
                <div style={{ minWidth: 220, flex: 1 }}>
                  <div style={{ fontWeight: 950, color: theme.colors.text }}>
                    {v.patientFirstName} {v.patientLastName}
                  </div>

                  <div style={subTextStyle}>Cod vizită: {v.visitCode || "-"}</div>

                  <div style={reasonStyle}>
                    Motiv: {v.presentationReason || "necompletat"}
                  </div>

                  <div style={staffInfoStyle}>
                    Medic:{" "}
                    {staffName(
                      v.doctorFirstName,
                      v.doctorLastName,
                      v.doctorEmail
                    )}
                  </div>

                  <div style={staffInfoStyle}>
                    Asistent:{" "}
                    {staffName(
                      v.nurseFirstName,
                      v.nurseLastName,
                      v.nurseEmail
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <TriageBadge triageColor={v.triageColor} />
                  <StatusBadge status={v.status} />
                </div>
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
                : `Vezi încă ${filteredVisits.length - LIMIT} pacienți ↓`}
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
  cursor: "pointer",
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

const staffInfoStyle = {
  color: "#475569",
  fontSize: 13,
  marginTop: 6,
  fontWeight: 800,
};

const searchInputStyle = {
  width: "100%",
  marginTop: 14,
  padding: "13px 15px",
  borderRadius: 18,
  border: `1px solid ${theme.colors.border}`,
  background: "#f8fafc",
  color: theme.colors.text,
  outline: "none",
  fontWeight: 800,
  boxSizing: "border-box",
};