import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";

const teal = "#08b8b3";
const tealDark = "#069a96";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "▦" },
  { key: "personal", label: "Personal", icon: "👥" },
  { key: "activeVisits", label: "Vizite active", icon: "📋" },
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
  const [dashboardData, setDashboardData] = useState(null);
const [users, setUsers] = useState([]);
const [loadingUsers, setLoadingUsers] = useState(false);
const [activeVisits, setActiveVisits] = useState([]);
const [loadingActiveVisits, setLoadingActiveVisits] = useState(false);

const [showCreateForm, setShowCreateForm] = useState(false);
const [createForm, setCreateForm] = useState({
  email: "",
  password: "",
  role: "DOCTOR",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  availabilityStatus: "AVAILABLE",
});
const [editingUser, setEditingUser] = useState(null);
const [editForm, setEditForm] = useState({
  email: "",
  role: "DOCTOR",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  availabilityStatus: "AVAILABLE",
});
const [resetUser, setResetUser] = useState(null);
const [resetPasswordForm, setResetPasswordForm] = useState({
  newPassword: "",
});

  const user = getCurrentUser();

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data = await apiGet("/admin/dashboard");
      setDashboardData(data);
    } catch (err) {
      console.error("Eroare dashboard admin:", err);
    }
  };

  loadDashboard();
}, []);

useEffect(() => {
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const data = await apiGet(
        `/admin/users/${activeRoleTab}`
      );

      setUsers(data || []);
    } catch (err) {
      console.error("Eroare utilizatori admin:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  loadUsers();
}, [activeRoleTab]);

  const stats = dashboardData
  ? [
      {
        label: "Total medici",
        value: dashboardData.totalDoctors,
      },
      {
        label: "Total asistenți",
        value: dashboardData.totalNurses,
      },
      {
        label: "Conturi recepție",
        value: dashboardData.totalReceptionUsers,
      },
      {
        label: "Utilizatori activi",
        value: dashboardData.activeUsers,
      },
      {
        label: "Utilizatori inactivi",
        value: dashboardData.inactiveUsers,
      },
      {
        label: "Vizite azi",
        value: dashboardData.todayVisits,
      },
      {
        label: "Vizite active",
        value: dashboardData.activeVisits,
      },
    ]
  : [];

  const tabs = [
    { key: "DOCTOR", label: "Medici" },
    { key: "NURSE", label: "Asistenți" },
    { key: "RECEPTION", label: "Recepție" },
  ];

  const filteredUsers = useMemo(() => {
  return users;
}, [users]);

  const titleMap = {
    dashboard: "Admin Dashboard",
    personal: "Gestionare personal",
    activeVisits: "Vizite active",
    audit: "Audit simplu",
  };

  const subtitleMap = {
    dashboard: "Privire generală asupra sistemului UPU",
    personal: "Administrare conturi pentru medici, asistenți și recepție",
    activeVisits: "Monitorizare și intervenții administrative asupra vizitelor active",
    audit: "Urmărirea acțiunilor importante din sistem",
  };

  const handleCreateUser = async (e) => {
  e.preventDefault();

  try {
    await apiPost("/admin/users", createForm);

    setShowCreateForm(false);

    setCreateForm({
      email: "",
      password: "",
      role: "DOCTOR",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      availabilityStatus: "AVAILABLE",
    });

    const data = await apiGet(`/admin/users/${activeRoleTab}`);
    setUsers(data || []);

    const dashboard = await apiGet("/admin/dashboard");
    setDashboardData(dashboard);
  } catch (err) {
    console.error("Eroare creare utilizator:", err);
    alert("Eroare la crearea utilizatorului.");
  }
};

useEffect(() => {
  if (activePage !== "activeVisits") return;

  const loadActiveVisits = async () => {
    try {
      setLoadingActiveVisits(true);

      const data = await apiGet("/admin/active-visits");
      setActiveVisits(data || []);
    } catch (err) {
      console.error("Eroare vizite active admin:", err);
      setActiveVisits([]);
    } finally {
      setLoadingActiveVisits(false);
    }
  };

  loadActiveVisits();
}, [activePage]);

const handleToggleActive = async (userId) => {
  try {
    await apiPut(`/admin/users/${userId}/toggle-active`, {});

    const data = await apiGet(`/admin/users/${activeRoleTab}`);
    setUsers(data || []);

    const dashboard = await apiGet("/admin/dashboard");
    setDashboardData(dashboard);
  } catch (err) {
    console.error("Eroare activare/dezactivare:", err);
    alert("Eroare la actualizarea statusului.");
  }
};

const openEditForm = (item) => {
  setEditingUser(item);

  setEditForm({
    email: item.email || "",
    role: item.role || "DOCTOR",
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    phoneNumber: item.phoneNumber || "",
    availabilityStatus: item.availabilityStatus || "AVAILABLE",
  });
};

const handleUpdateUser = async (e) => {
  e.preventDefault();

  try {
    await apiPut(`/admin/users/${editingUser.id}`, editForm);

    setEditingUser(null);

    const data = await apiGet(`/admin/users/${activeRoleTab}`);
    setUsers(data || []);

    const dashboard = await apiGet("/admin/dashboard");
    setDashboardData(dashboard);
  } catch (err) {
    console.error("Eroare editare utilizator:", err);
    alert("Eroare la editarea utilizatorului.");
  }
};

const openResetPasswordForm = (item) => {
  setResetUser(item);
  setResetPasswordForm({
    newPassword: "",
  });
};

const handleResetPassword = async (e) => {
  e.preventDefault();

  try {
    await apiPut(
      `/admin/users/${resetUser.id}/reset-password`,
      resetPasswordForm
    );

    setResetUser(null);
    setResetPasswordForm({
      newPassword: "",
    });

    alert("Parola a fost resetată.");
  } catch (err) {
    console.error("Eroare resetare parolă:", err);
    alert("Eroare la resetarea parolei.");
  }
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

  const reloadActiveVisits = async () => {
  try {
    setLoadingActiveVisits(true);
    const data = await apiGet("/admin/active-visits");
    setActiveVisits(data || []);

    const dashboard = await apiGet("/admin/dashboard");
    setDashboardData(dashboard);
  } catch (err) {
    console.error("Eroare reload vizite active:", err);
  } finally {
    setLoadingActiveVisits(false);
  }
};

const handleCancelVisit = async (visitId) => {
  const confirmed = window.confirm(
    "Sigur vrei să anulezi această vizită? Această acțiune trebuie folosită doar pentru vizite create greșit."
  );

  if (!confirmed) return;

  try {
    await apiPut(`/admin/visits/${visitId}/cancel`, {});
    await reloadActiveVisits();
  } catch (err) {
    console.error("Eroare anulare vizită:", err);
    alert("Eroare la anularea vizitei.");
  }
};

const handleForceDischargeVisit = async (visitId) => {
  const confirmed = window.confirm(
    "Sigur vrei să finalizezi forțat această vizită? Pacientul va fi marcat ca externat fără semnăturile normale."
  );

  if (!confirmed) return;

  try {
    await apiPut(`/admin/visits/${visitId}/force-discharge`, {});
    await reloadActiveVisits();
  } catch (err) {
    console.error("Eroare finalizare forțată:", err);
    alert("Eroare la finalizarea forțată a vizitei.");
  }
};

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

        <button
  type="button"
  onClick={() => setShowCreateForm((prev) => !prev)}
  style={primaryButtonStyle}
>
  {showCreateForm ? "Închide formularul" : "+ Creează cont"}
</button>
      </div>

      {showCreateForm && (
  <form
    onSubmit={handleCreateUser}
    style={{
      marginBottom: 18,
      padding: 18,
      borderRadius: 24,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      display: "grid",
      gap: 12,
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      <input
        type="text"
        placeholder="Prenume"
        value={createForm.firstName}
        onChange={(e) =>
          setCreateForm({ ...createForm, firstName: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="text"
        placeholder="Nume"
        value={createForm.lastName}
        onChange={(e) =>
          setCreateForm({ ...createForm, lastName: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={createForm.email}
        onChange={(e) =>
          setCreateForm({ ...createForm, email: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="password"
        placeholder="Parolă"
        value={createForm.password}
        onChange={(e) =>
          setCreateForm({ ...createForm, password: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="text"
        placeholder="Telefon"
        value={createForm.phoneNumber}
        onChange={(e) =>
          setCreateForm({ ...createForm, phoneNumber: e.target.value })
        }
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <select
        value={createForm.role}
        onChange={(e) =>
          setCreateForm({ ...createForm, role: e.target.value })
        }
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      >
        <option value="DOCTOR">Medic</option>
        <option value="NURSE">Asistent</option>
        <option value="RECEPTION">Recepție</option>
      </select>

      <select
        value={createForm.availabilityStatus}
        onChange={(e) =>
          setCreateForm({
            ...createForm,
            availabilityStatus: e.target.value,
          })
        }
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      >
        <option value="AVAILABLE">AVAILABLE</option>
        <option value="BUSY">BUSY</option>
      </select>
    </div>

    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button
        type="button"
        onClick={() => setShowCreateForm(false)}
        style={secondaryButtonStyle}
      >
        Anulează
      </button>

      <button type="submit" style={primaryButtonStyle}>
        Salvează cont
      </button>
    </div>
  </form>
)}

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

{editingUser && (
  <form
    onSubmit={handleUpdateUser}
    style={{
      marginBottom: 18,
      padding: 18,
      borderRadius: 24,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      display: "grid",
      gap: 12,
    }}
  >
    <div style={{ fontWeight: 900, color: "#102033" }}>
      Editează utilizator: {editingUser.firstName} {editingUser.lastName}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      <input
        type="text"
        placeholder="Prenume"
        value={editForm.firstName}
        onChange={(e) =>
          setEditForm({ ...editForm, firstName: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="text"
        placeholder="Nume"
        value={editForm.lastName}
        onChange={(e) =>
          setEditForm({ ...editForm, lastName: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={editForm.email}
        onChange={(e) =>
          setEditForm({ ...editForm, email: e.target.value })
        }
        required
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <input
        type="text"
        placeholder="Telefon"
        value={editForm.phoneNumber}
        onChange={(e) =>
          setEditForm({ ...editForm, phoneNumber: e.target.value })
        }
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      />

      <select
        value={editForm.role}
        onChange={(e) =>
          setEditForm({ ...editForm, role: e.target.value })
        }
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      >
        <option value="DOCTOR">Medic</option>
        <option value="NURSE">Asistent</option>
        <option value="RECEPTION">Recepție</option>
      </select>

      <select
        value={editForm.availabilityStatus}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            availabilityStatus: e.target.value,
          })
        }
        style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
      >
        <option value="AVAILABLE">AVAILABLE</option>
        <option value="BUSY">BUSY</option>
      </select>
    </div>

    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button
        type="button"
        onClick={() => setEditingUser(null)}
        style={secondaryButtonStyle}
      >
        Anulează
      </button>

      <button type="submit" style={primaryButtonStyle}>
        Salvează modificările
      </button>
    </div>
  </form>
)}

{resetUser && (
  <form
    onSubmit={handleResetPassword}
    style={{
      marginBottom: 18,
      padding: 18,
      borderRadius: 24,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      display: "grid",
      gap: 12,
    }}
  >
    <div style={{ fontWeight: 900, color: "#102033" }}>
      Resetează parola pentru: {resetUser.firstName} {resetUser.lastName}
    </div>

    <input
      type="password"
      placeholder="Parolă nouă"
      value={resetPasswordForm.newPassword}
      onChange={(e) =>
        setResetPasswordForm({
          ...resetPasswordForm,
          newPassword: e.target.value,
        })
      }
      required
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid #cbd5e1",
        maxWidth: 360,
      }}
    />

    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button
        type="button"
        onClick={() => setResetUser(null)}
        style={secondaryButtonStyle}
      >
        Anulează
      </button>

      <button type="submit" style={primaryButtonStyle}>
        Salvează parola nouă
      </button>
    </div>
  </form>
)}
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
{loadingUsers && (
  <tr>
    <td
      colSpan="7"
      style={{
        textAlign: "center",
        padding: 20,
      }}
    >
      Se încarcă...
    </td>
  </tr>
)}
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
                    <button
  type="button"
  onClick={() => openEditForm(item)}
  style={secondaryButtonStyle}
>
  Editează
</button>
                    <button
  type="button"
  onClick={() => openResetPasswordForm(item)}
  style={secondaryButtonStyle}
>
  Reset parolă
</button>
                    <button
  type="button"
  onClick={() => handleToggleActive(item.id)}
  style={secondaryButtonStyle}
>
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

  const renderActiveVisits = () => (
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
          Vizite active
        </h2>

        <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
          Vizite care nu sunt încă externate, internate sau transferate
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            setLoadingActiveVisits(true);
            const data = await apiGet("/admin/active-visits");
            setActiveVisits(data || []);
          } catch (err) {
            console.error("Eroare refresh vizite active:", err);
          } finally {
            setLoadingActiveVisits(false);
          }
        }}
        style={secondaryButtonStyle}
      >
        Reîncarcă
      </button>
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
            <th style={tableHeadCellStyle}>Cod vizită</th>
            <th style={tableHeadCellStyle}>Pacient</th>
            <th style={tableHeadCellStyle}>Status</th>
            <th style={tableHeadCellStyle}>Medic</th>
            <th style={tableHeadCellStyle}>Asistent</th>
            <th style={tableHeadCellStyle}>Creată la</th>
            <th style={tableHeadCellStyle}>Acțiuni</th>
          </tr>
        </thead>

        <tbody>
          {loadingActiveVisits && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                Se încarcă...
              </td>
            </tr>
          )}

          {!loadingActiveVisits &&
            activeVisits.map((visit) => (
              <tr key={visit.id}>
                <td style={tableCellStyle}>{visit.visitCode || "-"}</td>

                <td style={tableCellStyle}>
                  {visit.patientFirstName || ""} {visit.patientLastName || ""}
                </td>

                <td style={tableCellStyle}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "#e6fffd",
                      color: tealDark,
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    {visit.status}
                  </span>
                </td>

                <td style={tableCellStyle}>
                  {visit.doctorFirstName
                    ? `${visit.doctorFirstName} ${visit.doctorLastName || ""}`
                    : "-"}
                </td>

                <td style={tableCellStyle}>
                  {visit.nurseFirstName
                    ? `${visit.nurseFirstName} ${visit.nurseLastName || ""}`
                    : "-"}
                </td>

                <td style={tableCellStyle}>
                  {visit.createdAt
                    ? new Date(visit.createdAt).toLocaleString("ro-RO")
                    : "-"}
                </td>

                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" style={secondaryButtonStyle}>
                      Vezi
                    </button>

                    <button
  type="button"
  onClick={() => handleForceDischargeVisit(visit.id)}
  style={secondaryButtonStyle}
>
  Finalizează forțat
</button>

<button
  type="button"
  onClick={() => handleCancelVisit(visit.id)}
  style={secondaryButtonStyle}
>
  Anulează
</button>
                  </div>
                </td>
              </tr>
            ))}

          {!loadingActiveVisits && activeVisits.length === 0 && (
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
                Nu există vizite active momentan.
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
  if (activePage === "activeVisits") return renderActiveVisits();
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