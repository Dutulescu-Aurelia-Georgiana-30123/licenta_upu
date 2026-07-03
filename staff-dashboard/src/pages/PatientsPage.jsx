import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";
import { useToast } from "../context/ToastContext";

const teal = "#08b8b3";
const tealDark = "#069a96";

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 28,
        padding: 22,
        boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: 16,
        border: "none",
        background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
        color: "white",
        fontWeight: 950,
        cursor: "pointer",
        boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(8,184,179,0.25)",
        background: "#e6fffd",
        color: tealDark,
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 13px",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        color: "#334155",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children, error }) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: "#334155",
          marginBottom: 7,
        }}
      >
        {label}
      </div>

      {children}

      {error && (
        <div style={{ color: "#dc2626", fontSize: 12, marginTop: 5, fontWeight: 800 }}>
          {error}
        </div>
      )}
    </label>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 22,
        padding: 16,
        boxShadow: "0 18px 45px rgba(15,47,95,0.07)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ color: "#667085", fontSize: 12, fontWeight: 800 }}>
            {label}
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#102033",
              fontSize: 28,
              fontWeight: 950,
              letterSpacing: -0.8,
            }}
          >
            {value ?? 0}
          </div>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            background: "#e6fffd",
            color: tealDark,
            display: "grid",
            placeItems: "center",
            fontWeight: 950,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#102033",
  outline: "none",
  fontWeight: 700,
};


export default function PatientsPage({ onVisitCreated }) {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    cnp: "",
    phoneNumber: "",
    email: "",
  });

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      cnp: "",
      phoneNumber: "",
      email: "",
    });
    setEditingPatientId(null);
  };

  const load = async (silent = false) => {
    setError("");
    try {
      const data = await apiGet("/patients");
      setPatients(data || []);
    } catch (e) {
      const msg = String(e);
      setError(msg);
      if (!silent) showError("Eroare la încărcarea pacienților");
    }
  };

  useEffect(() => {
  load(true);

  const interval = setInterval(() => {
    load(true);
  }, 7000);

  return () => clearInterval(interval);
}, []);

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();

    return patients.filter((p) => {
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
      const cnp = (p.cnp || "").toLowerCase();

      return q === "" || fullName.includes(q) || cnp.includes(q);
    });
  }, [patients, search]);

  const createPatient = async () => {
    setError("");

    try {
      if (editingPatientId) {
        await apiPut(`/patients/${editingPatientId}`, form);
        showSuccess("Pacient actualizat cu succes");
      } else {
        await apiPost("/patients", form);
        showSuccess("Pacient creat cu succes");
      }

      resetForm();
      setShowCreate(false);
      load(true);
    } catch (e) {
      showError(
        editingPatientId
          ? "Eroare la actualizarea pacientului"
          : "Eroare la crearea pacientului"
      );
      setError(String(e));
    }
  };

  const createVisit = async (patientId) => {
    setError("");

    try {
      const createdVisit = await apiPost("/visits", { patientId });
      

      if (onVisitCreated) {
        onVisitCreated(createdVisit);
      }
    } catch (e) {
      showError("Eroare la crearea vizitei");
      setError(String(e));
    }
  };

  const cnpError =
    form.cnp.length > 0 && form.cnp.length < 13
      ? "CNP-ul trebuie să aibă 13 cifre"
      : "";

  const phoneError =
    form.phoneNumber.length > 0 && form.phoneNumber.length < 10
      ? "Numărul trebuie să aibă cel puțin 10 cifre"
      : "";

  const emailError =
    form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Email invalid (ex: nume@domeniu.ro)"
      : "";

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          padding: 26,
          backgroundImage: `
linear-gradient(
135deg,
rgba(8,184,179,0.88),
rgba(6,154,150,0.78)
),
url("/images/receptie.jpg")
`,

backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
          color: "white",
          boxShadow: "0 28px 80px rgba(8, 184, 179, 0.20)",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 13px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              fontWeight: 900,
              marginBottom: 16,
            }}
          >
            👥 Registru pacienți
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 34,
              letterSpacing: -1.1,
              lineHeight: 1.1,
            }}
          >
            Management pacienți
          </h2>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              maxWidth: 720,
              lineHeight: 1.65,
              opacity: 0.92,
              fontWeight: 600,
            }}
          >
            Caută, înregistrează sau actualizează rapid datele pacienților și
            creează vizite noi pentru fluxul UPU.
          </p>

          <div style={{ marginTop: 22 }}>
            <button
              onClick={() => {
                const next = !showCreate;
                setShowCreate(next);

                if (!next) {
                  resetForm();
                }
              }}
              style={{
                border: "none",
                background: "white",
                color: tealDark,
                padding: "12px 16px",
                borderRadius: 16,
                fontWeight: 950,
                cursor: "pointer",
                boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
              }}
            >
              {showCreate ? "Închide formularul" : "+ Adaugă pacient"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <MiniStat label="Pacienți total" value={patients.length} icon="👥" />
        <MiniStat label="Pacienți afișați" value={filteredPatients.length} icon="▦" />
      </div>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 13,
            borderRadius: 16,
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: 800,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Card>
          <input
            type="text"
            placeholder="Caută după nume sau CNP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...inputStyle,
              maxWidth: 440,
            }}
          />
        </Card>
      </div>

      {showCreate && (
        <div style={{ marginTop: 16 }}>
          <Card>
            <div style={{ marginBottom: 18 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#102033",
                  fontSize: 22,
                  letterSpacing: -0.4,
                }}
              >
                {editingPatientId ? "Editare pacient" : "Creare pacient"}
              </h3>
              <div style={{ color: "#667085", marginTop: 5, fontSize: 13, fontWeight: 700 }}>
                Completează datele principale ale pacientului
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <Field label="Prenume">
                <input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  style={inputStyle}
                />
              </Field>

              <Field label="Nume">
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  style={inputStyle}
                />
              </Field>

              <Field label="CNP" error={cnpError}>
                <input
                  value={form.cnp}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^\d*$/.test(value)) return;
                    if (value.length > 13) return;

                    setForm({ ...form, cnp: value });
                  }}
                  style={inputStyle}
                />
              </Field>

              <Field label="Telefon" error={phoneError}>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^\d*$/.test(value)) return;
                    if (value.length > 15) return;

                    setForm({ ...form, phoneNumber: value });
                  }}
                  style={inputStyle}
                />
              </Field>

              <Field label="Email" error={emailError}>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryButton onClick={createPatient}>
                {editingPatientId ? "Salvează modificările" : "Salvează pacient"}
              </PrimaryButton>

              <GhostButton
                onClick={() => {
                  resetForm();
                  setShowCreate(false);
                }}
              >
                Renunță
              </GhostButton>
            </div>
          </Card>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                width: "100%",
                background: "#ffffff",
                borderRadius: 22,
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ color: "#667085", fontSize: 13, background: "#f8fafc" }}>
                  <th style={headCellStyle}>Prenume</th>
                  <th style={headCellStyle}>Nume</th>
                  <th style={headCellStyle}>CNP</th>
                  <th style={headCellStyle}>Telefon</th>
                  <th style={headCellStyle}>Email</th>
                  <th style={{ ...headCellStyle, textAlign: "center" }}>Acțiuni</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td style={cellStyle}>{p.firstName}</td>
                    <td style={cellStyle}>{p.lastName}</td>
                    <td style={cellStyle}>{p.cnp || "-"}</td>
                    <td style={cellStyle}>{p.phoneNumber || "-"}</td>
                    <td style={cellStyle}>{p.email || "-"}</td>

                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <SecondaryButton onClick={() => createVisit(p.id)}>
                          Creează vizită
                        </SecondaryButton>

                        <GhostButton
  onClick={() => {
    setForm({
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      cnp: p.cnp || "",
      phoneNumber: p.phoneNumber || "",
      email: p.email || "",
    });

    setEditingPatientId(p.id);
    setShowCreate(true);
    setError("");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }}
>
  Editează
</GhostButton>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: 22,
                        color: "#667085",
                        fontWeight: 800,
                      }}
                    >
                      Nu există pacienți.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

const headCellStyle = {
  padding: "14px 12px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  fontWeight: 900,
};

const cellStyle = {
  padding: "15px 12px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontWeight: 700,
  verticalAlign: "middle",
};