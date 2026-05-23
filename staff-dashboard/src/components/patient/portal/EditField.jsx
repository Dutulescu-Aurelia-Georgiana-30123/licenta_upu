import { editLabel } from "../../../styles/patientPortalStyles";

export default function EditField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={editLabel}>{label}</div>
      {children}
    </div>
  );
}