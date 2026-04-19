export default function CurrentPatientSection({
  currentVisit,
  onFinishPatient,
  onToggleForms,
  showForms,
  canFinish,
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Pacient curent</h3>

      {currentVisit ? (
        <div style={{ border: "1px solid #333", padding: 12, marginTop: 10 }}>
          <div><b>Cod:</b> {currentVisit.visitCode}</div>
          <div>
            <b>Pacient:</b> {currentVisit.patientFirstName} {currentVisit.patientLastName}
          </div>
          <div><b>Status:</b> {currentVisit.status}</div>

         {canFinish && (
  <button onClick={onFinishPatient} style={{ marginTop: 10 }}>
    Finalizează pacient
  </button>
)}

          <button
            onClick={onToggleForms}
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            {showForms ? "Ascunde fișa actuală" : "Deschide fișa actuală"}
          </button>
        </div>
      ) : (
        <p style={{ color: "#aaa", marginTop: 10 }}>Nu ai niciun pacient activ.</p>
      )}
    </div>
  );
}