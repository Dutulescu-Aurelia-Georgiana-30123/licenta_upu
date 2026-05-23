import { infoRowStyle } from "../../../styles/patientPortalStyles";

export default function PatientInfoRow({ label, value }) {
  return (
    <div style={infoRowStyle}>
      <span style={{ color: "#667085", fontWeight: 800 }}>{label}</span>
      <span style={{ color: "#102033", fontWeight: 950 }}>
        {value || "—"}
      </span>
    </div>
  );
}