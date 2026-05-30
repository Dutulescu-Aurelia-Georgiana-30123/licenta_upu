import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut, API_BASE } from "../api/api";
import {teal, tealDark, } from "../components/admin/adminStyles";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminAudit from "../components/admin/AdminAudit";
import AdminPatients from "../components/admin/AdminPatients";
import AdminVisits from "../components/admin/AdminVisits";
import AdminPersonal from "../components/admin/AdminPersonal";
import { useToast } from "../context/ToastContext";

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "personal", label: "Personal" },
  { key: "patients", label: "Pacienți" },
  { key: "activeVisits", label: "Vizite active" },
  { key: "audit", label: "Jurnal activitate"},
];

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
const [auditLogs, setAuditLogs] = useState([]);
const [loadingAudit, setLoadingAudit] = useState(false);
const [patients, setPatients] = useState([]);
const [loadingPatients, setLoadingPatients] = useState(false);
const [patientsSearch, setPatientsSearch] = useState("");
const [editingPatient, setEditingPatient] = useState(null);
const [editPatientForm, setEditPatientForm] = useState({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  cnp: "",
  email: "",
});
const [selectedPatientRecord, setSelectedPatientRecord] = useState(null);
const [patientVisits, setPatientVisits] = useState([]);
const [loadingPatientRecord, setLoadingPatientRecord] = useState(false);
const [selectedVisitDetails, setSelectedVisitDetails] = useState(null);
const [loadingActiveVisits, setLoadingActiveVisits] = useState(false);
const [selectedRecordVisit, setSelectedRecordVisit] = useState(null);
const [recordVisitDocuments, setRecordVisitDocuments] = useState([]);
const [loadingRecordDocuments, setLoadingRecordDocuments] = useState(false);

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
  const { showSuccess, showError } = useToast();

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

  const filteredUsers = users;

  const openVisitDocuments = async (visit) => {
  try {
    setSelectedRecordVisit(visit);
    setLoadingRecordDocuments(true);

    const data = await apiGet(`/archived-documents/visit/${visit.id}`);
    setRecordVisitDocuments(data || []);
  } catch (err) {
    console.error("Eroare documente vizită:", err);
    setRecordVisitDocuments([]);
    showError("Nu am putut încărca documentele vizitei.");
  } finally {
    setLoadingRecordDocuments(false);
  }
};

  const openPatientRecord = async (patient) => {
  try {
    setSelectedPatientRecord(patient);
    setSelectedRecordVisit(null);
    setRecordVisitDocuments([]);
    setLoadingPatientRecord(true);

    const data = await apiGet(`/visits/patient/${patient.id}`);
    setPatientVisits(data || []);

    setTimeout(() => {
      document
        .getElementById("admin-patient-record")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  } catch (err) {
    console.error("Eroare dosar pacient:", err);
    setPatientVisits([]);
    showError("Nu am putut încărca dosarul pacientului.");
  } finally {
    setLoadingPatientRecord(false);
  }
};

const filteredPatients = useMemo(() => {
  const q = patientsSearch.trim().toLowerCase();

  return patients.filter((patient) => {
    const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();
    const cnp = (patient.cnp || "").toLowerCase();
    const email = (patient.email || "").toLowerCase();
    const phone = (patient.phoneNumber || "").toLowerCase();

    return (
      q === "" ||
      fullName.includes(q) ||
      cnp.includes(q) ||
      email.includes(q) ||
      phone.includes(q)
    );
  });
}, [patients, patientsSearch]);

  const titleMap = {
    dashboard: "Admin Dashboard",
    personal: "Gestionare personal",
    activeVisits: "Vizite active",
    audit: "Jurnal activitate",
    patients: "Pacienți",
  };

  const subtitleMap = {
    dashboard: "Privire generală asupra sistemului UPU",
    personal: "Administrare conturi pentru medici, asistenți și recepție",
    activeVisits: "Monitorizare și intervenții administrative asupra vizitelor active",
    audit: "Urmărirea acțiunilor importante din sistem",
    patients: "Vizualizare și administrare date pacienți",
  };

  const reloadAudit = async () => {
  try {
    setLoadingAudit(true);
    const data = await apiGet("/admin/audit");
    setAuditLogs(data || []);
  } catch (err) {
    console.error("Eroare refresh audit:", err);
  } finally {
    setLoadingAudit(false);
  }
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
    showError("Eroare la crearea utilizatorului.");
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

useEffect(() => {
  if (activePage !== "audit") return;

  const loadAuditLogs = async () => {
    try {
      setLoadingAudit(true);

      const data = await apiGet("/admin/audit");
      setAuditLogs(data || []);
    } catch (err) {
      console.error("Eroare audit admin:", err);
      setAuditLogs([]);
    } finally {
      setLoadingAudit(false);
    }
  };

  loadAuditLogs();
}, [activePage]);

useEffect(() => {
  if (activePage !== "patients") return;

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);

      const data = await apiGet("/patients");
      setPatients(data || []);
    } catch (err) {
      console.error("Eroare pacienți admin:", err);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  loadPatients();
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
    showError("Eroare la actualizarea statusului.");
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
    showError("Eroare la editarea utilizatorului.");
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

    showSuccess("Parola a fost resetată.");
  } catch (err) {
    console.error("Eroare resetare parolă:", err);
    showError("Eroare la resetarea parolei.");
  }
};

const reloadPatients = async () => {
  try {
    setLoadingPatients(true);
    const data = await apiGet("/patients");
    setPatients(data || []);
  } catch (err) {
    console.error("Eroare reload pacienți:", err);
  } finally {
    setLoadingPatients(false);
  }
};

const handleDeletePatient = async (patientId) => {
  const confirmed = window.confirm(
    "Sigur vrei să ștergi acest pacient? Acțiunea este permisă doar dacă pacientul nu are vizite asociate."
  );

  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:8081/admin/patients/${patientId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || "Pacientul nu poate fi șters.");
    }

    await reloadPatients();

    showSuccess("Pacientul a fost șters.");
  } catch (err) {
    console.error("Eroare ștergere pacient:", err);
    showError(err.message || "Pacientul nu poate fi șters dacă are vizite asociate.");
  }
};

const openEditPatientForm = (patient) => {
  setEditingPatient(patient);

  setEditPatientForm({
    firstName: patient.firstName || "",
    lastName: patient.lastName || "",
    phoneNumber: patient.phoneNumber || "",
    cnp: patient.cnp || "",
    email: patient.email || "",
  });
};

const handleUpdatePatient = async (e) => {
  e.preventDefault();

  try {
    await apiPut(`/patients/${editingPatient.id}`, editPatientForm);

    setEditingPatient(null);

    await reloadPatients();

    showSuccess("Pacientul a fost actualizat.");
  } catch (err) {
    console.error("Eroare editare pacient:", err);
    showError("Eroare la editarea pacientului.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("activePage");
    localStorage.removeItem("reception_active_page");
    localStorage.removeItem("reception_selected_visit_id");
    window.location.reload();
  };

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
    showError("Eroare la anularea vizitei.");
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
    showError("Eroare la finalizarea forțată a vizitei.");
  }
};

  const renderContent = () => {
  if (activePage === "personal") {
  return (
    <AdminPersonal
      tabs={tabs}
      activeRoleTab={activeRoleTab}
      setActiveRoleTab={setActiveRoleTab}
      showCreateForm={showCreateForm}
      setShowCreateForm={setShowCreateForm}
      createForm={createForm}
      setCreateForm={setCreateForm}
      onCreateUser={handleCreateUser}
      editingUser={editingUser}
      editForm={editForm}
      setEditForm={setEditForm}
      onUpdateUser={handleUpdateUser}
      onCancelEditUser={() => setEditingUser(null)}
      resetUser={resetUser}
      resetPasswordForm={resetPasswordForm}
      setResetPasswordForm={setResetPasswordForm}
      onResetPassword={handleResetPassword}
      onCancelResetPassword={() => setResetUser(null)}
      loadingUsers={loadingUsers}
      filteredUsers={filteredUsers}
      onEditUser={openEditForm}
      onOpenResetPassword={openResetPasswordForm}
      onToggleActive={handleToggleActive}
    />
  );
}
  if (activePage === "patients") {
  return (
    <AdminPatients
      patientsSearch={patientsSearch}
      setPatientsSearch={setPatientsSearch}
      editingPatient={editingPatient}
      editPatientForm={editPatientForm}
      setEditPatientForm={setEditPatientForm}
      loadingPatients={loadingPatients}
      filteredPatients={filteredPatients}
      onReloadPatients={reloadPatients}
      onEditPatient={openEditPatientForm}
      onUpdatePatient={handleUpdatePatient}
      onCancelEditPatient={() => setEditingPatient(null)}
      onDeletePatient={handleDeletePatient}
      selectedPatientRecord={selectedPatientRecord}
patientVisits={patientVisits}
loadingPatientRecord={loadingPatientRecord}
onOpenPatientRecord={openPatientRecord}
onClosePatientRecord={() => {
  setSelectedPatientRecord(null);
  setPatientVisits([]);
  setSelectedRecordVisit(null);
  setRecordVisitDocuments([]);
}}
selectedRecordVisit={selectedRecordVisit}
recordVisitDocuments={recordVisitDocuments}
loadingRecordDocuments={loadingRecordDocuments}
onOpenVisitDocuments={openVisitDocuments}
onCloseVisitDocuments={() => {
  setSelectedRecordVisit(null);
  setRecordVisitDocuments([]);
}}
apiBase={API_BASE}
    />
  );
}
  if (activePage === "activeVisits") {
  return (
    <AdminVisits
      activeVisits={activeVisits}
      loadingActiveVisits={loadingActiveVisits}
      selectedVisitDetails={selectedVisitDetails}
      setSelectedVisitDetails={setSelectedVisitDetails}
      onReloadActiveVisits={reloadActiveVisits}
      onForceDischargeVisit={handleForceDischargeVisit}
      onCancelVisit={handleCancelVisit}
    />
  );
}
  if (activePage === "audit") {
  return (
    <AdminAudit
      auditLogs={auditLogs}
      loadingAudit={loadingAudit}
      onReloadAudit={reloadAudit}
    />
  );
}

  return <AdminDashboard
  stats={stats}
  auditLogs={auditLogs}
/>
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
            Admin
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