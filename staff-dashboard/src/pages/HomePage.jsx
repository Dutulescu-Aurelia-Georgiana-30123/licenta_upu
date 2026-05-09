import { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import { useToast } from "../context/ToastContext";

function Card({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5eef8",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
      }}
    >
      {title && (
        <div style={{ marginBottom: subtitle ? 4 : 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function StatCard({ title, value, description, accent = "#2563eb", icon = "●" }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#0f172a",
              marginTop: 8,
              letterSpacing: -1,
            }}
          >
            {value ?? 0}
          </div>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: `${accent}18`,
            color: accent,
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ marginTop: 12, color: "#94a3b8", fontSize: 12 }}>
        {description}
      </div>
    </Card>
  );
}

function AlertRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #edf2f7",
      }}
    >
      <span style={{ color: "#475569", fontWeight: 600 }}>{label}</span>
      <span style={{ fontWeight: 900, fontSize: 20, color: "#0f172a" }}>
        {value ?? 0}
      </span>
    </div>
  );
}

function TriageBadge({ color, label, value, bg }) {
  return (
    <span
      style={{
        padding: "9px 12px",
        borderRadius: 999,
        background: bg,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: "#0f172a",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
      {label}: {value ?? 0}
    </span>
  );
}

function TriageTextBadge({ value }) {
  const config = {
    ROSU: { label: "Roșu", bg: "#fee2e2", color: "#991b1b" },
    GALBEN: { label: "Galben", bg: "#fef3c7", color: "#92400e" },
    VERDE: { label: "Verde", bg: "#dcfce7", color: "#166534" },
    CONSULT: { label: "Consult", bg: "#dbeafe", color: "#1d4ed8" },
    NESETAT: { label: "Netriat", bg: "#f1f5f9", color: "#64748b" },
  };

  const item = config[value] || { label: value || "-", bg: "#f1f5f9", color: "#64748b" };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {item.label}
    </span>
  );
}

function PriorityRow({ patient }) {
  const cellStyle = {
    padding: "12px 10px",
    borderBottom: "1px solid #edf2f7",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#334155",
    fontWeight: 600,
  };

  return (
    <tr>
      <td style={cellStyle}>{patient.visitCode}</td>
      <td style={cellStyle}>{patient.patientName}</td>
      <td style={cellStyle}>
        <TriageTextBadge value={patient.triageColor} />
      </td>
      <td style={cellStyle}>{patient.status}</td>
      <td style={cellStyle}>{patient.waitingMinutes ?? 0} min</td>
    </tr>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState(0);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useToast();

  const load = async (silent = false) => {
    setError("");
    try {
      const data = await apiGet("/stats/home");
      setStats(data);

      const doctors = await apiGet("/auth/available-doctors");
      setAvailableDoctors(doctors);

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
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              color: "#0f172a",
              letterSpacing: -0.6,
            }}
          >
            Dashboard
          </h2>
          <div style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            Monitorizare rapidă pacienți, triaj și flux UPU
          </div>
        </div>

        <button
          onClick={() => load(false)}
          style={{
            padding: "10px 16px",
            borderRadius: 14,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 12px 25px rgba(37, 99, 235, 0.22)",
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: 700,
          }}
        >
          Eroare /stats/home: {error}
        </div>
      )}

      {!stats ? (
        <Card>
          <div style={{ color: "#64748b" }}>Se încarcă...</div>
        </Card>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            <StatCard
              title="Pacienți în așteptare"
              value={stats.waitingTotal}
              description="Pacienți aflați în fluxul de așteptare"
              accent="#2563eb"
              icon="⌛"
            />

            <StatCard
              title="Pacienți în consult"
              value={stats.inConsultTotal}
              description="Consult / investigații / observație"
              accent="#14b8a6"
              icon="🩺"
            />

            <StatCard
              title="Finalizați"
              value={stats.dischargedTotal}
              description="Externat / internat / transferat"
              accent="#22c55e"
              icon="✓"
            />

            <StatCard
              title="Vizite azi"
              value={stats.todayTotal ?? 0}
              description="Vizite create în ziua curentă"
              accent="#8b5cf6"
              icon="＋"
            />

            <StatCard
              title="Medici disponibili"
              value={availableDoctors}
              description="Medici disponibili în acest moment"
              accent="#0ea5e9"
              icon="👨‍⚕️"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.25fr 0.75fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            <Card
              title="Distribuție coduri de triere"
              subtitle="Prioritate: Roșu > Galben > Verde > Consult > Netriat"
            >
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <TriageBadge
                  color="#ef4444"
                  bg="#fee2e2"
                  label="Roșu"
                  value={stats.waitingByTriage?.ROSU}
                />
                <TriageBadge
                  color="#f59e0b"
                  bg="#fef3c7"
                  label="Galben"
                  value={stats.waitingByTriage?.GALBEN}
                />
                <TriageBadge
                  color="#22c55e"
                  bg="#dcfce7"
                  label="Verde"
                  value={stats.waitingByTriage?.VERDE}
                />
                <TriageBadge
                  color="#3b82f6"
                  bg="#dbeafe"
                  label="Consult"
                  value={stats.waitingByTriage?.CONSULT}
                />
                <TriageBadge
                  color="#94a3b8"
                  bg="#f1f5f9"
                  label="Netriat"
                  value={stats.waitingByTriage?.NESETAT}
                />
              </div>
            </Card>

            <Card title="Atenție acum">
              <div style={{ marginTop: 2 }}>
                <AlertRow label="Pacienți care așteaptă prea mult" value={stats.waitingTooLong} />
                <AlertRow label="Pacienți fără preform" value={stats.missingPreform} />
                <AlertRow label="Pacienți fără externare completă" value={stats.missingDischarge} />
              </div>
            </Card>
          </div>

          <div style={{ marginTop: 14 }}>
            <Card title="Pacienți prioritari">
              {!stats.priorityPatients || stats.priorityPatients.length === 0 ? (
                <p style={{ color: "#64748b", marginTop: 12, marginBottom: 0 }}>
                  Nu există pacienți prioritari în acest moment.
                </p>
              ) : (
                <div style={{ marginTop: 10, overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr style={{ textAlign: "left", color: "#64748b", fontSize: 13 }}>
                        <th style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                          Cod vizită
                        </th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                          Pacient
                        </th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                          Triage
                        </th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                          Status
                        </th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #e2e8f0" }}>
                          Timp așteptare
                        </th>
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
            </Card>
          </div>
        </>
      )}
    </div>
  );
}