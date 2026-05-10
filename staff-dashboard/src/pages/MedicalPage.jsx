import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/api";
import FormsPage from "./FormsPage";
import MedicalHeader from "../components/medical/MedicalHeader";
import CurrentPatientSection from "../components/medical/CurrentPatientSection";
import PatientHistorySection from "../components/medical/PatientHistorySection";
import WaitingPatientsSection from "../components/medical/WaitingPatientsSection";
import MyPatientsSection from "../components/medical/MyPatientsSection";
import { useAuth } from "../context/AuthContext";

export default function MedicalPage() {
  const { user, isDoctor, logout } = useAuth();

  const [visits, setVisits] = useState([]);
  const [myVisits, setMyVisits] = useState([]);
  const [showForms, setShowForms] = useState(false);
  const [historyVisits, setHistoryVisits] = useState([]);
  const [selectedVisitForForms, setSelectedVisitForForms] = useState(null);

  const currentVisit = myVisits.find(
    (v) =>
      v.status !== "DISCHARGED" &&
      v.status !== "ADMITTED" &&
      v.status !== "TRANSFERRED"
  );

  const load = async () => {
    if (!user?.id) return;

    try {
      const allVisits = await apiGet("/visits");
      setVisits(allVisits || []);

      const mine = await apiGet(`/visits/doctor/${user.id}`);
      setMyVisits(mine || []);

      const activeVisit = (mine || []).find(
        (v) =>
          v.status !== "DISCHARGED" &&
          v.status !== "ADMITTED" &&
          v.status !== "TRANSFERRED"
      );

      if (activeVisit?.patientId) {
        const patientVisits = await apiGet(`/visits/patient/${activeVisit.patientId}`);
        setHistoryVisits(patientVisits || []);
      } else {
        setHistoryVisits([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user?.id) {
      load();
    }
  }, [user?.id]);

  const takePatient = async (visitId) => {
    if (!user?.id) return;

    try {
      await apiPut(`/visits/${visitId}/assign-doctor`, {
        doctorId: user.id,
      });
      await load();
    } catch (e) {
      alert(e.message || "Nu poți prelua pacientul");
    }
  };

  const finishCurrentPatient = async () => {
    if (!currentVisit) return;

    try {
      await apiPut(`/visits/${currentVisit.id}/status`, {
        status: "DISCHARGED",
      });
      await load();
    } catch (e) {
      alert("Eroare la finalizare");
    }
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#102033",
        }}
      >
        Se încarcă...
      </div>
    );
  }

 return (
  <div
    style={{
      minHeight: "100vh",
      padding: 28,
      boxSizing: "border-box",
      background:
        "radial-gradient(circle at top left, rgba(8,184,179,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 32%), linear-gradient(135deg, #eefdfa 0%, #f8fbff 45%, #e6fffd 100%)",
      color: "#102033",
    }}
  >
    <div
      style={{
        maxWidth: 1600,
        margin: "0 auto",
        display: "grid",
        gap: 18,
      }}
    >
      <MedicalHeader user={user} onLogout={logout} />

      <CurrentPatientSection
        currentVisit={currentVisit}
        showForms={showForms}
        onToggleForms={() => {
          setSelectedVisitForForms(currentVisit);
          setShowForms((prev) => !prev);
        }}
        onFinishPatient={finishCurrentPatient}
        canFinish={isDoctor}
      />

      {showForms && selectedVisitForForms && (
        <div
          style={{
            background: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(255,255,255,0.8)",
            borderRadius: 34,
            padding: 24,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <FormsPage
            selected={selectedVisitForForms}
            onSelectVisit={setSelectedVisitForForms}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 18 }}>
          <WaitingPatientsSection visits={visits} onTakePatient={takePatient} />
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <MyPatientsSection myVisits={myVisits} />

          <PatientHistorySection
            currentVisit={currentVisit}
            historyVisits={historyVisits}
            onOpenVisit={(visit) => {
              setSelectedVisitForForms(visit);
              setShowForms(true);
            }}
          />
        </div>
      </div>
    </div>
  </div>
);
}