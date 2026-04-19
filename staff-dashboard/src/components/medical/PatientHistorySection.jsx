export default function PatientHistorySection({
  currentVisit,
  historyVisits,
  onOpenVisit,
}) {
  if (!currentVisit) return null;

  const previousVisits = historyVisits.filter((v) => v.id !== currentVisit.id);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Fișe trecute</h3>

      {previousVisits.length === 0 ? (
        <p style={{ color: "#aaa", marginTop: 10 }}>
          Nu există fișe anterioare pentru acest pacient.
        </p>
      ) : (
        previousVisits.map((v) => (
          <div
            key={v.id}
            style={{
              border: "1px solid #333",
              padding: 10,
              marginTop: 10,
              cursor: "pointer",
            }}
            onClick={() => onOpenVisit(v)}
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