import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8081";

/** ---------- Global Layout Fix (no horizontal overflow) ---------- */
function useGlobalLayoutFix() {
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-layout-fix", "true");
    style.innerHTML = `
      html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      button, input, select, textarea {
        font-family: inherit;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

/** ---------- Shared page wrapper ---------- */
function PageWrap({ children }) {
  return (
    <div
      style={{
        padding: 16,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

/** ---------- Top Nav (orizontal) ---------- */
function TopNav({ active, onChange, selected }) {
  const items = [
    { key: "home", label: "Home" },
    { key: "visits", label: "Vizite" },
    { key: "forms", label: "Fișe" },
    { key: "archive", label: "Arhivă" },
  ];

  return (
    <div style={{ borderBottom: "1px solid #333", background: "#0f0f0f", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18, flexShrink: 0 }}>UPU Dashboard</div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                border: active === it.key ? "1px solid #3a3a3a" : "1px solid #222",
                background: active === it.key ? "#2a2a2a" : "#151515",
                color: "#eaeaea",
                whiteSpace: "nowrap",
              }}
            >
              {it.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }} />

        <div style={{ fontSize: 13, color: "#ccc", textAlign: "right", minWidth: 0, maxWidth: "100%" }}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
            title={
              selected
                ? `Vizită selectată: ${selected.visitCode} (ID ${selected.id})`
                : "Nicio vizită selectată"
            }
          >
            {selected ? (
              <>
                Vizită selectată: <b>{selected.visitCode}</b> (ID {selected.id})
              </>
            ) : (
              "Nicio vizită selectată"
            )}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#888",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
            title={`Backend: ${API_BASE}`}
          >
            Backend: {API_BASE}
          </div>
        </div>
      </div>
    </div>
  );
}

/** ---------- Home / Stats ---------- */
function StatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 12,
        padding: 10,
        background: "#121212",
        minWidth: 0,
        maxWidth: "100%",
      }}
    >
      <div style={{ fontSize: 12, color: "#aaa" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{value}</div>
      {subtitle && <div style={{ marginTop: 4, color: "#ccc", fontSize: 12 }}>{subtitle}</div>}
    </div>
  );
}

function HomePage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    fetch(`${API_BASE}/stats`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(String(e)));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageWrap>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <h2 style={{ margin: 0 }}>Overview</h2>
        <button onClick={load} style={{ padding: "6px 10px", flexShrink: 0 }}>
          Refresh
        </button>
      </div>

      {error && <p style={{ color: "red" }}>Eroare /stats: {error}</p>}

      {!stats ? (
        <p style={{ color: "#aaa", marginTop: 12 }}>Se încarcă...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
            marginTop: 12,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <StatCard title="Pacienți (conturi)" value={stats.patientsCount} subtitle="Total pacienți înregistrați" />
          <StatCard title="Vizite UPU" value={stats.visitsCount} subtitle="Total vizite" />
          <StatCard title="Fișe pre-spitalizare" value={stats.preFormsCount} subtitle="Total fișe preform" />
          <StatCard title="Fișe externare" value={stats.dischargeFormsCount} subtitle="Total fișe externare" />
          <StatCard title="Arhivă (documente PDF)" value={stats.archivedDocumentsCount} subtitle="Total PDF-uri (doar combinat)" />
        </div>
      )}
    </PageWrap>
  );
}

/** ---------- Visits ---------- */
function VisitsPage({ visits, selected, onSelect, onReload }) {
  return (
    <PageWrap>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <h2 style={{ margin: 0 }}>Vizite ({visits.length})</h2>
        <button onClick={onReload} style={{ padding: "6px 10px", flexShrink: 0 }}>
          Refresh
        </button>
      </div>

      <div style={{ marginTop: 12, overflowX: "auto", maxWidth: "100%" }}>
        <table
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 900,
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Visit Code</th>
              <th>Pacient</th>
              <th>Status</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr
                key={v.id}
                onClick={() => onSelect(v)}
                style={{
                  cursor: "pointer",
                  background: selected?.id === v.id ? "#2a2a2a" : "transparent",
                }}
              >
                <td>{v.id}</td>
                <td>{v.visitCode}</td>
                <td>
                  {v.patientFirstName} {v.patientLastName} (ID {v.patientId})
                </td>
                <td>{v.status}</td>
                <td>{v.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: "#aaa", marginTop: 10 }}>Click pe o vizită ca să o selectezi.</p>
    </PageWrap>
  );
}

/** ---------- Forms ---------- */
function FormsPage({ selected }) {
  const [preform, setPreform] = useState({
    firstName: "",
    lastName: "",
    cnp: "",
    sex: "",
    triageColor: "GALBEN",
    arrivalMode: "MIJLOACE_PROPRII",
    respiratoryRate: "",
    pulse: "",
    systolicBp: "",
    diastolicBp: "",
    spo2: "",
    temperature: "",
    glycemia: "",
    reason: "",
  });

  const [discharge, setDischarge] = useState({
    hospitalName: "",
    sectionName: "",
    foNumber: "",
    firstName: "",
    lastName: "",
    cnp: "",
    sex: "",
    diagnosisAtAdmission: "",
    diagnosisAtDischarge: "",
    treatmentAndRecommendations: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);

  const loadPreform = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const resPatient = await fetch(`${API_BASE}/patients/${selected.patientId}`);
      const patient = await resPatient.json();
      setPatientDetails(patient);

      let data = null;
      const resPre = await fetch(`${API_BASE}/visits/${selected.id}/preform`);
      if (resPre.ok) data = await resPre.json();

      setPreform((prev) => ({
        ...prev,
        ...(data
          ? {
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              cnp: data.cnp || "",
              sex: data.sex || "",
              triageColor: data.triageColor || prev.triageColor,
              arrivalMode: data.arrivalMode || prev.arrivalMode,
              reason: data.reason || "",
              respiratoryRate: data.respiratoryRate ?? "",
              pulse: data.pulse ?? "",
              systolicBp: data.systolicBp ?? "",
              diastolicBp: data.diastolicBp ?? "",
              spo2: data.spo2 ?? "",
              temperature: data.temperature ?? "",
              glycemia: data.glycemia ?? "",
            }
          : {}),
        firstName: data?.firstName?.trim() ? data.firstName : patient.firstName || "",
        lastName: data?.lastName?.trim() ? data.lastName : patient.lastName || "",
        cnp: data?.cnp ? data.cnp : patient.cnp || "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadDischarge = async () => {
    if (!selected) return;
    try {
      const resPatient = await fetch(`${API_BASE}/patients/${selected.patientId}`);
      const patient = await resPatient.json();
      setPatientDetails(patient);

      let data = null;
      const res = await fetch(`${API_BASE}/visits/${selected.id}/discharge`);
      if (res.ok) data = await res.json();

      setDischarge((prev) => ({
        ...prev,
        ...(data
          ? {
              hospitalName: data.hospitalName || "",
              sectionName: data.sectionName || "",
              foNumber: data.foNumber || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              cnp: data.cnp || "",
              sex: data.sex || "",
              diagnosisAtAdmission: data.diagnosisAtAdmission || "",
              diagnosisAtDischarge: data.diagnosisAtDischarge || "",
              treatmentAndRecommendations: data.treatmentAndRecommendations || "",
            }
          : {}),
        firstName: data?.firstName?.trim() ? data.firstName : patient.firstName || "",
        lastName: data?.lastName?.trim() ? data.lastName : patient.lastName || "",
        cnp: data?.cnp ? data.cnp : patient.cnp || "",
      }));
    } catch (e) {
      setMsg(`Eroare load externare: ${e}`);
    }
  };

  useEffect(() => {
    if (!selected) return;
    loadPreform();
    loadDischarge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const toIntOrNull = (v) => (v === "" ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null);
  const toFloatOrNull = (v) => (v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);

  const savePreform = async () => {
    if (!selected) return;
    setMsg("");
    setLoading(true);

    const payload = {
      ...preform,
      respiratoryRate: toIntOrNull(preform.respiratoryRate),
      pulse: toIntOrNull(preform.pulse),
      systolicBp: toIntOrNull(preform.systolicBp),
      diastolicBp: toIntOrNull(preform.diastolicBp),
      spo2: toIntOrNull(preform.spo2),
      glycemia: toIntOrNull(preform.glycemia),
      temperature: toFloatOrNull(preform.temperature),
    };

    try {
      const res = await fetch(`${API_BASE}/visits/${selected.id}/preform`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("PreForm salvat ✅");
    } catch (e) {
      setMsg(`Eroare salvare preform: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const saveDischarge = async () => {
    if (!selected) return;
    setMsg("");
    setLoading(true);

    const payload = {
      ...discharge,
      details: "{}",
      citizenshipType: "ROMANA",
      insuranceStatus: "ASIGURAT_CNAS",
      admissionType: "URGENTA",
      hospitalizationOutcome: "AMELIORAT",
      dischargeType: "EXTERNAT",
    };

    try {
      const res = await fetch(`${API_BASE}/visits/${selected.id}/discharge`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("Externare salvată ✅");
    } catch (e) {
      setMsg(`Eroare salvare externare: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  if (!selected) {
    return (
      <PageWrap>
        <h2>Fișe</h2>
        <p>Selectează o vizită din “Vizite” ca să lucrezi pe fișe.</p>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <h2>Fișe (vizita {selected.id})</h2>

      {patientDetails && (
        <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8, maxWidth: "100%" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Date pacient (auto-complete)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
            <div><b>Nume:</b> {patientDetails.firstName}</div>
            <div><b>Prenume:</b> {patientDetails.lastName}</div>
            <div><b>CNP:</b> {patientDetails.cnp || "-"}</div>
            <div><b>Telefon:</b> {patientDetails.phoneNumber || "-"}</div>
            <div><b>Email:</b> {patientDetails.email || "-"}</div>
            <div><b>PatientId:</b> {patientDetails.id}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8, maxWidth: "100%" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", minWidth: 0 }}>
          <button onClick={savePreform} disabled={loading} style={{ padding: "8px 12px" }}>
            Save PreForm
          </button>
          <button onClick={saveDischarge} disabled={loading} style={{ padding: "8px 12px" }}>
            Save Externare
          </button>
          <button
            onClick={async () => {
              setMsg("");
              try {
                const res = await fetch(`${API_BASE}/visits/${selected.id}/export/combined`, { method: "POST" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                setMsg("PDF combinat generat ✅");
              } catch (e) {
                setMsg(`Eroare export: ${e}`);
              }
            }}
            style={{ padding: "8px 12px" }}
          >
            Export PDF combinat
          </button>
        </div>
        {msg && <p style={{ marginTop: 10, color: "#ddd" }}>{msg}</p>}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 14,
          marginTop: 14,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
        {/* Preform */}
        <div style={{ border: "1px solid #333", borderRadius: 12, padding: 14, background: "#121212", minWidth: 0 }}>
          <h3 style={{ marginTop: 0 }}>Pre-spitalizare</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 0 }}>
            <label>
              Nume
              <input
                value={preform.firstName}
                onChange={(e) => setPreform({ ...preform, firstName: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Prenume
              <input
                value={preform.lastName}
                onChange={(e) => setPreform({ ...preform, lastName: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              CNP
              <input
                value={preform.cnp}
                onChange={(e) => setPreform({ ...preform, cnp: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Sex (M/F)
              <input
                value={preform.sex}
                onChange={(e) => setPreform({ ...preform, sex: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Cod urgență
              <select
                value={preform.triageColor}
                onChange={(e) => setPreform({ ...preform, triageColor: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              >
                <option value="ROSU">Roșu</option>
                <option value="GALBEN">Galben</option>
                <option value="VERDE">Verde</option>
              </select>
            </label>
            <label>
              Adus de
              <select
                value={preform.arrivalMode}
                onChange={(e) => setPreform({ ...preform, arrivalMode: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              >
                <option value="SMURD">SMURD</option>
                <option value="SAJ">SAJ</option>
                <option value="MIJLOACE_PROPRII">Mijloace proprii</option>
                <option value="ALTELE">Altele</option>
              </select>
            </label>
          </div>

          <label style={{ display: "block", marginTop: 12 }}>
            Motiv solicitare
            <textarea
              value={preform.reason}
              onChange={(e) => setPreform({ ...preform, reason: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <h4 style={{ marginTop: 14, marginBottom: 8 }}>Semne vitale</h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, minWidth: 0 }}>
            <label>
              FR
              <input
                type="number"
                value={preform.respiratoryRate}
                onChange={(e) => setPreform({ ...preform, respiratoryRate: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Puls
              <input
                type="number"
                value={preform.pulse}
                onChange={(e) => setPreform({ ...preform, pulse: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              SpO2
              <input
                type="number"
                value={preform.spo2}
                onChange={(e) => setPreform({ ...preform, spo2: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              TA sistolică
              <input
                type="number"
                value={preform.systolicBp}
                onChange={(e) => setPreform({ ...preform, systolicBp: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              TA diastolică
              <input
                type="number"
                value={preform.diastolicBp}
                onChange={(e) => setPreform({ ...preform, diastolicBp: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Temperatura
              <input
                type="number"
                step="0.1"
                value={preform.temperature}
                onChange={(e) => setPreform({ ...preform, temperature: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Glicemie
              <input
                type="number"
                value={preform.glycemia}
                onChange={(e) => setPreform({ ...preform, glycemia: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
          </div>
        </div>

        {/* Externare */}
        <div style={{ border: "1px solid #333", borderRadius: 12, padding: 14, background: "#121212", minWidth: 0 }}>
          <h3 style={{ marginTop: 0 }}>Externare</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 0 }}>
            <label>
              Spital
              <input
                value={discharge.hospitalName}
                onChange={(e) => setDischarge({ ...discharge, hospitalName: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Secția
              <input
                value={discharge.sectionName}
                onChange={(e) => setDischarge({ ...discharge, sectionName: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Nr. F.O.
              <input
                value={discharge.foNumber}
                onChange={(e) => setDischarge({ ...discharge, foNumber: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
            <label>
              Sex (M/F)
              <input
                value={discharge.sex}
                onChange={(e) => setDischarge({ ...discharge, sex: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
          </div>

          <label style={{ display: "block", marginTop: 12 }}>
            Diagnostic la internare
            <textarea
              value={discharge.diagnosisAtAdmission}
              onChange={(e) => setDischarge({ ...discharge, diagnosisAtAdmission: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Diagnostic la externare
            <textarea
              value={discharge.diagnosisAtDischarge}
              onChange={(e) => setDischarge({ ...discharge, diagnosisAtDischarge: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Tratament / Recomandări postspitalizare
            <textarea
              value={discharge.treatmentAndRecommendations}
              onChange={(e) => setDischarge({ ...discharge, treatmentAndRecommendations: e.target.value })}
              rows={4}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>
      </div>
    </PageWrap>
  );
}

/** ---------- Archive ---------- */
function ArchivePage({ selected }) {
  const [combinedDoc, setCombinedDoc] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCombinedDoc(null);
    setError("");
    if (!selected) return;

    fetch(`${API_BASE}/visits/${selected.id}/documents`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((docs) => {
        const doc = docs.find((d) => d.documentType === "COMBINED_VISIT_PDF") || null;
        setCombinedDoc(doc);
      })
      .catch((e) => setError(String(e)));
  }, [selected]);

  if (!selected) {
    return (
      <PageWrap>
        <h2>Arhivă</h2>
        <p>Selectează o vizită din “Vizite” ca să vezi documentul combinat.</p>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <h2>Arhivă (vizita {selected.id})</h2>

      {error && <p style={{ color: "red" }}>Eroare: {error}</p>}

      {!combinedDoc ? (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #333", borderRadius: 8, maxWidth: "100%" }}>
          <p style={{ marginTop: 0 }}>Nu există încă PDF combinat pentru această vizită.</p>
          <p style={{ color: "#aaa", marginBottom: 0 }}>
            (Îl generezi din pagina “Fișe” cu butonul Export PDF combinat.)
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #333", borderRadius: 8, maxWidth: "100%" }}>
          <p style={{ marginTop: 0 }}>
            PDF combinat disponibil: <b>{combinedDoc.fileName}</b>
          </p>
          <a href={`${API_BASE}/documents/${combinedDoc.id}/download`} target="_blank" rel="noreferrer">
            Descarcă PDF combinat
          </a>
        </div>
      )}
    </PageWrap>
  );
}

/** ---------- App root ---------- */
export default function App() {
  useGlobalLayoutFix();

  const [activePage, setActivePage] = useState("home");
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const loadVisits = () => {
    setError("");
    fetch(`${API_BASE}/visits`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVisits(data);
        if (selected) {
          const fresh = data.find((v) => v.id === selected.id);
          if (fresh) setSelected(fresh);
        }
      })
      .catch((e) => setError(String(e)));
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const content = useMemo(() => {
    if (activePage === "home") return <HomePage />;
    if (activePage === "visits")
      return <VisitsPage visits={visits} selected={selected} onSelect={(v) => setSelected(v)} onReload={loadVisits} />;
    if (activePage === "forms") return <FormsPage selected={selected} />;
    if (activePage === "archive") return <ArchivePage selected={selected} />;
    return null;
  }, [activePage, visits, selected]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",          // IMPORTANT: NU 100vw
        maxWidth: "100%",
        color: "#eaeaea",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",    // blochează overflow orizontal
      }}
    >
      <TopNav active={activePage} onChange={setActivePage} selected={selected} />

      {error && <div style={{ padding: 12, color: "red" }}>Eroare la fetch /visits: {error}</div>}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {content}
      </div>
    </div>
  );
}