import { useMemo, useState } from "react";

const teal = "#08b8b3";
const tealDark = "#069a96";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "▦" },
  { key: "personal", label: "Personal", icon: "👥" },
  { key: "audit", label: "Audit", icon: "🧾" },
];

const mockUsers = [
  {
    id: 1,
    firstName: "Andrei",
    lastName: "Popescu",
    email: "andrei.popescu@upu.ro",
    role: "DOCTOR",
    phoneNumber: "0711111111",
    isActive: true,
    availabilityStatus: "AVAILABLE",
  },
  {
    id: 2,
    firstName: "Ioana",
    lastName: "Ionescu",
    email: "ioana.ionescu@upu.ro",
    role: "NURSE",
    phoneNumber: "0722222222",
    isActive: true,
    availabilityStatus: "BUSY",
  },
  {
    id: 3,
    firstName: "Maria",
    lastName: "Dumitrescu",
    email: "maria.dumitrescu@upu.ro",
    role: "RECEPTION",
    phoneNumber: "0733333333",
    isActive: false,
    availabilityStatus: "AVAILABLE",
  },
];

const mockAudit = [
  {
    time: "09:12",
    action: "Recepția Maria Dumitrescu a creat pacientul Ion Marin.",
  },
  {
    time: "09:28",
    action: "Dr. Andrei Popescu a preluat vizita UPU-1024.",
  },
  {
    time: "10:03",
    action: "As. Ioana Ionescu a semnat fișa de pre-spitalizare.",
  },
  {
    time: "10:45",
    action: "Dr. Andrei Popescu a finalizat vizita UPU-1021.",
  },
];

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid #e5eef8",
  borderRadius: 28,
  padding: 22,
  boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
  backdropFilter: "blur(14px)",
};

const primaryButtonStyle = {
  padding: "12px 16px",
  borderRadius: 16,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

const secondaryButtonStyle = {
  padding: "11px 15px",
  borderRadius: 16,
  border: "1px solid rgba(8,184,179,0.25)",
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 900,
  cursor: "pointer",
};

const tableHeadCellStyle = {
  padding: "12px 10px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: 13,
  fontWeight: 800,
};

const tableCellStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontWeight: 700,
  verticalAlign: "middle",
};

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function AdminPortal() {
  const [activePage, setActivePage] = useState("dashboard");
  const [activeRoleTab, setActiveRoleTab] = useState("DOCTOR");

  const user = getCurrentUser();

  const stats = [
    { label: "Total medici", value: 12 },
    { label: "Total asistenți", value: 18 },
    { label: "Total recepționeri", value: 6 },
    { label: "Utilizatori activi", value: 31 },
    { label: "Utilizatori inactivi", value: 5 },
    { label: "Pacienți azi", value: 42 },
    { label: "Vizite active", value: 17 },
  ];

  const tabs = [
    { key: "DOCTOR", label: "Medici" },
    { key: "NURSE", label: "Asistenți" },
    { key: "RECEPTION", label: "Recepție" },
  ];

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((item) => item.role === activeRoleTab);
  }, [activeRoleTab]);

  const titleMap = {
    dashboard: "Admin Dashboard",
    personal: "Gestionare personal",
    audit: "Audit simplu",
  };

  const subtitleMap = {
    dashboard: "Privire generală asupra sistemului UPU",
    personal: "Administrare conturi pentru medici, asistenți și recepție",
    audit: "Urmărirea acțiunilor importante din sistem",
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("activePage");
    localStorage.removeItem("reception_active_page");
    localStorage.removeItem("reception_selected_visit_id");
    window.location.reload();
  };

  const renderDashboard = () => (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {stat.label}
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 34,
                fontWeight: 950,
                color: "#102033",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 22 }}>
            Activitate recentă
          </h2>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gap: 10,
            }}
          >
            {mockAudit.slice(0, 3).map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#334155",
                  fontWeight: 750,
                  display: "flex",
                  gap: 12,
                }}
              >
                <span style={{ color: tealDark, fontWeight: 950 }}>
                  {item.time}
                </span>
                <span>{item.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 22 }}>
            Distribuție roluri
          </h2>

          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            {[
              ["Medici", 12],
              ["Asistenți", 18],
              ["Recepție", 6],
            ].map(([label, value]) => (
              <div key={label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 7,
                    color: "#334155",
                    fontWeight: 850,
                  }}
                >
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "#e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(value * 4, 100)}%`,
                      background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonal = () => (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 24 }}>
            Gestionare personal
          </h2>

          <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
            Creare, editare, activare/dezactivare și disponibilitate
          </div>
        </div>

        <button type="button" style={primaryButtonStyle}>
          + Creează cont
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        {tabs.map((tab) => {
          const isActive = activeRoleTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveRoleTab(tab.key)}
              style={{
                padding: "11px 15px",
                borderRadius: 16,
                border: isActive ? "none" : "1px solid rgba(8,184,179,0.25)",
                background: isActive
                  ? `linear-gradient(135deg, ${teal}, ${tealDark})`
                  : "#e6fffd",
                color: isActive ? "white" : tealDark,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 14px 28px rgba(8,184,179,0.22)"
                  : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "#ffffff",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeadCellStyle}>Nume</th>
              <th style={tableHeadCellStyle}>Email</th>
              <th style={tableHeadCellStyle}>Rol</th>
              <th style={tableHeadCellStyle}>Telefon</th>
              <th style={tableHeadCellStyle}>Status</th>
              <th style={tableHeadCellStyle}>Disponibilitate</th>
              <th style={tableHeadCellStyle}>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((item) => (
              <tr key={item.id}>
                <td style={tableCellStyle}>
                  {item.firstName} {item.lastName}
                </td>

                <td style={tableCellStyle}>{item.email}</td>

                <td style={tableCellStyle}>{item.role}</td>

                <td style={tableCellStyle}>{item.phoneNumber}</td>

                <td style={tableCellStyle}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: item.isActive ? "#dcfce7" : "#fee2e2",
                      color: item.isActive ? "#166534" : "#991b1b",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    {item.isActive ? "ACTIV" : "INACTIV"}
                  </span>
                </td>

                <td style={tableCellStyle}>{item.availabilityStatus}</td>

                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" style={secondaryButtonStyle}>
                      Editează
                    </button>
                    <button type="button" style={secondaryButtonStyle}>
                      Reset parolă
                    </button>
                    <button type="button" style={secondaryButtonStyle}>
                      {item.isActive ? "Dezactivează" : "Activează"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 22,
                    color: "#64748b",
                    fontWeight: 800,
                  }}
                >
                  Nu există utilizatori în această categorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div style={cardStyle}>
      <h2 style={{ margin: 0, color: "#102033", fontSize: 24 }}>
        Audit simplu
      </h2>

      <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
        Acțiuni importante urmărite în sistem
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        {mockAudit.map((item, index) => (
          <div
            key={index}
            style={{
              padding: 15,
              borderRadius: 18,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#334155",
              fontWeight: 750,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: tealDark, fontWeight: 950, minWidth: 48 }}>
              {item.time}
            </span>

            <span>{item.action}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 18,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#92400e",
          fontWeight: 800,
        }}
      >
        Auditul este momentan vizual. După ce legăm backend-ul, aici vor apărea
        acțiunile reale: pacient creat, pacient preluat, fișă semnată, vizită finalizată.
      </div>
    </div>
  );

  const renderContent = () => {
    if (activePage === "personal") return renderPersonal();
    if (activePage === "audit") return renderAudit();

    return renderDashboard();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        background: `
          radial-gradient(circle at top left, rgba(8,184,179,0.18), transparent 28%),
          radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 32%),
          linear-gradient(135deg, #f4fffe 0%, #f8fbff 45%, #eef7ff 100%)
        `,
      }}
    >
      <aside
        style={{
          width: 270,
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
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
              color: teal,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            ⚙️ Admin
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#667085",
              marginTop: 6,
              fontWeight: 700,
            }}
          >
            UPU Management
          </div>
        </div>

        <nav style={{ display: "grid", gap: 10 }}>
          {navItems.map((item) => {
            const isActive = activePage === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActivePage(item.key)}
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
                    ? `linear-gradient(135deg, ${teal}, ${tealDark})`
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
                <span style={{ width: 24, textAlign: "center", fontSize: 16 }}>
                  {item.icon}
                </span>

                {item.label}
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
              color: tealDark,
              fontWeight: 900,
              marginBottom: 8,
            }}
          >
            Portal administrare
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#667085",
              lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            Acces pentru managementul utilizatorilor și audit sistem.
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <button
          type="button"
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
            color: tealDark,
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 14,
            transition: "0.2s ease",
          }}
        >
          Logout
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: 26,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            marginBottom: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.7)",
            borderRadius: 26,
            padding: "18px 24px",
            boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
            boxSizing: "border-box",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#102033",
                letterSpacing: -0.7,
              }}
            >
              {titleMap[activePage]}
            </div>

            <div
              style={{
                marginTop: 4,
                color: "#6b7280",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {subtitleMap[activePage]}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background:
                "linear-gradient(135deg, rgba(8,184,179,0.12), rgba(8,184,179,0.03))",
              border: "1px solid rgba(8,184,179,0.14)",
              padding: "12px 18px",
              borderRadius: 20,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 900,
                fontSize: 18,
                boxShadow: "0 10px 24px rgba(8,184,179,0.22)",
              }}
            >
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
            </div>

            <div>
              <div style={{ fontWeight: 800, color: "#102033", fontSize: 14 }}>
                {user?.firstName || "Admin"} {user?.lastName || ""}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: tealDark,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {user?.role || "ADMIN"}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            borderRadius: 34,
            padding: 28,
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
            minHeight: "calc(100vh - 120px)",
            boxSizing: "border-box",
          }}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
}