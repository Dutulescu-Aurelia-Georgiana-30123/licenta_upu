import { useMemo, useState } from "react";
import TopNav from "./components/TopNav";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import VisitsPage from "./pages/VisitsPage";
import FormsPage from "./pages/FormsPage";
import ArchivePage from "./pages/ArchivePage";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [selectedVisit, setSelectedVisit] = useState(null);

  const content = useMemo(() => {
    if (activePage === "home") return <HomePage />;

    if (activePage === "patients") {
      return (
        <PatientsPage
          onVisitCreated={(visit) => {
            setSelectedVisit(visit);
            setActivePage("forms");
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
            setActivePage("forms");
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

    return null;
  }, [activePage, selectedVisit]);

  return (
    <ToastProvider>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          color: "#eaeaea",
          background: "#111",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopNav
          active={activePage}
          selected={selectedVisit}
          onChange={(page) => {
            setActivePage(page);
            if (page !== "forms") {
              setSelectedVisit(null);
            }
          }}
        />

        <main
          style={{
            flex: 1,
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
            overflowY: "auto",
            padding: 16,
          }}
        >
          {content}
        </main>
      </div>
    </ToastProvider>
  );
}