import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const teal = "#08b8b3";
const tealDark = "#069a96";

export default function PatientRegisterModal({ open, onClose }) {
  const { login } = useAuth();

  const [step, setStep] = useState("gdpr");

  const [acceptedGdpr, setAcceptedGdpr] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cnp, setCnp] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setStep("gdpr");
    setAcceptedGdpr(false);
    setFirstName("");
    setLastName("");
    setCnp("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const closeModal = () => {
    resetForm();
    onClose?.();
  };

  const goToForm = () => {
    setError("");

    if (!acceptedGdpr) {
      setError("Trebuie să accepți prelucrarea datelor personale.");
      return;
    }

    setStep("form");
  };

  const handleCreateAccount = async () => {
    setError("");

    if (!lastName.trim() || !firstName.trim() || !cnp.trim() || !phone.trim()) {
      setError("Completează toate câmpurile obligatorii.");
      return;
    }

    if (cnp.length !== 13) {
      setError("CNP-ul trebuie să aibă 13 cifre.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
  setError("Numărul de telefon trebuie să conțină minimum 10 cifre.");
  return;
}

    if (!password || !confirmPassword) {
      setError("Introdu parola și confirmarea parolei.");
      return;
    }

    if (password.length < 4) {
      setError("Parola trebuie să aibă minimum 4 caractere.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    try {
  const res = await axios.post(
    "http://localhost:8081/auth/register-patient",
    {
      firstName,
      lastName,
      cnp,
      phoneNumber: phone,
      password,
      gdprAccepted: true,
    }
  );

  login(res.data);

  window.location.href = "/patient";
} catch (err) {
  setError(
    err?.response?.data?.message ||
      "Nu s-a putut crea contul."
  );
}
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>
            <div style={badgeStyle}>Cont pacient</div>
            <h2 style={titleStyle}>
              {step === "gdpr"
                ? "Acord pentru prelucrarea datelor"
                : "Creeaza cont pacient"}
            </h2>
            <p style={subtitleStyle}>
              {step === "gdpr"
                ? "Pentru crearea contului este necesar acordul privind datele personale."
                : "Completează datele de bază pentru accesul în portal."}
            </p>
          </div>

          <button onClick={closeModal} style={closeButtonStyle}>
            ×
          </button>
        </div>

        {step === "gdpr" ? (
          <>
            <div style={gdprBoxStyle}>
              <strong>Informare privind datele personale</strong>

              <p style={{ marginTop: 10, lineHeight: 1.6 }}>
                Prin crearea contului, ești de acord ca datele introduse
                precum numele, prenumele, CNP-ul și numărul de telefon să fie
                utilizate în cadrul aplicației pentru identificarea pacientului,
                gestionarea vizitelor medicale și accesul la fișele generate.
              </p>

              <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
                Datele sunt folosite doar în scop medical și administrativ în
                cadrul sistemului UPU.
              </p>
            </div>

            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                checked={acceptedGdpr}
                onChange={(e) => setAcceptedGdpr(e.target.checked)}
              />
              <span>
                Sunt de acord cu prelucrarea datelor personale pentru crearea
                contului de pacient.
              </span>
            </label>

            {error && <div style={errorStyle}>{error}</div>}

            <button onClick={goToForm} style={primaryButtonStyle}>
              Continuă
            </button>
          </>
        ) : (
          <>
            <div style={gridStyle}>
              <label>
                <div style={labelStyle}>Nume</div>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </label>

              <label>
                <div style={labelStyle}>Prenume</div>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                />
              </label>

              <label>
                <div style={labelStyle}>CNP</div>
                <input
                  value={cnp}
                  onChange={(e) =>
                    setCnp(e.target.value.replace(/\D/g, "").slice(0, 13))
                  }
                  style={inputStyle}
                />
              </label>

              <label>
                <div style={labelStyle}>Telefon</div>
                <input
                  value={phone}
                  onChange={(e) =>
  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
}
                  style={inputStyle}
                />
              </label>

              <label>
                <div style={labelStyle}>Parolă</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="Introdu parola"
                />
              </label>

              <label>
                <div style={labelStyle}>Confirmă parola</div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="Reintrodu parola"
                />
              </label>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button
                onClick={() => setStep("gdpr")}
                style={secondaryButtonStyle}
              >
                Înapoi
              </button>

              <button onClick={handleCreateAccount} style={primaryButtonStyle}>
                Creează cont
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(15, 23, 42, 0.42)",
  backdropFilter: "blur(8px)",
  display: "grid",
  placeItems: "center",
  padding: 20,
};

const modalStyle = {
  width: "100%",
  maxWidth: 680,
  background: "rgba(255,255,255,0.96)",
  borderRadius: 30,
  padding: 28,
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 30px 90px rgba(15, 23, 42, 0.24)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  marginBottom: 22,
};

const badgeStyle = {
  display: "inline-flex",
  padding: "7px 11px",
  borderRadius: 999,
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 900,
  fontSize: 13,
  marginBottom: 12,
};

const titleStyle = {
  margin: 0,
  fontSize: 28,
  color: "#102033",
  letterSpacing: -0.7,
};

const subtitleStyle = {
  margin: "8px 0 0",
  color: "#667085",
  fontWeight: 600,
  lineHeight: 1.5,
};

const closeButtonStyle = {
  width: 42,
  height: 42,
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "white",
  color: "#64748b",
  fontSize: 26,
  fontWeight: 800,
  cursor: "pointer",
};

const gdprBoxStyle = {
  padding: 18,
  borderRadius: 22,
  background: "#f8fbff",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontWeight: 600,
};

const checkboxRowStyle = {
  marginTop: 16,
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  color: "#334155",
  fontWeight: 800,
  lineHeight: 1.5,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

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
  marginTop: 16,
  padding: 12,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 800,
  fontSize: 13,
};

const primaryButtonStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  fontWeight: 950,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

const secondaryButtonStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #dbe7f3",
  background: "white",
  color: "#334155",
  fontWeight: 950,
  fontSize: 15,
  cursor: "pointer",
};