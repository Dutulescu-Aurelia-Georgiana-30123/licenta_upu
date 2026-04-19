export default function WaitingPatientsSection({ visits, onTakePatient }) {
  const waitingVisits = visits.filter((v) => !v.doctorEmail);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Pacienți în așteptare</h3>

      {waitingVisits.length === 0 ? (
        <p style={{ color: "#aaa", marginTop: 10 }}>
          Nu există pacienți în așteptare.
        </p>
      ) : (
        waitingVisits.map((v) => (
          <div
            key={v.id}
            style={{ border: "1px solid #333", padding: 10, marginTop: 10 }}
          >
            <div><b>Cod:</b> {v.visitCode}</div>
            <div><b>Pacient:</b> {v.patientFirstName} {v.patientLastName}</div>

            <button onClick={() => onTakePatient(v.id)} style={{ marginTop: 8 }}>
              Preia pacient
            </button>
          </div>
        ))
      )}
    </div>
  );
}