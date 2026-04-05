export default function PatientDetailsPanel({ patientDetails }) {
  if (!patientDetails) return null;

  return (
    <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Date pacient</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div><b>Prenume:</b> {patientDetails.firstName}</div>
        <div><b>Nume:</b> {patientDetails.lastName}</div>
        <div><b>CNP:</b> {patientDetails.cnp || "-"}</div>
        <div><b>Telefon:</b> {patientDetails.phoneNumber || "-"}</div>
        <div><b>Email:</b> {patientDetails.email || "-"}</div>
      </div>
    </div>
  );
}