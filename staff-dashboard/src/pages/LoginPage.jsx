import { useState } from "react";
import axios from "axios";
import { theme } from "../styles/theme";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8081/auth/login", {
        email,
        password,
      });

      const user = res.data;
      login(user);

      if (user.role === "RECEPTION") {
        window.location.href = "/";
      } else if (user.role === "DOCTOR" || user.role === "NURSE") {
        window.location.href = "/medical";
      } else if (user.role === "PATIENT") {
        window.location.href = "/patient";
      }
    } catch (err) {
      setError("Email sau parolă incorectă.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

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
                "Triaj asistat AI și documente PDF",
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
          <div style={{ marginBottom: 34 }}>
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
              Bine ai revenit
            </h2>

            <p style={{ color: "#64748b", marginTop: 10, fontSize: 15 }}>
              Introdu datele contului pentru a accesa aplicația.
            </p>
          </div>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div
              style={{
                marginBottom: 7,
                color: "#334155",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              Email
            </div>
            <input
              placeholder="email@exemplu.ro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEnter}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginBottom: 14 }}>
            <div
              style={{
                marginBottom: 7,
                color: "#334155",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              Parolă
            </div>
            <input
              placeholder="Introdu parola"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleEnter}
              style={inputStyle}
            />
          </label>

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                borderRadius: 14,
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #08b8b3, #069a96)",
              color: "white",
              fontWeight: 900,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: theme.shadow.teal,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Se autentifică..." : "Login"}
          </button>

          <button
  type="button"
  onClick={() => alert("Înregistrarea pacienților va fi disponibilă în etapa următoare.")}
  style={{
    marginTop: 12,
    width: "100%",
    padding: "12px 16px",
    borderRadius: 16,
    border: "1px solid rgba(8,184,179,0.25)",
    background: "#e6fffd",
    color: "#069a96",
    fontWeight: 900,
    cursor: "pointer",
  }}
>
  Creează cont pacient
</button>

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
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#102033",
  outline: "none",
  fontWeight: 700,
  fontSize: 14,
};