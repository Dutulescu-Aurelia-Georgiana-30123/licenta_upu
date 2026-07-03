import { useState } from "react";
import { theme } from "../styles/theme";
import StaffLoginForm from "../components/auth/StaffLoginForm";
import PatientLoginForm from "../components/auth/PatientLoginForm";
import PatientRegisterModal from "../components/patient/PatientRegisterModal";

export default function LoginPage() {
  const [loginType, setLoginType] = useState("STAFF");
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div style={pageStyle}>
      <div style={backgroundImageStyle} />
      <div style={overlayStyle} />

      <div style={layoutStyle}>
        <div style={loginCardStyle}>
          <div style={topRowStyle}>
            <div style={brandStyle}>
              <span style={plusStyle}>✚</span>
              <span>UPU Medical</span>
            </div>
          </div>

          <h2 style={formTitleStyle}>
            {loginType === "STAFF" ? "Bine ai venit" : "Portal pacienți"}
          </h2>

          <p style={formSubtitleStyle}>
            {loginType === "STAFF"
              ? "Personalul medical se autentifică folosind emailul și parola."
              : "Pacienții se autentifică folosind numele, CNP-ul și parola. Dacă s-a creat deja un cont la spital, vă rugăm să accesați Activează cont pacient"}
          </p>

          <div style={tabsWrapperStyle}>
            <button
              type="button"
              onClick={() => setLoginType("STAFF")}
              style={{
                ...tabButtonStyle,
                background: loginType === "STAFF" ? "white" : "transparent",
                color: loginType === "STAFF" ? "#069a96" : "#64748b",
                boxShadow:
                  loginType === "STAFF"
                    ? "0 10px 24px rgba(15,23,42,0.08)"
                    : "none",
              }}
            >
              Personal medical
            </button>

            <button
              type="button"
              onClick={() => setLoginType("PATIENT")}
              style={{
                ...tabButtonStyle,
                background: loginType === "PATIENT" ? "white" : "transparent",
                color: loginType === "PATIENT" ? "#069a96" : "#64748b",
                boxShadow:
                  loginType === "PATIENT"
                    ? "0 10px 24px rgba(15,23,42,0.08)"
                    : "none",
              }}
            >
              Pacient
            </button>
          </div>

          {loginType === "STAFF" ? (
            <StaffLoginForm />
          ) : (
            <PatientLoginForm onOpenRegister={() => setRegisterOpen(true)} />
          )}
        </div>

        <div style={heroStyle}>
          <h1 style={heroTitleStyle}>
            Sistem de fluidizare <br />
            a fluxului pacienților la <br />
            <span style={heroAccentStyle}>Unitatea de Primiri Urgențe</span>
          </h1>

          <div style={heroLineStyle} />

          <p style={heroTextStyle}>
            Digitalizăm procesele din UPU pentru un flux mai rapid, decizii mai
            bune și îngrijire de calitate pentru fiecare pacient.
          </p>

          <div style={featuresStyle}>
            <div style={featuresStyle}>
  <Feature 
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#069a96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    } 
    text="Gestionare pacienți" 
  />
  <Feature 
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#069a96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    } 
    text="Fișe medicale" 
  />
  <Feature 
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#069a96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    } 
    text="Triaj asistat AI" 
  />
  <Feature 
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#069a96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" height="11" width="18" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    } 
    text="Date securizate" 
  />
</div>
          </div>
        </div>
      </div>

      <PatientRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div style={featureItemStyle}>
      <div style={featureIconStyle}>{icon}</div>
      <div style={featureTextStyle}>{text}</div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "42px 5vw",
  boxSizing: "border-box",
  color: "#0f172a",
};

const backgroundImageStyle = {
  position: "absolute",
  inset: 0,
  backgroundImage: "url('/images/login.png')",
  backgroundSize: "cover",
  backgroundPosition: "center right",
  backgroundRepeat: "no-repeat",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 35%, rgba(255,255,255,0.40) 65%, rgba(255,255,255,0.25) 100%)",
};

const layoutStyle = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: 1380,
  display: "grid",
  gridTemplateColumns: "480px 1fr",
  gap: 64,
  alignItems: "center",
};

const loginCardStyle = {
  width: "100%",
  padding: 48,
  borderRadius: 34,
  background: "rgba(255,255,255,0.90)",
  border: "1px solid rgba(255,255,255,0.85)",
  boxShadow: "0 30px 90px rgba(15,23,42,0.14)",
  backdropFilter: "blur(20px)",
};

const topRowStyle = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  marginBottom: 28,
};

const brandStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 16px",
  borderRadius: 999,
  background: "rgba(8,184,179,0.12)",
  color: "#069a96",
  fontWeight: 950,
};

const plusStyle = {
  fontSize: 22,
  fontWeight: 950,
};

const badgeStyle = {
  display: "inline-flex",
  padding: "9px 13px",
  borderRadius: 999,
  background: theme.colors.primarySoft,
  color: theme.colors.primaryDark,
  fontWeight: 900,
  fontSize: 13,
};

const formTitleStyle = {
  fontSize: 34,
  margin: 0,
  textAlign: "center",
  color: "#0f172a",
  letterSpacing: -0.8,
};

const formSubtitleStyle = {
  color: "#64748b",
  marginTop: 12,
  marginBottom: 28,
  fontSize: 15,
  lineHeight: 1.55,
  textAlign: "center",
};

const tabsWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 22,
  padding: 6,
  borderRadius: 18,
  background: "#eaf3fb",
};

const tabButtonStyle = {
  border: "none",
  borderRadius: 14,
  padding: "11px 12px",
  fontWeight: 950,
  cursor: "pointer",
};

const footerStyle = {
  marginTop: 22,
  color: "#94a3b8",
  fontSize: 13,
  textAlign: "center",
  fontWeight: 600,
};

const heroStyle = {
  maxWidth: 600,
  color: "#123244",
  padding: "0px", 
  borderRadius: 32,
  background: "transparent", 
  backdropFilter: "none", 
  boxShadow: "none", 
};

const heroTitleStyle = {
  margin: 0,
  fontSize: 38,
  lineHeight: 1.25,
  letterSpacing: -0.8,
  fontWeight: 750,
  color: "#123244",
  // O umbră discretă albă în jurul literelor ca textul să sară în ochi de pe poze mai colorate
  textShadow: "0 2px 12px rgba(255,255,255,0.9)", 
};

const heroAccentStyle = {
  color: "#069a96",
  fontWeight: 850,
};

const heroLineStyle = {
  width: 72,
  height: 3,
  borderRadius: 999,
  background: "#08b8b3",
  marginTop: 24,
  marginBottom: 22,
};

const heroTextStyle = {
  margin: 0,
  maxWidth: 500,
  color: "#1e293b", // Culoare text puțin mai închisă pentru lizibilitate maximă
  fontSize: 16,
  lineHeight: 1.6,
  fontWeight: 600,
};

const featuresStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(95px, 1fr))",
  gap: 18,
  marginTop: 46,
  maxWidth: 620,
};

const featureItemStyle = {
  textAlign: "center",
  color: "#334155", 
  fontWeight: 800,
  fontSize: 13,
};

const featureIconStyle = {
  width: 58,
  height: 58,
  margin: "0 auto 10px",
  borderRadius: 18,
  border: "1px solid rgba(0, 0, 0, 0.15)", 
  background: "rgba(255, 255, 255, 0.4)",  
  backdropFilter: "blur(4px)",
  display: "grid",
  placeItems: "center",
  fontSize: 24,
  boxShadow: "none",                       
};

const featureTextStyle = {
  lineHeight: 1.35,
};