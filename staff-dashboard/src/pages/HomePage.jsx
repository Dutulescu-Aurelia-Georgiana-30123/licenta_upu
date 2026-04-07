import { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import { useToast } from "../context/ToastContext";

function StatBox({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 12,
        padding: 12,
        background: "#121212",
      }}
    >
      <div style={{ fontSize: 12, color: "#aaa" }}>{title}</div>
      {children}
    </div>
  );
}

function AlertRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #262626",
      }}
    >
      <span style={{ color: "#ddd" }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 18 }}>{value ?? 0}</span>
    </div>
  );
}

function TriageBadge({ color, label, value }) {
  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #333",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
      {label}: <b>{value ?? 0}</b>
    </span>
  );
}

function PriorityRow({ patient }) {
  const cellStyle = {
    padding: 8,
    borderBottom: "1px solid #262626",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <tr>
      <td style={cellStyle}>{patient.visitCode}</td>
      <td style={cellStyle}>{patient.patientName}</td>
      <td style={cellStyle}>{patient.triageColor}</td>
      <td style={cellStyle}>{patient.status}</td>
      <td style={cellStyle}>{patient.waitingMinutes ?? 0} min</td>
    </tr>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useToast();

 const load = async (silent = false) => {
  setError("");
  try {
    const data = await apiGet("/stats/home");
    setStats(data);
    if (!silent) showSuccess("Datele au fost actualizate");
  } catch (e) {
    const msg = String(e);
    setError(msg);
    if (!silent) showError("Eroare la încărcarea datelor");
  }
};

useEffect(() => {
  load(true); 
}, []);

  return (
    <div style={{ padding: 12, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Overview</h2>
        <button onClick={load} style={{ padding: "6px 10px" }}>
          Refresh
        </button>
      </div>

      {error && <p style={{ color: "red" }}>Eroare /stats/home: {error}</p>}

      {!stats ? (
        <p style={{ color: "#aaa", marginTop: 12 }}>Se încarcă...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
              marginTop: 12,
              width: "100%",
            }}
          >
            <StatBox title="Pacienți în așteptare">
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{stats.waitingTotal}</div>
              <div style={{ marginTop: 10, color: "#aaa", fontSize: 12 }}>
                Pacienți aflați în fluxul de așteptare
              </div>
            </StatBox>

            <StatBox title="Pacienți în consult">
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{stats.inConsultTotal}</div>
              <div style={{ marginTop: 10, color: "#aaa", fontSize: 12 }}>
                Include consult / investigații / observație
              </div>
            </StatBox>

            <StatBox title="Pacienți externați/finalizați">
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{stats.dischargedTotal}</div>
              <div style={{ marginTop: 10, color: "#aaa", fontSize: 12 }}>
                Externat / internat / transferat
              </div>
            </StatBox>

            <StatBox title="Total vizite azi">
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{stats.todayTotal ?? 0}</div>
              <div style={{ marginTop: 10, color: "#aaa", fontSize: 12 }}>
                Vizite create astăzi
              </div>
            </StatBox>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 12,
              marginTop: 12,
            }}
          >
            <StatBox title="Distribuție coduri de triere">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <TriageBadge color="#ff3b30" label="Roșu" value={stats.waitingByTriage?.ROSU} />
                <TriageBadge color="#ffd60a" label="Galben" value={stats.waitingByTriage?.GALBEN} />
                <TriageBadge color="#32d74b" label="Verde" value={stats.waitingByTriage?.VERDE} />
                <TriageBadge color="#d1d1d6" label="Netriat" value={stats.waitingByTriage?.NESETAT} />
              </div>

              <div style={{ marginTop: 12, color: "#aaa", fontSize: 12 }}>
                Prioritate: Roșu &gt; Galben &gt; Verde &gt; Netriat
              </div>
            </StatBox>

            <StatBox title="Atenție acum">
              <div style={{ marginTop: 6 }}>
                <AlertRow label="Pacienți care așteaptă prea mult" value={stats.waitingTooLong} />
                <AlertRow label="Pacienți fără preform" value={stats.missingPreform} />
                <AlertRow label="Pacienți fără externare completă" value={stats.missingDischarge} />
              </div>
            </StatBox>
          </div>

          <div style={{ marginTop: 12 }}>
            <StatBox title="Pacienți prioritari">
              {!stats.priorityPatients || stats.priorityPatients.length === 0 ? (
                <p style={{ color: "#aaa", marginTop: 12, marginBottom: 0 }}>
                  Nu există pacienți prioritari în acest moment.
                </p>
              ) : (
                <div style={{ marginTop: 10, overflowX: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "#aaa" }}>
                        <th style={{ padding: 8, borderBottom: "1px solid #333" }}>Cod vizită</th>
                        <th style={{ padding: 8, borderBottom: "1px solid #333" }}>Pacient</th>
                        <th style={{ padding: 8, borderBottom: "1px solid #333" }}>Triage</th>
                        <th style={{ padding: 8, borderBottom: "1px solid #333" }}>Status</th>
                        <th style={{ padding: 8, borderBottom: "1px solid #333" }}>Timp așteptare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.priorityPatients.map((patient) => (
                        <PriorityRow key={patient.visitId} patient={patient} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </StatBox>
          </div>
        </>
      )}
    </div>
  );
}