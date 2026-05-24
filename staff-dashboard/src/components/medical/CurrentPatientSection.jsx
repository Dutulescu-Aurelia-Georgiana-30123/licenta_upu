import { useState } from "react";
import { theme } from "../../styles/theme";
import { StatusBadge, TriageBadge } from "./MedicalBadges";
import { getStatusLabel } from "../../utils/visitStatus";
import { getTriageLabel } from "../../utils/triage";

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div
        style={{
          color: theme.colors.muted,
          fontSize: 12,
          fontWeight: 900,
          marginBottom: 5,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: theme.colors.text,
          fontSize: 16,
          fontWeight: 950,
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

export default function CurrentPatientSection({
  currentVisit,
  onFinishPatient,
  onFinishAndExport,
  onPrintForms,
  onToggleForms,
  showForms,
  canFinish,
  finalStatus,
  setFinalStatus,
  historyVisits = [],
  onOpenPreviousVisit,
}) {
  const [showHistory, setShowHistory] = useState(false);

  const previousVisits = historyVisits
    .filter((v) => v.id !== currentVisit?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(255,255,255,0.8)",
        borderRadius: 34,
        padding: 24,
        boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#102033",
              letterSpacing: -0.4,
            }}
          >
            Pacient curent
          </div>

          <div
            style={{
              marginTop: 4,
              color: "#6b7280",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Pacientul activ preluat în fluxul medical
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {currentVisit && previousVisits.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              style={{
                ...theme.button.secondary,
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
              }}
            >
              {showHistory
                ? "Ascunde vizitele ↑"
                : `Vizite anterioare (${previousVisits.length}) ↓`}
            </button>
          )}

          {currentVisit && <StatusBadge status={currentVisit.status} />}
          {currentVisit && <TriageBadge triageColor={currentVisit.triageColor} />}
        </div>
      </div>

      {!currentVisit ? (
        <div
          style={{
            padding: 24,
            borderRadius: 24,
            background: "#f8fafc",
            border: `1px dashed ${theme.colors.border}`,
            color: theme.colors.muted,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          Nu ai niciun pacient activ.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            <InfoBox label="Cod vizită" value={currentVisit.visitCode} />

            <InfoBox
              label="Pacient"
              value={`${currentVisit.patientFirstName || ""} ${
                currentVisit.patientLastName || ""
              }`}
            />

            <InfoBox label="Status" value={getStatusLabel(currentVisit.status)} />

            <InfoBox
  label="Triaj"
  value={getTriageLabel(currentVisit.triageColor)}
/>
          </div>

          {showHistory && previousVisits.length > 0 && (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 24,
                background: "#f8fafc",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  marginBottom: 10,
                  color: theme.colors.text,
                  fontWeight: 900,
                  fontSize: 15,
                }}
              >
                Vizite anterioare
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {previousVisits.map((visit) => (
                  <div
                    key={visit.id}
                    onClick={() => onOpenPreviousVisit && onOpenPreviousVisit(visit)}
                    style={{
                      padding: 14,
                      borderRadius: 18,
                      background: "#ffffff",
                      border: `1px solid ${theme.colors.border}`,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 900,
                            color: theme.colors.text,
                          }}
                        >
                          {visit.visitCode || `Vizita ${visit.id}`}
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            color: theme.colors.muted,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          Status: {getStatusLabel(visit.status)}
                        </div>
                      </div>

                      <div
                        style={{
                          color: theme.colors.muted,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {visit.createdAt
                          ? new Date(visit.createdAt).toLocaleString("ro-RO")
                          : "-"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

         <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 20,
  }}
>
  <button onClick={onToggleForms} style={theme.button.primary}>
    {showForms ? "Ascunde fișa actuală" : "Deschide fișa actuală"}
  </button>

</div>
        </>
      )}
    </div>
  );
}