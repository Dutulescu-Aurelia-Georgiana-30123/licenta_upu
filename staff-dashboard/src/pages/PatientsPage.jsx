import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";
import { useToast } from "../context/ToastContext";

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Pacienți ({filteredPatients.length})</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => {
              const next = !showCreate;
              setShowCreate(next);

              if (!next) {
                resetForm();
              }
            }}
            style={{ padding: "8px 12px" }}
          >
            {showCreate ? "Închide formularul" : "Adaugă pacient"}
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 12 }}>
        <input
          type="text"
          placeholder="Caută după nume sau CNP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            minWidth: 320,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#121212",
            color: "#eaeaea",
          }}
        />
      </div>

      {showCreate && (
        <div
          style={{
            marginTop: 16,
            border: "1px solid #333",
            borderRadius: 12,
            padding: 14,
            background: "#121212",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {editingPatientId ? "Editare pacient" : "Creare pacient"}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <label>
              Prenume
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <label>
              Nume
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <label>
              CNP
              <input
                value={form.cnp}
                onChange={(e) => setForm({ ...form, cnp: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <label>
              Telefon
              <input
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <label>
              Email
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={createPatient} style={{ padding: "8px 12px" }}>
              {editingPatientId ? "Salvează modificările" : "Salvează pacient"}
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowCreate(false);
              }}
              style={{ padding: "8px 12px" }}
            >
              Renunță
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            background: "#111",
          }}
        >
          <thead>
            <tr style={{ background: "#151515" }}>
              <th style={{ border: "1px solid #333", padding: 10 }}>Prenume</th>
              <th style={{ border: "1px solid #333", padding: 10 }}>Nume</th>
              <th style={{ border: "1px solid #333", padding: 10 }}>CNP</th>
              <th style={{ border: "1px solid #333", padding: 10 }}>Telefon</th>
              <th style={{ border: "1px solid #333", padding: 10 }}>Email</th>
              <th style={{ border: "1px solid #333", padding: 10 }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id}>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.firstName}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.lastName}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.cnp || "-"}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.phoneNumber || "-"}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.email || "-"}</td>

                <td style={{ border: "1px solid #333", padding: 10, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent:"center"}}>
                    <button
                      onClick={() => createVisit(p.id)}
                      style={{ padding: "6px 10px", cursor: "pointer" }}
                    >
                      Creează vizită
                    </button>

                    <button
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
                      style={{ padding: "6px 10px", cursor: "pointer" }}
                    >
                      Editează pacient
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 14, color: "#aaa" }}>
                  Nu există pacienți.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}