export default function TopNav({ active, onChange }) {
  const items = [
    { key: "home", label: "Dashboard", icon: "▦" },
    { key: "patients", label: "Pacienți", icon: "👥" },
    { key: "visits", label: "Vizite", icon: "📋" },
    { key: "forms", label: "Fișe", icon: "📝" },
    { key: "archive", label: "Arhivă", icon: "🗂" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("activePage");
    window.location.reload();
  };

  return (
    <aside
      style={{
        width: 270,
        minHeight: "100vh",
        background: "rgba(255,255,255,0.92)",
        color: "#102033",
        padding: 22,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        boxShadow: "14px 0 45px rgba(15, 47, 95, 0.08)",
        borderRight: "1px solid #e5eef8",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ marginBottom: 34 }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: -1,
            color: "#08b8b3",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          ✚ UPU
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#667085",
            marginTop: 6,
            fontWeight: 700,
          }}
        >
          Medical Dashboard
        </div>
      </div>

      <nav style={{ display: "grid", gap: 10 }}>
        {items.map((it) => {
          const isActive = active === it.key;

          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 18,
                border: "none",
                cursor: "pointer",
                background: isActive
                  ? "linear-gradient(135deg, #08b8b3, #069a96)"
                  : "transparent",
                color: isActive ? "white" : "#334155",
                fontSize: 15,
                fontWeight: isActive ? 900 : 700,
                textAlign: "left",
                transition: "0.2s ease",
                boxShadow: isActive
                  ? "0 14px 28px rgba(8, 184, 179, 0.24)"
                  : "none",
              }}
            >
              <span
                style={{
                  width: 24,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {it.icon}
              </span>

              {it.label}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 28,
          padding: 18,
          borderRadius: 22,
          background:
            "linear-gradient(135deg, rgba(8,184,179,0.12), rgba(8,184,179,0.03))",
          border: "1px solid rgba(8,184,179,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#069a96",
            fontWeight: 900,
            marginBottom: 8,
          }}
        >
          Sistem activ
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#667085",
            lineHeight: 1.5,
            fontWeight: 600,
          }}
        >
          Platforma UPU funcționează normal.
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "13px 14px",
          borderRadius: 18,
          border: "1px solid #d7f5f3",
          background: "#e6fffd",
          color: "#069a96",
          cursor: "pointer",
          fontWeight: 900,
          fontSize: 14,
          transition: "0.2s ease",
        }}
      >
        ⏻ Logout
      </button>
    </aside>
  );
}