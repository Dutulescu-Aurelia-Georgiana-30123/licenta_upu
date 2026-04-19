import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/api";
import FormsPage from "./FormsPage";
import MedicalHeader from "../components/medical/MedicalHeader";
import CurrentPatientSection from "../components/medical/CurrentPatientSection";
import PatientHistorySection from "../components/medical/PatientHistorySection";
import WaitingPatientsSection from "../components/medical/WaitingPatientsSection";
import MyPatientsSection from "../components/medical/MyPatientsSection";

export default function MedicalPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [visits, setVisits] = useState([]);
  const [myVisits, setMyVisits] = useState([]);
  const [showForms, setShowForms] = useState(false);
  const [historyVisits, setHistoryVisits] = useState([]);
  const [selectedVisitForForms, setSelectedVisitForForms] = useState(null);
  const role = user?.role;
  const isDoctor = role === "DOCTOR";

  const currentVisit = myVisits.find(
    (v) =>
      v.status !== "DISCHARGED" &&
      v.status !== "ADMITTED" &&
      v.status !== "TRANSFERRED"
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const load = async () => {
    try {
      const allVisits = await apiGet("/visits");
      setVisits(allVisits);

      const mine = await apiGet(`/visits/doctor/${user.id}`);
      setMyVisits(mine);

      const activeVisit = mine.find(
        (v) =>
          v.status !== "DISCHARGED" &&
          v.status !== "ADMITTED" &&
          v.status !== "TRANSFERRED"
      );

      if (activeVisit?.patientId) {
        const patientVisits = await apiGet(`/visits/patient/${activeVisit.patientId}`);
        setHistoryVisits(patientVisits);
      } else {
        setHistoryVisits([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const takePatient = async (visitId) => {
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

  return (
    <div style={{ padding: 20 }}>
      <MedicalHeader user={user} onLogout={handleLogout} />

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
        <div style={{ marginTop: 20 }}>
          <FormsPage
            selected={selectedVisitForForms}
            onSelectVisit={setSelectedVisitForForms}
          />
        </div>
      )}

      <PatientHistorySection
        currentVisit={currentVisit}
        historyVisits={historyVisits}
        onOpenVisit={(visit) => {
          setSelectedVisitForForms(visit);
          setShowForms(true);
        }}
      />

      <WaitingPatientsSection
        visits={visits}
        onTakePatient={takePatient}
      />

      <MyPatientsSection myVisits={myVisits} />
    </div>
  );
}