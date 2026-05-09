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
        width: 250,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #2563eb 0%, #1e40af 100%)",
        color: "white",
        padding: 22,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        boxShadow: "12px 0 30px rgba(37, 99, 235, 0.18)",
      }}
    >
      <div style={{ marginBottom: 34 }}>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>
          UPU
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
          Medical Dashboard
        </div>
      </div>

      <nav style={{ display: "grid", gap: 8 }}>
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
                gap: 12,
                padding: "12px 14px",
                borderRadius: 16,
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(255,255,255,0.22)" : "transparent",
                color: "white",
                fontSize: 15,
                fontWeight: isActive ? 800 : 600,
                textAlign: "left",
                boxShadow: isActive ? "0 10px 22px rgba(0,0,0,0.12)" : "none",
              }}
            >
              <span style={{ width: 22, textAlign: "center" }}>{it.icon}</span>
              {it.label}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(255,255,255,0.12)",
          color: "white",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        ⏻ Logout
      </button>
    </aside>
  );
}