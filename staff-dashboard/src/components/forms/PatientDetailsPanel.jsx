import { theme } from "../../styles/theme";

export default function PatientDetailsPanel({ patientDetails }) {
  if (!patientDetails) return null;

  const itemStyle = {
    background: "#f8fafc",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: 12,
  };

  const labelStyle = {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 4,
  };

  const valueStyle = {
    color: theme.colors.text,
    fontWeight: 800,
  };

  return (
    <div>
      <div
        style={{
          fontWeight: 900,
          marginBottom: 12,
          color: theme.colors.text,
          fontSize: 17,
        }}
      >
        Date pacient
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        <div style={itemStyle}>
          <div style={labelStyle}>Prenume</div>
          <div style={valueStyle}>{patientDetails.firstName || "-"}</div>
        </div>

        <div style={itemStyle}>
          <div style={labelStyle}>Nume</div>
          <div style={valueStyle}>{patientDetails.lastName || "-"}</div>
        </div>

        <div style={itemStyle}>
          <div style={labelStyle}>CNP</div>
          <div style={valueStyle}>{patientDetails.cnp || "-"}</div>
        </div>

        <div style={itemStyle}>
          <div style={labelStyle}>Telefon</div>
          <div style={valueStyle}>{patientDetails.phoneNumber || "-"}</div>
        </div>

        <div style={itemStyle}>
          <div style={labelStyle}>Email</div>
          <div style={valueStyle}>{patientDetails.email || "-"}</div>
        </div>
      </div>
    </div>
  );
}