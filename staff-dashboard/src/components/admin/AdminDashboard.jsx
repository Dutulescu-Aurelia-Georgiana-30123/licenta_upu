import {
  teal,
  tealDark,
  cardStyle,
} from "./adminStyles";

const actionLabels = {
  CREATE_USER: "Utilizator creat",
  UPDATE_USER: "Utilizator modificat",
  RESET_PASSWORD: "Parolă resetată",
  ACTIVATE_USER: "Utilizator activat",
  DEACTIVATE_USER: "Utilizator dezactivat",
  DELETE_PATIENT: "Pacient șters",
  UPDATE_PATIENT: "Pacient modificat",
  CANCEL_VISIT: "Vizită anulată",
  FORCE_DISCHARGE_VISIT: "Vizită finalizată forțat",
};

function getActionLabel(action) {
  return actionLabels[action] || action || "-";
}

export default function AdminDashboard({stats, auditLogs = [], }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {stat.label}
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 34,
                fontWeight: 950,
                color: "#102033",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
  <h2 style={{ margin: 0, color: "#102033", fontSize: 22 }}>
    Activitate recentă
  </h2>

  <div
    style={{
      display: "grid",
      gap: 10,
      marginTop: 18,
    }}
  >
    {auditLogs.length === 0 ? (
      <div
        style={{
          color: "#64748b",
          fontWeight: 800,
        }}
      >
        Nu există activitate recentă.
      </div>
    ) : (
      auditLogs.slice(0, 5).map((log) => (
        <div
          key={log.id}
          style={{
            padding: 12,
            borderRadius: 14,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontWeight: 900,
              color: "#102033",
              marginBottom: 4,
            }}
          >
           {getActionLabel(log.action)}
          </div>

          <div
            style={{
              color: "#475569",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {log.details || "-"}
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#94a3b8",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {log.createdAt
              ? new Date(log.createdAt).toLocaleString("ro-RO")
              : "-"}
          </div>
        </div>
      ))
    )}
  </div>
</div>

        <div style={cardStyle}>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 22 }}>
            Distribuție roluri
          </h2>

          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            {[
              ["Medici", stats.find((s) => s.label === "Total medici")?.value || 0],
              ["Asistenți", stats.find((s) => s.label === "Total asistenți")?.value || 0],
              ["Recepție", stats.find((s) => s.label === "Conturi recepție")?.value || 0],
            ].map(([label, value]) => (
              <div key={label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 7,
                    color: "#334155",
                    fontWeight: 850,
                  }}
                >
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "#e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(Number(value) * 4, 100)}%`,
                      background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}