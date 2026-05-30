import {
  tealDark,
  cardStyle,
  secondaryButtonStyle,
  tableHeadCellStyle,
  tableCellStyle,
} from "./adminStyles";

const actionLabels = {
  CREATE_USER: "Utilizator creat",
  UPDATE_USER: "Utilizator modificat",
  RESET_PASSWORD: "Parolă resetată",
  ACTIVATE_USER: "Utilizator activat",
  DEACTIVATE_USER: "Utilizator dezactivat",
  DELETE_PATIENT: "Pacient șters",
  CANCEL_VISIT: "Vizită anulată",
  FORCE_DISCHARGE_VISIT: "Vizită finalizată forțat",
};

function getActionLabel(action) {
  return actionLabels[action] || action || "-";
}

export default function AdminAudit({ auditLogs, loadingAudit, onReloadAudit }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 24 }}>
            Jurnal activitate
          </h2>

          <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
            Istoricul ultimelor acțiuni administrative din sistem
          </div>
        </div>

        <button type="button" onClick={onReloadAudit} style={secondaryButtonStyle}>
          Reîncarcă
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#ffffff" }}>
          <thead>
            <tr>
              <th style={tableHeadCellStyle}>Dată</th>
              <th style={tableHeadCellStyle}>Acțiune</th>
              <th style={tableHeadCellStyle}>Detalii</th>
              <th style={tableHeadCellStyle}>Utilizator</th>
            </tr>
          </thead>

          <tbody>
            {loadingAudit && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                  Se încarcă...
                </td>
              </tr>
            )}

            {!loadingAudit &&
              auditLogs.map((log) => (
                <tr key={log.id}>
                  <td style={tableCellStyle}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleString("ro-RO") : "-"}
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
                      {getActionLabel(log.action)}
                    </span>
                  </td>

                  <td style={tableCellStyle}>{log.details || "-"}</td>

                  <td style={tableCellStyle}>{log.performedByName || "ADMIN"}</td>
                </tr>
              ))}

            {!loadingAudit && auditLogs.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 22, color: "#64748b", fontWeight: 800 }}>
                  Nu există încă acțiuni în jurnal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}