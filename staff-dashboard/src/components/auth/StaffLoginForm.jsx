import { useState } from "react";
import axios from "axios";
import { theme } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";

export default function StaffLoginForm() {
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
      }
    } catch {
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
  <>
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={labelStyle}>Email</div>

      <input
        placeholder="email@exemplu.ro"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleEnter}
        autoComplete="off"
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
        autoComplete="off"
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
      {loading ? "Se autentifică..." : "Login personal medical"}
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