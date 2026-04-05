import { API_BASE } from "../api/api";

export default function TopNav({ active, onChange, selected }) {
  const items = [
    { key: "home", label: "Home" },
    { key: "patients", label: "Pacienți" },
    { key: "visits", label: "Vizite" },
    { key: "forms", label: "Fișe" },
    { key: "archive", label: "Arhivă" },

  ];

  return (
    <div style={{ borderBottom: "1px solid #333", background: "#0f0f0f" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16 }}>UPU Dashboard</div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                cursor: "pointer",
                border: active === it.key ? "1px solid #3a3a3a" : "1px solid #222",
                background: active === it.key ? "#2a2a2a" : "#151515",
                color: "#eaeaea",
                fontSize: 13,
              }}
            >
              {it.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}