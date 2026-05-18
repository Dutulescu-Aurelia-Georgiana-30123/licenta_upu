import { useState } from "react";
import axios from "axios";
import { theme } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";

export default function PatientLoginForm({ onOpenRegister }) {
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [cnp, setCnp] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    const cleanFullName = fullName.trim();
    const cleanCnp = cnp.trim();
    const cleanPassword = password.trim();

    if (!cleanFullName || !cleanCnp || !cleanPassword) {
      setError("Completează numele complet, CNP-ul și parola.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8081/auth/login", {
        fullName: cleanFullName,
        cnp: cleanCnp,
        password: cleanPassword,
      });

      login(res.data);
      window.location.href = "/patient";
    } catch {
      setError("Nume, CNP sau parolă incorectă.");
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
    <>
      <label style={{ display: "block", marginBottom: 16 }}>
        <div style={labelStyle}>Nume și prenume</div>

        <input
          placeholder="Ex: Ana Dutu sau Dutu Ana"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onKeyDown={handleEnter}
          style={inputStyle}
        />
      </label>

      <label style={{ display: "block", marginBottom: 16 }}>
        <div style={labelStyle}>CNP</div>

        <input
          placeholder="Introdu CNP"
          value={cnp}
          onChange={(e) =>
            setCnp(e.target.value.replace(/\D/g, "").slice(0, 13))
          }
          onKeyDown={handleEnter}
          style={inputStyle}
        />
      </label>

      <label style={{ display: "block", marginBottom: 14 }}>
        <div style={labelStyle}>Parolă</div>

        <input
          placeholder="Introdu parola"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleEnter}
          style={inputStyle}
        />
      </label>

      {error && <div style={errorStyle}>{error}</div>}

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
        {loading ? "Se autentifică..." : "Login pacient"}
      </button>

      <button
        type="button"
        onClick={onOpenRegister}
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
    </>
  );
}

const labelStyle = {
  marginBottom: 7,
  color: "#334155",
  fontWeight: 800,
  fontSize: 13,
};

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

const errorStyle = {
  marginBottom: 16,
  padding: 12,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 800,
  fontSize: 13,
};