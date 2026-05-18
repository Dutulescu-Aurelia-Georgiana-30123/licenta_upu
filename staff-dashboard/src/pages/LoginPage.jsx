import { useState } from "react";
import { theme } from "../styles/theme";
import StaffLoginForm from "../components/auth/StaffLoginForm";
import PatientLoginForm from "../components/auth/PatientLoginForm";
import PatientRegisterModal from "../components/patient/PatientRegisterModal";

export default function LoginPage() {
  const [loginType, setLoginType] = useState("STAFF");
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #eef2ff 45%, #f8fbff 100%)",
        display: "grid",
        placeItems: "center",
        padding: 28,
        boxSizing: "border-box",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1120,
          minHeight: 640,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(255,255,255,0.8)",
          borderRadius: 34,
          overflow: "hidden",
          boxShadow: "0 30px 90px rgba(15, 23, 42, 0.16)",
        }}
      >
        <div
          style={{
            position: "relative",
            padding: 56,
            background:
              "linear-gradient(145deg, #08b8b3 0%, #069a96 60%, #14b8a6 100%)",
            color: "white",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              top: -70,
              left: -80,
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              bottom: 60,
              right: -40,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                fontWeight: 800,
                marginBottom: 70,
              }}
            >
              <span style={{ fontSize: 22 }}>✚</span>
              UPU Medical
            </div>

            <h1
              style={{
                fontSize: 48,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: -1.5,
                maxWidth: 520,
              }}
            >
              Platformă digitală pentru fluxul UPU
            </h1>

            <p
              style={{
                marginTop: 22,
                fontSize: 17,
                lineHeight: 1.7,
                opacity: 0.9,
                maxWidth: 500,
              }}
            >
              Gestionare pacienți, vizite, fișe medicale, triaj asistat AI și
              arhivare documente într-un singur sistem.
            </p>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 42,
                maxWidth: 430,
              }}
            >
              {[
                "Dashboard operațional pentru recepție",
                "Flux medical pentru medic și asistent",
                "Portal dedicat pentru pacienți",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 14px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                    fontWeight: 700,
                  }}
                >
                  <span>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 56,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#f8fbff",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                background: theme.colors.primarySoft,
                color: theme.colors.primaryDark,
                fontWeight: 900,
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              Autentificare
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                letterSpacing: -0.8,
              }}
            >
              {loginType === "STAFF" ? "Bine ai revenit" : "Portal pacient"}
            </h2>

            <p style={{ color: "#64748b", marginTop: 10, fontSize: 15 }}>
              {loginType === "STAFF"
                ? "Personalul medical se autentifică folosind emailul și parola."
                : "Pacienții se autentifică folosind numele, CNP-ul și parola."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 22,
              padding: 6,
              borderRadius: 18,
              background: "#eaf3fb",
            }}
          >
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

          <div
            style={{
              marginTop: 22,
              color: "#94a3b8",
              fontSize: 13,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            UPU Dashboard · Licență
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

const tabButtonStyle = {
  border: "none",
  borderRadius: 14,
  padding: "11px 12px",
  fontWeight: 950,
  cursor: "pointer",
};