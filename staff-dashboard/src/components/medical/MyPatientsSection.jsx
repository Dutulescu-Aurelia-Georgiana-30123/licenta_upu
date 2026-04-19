export default function MyPatientsSection({ myVisits }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>Pacienții mei</h3>

      {myVisits.length === 0 ? (
        <p style={{ color: "#aaa", marginTop: 10 }}>
          Nu ai pacienți asignați.
        </p>
      ) : (
        myVisits.map((v) => (
          <div
            key={v.id}
            style={{ border: "1px solid #333", padding: 10, marginTop: 10 }}
          >
            <div><b>Cod:</b> {v.visitCode}</div>
            <div><b>Pacient:</b> {v.patientFirstName} {v.patientLastName}</div>
            <div><b>Status:</b> {v.status}</div>
          </div>
        ))
      )}
    </div>
  );
}