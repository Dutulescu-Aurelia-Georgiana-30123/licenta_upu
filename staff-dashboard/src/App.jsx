import { useMemo, useState } from "react";
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

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "home";
  });

  const [selectedVisit, setSelectedVisit] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const changePage = (page) => {
    setActivePage(page);
    localStorage.setItem("activePage", page);

    if (page !== "forms") {
      setSelectedVisit(null);
    }
  };

  if (!user) {
    return <LoginPage />;
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

  const content = useMemo(() => {
    if (activePage === "home") return <HomePage />;

    if (activePage === "patients") {
      return (
        <PatientsPage
          onVisitCreated={(visit) => {
            setSelectedVisit(visit);
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
            setSelectedVisit(visit);
            changePage("forms");
          }}
        />
      );
    }

    if (activePage === "forms") {
      return (
        <FormsPage
          selected={selectedVisit}
          onSelectVisit={setSelectedVisit}
        />
      );
    }

    if (activePage === "archive") {
      return <ArchivePage selected={selectedVisit} />;
    }

    return <HomePage />;
  }, [activePage, selectedVisit]);

  return (
    <ToastProvider>
      <div
  style={{
    minHeight: "100vh",
    width: "100%",
    color: "#0f172a",
    background: "linear-gradient(135deg, #eef6ff 0%, #f8fbff 45%, #eef2ff 100%)",
    display: "flex",
  }}
>
  <TopNav
    active={activePage}
    selected={selectedVisit}
    onChange={changePage}
  />

  <main
    style={{
      flex: 1,
      boxSizing: "border-box",
      overflowX: "hidden",
      overflowY: "auto",
      padding: 28,
    }}
  >
    <div
      style={{
        maxWidth: 1500,
        margin: "0 auto",
        background: "rgba(255,255,255,0.82)",
        borderRadius: 28,
        padding: 24,
        boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      {content}
    </div>
  </main>
</div>
    </ToastProvider>
  );
}