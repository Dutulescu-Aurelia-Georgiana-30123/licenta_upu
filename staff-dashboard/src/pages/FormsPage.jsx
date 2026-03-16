import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";

export default function FormsPage({ selected }) {
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
    setMsg("");

    try {
      const patient = await apiGet(`/patients/${selected.patientId}`);
      setPatientDetails(patient);

      let data = null;
      try {
        data = await apiGet(`/visits/${selected.id}/preform`);
      } catch {
        data = null;
      }

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
    } catch (e) {
      setMsg(`Eroare load preform: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const loadDischarge = async () => {
    if (!selected) return;
    setMsg("");

    try {
      const patient = await apiGet(`/patients/${selected.patientId}`);
      setPatientDetails(patient);

      let data = null;
      try {
        data = await apiGet(`/visits/${selected.id}/discharge`);
      } catch {
        data = null;
      }

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
      await apiPut(`/visits/${selected.id}/preform`, payload);
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
      await apiPut(`/visits/${selected.id}/discharge`, payload);
      setMsg("Externare salvată ✅");
    } catch (e) {
      setMsg(`Eroare salvare externare: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const exportCombined = async () => {
    if (!selected) return;
    setMsg("");
    try {
      await apiPost(`/visits/${selected.id}/export/combined`);
      setMsg("PDF combinat generat ✅");
    } catch (e) {
      setMsg(`Eroare export: ${e}`);
    }
  };

  if (!selected) {
    return (
      <div style={{ padding: 16, width: "100%" }}>
        <h2>Fișe</h2>
        <p>Selectează o vizită din “Vizite” ca să lucrezi pe fișe.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, width: "100%" }}>
      <h2>Fișe (vizita {selected.id})</h2>

      {patientDetails && (
        <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Date pacient</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><b>Nume:</b> {patientDetails.firstName}</div>
            <div><b>Prenume:</b> {patientDetails.lastName}</div>
            <div><b>CNP:</b> {patientDetails.cnp || "-"}</div>
            <div><b>Telefon:</b> {patientDetails.phoneNumber || "-"}</div>
            <div><b>Email:</b> {patientDetails.email || "-"}</div>
            <div><b>PatientId:</b> {patientDetails.id}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={savePreform} disabled={loading} style={{ padding: "8px 12px" }}>Save PreForm</button>
          <button onClick={saveDischarge} disabled={loading} style={{ padding: "8px 12px" }}>Save Externare</button>
          <button onClick={exportCombined} style={{ padding: "8px 12px" }}>Export PDF combinat</button>
        </div>
        {msg && <p style={{ marginTop: 10, color: "#ddd" }}>{msg}</p>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 14, marginTop: 14 }}>
        <div style={{ border: "1px solid #333", borderRadius: 12, padding: 14, background: "#121212" }}>
          <h3 style={{ marginTop: 0 }}>Pre-spitalizare</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>Nume
              <input value={preform.firstName} onChange={(e) => setPreform({ ...preform, firstName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>Prenume
              <input value={preform.lastName} onChange={(e) => setPreform({ ...preform, lastName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>CNP
              <input value={preform.cnp} onChange={(e) => setPreform({ ...preform, cnp: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>Sex (M/F)
              <input value={preform.sex} onChange={(e) => setPreform({ ...preform, sex: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>Cod urgență
              <select value={preform.triageColor} onChange={(e) => setPreform({ ...preform, triageColor: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                <option value="ROSU">Roșu</option>
                <option value="GALBEN">Galben</option>
                <option value="VERDE">Verde</option>
              </select>
            </label>
            <label>Adus de
              <select value={preform.arrivalMode} onChange={(e) => setPreform({ ...preform, arrivalMode: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                <option value="SMURD">SMURD</option>
                <option value="SAJ">SAJ</option>
                <option value="MIJLOACE_PROPRII">Mijloace proprii</option>
                <option value="ALTELE">Altele</option>
              </select>
            </label>
          </div>

          <label style={{ display: "block", marginTop: 12 }}>
            Motiv solicitare
            <textarea value={preform.reason} onChange={(e) => setPreform({ ...preform, reason: e.target.value })} rows={3} style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>
        </div>

        <div style={{ border: "1px solid #333", borderRadius: 12, padding: 14, background: "#121212" }}>
          <h3 style={{ marginTop: 0 }}>Externare</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>Spital
              <input value={discharge.hospitalName} onChange={(e) => setDischarge({ ...discharge, hospitalName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>Secția
              <input value={discharge.sectionName} onChange={(e) => setDischarge({ ...discharge, sectionName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>Nr. F.O.
              <input value={discharge.foNumber} onChange={(e) => setDischarge({ ...discharge, foNumber: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label>Sex (M/F)
              <input value={discharge.sex} onChange={(e) => setDischarge({ ...discharge, sex: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
          </div>

          <label style={{ display: "block", marginTop: 12 }}>
            Diagnostic la internare
            <textarea value={discharge.diagnosisAtAdmission} onChange={(e) => setDischarge({ ...discharge, diagnosisAtAdmission: e.target.value })} rows={3} style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>
        </div>
      </div>
    </div>
  );
}