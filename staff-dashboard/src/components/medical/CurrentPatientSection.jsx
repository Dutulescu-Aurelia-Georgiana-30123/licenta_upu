import { theme } from "../../styles/theme";

function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "7px 11px",
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

export default function CurrentPatientSection({
  currentVisit,
  onFinishPatient,
  onToggleForms,
  showForms,
  canFinish,
}) {
  return (
    <div style={theme.card.base}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 950,
              color: theme.colors.text,
            }}
          >
            Pacient curent
          </div>

          <div
            style={{
              marginTop: 4,
              color: theme.colors.muted,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Pacientul activ preluat în fluxul medical
          </div>
        </div>

        {currentVisit && <StatusBadge status={currentVisit.status} />}
      </div>

      {!currentVisit ? (
        <div
          style={{
            marginTop: 18,
            padding: 22,
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
        <div
          style={{
            marginTop: 18,
            borderRadius: 28,
            padding: 22,
            background:
              "linear-gradient(135deg, rgba(8,184,179,0.12), rgba(255,255,255,0.95))",
            border: "1px solid rgba(8,184,179,0.18)",
            boxShadow: "0 18px 45px rgba(8,184,179,0.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            <div>
              <div style={labelStyle}>Cod vizită</div>
              <div style={valueStyle}>{currentVisit.visitCode || "-"}</div>
            </div>

            <div>
              <div style={labelStyle}>Pacient</div>
              <div style={valueStyle}>
                {currentVisit.patientFirstName} {currentVisit.patientLastName}
              </div>
            </div>

            <div>
              <div style={labelStyle}>Status</div>
              <div style={valueStyle}>{currentVisit.status || "-"}</div>
            </div>

            <div>
              <div style={labelStyle}>Triaj</div>
              <div style={valueStyle}>{currentVisit.triageColor || "Neales"}</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <button onClick={onToggleForms} style={theme.button.primary}>
              {showForms ? "Ascunde fișa actuală" : "Deschide fișa actuală"}
            </button>

            {canFinish && (
              <button
                onClick={onFinishPatient}
                style={{
                  ...theme.button.secondary,
                  background: "#dcfce7",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                }}
              >
                Finalizează pacient
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  color: theme.colors.muted,
  fontSize: 12,
  fontWeight: 900,
  marginBottom: 5,
};

const valueStyle = {
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: 950,
};