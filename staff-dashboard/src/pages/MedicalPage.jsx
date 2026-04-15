import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/api";
import FormsPage from "./FormsPage";

export default function MedicalPage() {
  const user = JSON.parse(localStorage.getItem("user"));

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
const activeStatuses = ["DISCHARGED", "ADMITTED", "TRANSFERRED"];

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Interfață Medic</h2>
      <p>Logat ca: {user.email}</p>

      <button onClick={handleLogout}>Logout</button>

      <h3 style={{ marginTop: 20 }}>Pacient curent</h3>

{currentVisit ? (
  <div style={{ border: "1px solid #333", padding: 12, marginTop: 10 }}>
    <div><b>Cod:</b> {currentVisit.visitCode}</div>
    <div><b>Pacient:</b> {currentVisit.patientFirstName} {currentVisit.patientLastName}</div>
    <div><b>Status:</b> {currentVisit.status}</div>

    <button
      onClick={async () => {
        try {
          await apiPut(`/visits/${currentVisit.id}/status`, {
            status: "DISCHARGED",
          });
          await load();
        } catch (e) {
          alert("Eroare la finalizare");
        }
      }}
      style={{ marginTop: 10 }}
    >
      Finalizează pacient
    </button>
    <button
  onClick={() => {
  setSelectedVisitForForms(currentVisit);
  setShowForms((prev) => !prev);
}}
  style={{ marginTop: 10, marginLeft: 10 }}
>
  {showForms ? "Ascunde fișa actuală" : "Deschide fișa actuală"}
</button>
  </div>
) : (
  <p style={{ color: "#aaa", marginTop: 10 }}>Nu ai niciun pacient activ.</p>
)}

{showForms && selectedVisitForForms && (
  <div style={{ marginTop: 20 }}>
    <FormsPage
      selected={selectedVisitForForms}
      onSelectVisit={setSelectedVisitForForms}
    />
  </div>
)}

{currentVisit && (
  <div style={{ marginTop: 20 }}>
    <h3>Fișe trecute</h3>

    {historyVisits.filter((v) => v.id !== currentVisit.id).length === 0 ? (
      <p style={{ color: "#aaa", marginTop: 10 }}>
        Nu există fișe anterioare pentru acest pacient.
      </p>
    ) : (
      historyVisits
        .filter((v) => v.id !== currentVisit.id)
        .map((v) => (
          <div
            key={v.id}
            style={{
              border: "1px solid #333",
              padding: 10,
              marginTop: 10,
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedVisitForForms(v);
              setShowForms(true);
            }}
          >
            <div><b>Cod:</b> {v.visitCode}</div>
            <div><b>Pacient:</b> {v.patientFirstName} {v.patientLastName}</div>
            <div><b>Status:</b> {v.status}</div>
          </div>
        ))
    )}
  </div>
)}
      <h3 style={{ marginTop: 20 }}>Pacienți în așteptare</h3>

      {visits
        .filter((v) => !v.doctor) // doar cei nepreluați
        .map((v) => (
          <div key={v.id} style={{ border: "1px solid #333", padding: 10, marginTop: 10 }}>
            <div>Cod: {v.visitCode}</div>
            <div>Pacient: {v.patientFirstName} {v.patientLastName}</div>

            <button onClick={() => takePatient(v.id)}>
              Preia pacient
            </button>
          </div>
        ))}

      <h3 style={{ marginTop: 30 }}>Pacienții mei</h3>

      {myVisits.map((v) => (
        <div key={v.id} style={{ border: "1px solid #333", padding: 10, marginTop: 10 }}>
          <div>Cod: {v.visitCode}</div>
          <div>Pacient: {v.patientFirstName} {v.patientLastName}</div>
          <div>Status: {v.status}</div>
        </div>
      ))}
    </div>
  );
}