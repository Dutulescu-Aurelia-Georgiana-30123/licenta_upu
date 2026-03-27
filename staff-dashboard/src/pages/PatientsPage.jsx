import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../api/api";

export default function PatientsPage({ onVisitCreated }) {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    cnp: "",
    phoneNumber: "",
    email: "",
  });

  const load = async () => {
    setError("");
    try {
      const data = await apiGet("/patients");
      setPatients(data);
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();

    return patients.filter((p) => {
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
      const phone = (p.phoneNumber || "").toLowerCase();
      const email = (p.email || "").toLowerCase();

      return q === "" || fullName.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [patients, search]);

  const createPatient = async () => {
    setMsg("");
    setError("");

    try {
      await apiPost("/patients", form);
      setMsg("Pacient creat cu succes.");
      setForm({
        firstName: "",
        lastName: "",
        cnp: "",
        phoneNumber: "",
        email: "",
      });
      setShowCreate(false);
      load();
    } catch (e) {
      setError(`Eroare creare pacient: ${e}`);
    }
  };

  const createVisit = async (patientId) => {
    setMsg("");
    setError("");

    try {
      const createdVisit = await apiPost("/visits", { patientId });

      if (onVisitCreated) {
        onVisitCreated(createdVisit);
      }
    } catch (e) {
      setError(`Eroare creare vizită: ${e}`);
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
            onClick={() => setShowCreate((prev) => !prev)}
            style={{ padding: "8px 12px" }}
          >
            {showCreate ? "Închide formularul" : "Adaugă pacient"}
          </button>

          <button onClick={load} style={{ padding: "8px 12px" }}>
            Refresh
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {msg && <p style={{ color: "#9ae6b4" }}>{msg}</p>}

      <div style={{ marginTop: 12 }}>
        <input
          type="text"
          placeholder="Caută după nume, telefon sau email"
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
          <h3 style={{ marginTop: 0 }}>Creare pacient</h3>

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

          <div style={{ marginTop: 14 }}>
            <button onClick={createPatient} style={{ padding: "8px 12px" }}>
              Salvează pacient
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
              <th style={{ border: "1px solid #333", padding: 10 }}>ID</th>
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
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.id}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.firstName}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.lastName}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.cnp || "-"}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.phoneNumber || "-"}</td>
                <td style={{ border: "1px solid #333", padding: 10 }}>{p.email || "-"}</td>

                <td style={{ border: "1px solid #333", padding: 10 }}>
                  <button
                    onClick={() => createVisit(p.id)}
                    style={{ padding: "6px 10px", cursor: "pointer" }}
                  >
                    Creează vizită
                  </button>
                </td>
              </tr>
            ))}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 14, color: "#aaa" }}>
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