import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api/api";
import { getStatusLabel } from "../utils/visitStatus";
import { useToast } from "../context/ToastContext";

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
        padding: "6px 10px",
        borderRadius: 999,
        background,
        color,
        fontSize: 12,
        fontWeight: 800,
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
    WAITING_TRIAGE: { background: "#f1f5f9", color: "#475569" },
    TRIAGE_DONE: { background: "#dbeafe", color: "#1d4ed8" },
    WAITING_CONSULT: { background: "#ffedd5", color: "#9a3412" },
    IN_CONSULT: { background: "#ccfbf1", color: "#0f766e" },
    IN_INVESTIGATION: { background: "#ede9fe", color: "#6d28d9" },
    OBSERVATION: { background: "#f3e8ff", color: "#7e22ce" },
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
    CONSULT: { background: "#dbeafe", color: "#1d4ed8", label: "Consult" },
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
      background={assigned ? "#ccfbf1" : "#fef3c7"}
      color={assigned ? "#0f766e" : "#92400e"}
    />
  );
}

function FieldControl({ children }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "4px 10px",
      }}
    >
      {children}
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

  const { showError, showInfo } = useToast();

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
        q === "" ||
        name.includes(q) ||
        cnp.includes(q) ||
        code.includes(q);

      const matchesStatus =
        statusFilter === "ALL" || v.status === statusFilter;

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

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
            Vizite
          </h2>
          <div style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            {filteredVisits.length} vizite afișate
          </div>
        </div>
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
          Eroare /visits: {error}
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          background: "#ffffff",
          border: "1px solid #e5eef8",
          borderRadius: 24,
          padding: 16,
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <FieldControl>
            <input
              type="text"
              placeholder="Caută după pacient sau cod vizită"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: 10,
                minWidth: 300,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#0f172a",
                fontWeight: 600,
              }}
            />
          </FieldControl>

          <FieldControl>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 10,
                minWidth: 220,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#0f172a",
                fontWeight: 700,
              }}
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
              style={{
                padding: 10,
                minWidth: 190,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#0f172a",
                fontWeight: 700,
              }}
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
              style={{
                padding: 10,
                minWidth: 190,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#0f172a",
                fontWeight: 700,
              }}
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
            }}
          >
            <thead>
              <tr style={{ color: "#64748b", fontSize: 13 }}>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Cod vizită
                </th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Pacient
                </th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Asignare
                </th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Status
                </th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Triaj
                </th>
                <th style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  Creat la
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredVisits.map((v) => {
                const isSelected = selected?.id === v.id;
                const isUnassigned = !v.doctorEmail;

                return (
                  <tr
                    key={v.id}
                    onClick={() => {
                      onSelect(v);
                      showInfo(`Vizită selectată: ${v.visitCode}`);
                    }}
                    style={{
                      cursor: "pointer",
                      background: isSelected
                        ? "#eff6ff"
                        : isUnassigned
                        ? "#fffbeb"
                        : "#ffffff",
                    }}
                  >
                    <td style={cellStyle}>{v.visitCode}</td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: 800, color: "#0f172a" }}>
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
                      padding: 20,
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Nu există vizite pentru filtrarea curentă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#94a3b8", marginTop: 14, marginBottom: 0, fontSize: 13 }}>
          Click pe o vizită ca să o selectezi.
        </p>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontWeight: 600,
  verticalAlign: "middle",
};