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

function StatusBadge({ status }) {
  const stylesByStatus = {
    REGISTERED: { background: "#3a2f1a", color: "#ffd166", border: "#6b5621" },
    WAITING_TRIAGE: { background: "#2f2f2f", color: "#d1d5db", border: "#4b5563" },
    TRIAGE_DONE: { background: "#1f3a5f", color: "#93c5fd", border: "#3b82f6" },
    WAITING_CONSULT: { background: "#4a3410", color: "#fcd34d", border: "#b45309" },
    IN_CONSULT: { background: "#0f3d2e", color: "#6ee7b7", border: "#10b981" },
    IN_INVESTIGATION: { background: "#312e81", color: "#c4b5fd", border: "#8b5cf6" },
    OBSERVATION: { background: "#3f1d5c", color: "#e9d5ff", border: "#a855f7" },
    DISCHARGED: { background: "#16351f", color: "#86efac", border: "#22c55e" },
    ADMITTED: { background: "#0f2f46", color: "#7dd3fc", border: "#0ea5e9" },
    TRANSFERRED: { background: "#4a1d1d", color: "#fca5a5", border: "#ef4444" },
  };

  const config = stylesByStatus[status] || {
    background: "#222",
    color: "#ddd",
    border: "#444",
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: 999,
        border: `1px solid ${config.border}`,
        background: config.background,
        color: config.color,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export default function VisitsPage({ selected, onSelect }) {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
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

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();

      if (sortOrder === "asc") return da - db;
      return db - da;
    });

    return filtered;
  }, [visits, search, statusFilter, sortOrder]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Vizite ({filteredVisits.length})</h2>
      </div>

      {error && <p style={{ color: "red" }}>Eroare /visits: {error}</p>}

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Caută după pacient sau cod vizită"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            minWidth: 280,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#121212",
            color: "#eaeaea",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: 10,
            minWidth: 220,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#121212",
            color: "#eaeaea",
          }}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "Toate statusurile" : getStatusLabel(status)}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: 10,
            minWidth: 200,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#121212",
            color: "#eaeaea",
          }}
        >
          <option value="desc">Cele mai noi primele</option>
          <option value="asc">Cele mai vechi primele</option>
        </select>
      </div>

      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            background: "#111",
          }}
        >
          <thead>
            <tr style={{ background: "#151515" }}>
              <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>Cod vizită</th>
              <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>Pacient</th>
              <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>Status</th>
              <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>Creat la</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.map((v) => (
              <tr
                key={v.id}
                onClick={() => {
                  onSelect(v);
                  showInfo(`Vizită selectată: ${v.visitCode}`);
                }}
                style={{
                  cursor: "pointer",
                  background: selected?.id === v.id ? "#2a2a2a" : "transparent",
                }}
              >
                <td style={{ border: "1px solid #333", padding: 10 }}>{v.visitCode}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>
                  {v.patientFirstName} {v.patientLastName}
                </td>
                <td style={{ border: "1px solid #333", padding: 10 }}>
                  <StatusBadge status={v.status} />
                </td>
                <td style={{ border: "1px solid #333", padding: 10 }}>
                  {formatDateTime(v.createdAt)}
                </td>
              </tr>
            ))}

            {filteredVisits.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    border: "1px solid #333",
                    padding: 14,
                    textAlign: "center",
                    color: "#aaa",
                  }}
                >
                  Nu există vizite pentru filtrarea curentă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ color: "#aaa", marginTop: 10 }}>
        Click pe o vizită ca să o selectezi.
      </p>
    </div>
  );
}