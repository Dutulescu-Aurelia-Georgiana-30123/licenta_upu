import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api/api";
import { useToast } from "../context/ToastContext";

const teal = "#08b8b3";
const tealDark = "#069a96";

function Card({ title, subtitle, children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 28,
        padding: 22,
        boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {title && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#102033" }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 13, color: "#667085", marginTop: 4, fontWeight: 600 }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function StatCard({ title, value, description, accent = teal, icon = "●" }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: "#667085", fontWeight: 800 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 950,
              color: "#102033",
              marginTop: 8,
              letterSpacing: -1.4,
            }}
          >
            {value ?? 0}
          </div>
        </div>

        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 18,
            background: `${accent}18`,
            color: accent,
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            fontSize: 22,
            boxShadow: `0 14px 30px ${accent}22`,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ marginTop: 14, color: "#8a97a8", fontSize: 12, fontWeight: 700 }}>
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
        padding: "13px 0",
        borderBottom: "1px solid #edf2f7",
      }}
    >
      <span style={{ color: "#475569", fontWeight: 700 }}>{label}</span>
      <span style={{ fontWeight: 950, fontSize: 21, color: "#102033" }}>
        {value ?? 0}
      </span>
    </div>
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
        padding: "7px 11px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {item.label}
    </span>
  );
}

function TriageBar({ label, value, total, color, bg }) {
  const percent = total > 0 ? Math.round(((value ?? 0) / total) * 100) : 0;

  return (
    <div style={{ display: "grid", gap: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <span style={{ color: "#334155", fontWeight: 800, fontSize: 13 }}>{label}</span>
        <span style={{ color: "#667085", fontWeight: 900, fontSize: 13 }}>
          {value ?? 0} · {percent}%
        </span>
      </div>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: bg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function PriorityRow({ patient }) {
  const cellStyle = {
    padding: "13px 10px",
    borderBottom: "1px solid #edf2f7",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#334155",
    fontWeight: 700,
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

export default function HomePage({ onNavigate }) {
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

  const triageTotal = useMemo(() => {
    const t = stats?.waitingByTriage || {};
    return (
      (t.ROSU ?? 0) +
      (t.GALBEN ?? 0) +
      (t.VERDE ?? 0) +
      (t.CONSULT ?? 0) +
      (t.NESETAT ?? 0)
    );
  }, [stats]);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 0.6fr",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            padding: 30,
            background:
              "linear-gradient(135deg, rgba(8,184,179,0.96), rgba(6,154,150,0.86))",
            color: "white",
            boxShadow: "0 28px 80px rgba(8, 184, 179, 0.22)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.16)",
              right: -70,
              top: -90,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              right: 120,
              bottom: -80,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 13px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                fontWeight: 900,
                marginBottom: 22,
              }}
            >
              ✚ UPU Live Dashboard
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 36,
                letterSpacing: -1.2,
                lineHeight: 1.1,
              }}
            >
              Monitorizare rapidă pentru recepție și fluxul UPU
            </h2>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                maxWidth: 720,
                lineHeight: 1.7,
                opacity: 0.92,
                fontWeight: 600,
              }}
            >
              Vizualizare pacienți, vizite active, triaj, medici disponibili și
              documente medicale într-un singur panou operațional.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button
                onClick={() => onNavigate?.("patients")}
                style={{
                  border: "none",
                  background: "white",
                  color: tealDark,
                  padding: "12px 16px",
                  borderRadius: 16,
                  fontWeight: 950,
                  cursor: "pointer",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
                }}
              >
                + Pacient nou
              </button>

              <button
                onClick={() => onNavigate?.("visits")}
                style={{
                  border: "1px solid rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.16)",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: 16,
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Vezi vizite
              </button>
            </div>
          </div>
        </div>

        <Card>
          <div style={{ color: "#667085", fontSize: 13, fontWeight: 800 }}>
            Status sistem
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 20,
                background: "#e6fffd",
                color: tealDark,
                fontWeight: 900,
              }}
            >
              ● Sistem activ
            </div>

            <button
              onClick={() => load(false)}
              style={{
                border: "none",
                background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
                color: "white",
                padding: "13px 16px",
                borderRadius: 16,
                fontWeight: 950,
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
              }}
            >
              Refresh date
            </button>
          </div>
        </Card>
      </div>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 13,
            borderRadius: 16,
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: 800,
          }}
        >
          Eroare /stats/home: {error}
        </div>
      )}

      {!stats ? (
        <div style={{ marginTop: 18 }}>
          <Card>
            <div style={{ color: "#667085", fontWeight: 800 }}>Se încarcă...</div>
          </Card>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 18,
            }}
          >
            <StatCard
              title="Pacienți în așteptare"
              value={stats.waitingTotal}
              description="Pacienți aflați în fluxul de așteptare"
              accent={teal}
              icon="⌛"
            />

            <StatCard
              title="Pacienți în consult"
              value={stats.inConsultTotal}
              description="Consult / investigații / observație"
              accent="#0ea5e9"
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
              accent="#f59e0b"
              icon="👨‍⚕️"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 16,
              marginTop: 16,
            }}
          >
            <Card
              title="Distribuție coduri de triere"
              subtitle="Distribuția curentă a pacienților pe niveluri de prioritate"
            >
              <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
                <TriageBar
                  label="Roșu"
                  value={stats.waitingByTriage?.ROSU}
                  total={triageTotal}
                  color="#ef4444"
                  bg="#fee2e2"
                />
                <TriageBar
                  label="Galben"
                  value={stats.waitingByTriage?.GALBEN}
                  total={triageTotal}
                  color="#f59e0b"
                  bg="#fef3c7"
                />
                <TriageBar
                  label="Verde"
                  value={stats.waitingByTriage?.VERDE}
                  total={triageTotal}
                  color="#22c55e"
                  bg="#dcfce7"
                />
                <TriageBar
                  label="Consult"
                  value={stats.waitingByTriage?.CONSULT}
                  total={triageTotal}
                  color="#3b82f6"
                  bg="#dbeafe"
                />
                <TriageBar
                  label="Netriat"
                  value={stats.waitingByTriage?.NESETAT}
                  total={triageTotal}
                  color="#94a3b8"
                  bg="#f1f5f9"
                />
              </div>
            </Card>

            <Card title="Acțiuni rapide" subtitle="Scurtături pentru fluxul zilnic">
              <div style={{ display: "grid", gap: 12 }}>
                <button onClick={() => onNavigate?.("patients")} style={quickActionStyle}>
                  <span style={quickIconStyle}>＋</span>
                  <span>
                    <strong>Pacient nou</strong>
                    <small>Înregistrează pacient și date de contact</small>
                  </span>
                </button>

                <button onClick={() => onNavigate?.("patients")} style={quickActionStyle}>
                  <span style={quickIconStyle}>📋</span>
                  <span>
                    <strong>Vizită nouă</strong>
                    <small>Creează vizită pentru un pacient existent</small>
                  </span>
                </button>

                <button onClick={() => onNavigate?.("archive")} style={quickActionStyle}>
                  <span style={quickIconStyle}>🗂</span>
                  <span>
                    <strong>Arhivă PDF</strong>
                    <small>Caută documente medicale arhivate</small>
                  </span>
                </button>
              </div>
            </Card>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.8fr 1.2fr",
              gap: 16,
              marginTop: 16,
            }}
          >
            <Card title="Atenție acum">
              <div style={{ marginTop: 2 }}>
                <AlertRow label="Pacienți care așteaptă prea mult" value={stats.waitingTooLong} />
                <AlertRow label="Pacienți fără preform" value={stats.missingPreform} />
                <AlertRow label="Pacienți fără externare completă" value={stats.missingDischarge} />
              </div>
            </Card>

            <Card title="Pacienți prioritari">
              {!stats.priorityPatients || stats.priorityPatients.length === 0 ? (
                <p style={{ color: "#667085", marginTop: 12, marginBottom: 0, fontWeight: 700 }}>
                  Nu există pacienți prioritari în acest moment.
                </p>
              ) : (
                <div style={{ marginTop: 10, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "#667085", fontSize: 13 }}>
                        <th style={headCellStyle}>Cod vizită</th>
                        <th style={headCellStyle}>Pacient</th>
                        <th style={headCellStyle}>Triaj</th>
                        <th style={headCellStyle}>Status</th>
                        <th style={headCellStyle}>Așteptare</th>
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

const quickActionStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "100%",
  padding: 14,
  borderRadius: 20,
  border: "1px solid #e5eef8",
  background: "linear-gradient(135deg, #ffffff, #f6fffe)",
  cursor: "pointer",
  textAlign: "left",
  boxShadow: "0 12px 28px rgba(15,47,95,0.05)",
};

const quickIconStyle = {
  width: 44,
  height: 44,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 950,
  flexShrink: 0,
};

const headCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #e2e8f0",
  fontWeight: 900,
};