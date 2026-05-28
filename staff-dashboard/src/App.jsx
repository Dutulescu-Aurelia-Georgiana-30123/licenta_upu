import { useMemo, useState, useEffect } from "react";
import TopNav from "./components/TopNav";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import VisitsPage from "./pages/VisitsPage";
import FormsPage from "./pages/FormsPage";
import ArchivePage from "./pages/ArchivePage";
import LoginPage from "./pages/LoginPage";
import { ToastProvider } from "./context/ToastContext";
import MedicalPage from "./pages/MedicalPage";
import PatientPortal from "./pages/PatientPortal";
import { useAuth } from "./context/AuthContext";
import { apiGet } from "./api/api";
import "./styles/theme.css";
import AdminPortal from "./pages/AdminPortal";

export default function App() {
  const [activePage, setActivePage] = useState(
    localStorage.getItem("reception_active_page") || "home"
  );

  const [selectedVisit, setSelectedVisit] = useState(null);

  const { user, role, authReady } = useAuth();

  const selectVisit = (visit) => {
    setSelectedVisit(visit);

    if (visit?.id) {
      localStorage.setItem("reception_selected_visit_id", String(visit.id));
    } else {
      localStorage.removeItem("reception_selected_visit_id");
    }
  };

  const changePage = (page) => {
    setActivePage(page);
    localStorage.setItem("reception_active_page", page);

    if (page !== "forms") {
      setSelectedVisit(null);
      localStorage.removeItem("reception_selected_visit_id");
    }
  };

  useEffect(() => {
    localStorage.setItem("reception_active_page", activePage);
  }, [activePage]);

  useEffect(() => {
    const savedVisitId = localStorage.getItem("reception_selected_visit_id");

    if (!savedVisitId) return;
    if (activePage !== "forms") return;

    const loadSavedVisit = async () => {
      try {
        const visits = await apiGet("/visits");
        const visit = (visits || []).find(
          (v) => String(v.id) === String(savedVisitId)
        );

        if (visit) {
          setSelectedVisit(visit);
        } else {
          localStorage.removeItem("reception_selected_visit_id");
        }
      } catch (e) {
        console.error("Eroare la reîncărcarea vizitei selectate:", e);
      }
    };

    loadSavedVisit();
  }, [activePage]);

  const content = useMemo(() => {
    if (activePage === "home") return <HomePage onNavigate={changePage} />;

    if (activePage === "patients") {
      return (
        <PatientsPage
          onVisitCreated={(visit) => {
            selectVisit(visit);
            changePage("forms");
          }}
        />
      );
    }

    if (activePage === "visits") {
      return (
        <VisitsPage
          selected={selectedVisit}
          onSelect={(visit) => {
            selectVisit(visit);
            changePage("forms");
          }}
        />
      );
    }

    if (activePage === "forms") {
      return (
        <FormsPage
          selected={selectedVisit}
          onSelectVisit={selectVisit}
        />
      );
    }

    if (activePage === "archive") {
      return <ArchivePage selected={selectedVisit} />;
    }

    return <HomePage onNavigate={changePage} />;
  }, [activePage, selectedVisit]);

  if (!authReady) {
    return <div style={{ padding: 30 }}>Se încarcă...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (role === "ADMIN") {
  return (
    <ToastProvider>
      <AdminPortal />
    </ToastProvider>
  );
}

  if (role === "DOCTOR" || role === "NURSE") {
    return (
      <ToastProvider>
        <MedicalPage />
      </ToastProvider>
    );
  }

  if (role === "PATIENT") {
    return (
      <ToastProvider>
        <PatientPortal />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
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
        <TopNav active={activePage} selected={selectedVisit} onChange={changePage} />

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
                UPU Dashboard
              </div>

              <div
                style={{
                  marginTop: 4,
                  color: "#6b7280",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Sistem inteligent de management medical
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
                  background: "linear-gradient(135deg, #08b8b3, #069a96)",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 18,
                  boxShadow: "0 10px 24px rgba(8,184,179,0.22)",
                }}
              >
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#102033",
                    fontSize: 14,
                  }}
                >
                  {user?.firstName || ""} {user?.lastName || ""}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#069a96",
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  {user?.role}
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
            {content}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}