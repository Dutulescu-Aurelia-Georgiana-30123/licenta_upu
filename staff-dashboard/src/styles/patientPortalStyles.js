const teal = "#08b8b3";
const tealDark = "#069a96";

export const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: 26,
  boxSizing: "border-box",
  background: `
    radial-gradient(circle at top left, rgba(8,184,179,0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 32%),
    linear-gradient(135deg, #f4fffe 0%, #f8fbff 45%, #eef7ff 100%)
  `,
};

export const headerStyle = {
  width: "100%",
  marginBottom: 22,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: 26,
  padding: "18px 24px",
  boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
};

export const headerTitleStyle = {
  fontSize: 26,
  fontWeight: 900,
  color: "#102033",
  letterSpacing: -0.7,
};

export const headerSubtitleStyle = {
  marginTop: 4,
  color: "#6b7280",
  fontSize: 14,
  fontWeight: 600,
};

export const shellStyle = {
  maxWidth: 1350,
  margin: "0 auto",
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  borderRadius: 34,
  padding: 28,
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
  minHeight: "calc(100vh - 120px)",
};

export const singleColumnGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
};

export const profileGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(260px, 0.75fr) minmax(320px, 1.25fr)",
  gap: 20,
};

export const avatarStyle = {
  width: 110,
  height: 110,
  borderRadius: "50%",
  margin: "0 auto",
  background: "linear-gradient(135deg, #08b8b3, #069a96)",
  display: "grid",
  placeItems: "center",
  color: "white",
  fontWeight: 950,
  fontSize: 42,
  boxShadow: "0 20px 45px rgba(8,184,179,0.28)",
  overflow: "hidden",
};

export const patientNameStyle = {
  margin: "18px 0 4px",
  color: "#102033",
  fontSize: 25,
  fontWeight: 950,
};

export const patientBadgeStyle = {
  color: tealDark,
  fontSize: 13,
  fontWeight: 900,
  background: "#e6fffd",
  display: "inline-block",
  padding: "7px 12px",
  borderRadius: 999,
  marginTop: 8,
};

export const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "13px 0",
  borderBottom: "1px solid #edf2f7",
};

export const activeVisitGridStyle = {
  display: "grid",
  gridTemplateColumns: "0.9fr 0.7fr 1.1fr",
  gap: 14,
  alignItems: "stretch",
};

export const activeVisitMainStyle = {
  borderRadius: 24,
  background: "#e6fffd",
  padding: 22,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export const activeStatusTextStyle = {
  marginTop: 8,
  color: tealDark,
  fontWeight: 950,
  fontSize: 22,
  lineHeight: 1.15,
};

export const triageBoxBaseStyle = {
  padding: 22,
  borderRadius: 24,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export const activeInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: 20,
};

export const accordionButtonStyle = {
  width: "100%",
  border: "none",
  background: "linear-gradient(135deg, #ffffff, #f6fffe)",
  borderRadius: 22,
  padding: "18px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  textAlign: "left",
  color: "#102033",
};

export const accordionArrowStyle = {
  background: "#e6fffd",
  color: tealDark,
  borderRadius: 999,
  padding: "9px 13px",
  fontWeight: 950,
};

export const historyListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 14,
};

export const historyCardStyle = {
  border: "1px solid #e5eef8",
  borderRadius: 22,
  padding: 18,
  background: "#f8fbff",
};

export const historyCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

export const historyDetailsGridStyle = {
  display: "grid",
  gap: 0,
};

export const statusPillStyle = {
  background: "#e6fffd",
  color: tealDark,
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 900,
  fontSize: 12,
};

export const questionsLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "0.9fr 1.1fr",
  gap: 22,
  alignItems: "start",
};

export const textareaStyle = {
  width: "100%",
  resize: "vertical",
  border: "1px solid #dbe7f3",
  borderRadius: 18,
  padding: 14,
  outline: "none",
  color: "#102033",
  fontWeight: 600,
  boxSizing: "border-box",
};

export const sectionMiniTitleStyle = {
  fontWeight: 950,
  color: "#102033",
  marginBottom: 10,
};

export const questionCardStyle = {
  border: "1px solid #e5eef8",
  borderRadius: 18,
  padding: 14,
  background: "#f8fbff",
};

export const questionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 8,
};

export const questionDateStyle = {
  fontSize: 12,
  color: "#667085",
  fontWeight: 800,
};

export const questionStatusStyle = {
  fontSize: 12,
  fontWeight: 900,
  padding: "5px 9px",
  borderRadius: 999,
};

export const questionTextStyle = {
  color: "#102033",
  fontWeight: 800,
  lineHeight: 1.5,
};

export const answerBoxStyle = {
  marginTop: 10,
  padding: 12,
  borderRadius: 14,
  background: "#e6fffd",
  color: "#0f766e",
  fontWeight: 700,
  lineHeight: 1.5,
};

export const answeredByStyle = {
  marginTop: 8,
  fontSize: 12,
  color: "#069a96",
  fontWeight: 900,
};

export const emptyTextStyle = {
  margin: 0,
  color: "#667085",
  fontWeight: 700,
  lineHeight: 1.6,
};

export const noPdfStyle = {
  marginTop: 12,
  color: "#94a3b8",
  fontWeight: 800,
  fontSize: 13,
};

export const previewButtonStyle = {
  border: "1px solid #dbe7f3",
  background: "#eef7ff",
  color: "#102033",
  padding: "10px 14px",
  borderRadius: 14,
  fontWeight: 900,
  cursor: "pointer",
};

export const downloadButtonStyle = {
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "10px 14px",
  borderRadius: 14,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(8,184,179,0.18)",
};

export const logoutButtonStyle = {
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

export const primaryButtonStyle = {
  marginTop: 18,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.18)",
};

export const secondaryButtonStyle = {
  marginTop: 4,
  border: "1px solid #dbe7f3",
  background: "white",
  color: "#102033",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 900,
  cursor: "pointer",
};

export const askButtonStyle = {
  marginTop: 12,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  padding: "12px 16px",
  borderRadius: 16,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

export const editLabel = {
  marginBottom: 6,
  color: "#667085",
  fontWeight: 800,
  fontSize: 13,
};

export const editInput = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid #dbe7f3",
  outline: "none",
  fontWeight: 700,
  fontSize: 14,
  boxSizing: "border-box",
};

export const statusBoxStyle = {
  padding: 16,
  borderRadius: 20,
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 950,
};