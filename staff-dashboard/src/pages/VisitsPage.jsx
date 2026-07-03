import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api/api";
import { getStatusLabel } from "../utils/visitStatus";
import { useToast } from "../context/ToastContext";

const teal = "#08b8b3";
const tealDark = "#069a96";

function formatDateTime(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString("ro-RO");
}

function Badge({ label, background, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 11px",
        borderRadius: 999,
        background,
        color,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const stylesByStatus = {
    REGISTERED: { background: "#fef3c7", color: "#92400e" },
    WAITING_CONSULT: { background: "#ffedd5", color: "#9a3412" },
    IN_CONSULT: { background: "#ccfbf1", color: "#0f766e" },
    DISCHARGED: { background: "#dcfce7", color: "#166534" },
    ADMITTED: { background: "#e0f2fe", color: "#0369a1" },
    TRANSFERRED: { background: "#fee2e2", color: "#991b1b" },
  };

  const config = stylesByStatus[status] || {
    background: "#f1f5f9",
    color: "#475569",
  };

  return (
    <Badge
      label={getStatusLabel(status)}
      background={config.background}
      color={config.color}
    />
  );
}

function TriageBadge({ triageColor }) {
  const stylesByColor = {
    ROSU: { background: "#fee2e2", color: "#991b1b", label: "Roșu" },
    GALBEN: { background: "#fef3c7", color: "#92400e", label: "Galben" },
    VERDE: { background: "#dcfce7", color: "#166534", label: "Verde" },
    CONSULT: { background: "#e6fffd", color: tealDark, label: "Consult" },
  };

  const config = stylesByColor[triageColor] || {
    background: "#f1f5f9",
    color: "#64748b",
    label: "Neales",
  };

  return (
    <Badge
      label={config.label}
      background={config.background}
      color={config.color}
    />
  );
}

function DoctorBadge({ doctorEmail }) {
  const assigned = !!doctorEmail;

  return (
    <Badge
      label={assigned ? `Preluat: ${doctorEmail}` : "Neasignat"}
      background={assigned ? "#e6fffd" : "#fef3c7"}
      color={assigned ? tealDark : "#92400e"}
    />
  );
}

function FieldControl({ children }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: "5px 11px",
        boxShadow: "0 10px 24px rgba(15,47,95,0.04)",
      }}
    >
      {children}
    </div>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 22,
        padding: 16,
        boxShadow: "0 18px 45px rgba(15,47,95,0.07)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ color: "#667085", fontSize: 12, fontWeight: 800 }}>
            {label}
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#102033",
              fontSize: 28,
              fontWeight: 950,
              letterSpacing: -0.8,
            }}
          >
            {value ?? 0}
          </div>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            background: "#e6fffd",
            color: tealDark,
            display: "grid",
            placeItems: "center",
            fontWeight: 950,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function VisitsPage({ selected, onSelect }) {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assignmentFilter, setAssignmentFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");

  const { showError} = useToast();

  const load = async (silent = false) => {
    setError("");
    try {
      const data = await apiGet("/visits");
      setVisits(data);
    } catch (e) {
      const msg = String(e);
      setError(msg);
      if (!silent) showError("Eroare la încărcarea vizitelor");
    }
  };

  useEffect(() => {
    load(true);

    const interval = setInterval(() => {
      load(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const statuses = useMemo(() => {
    const allStatuses = visits.map((v) => v.status).filter(Boolean);
    return ["ALL", ...Array.from(new Set(allStatuses))];
  }, [visits]);

  const filteredVisits = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = visits.filter((v) => {
      const name = `${v.patientFirstName || ""} ${v.patientLastName || ""}`.toLowerCase();
      const cnp = (v.patientCnp || "").toLowerCase();
      const code = (v.visitCode || "").toLowerCase();

      const matchesSearch =
        q === "" || name.includes(q) || cnp.includes(q) || code.includes(q);

      const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;

      const matchesAssignment =
        assignmentFilter === "ALL" ||
        (assignmentFilter === "UNASSIGNED" && !v.doctorEmail) ||
        (assignmentFilter === "ASSIGNED" && !!v.doctorEmail);

      return matchesSearch && matchesStatus && matchesAssignment;
    });

    filtered.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();

      if (sortOrder === "asc") return da - db;
      return db - da;
    });

    return filtered;
  }, [visits, search, statusFilter, assignmentFilter, sortOrder]);

  const unassignedCount = visits.filter((v) => !v.doctorEmail).length;
  const assignedCount = visits.filter((v) => !!v.doctorEmail).length;
  const triagedCount = visits.filter((v) => !!v.triageColor).length;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          padding: 26,
          backgroundImage: `
  linear-gradient(
    135deg,
    rgba(8,184,179,0.88),
    rgba(6,154,150,0.78)
  ),
  url("/images/receptie.jpg")
`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
          color: "white",
          boxShadow: "0 28px 80px rgba(8, 184, 179, 0.20)",
        }}
      >

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
              marginBottom: 16,
            }}
          >
            📋 Vizite UPU
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 34,
              letterSpacing: -1.1,
              lineHeight: 1.1,
            }}
          >
            Management vizite pacienți
          </h2>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              maxWidth: 720,
              lineHeight: 1.65,
              opacity: 0.92,
              fontWeight: 600,
            }}
          >
            Caută, filtrează și selectează rapid vizitele active sau finalizate
            pentru completarea fișelor medicale.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <MiniStat label="Vizite afișate" value={filteredVisits.length} icon="▦" />
        <MiniStat label="Neasignați" value={unassignedCount} icon="!" />
        <MiniStat label="Asignați" value={assignedCount} icon="✓" />
        <MiniStat label="Cu triaj" value={triagedCount} icon="◆" />
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
          Eroare /visits: {error}
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid #e5eef8",
          borderRadius: 28,
          padding: 18,
          boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <FieldControl>
            <input
              type="text"
              placeholder="Caută după pacient sau cod vizită"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={controlInnerStyle}
            />
          </FieldControl>

          <FieldControl>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...controlInnerStyle, minWidth: 230 }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "Toate statusurile" : getStatusLabel(status)}
                </option>
              ))}
            </select>
          </FieldControl>

          <FieldControl>
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              style={{ ...controlInnerStyle, minWidth: 200 }}
            >
              <option value="ALL">Toți pacienții</option>
              <option value="UNASSIGNED">Neasignați</option>
              <option value="ASSIGNED">Asignați</option>
            </select>
          </FieldControl>

          <FieldControl>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ ...controlInnerStyle, minWidth: 210 }}
            >
              <option value="desc">Cele mai noi primele</option>
              <option value="asc">Cele mai vechi primele</option>
            </select>
          </FieldControl>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "separate",
              borderSpacing: 0,
              width: "100%",
              background: "#ffffff",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ color: "#667085", fontSize: 13, background: "#f8fafc" }}>
                <th style={headCellStyle}>Cod vizită</th>
                <th style={headCellStyle}>Pacient</th>
                <th style={headCellStyle}>Asignare</th>
                <th style={headCellStyle}>Status</th>
                <th style={headCellStyle}>Triaj</th>
                <th style={headCellStyle}>Creat la</th>
              </tr>
            </thead>

            <tbody>
              {filteredVisits.map((v) => {
                const isSelected = selected?.id === v.id;
                const isUnassigned = !v.doctorEmail;

                return (
                  <tr
                    key={v.id}
                    onClick={() => onSelect(v)}
                    style={{
                      cursor: "pointer",
                      background: isSelected
                        ? "#e6fffd"
                        : isUnassigned
                        ? "#fffbeb"
                        : "#ffffff",
                      transition: "0.15s ease",
                    }}
                  >
                    <td style={cellStyle}>{v.visitCode}</td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: 900, color: "#102033" }}>
                        {v.patientFirstName} {v.patientLastName}
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <DoctorBadge doctorEmail={v.doctorEmail} />
                    </td>
                    <td style={cellStyle}>
                      <StatusBadge status={v.status} />
                    </td>
                    <td style={cellStyle}>
                      <TriageBadge triageColor={v.triageColor} />
                    </td>
                    <td style={cellStyle}>{formatDateTime(v.createdAt)}</td>
                  </tr>
                );
              })}

              {filteredVisits.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: 22,
                      textAlign: "center",
                      color: "#667085",
                      fontWeight: 800,
                    }}
                  >
                    Nu există vizite pentru filtrarea curentă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p
          style={{
            color: "#8a97a8",
            marginTop: 14,
            marginBottom: 0,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
        </p>
      </div>
    </div>
  );
}

const controlInnerStyle = {
  padding: 10,
  minWidth: 310,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#102033",
  fontWeight: 800,
};

const headCellStyle = {
  padding: "14px 12px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  fontWeight: 900,
};

const cellStyle = {
  padding: "15px 12px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontWeight: 700,
  verticalAlign: "middle",
};