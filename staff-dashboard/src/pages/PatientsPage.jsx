import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";
import { useToast } from "../context/ToastContext";

function Card({ children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5eef8",
        borderRadius: 24,
        padding: 18,
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
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
        padding: "10px 16px",
        borderRadius: 14,
        border: "none",
        background: "#2563eb",
        color: "white",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 12px 25px rgba(37, 99, 235, 0.22)",
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
        border: "1px solid #dbeafe",
        background: "#eff6ff",
        color: "#1d4ed8",
        fontWeight: 800,
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
        padding: "9px 12px",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        color: "#334155",
        fontWeight: 800,
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
      <div style={{ fontSize: 13, fontWeight: 800, color: "#334155", marginBottom: 6 }}>
        {label}
      </div>
      {children}
      {error && (
        <div style={{ color: "#dc2626", fontSize: 12, marginTop: 5, fontWeight: 700 }}>
          {error}
        </div>
      )}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  fontWeight: 600,
};

const cellStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontWeight: 600,
  verticalAlign: "middle",
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
      setPatients(data);
    } catch (e) {
      const msg = String(e);
      setError(msg);
      if (!silent) showError("Eroare la încărcarea pacienților");
    }
  };

  useEffect(() => {
    load(true);
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

      showSuccess("Vizită creată");

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              color: "#0f172a",
              letterSpacing: -0.6,
            }}
          >
            Pacienți
          </h2>
          <div style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            {filteredPatients.length} pacienți afișați
          </div>
        </div>

        <PrimaryButton
          onClick={() => {
            const next = !showCreate;
            setShowCreate(next);

            if (!next) {
              resetForm();
            }
          }}
        >
          {showCreate ? "Închide formularul" : "Adaugă pacient"}
        </PrimaryButton>
      </div>

      {error && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      <Card>
        <input
          type="text"
          placeholder="Caută după nume sau CNP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            marginTop: 0,
            maxWidth: 420,
          }}
        />
      </Card>

      {showCreate && (
        <div style={{ marginTop: 16 }}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: 20 }}>
                {editingPatientId ? "Editare pacient" : "Creare pacient"}
              </h3>
              <div style={{ color: "#64748b", marginTop: 4, fontSize: 13 }}>
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

            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              }}
            >
              <thead>
                <tr style={{ color: "#64748b", fontSize: 13 }}>
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
                      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
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
                        padding: 20,
                        color: "#64748b",
                        fontWeight: 700,
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
  padding: "12px 10px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  fontWeight: 800,
};