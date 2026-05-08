import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "../api/api";
import { initialPreformState, initialDischargeState } from "../forms/initialStates";
import PatientDetailsPanel from "../components/forms/PatientDetailsPanel";
import FormsToolbar from "../components/forms/FormsToolbar";
import PreformSection from "../components/forms/PreformSection";
import DischargeSection from "../components/forms/DischargeSection";
import PreformPrintView from "../components/forms/PreFormPrintView";
import DischargePrintView from "../components/forms/DischargePrintView";
import { exportCombinedPdf, downloadCombinedPdf } from "./formsPrintActions";
import {
  buildPreformPayload,
  buildDischargePayload,
  buildAiTriagePayload,
} from "./formsPayloadBuilders";
import { loadPreformIntoState, loadDischargeIntoState } from "./formsPageLoaders";
import { loadPatientVisitsAction } from "./formsSearchActions";
import SignaturesSection from "../components/forms/SignaturesSection";
import {
  loadPreformData,
  loadDischargeData,
  savePreformData,
  saveDischargeData,
  updateVisitStatusData,
  loadPatientVisitsData,
  predictAiTriageData,
} from "./formsPageApi";
import { useToast } from "../context/ToastContext";

function mapAiLabelToTriageColor(label) {
  const map = {
    rosu: "ROSU",
    galben: "GALBEN",
    verde: "VERDE",
    consult: "CONSULT",
  };

  return map[label] || "";
}

function getMissingRequiredAiFields(preform) {
  const hasCriticalSafetyFlag =
    preform.pickupStopCr ||
    preform.pickupDeceased ||
    preform.pickupResuscitationInProgress;

  if (hasCriticalSafetyFlag) return [];

  const missingFields = [];

  if (!preform.age) missingFields.push("vârsta");
  if (!preform.sex) missingFields.push("sexul");
  if (!preform.temperature) missingFields.push("temperatura");
  if (!preform.pulse && !preform.av) missingFields.push("pulsul / AV");
  if (!preform.respiratoryRate) missingFields.push("frecvența respiratorie");
  if (!preform.systolicBp) missingFields.push("TA sistolică");
  if (!preform.diastolicBp) missingFields.push("TA diastolică");
  if (!preform.spo2) missingFields.push("saturația O2");

  if (
    preform.painScale === "" ||
    preform.painScale === null ||
    preform.painScale === undefined
  ) {
    missingFields.push("scorul durerii");
  }

  return missingFields;
}

function getMissingRecommendedAiFields(preform) {
  const missingFields = [];

  if (!preform.reason) missingFields.push("motivul prezentării");
  if (!preform.broughtByCode) missingFields.push("adus de");
  if (!preform.patientStateCode) missingFields.push("starea pacientului");
  if (!preform.gcs) missingFields.push("GCS");

  return missingFields;
}

export default function FormsPage({ selected, onSelectVisit }) {
  const [patientsSearch, setPatientsSearch] = useState("");
  const [preformOpen, setPreformOpen] = useState(false);
  const [dischargeOpen, setDischargeOpen] = useState(false);

  const [preform, setPreform] = useState(initialPreformState);
  const [discharge, setDischarge] = useState(initialDischargeState);

  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [aiTriageResult, setAiTriageResult] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [patientsList, setPatientsList] = useState([]);

  const [combinedPrintMode, setCombinedPrintMode] = useState(false);
  const [alreadyExported, setAlreadyExported] = useState(false);

  const { showSuccess, showError, showInfo } = useToast();

  const lastEditAtRef = useRef(0);
  const autosaveTimeoutRef = useRef(null);
const hasUserEditedRef = useRef(false);
  const isClosedVisit =
  selected?.status === "DISCHARGED" ||
  selected?.status === "ADMITTED" ||
  selected?.status === "TRANSFERRED";

  const markEditing = () => {
  lastEditAtRef.current = Date.now();
  hasUserEditedRef.current = true;
};

  const loadAllPatients = async () => {
    setMsg("");
    try {
      const data = await apiGet("/patients");
      setPatientsList(data || []);
    } catch (e) {
      setMsg(`Eroare încărcare pacienți: ${e}`);
      showError("Eroare la încărcarea pacienților");
      setPatientsList([]);
    }
  };

  const filteredPatientsList = useMemo(() => {
    const q = patientsSearch.trim().toLowerCase();

    return patientsList.filter((p) => {
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
      const cnp = (p.cnp || "").toLowerCase();

      return q === "" || fullName.includes(q) || cnp.includes(q);
    });
  }, [patientsList, patientsSearch]);

  const reloadCurrentForms = async () => {
    if (!selected) return;

    const now = Date.now();
    const msSinceLastEdit = now - lastEditAtRef.current;

    if (msSinceLastEdit < 4000) {
      return;
    }

    setMsg("");

    await loadPreformIntoState({
      selected,
      setLoading,
      setMsg,
      setPatientDetails,
      setPreform,
      loadPreformData,
      setAiTriageResult,
    });

    await loadDischargeIntoState({
      selected,
      setMsg,
      setPatientDetails,
      setDischarge,
      loadDischargeData,
    });
  };

 useEffect(() => {
  if (!selected) return;

  const checkIfExported = async () => {
    try {
      const docs = await apiGet(`/archived-documents/visit/${selected.id}`);
      setAlreadyExported(docs.length > 0);
    } catch (e) {
      console.error("Eroare verificare documente:", e);
    }
  };

  checkIfExported();
}, [selected?.id]);

  useEffect(() => {
    setSelectedPatient(null);
    setPatientVisits([]);
    setCombinedPrintMode(false);
    setMsg("");
    setAiTriageResult(null);

    if (!selected) {
      setPatientDetails(null);
      setPreform(initialPreformState);
      setDischarge(initialDischargeState);
      setStatus("");
      setPreformOpen(false);
      setDischargeOpen(false);
      loadAllPatients();
      return;
    }

    setStatus(selected.status || "");
    setPreformOpen(false);
    setDischargeOpen(false);

    loadPreformIntoState({
      selected,
      setLoading,
      setMsg,
      setPatientDetails,
      setPreform,
      loadPreformData,
      setAiTriageResult,
    });

    loadDischargeIntoState({
      selected,
      setMsg,
      setPatientDetails,
      setDischarge,
      loadDischargeData,
    });
  }, [selected?.id]);

 const savePreform = async () => {
  if (!selected || isClosedVisit) return;
    setMsg("");
    setLoading(true);

    const payload = buildPreformPayload(preform);

    try {
      await savePreformData(selected, payload);
      lastEditAtRef.current = 0;
      setMsg("Fișa de pre-spitalizare a fost salvată.");
      showSuccess("Fișa de pre-spitalizare a fost salvată.");
    } catch (e) {
      setMsg(`Eroare salvare preform: ${e}`);
      showError("Eroare salvare preform");
    } finally {
      setLoading(false);
    }
  };

  const autoSavePreform = async () => {
  if (!selected || isClosedVisit) return;
  if (!hasUserEditedRef.current) return;

  try {
    const payload = buildPreformPayload(preform);
    await savePreformData(selected, payload);

    lastEditAtRef.current = 0;
    hasUserEditedRef.current = false;

  } catch (e) {
    console.error("Eroare autosave preform:", e);
  }
};

useEffect(() => {
  if (!selected || isClosedVisit) return;
  if (!hasUserEditedRef.current) return;

  if (autosaveTimeoutRef.current) {
    clearTimeout(autosaveTimeoutRef.current);
  }

  autosaveTimeoutRef.current = setTimeout(() => {
    autoSavePreform();
  }, 3000);

  return () => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
  };
}, [preform, selected?.id, isClosedVisit]);

  const runAiTriage = async () => {
  if (!selected || isClosedVisit) return;

  const hasCriticalSafetyFlag =
  preform.pickupStopCr ||
  preform.pickupDeceased ||
  preform.pickupResuscitationInProgress;

  const missingFields = [];

  if (!preform.age) missingFields.push("vârsta");
  if (!preform.sex) missingFields.push("sexul");
  if (!preform.temperature) missingFields.push("temperatura");
  if (!preform.pulse && !preform.av) missingFields.push("pulsul / AV");
  if (!preform.respiratoryRate) missingFields.push("frecvența respiratorie");
  if (!preform.systolicBp) missingFields.push("TA sistolică");
  if (!preform.diastolicBp) missingFields.push("TA diastolică");
  if (!preform.spo2) missingFields.push("saturația O2");
  if (preform.painScale === "" || preform.painScale === null || preform.painScale === undefined) {
    missingFields.push("scorul durerii");
  }

  if (!hasCriticalSafetyFlag && missingFields.length > 0) {
  const message = `Completează înainte de AI: ${missingFields.join(", ")}.`;
  setMsg(message);
  showError(message);
  return;
}

  const recommendedMissingFields = [];

if (!preform.reason) recommendedMissingFields.push("motivul prezentării");
if (!preform.broughtByCode) recommendedMissingFields.push("adus de");
if (!preform.patientStateCode) recommendedMissingFields.push("starea pacientului");
if (!preform.gcs) recommendedMissingFields.push("GCS");

if (recommendedMissingFields.length > 0) {
  showInfo(
    `Predicția rulează, dar lipsesc date recomandate: ${recommendedMissingFields.join(", ")}.`
  );
}

  setMsg("");
  setLoading(true);

  try {
    const payload = buildAiTriagePayload(preform);
    const result = await predictAiTriageData(payload);

    setAiTriageResult(result);

    setPreform((prev) => ({
      ...prev,
      aiTriageResult: result,
    }));

    showSuccess("Predicția AI a fost generată.");
  } catch (e) {
    console.error("Eroare AI triage:", e);
    setMsg(`Eroare AI triage: ${e.message || e}`);
    showError("Eroare la predicția AI");
  } finally {
    setLoading(false);
  }
};

const applyAiRecommendation = () => {
  if (!aiTriageResult?.predictie_finala) return;

  const triageColor = mapAiLabelToTriageColor(aiTriageResult.predictie_finala);

  markEditing();

  setPreform((prev) => ({
    ...prev,
    triageColor,
  }));

  showSuccess("Recomandarea AI a fost aplicată.");
};

const changeManualTriageColor = (value) => {
  markEditing();

  setPreform((prev) => ({
    ...prev,
    triageColor: value,
  }));

  showInfo("Culoarea triajului a fost modificată manual.");
};

const saveDischarge = async () => {
  if (!selected || isClosedVisit) return;
    setMsg("");
    setLoading(true);

    const payload = buildDischargePayload(discharge);

    try {
      await saveDischargeData(selected, payload);
      lastEditAtRef.current = 0;
      setMsg("Fișa de externare a fost salvată.");
      showSuccess("Fișa de externare a fost salvată.");
    } catch (e) {
      setMsg(`Eroare salvare externare: ${e}`);
      showError("Eroare salvare externare");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
  if (!selected || !status || isClosedVisit) return;
    setMsg("");

    try {
      await updateVisitStatusData(selected, status);
      setMsg("Status actualizat.");
      showSuccess("Status actualizat.");
    } catch (e) {
      setMsg(`Eroare status: ${e}`);
      showError("Eroare actualizare status");
    }
  };

  const exportCombined = async () => {
  if (!selected) return;

  setCombinedPrintMode(true);

  setTimeout(async () => {
    try {
      const success = await exportCombinedPdf({ selected, setMsg });

      if (success) {
        showSuccess("PDF generat.");
      }
    } catch (e) {
      console.error("Eroare exportCombined:", e);
      setMsg(e.message || "Eroare export PDF");
      showError(e.message || "Eroare export PDF");
    }
  }, 500);
};

  const handlePrintCombined = async () => {
    if (!selected) return;

    setCombinedPrintMode(true);

    setTimeout(async () => {
      try {
        await downloadCombinedPdf({ selected, setMsg });
        showSuccess("PDF descărcat.");
      } catch (e) {
        console.error("Eroare descarcare PDF:", e);
        setMsg(`Eroare la descărcarea PDF-ului: ${e.message || e}`);
        showError("Eroare la descărcarea PDF-ului");
      }
    }, 500);
  };

  const loadPatientVisits = async (patient) => {
    await loadPatientVisitsAction({
      patient,
      setSelectedPatient,
      setMsg,
      setPatientVisits,
      loadPatientVisitsData,
    });

    showInfo("Pacient selectat");
  };

  if (!selected) {
    return (
      <div>
        <h2>Fișe pacienți</h2>

        {msg && <p style={{ color: "#ff8080" }}>{msg}</p>}

        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Caută pacient după nume sau CNP"
            value={patientsSearch}
            onChange={(e) => setPatientsSearch(e.target.value)}
            style={{
              padding: 10,
              minWidth: 340,
              borderRadius: 8,
              border: "1px solid #333",
              background: "#121212",
              color: "#eaeaea",
            }}
          />
        </div>

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
                <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>
                  Prenume
                </th>
                <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>
                  Nume
                </th>
                <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>
                  CNP
                </th>
                <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>
                  Telefon
                </th>
                <th style={{ border: "1px solid #333", padding: 10, textAlign: "left" }}>
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatientsList.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => loadPatientVisits(p)}
                  style={{
                    cursor: "pointer",
                    background: selectedPatient?.id === p.id ? "#2a2a2a" : "transparent",
                  }}
                >
                  <td style={{ border: "1px solid #333", padding: 10 }}>{p.firstName || "-"}</td>
                  <td style={{ border: "1px solid #333", padding: 10 }}>{p.lastName || "-"}</td>
                  <td style={{ border: "1px solid #333", padding: 10 }}>{p.cnp || "-"}</td>
                  <td style={{ border: "1px solid #333", padding: 10 }}>{p.phoneNumber || "-"}</td>
                  <td style={{ border: "1px solid #333", padding: 10 }}>{p.email || "-"}</td>
                </tr>
              ))}

              {filteredPatientsList.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: 14,
                      color: "#aaa",
                      border: "1px solid #333",
                    }}
                  >
                    Nu există pacienți.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedPatient && (
          <div
            style={{
              marginTop: 18,
              border: "1px solid #333",
              borderRadius: 12,
              padding: 14,
              background: "#121212",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              Fișele pacientului: {selectedPatient.firstName} {selectedPatient.lastName}
            </h3>

            {patientVisits.length === 0 ? (
              <div style={{ color: "#aaa" }}>Nu există vizite pentru acest pacient.</div>
            ) : (
              <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
                {patientVisits.map((visit, index) => {
                  const visitDate = visit.createdAt
                    ? new Date(visit.createdAt).toLocaleString("ro-RO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  const statusLabels = {
                    REGISTERED: "Înregistrat",
                    WAITING_TRIAGE: "În așteptare triaj",
                    TRIAGE_DONE: "Triaj făcut",
                    WAITING_CONSULT: "În așteptare consult",
                    IN_CONSULT: "În consult",
                    IN_INVESTIGATION: "În investigații",
                    OBSERVATION: "În observație",
                    DISCHARGED: "Externat",
                    ADMITTED: "Internat",
                    TRANSFERRED: "Transferat",
                  };

                  return (
                    <div
                      key={visit.id}
                      onClick={() => onSelectVisit && onSelectVisit(visit)}
                      style={{
                        cursor: "pointer",
                        padding: 12,
                        borderBottom:
                          index !== patientVisits.length - 1 ? "1px solid #333" : "none",
                        background: "#111",
                      }}
                    >
                      Vizita {visit.visitCode}, {visitDate} -{" "}
                      {statusLabels[visit.status] || visit.status}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap",
  }}
>
  <h2 style={{ margin: 0 }}>
    Fișe ({selected.visitCode || `vizita ${selected.id}`})
  </h2>

  {preform.triageColor && (
    <div
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontWeight: 700,
        background:
          preform.triageColor === "ROSU"
            ? "#7f1d1d"
            : preform.triageColor === "GALBEN"
            ? "#854d0e"
            : preform.triageColor === "VERDE"
            ? "#166534"
            : "#1e3a8a",
      }}
    >
      TRIAJ: {preform.triageColor}
    </div>
  )}
</div>

      <PatientDetailsPanel patientDetails={patientDetails} />

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => setCombinedPrintMode((prev) => !prev)}
          style={{ padding: "8px 12px" }}
        >
          {combinedPrintMode
            ? "Ascunde previzualizarea fișelor"
            : "Arată previzualizarea fișelor"}
        </button>

        <button onClick={handlePrintCombined} style={{ padding: "8px 12px" }}>
          Printează fișele
        </button>

<button
  onClick={runAiTriage}
  disabled={loading || isClosedVisit}
  style={{
    padding: "8px 12px",
    opacity: loading ? 0.7 : 1,
    cursor: loading ? "not-allowed" : "pointer",
    minWidth: 170,
  }}
>
  {loading ? "Se generează..." : "Generează triaj AI"}
</button>
      </div>

{aiTriageResult && (() => {
  const label = aiTriageResult.predictie_finala;

  const colorMap = {
    rosu: "#7f1d1d",
    galben: "#854d0e",
    verde: "#166534",
    consult: "#1e3a8a",
  };

  const labelMap = {
    rosu: "ROȘU",
    galben: "GALBEN",
    verde: "VERDE",
    consult: "CONSULT",
  };

  const cardColor = colorMap[label] || "#333";

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        border: `1px solid ${cardColor}`,
        borderRadius: 12,
        background: "#121212",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Recomandare AI</div>
        </div>

        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: cardColor,
            fontWeight: 800,
            alignSelf: "flex-start",
          }}
        >
          {labelMap[label] || label}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        Triaj final ales: <strong>{preform.triageColor || "NEALES"}</strong>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(120px, 1fr))", gap: 8, marginTop: 12 }}>
        {aiTriageResult.decizie_etapa_1 && (
          <div>Etapa: <strong>{aiTriageResult.decizie_etapa_1}</strong></div>
        )}

        {aiTriageResult.prob_urgent !== undefined && (
          <div>Urgent: <strong>{(aiTriageResult.prob_urgent * 100).toFixed(1)}%</strong></div>
        )}

        {aiTriageResult.prob_red !== undefined && (
          <div>Roșu: <strong>{(aiTriageResult.prob_red * 100).toFixed(1)}%</strong></div>
        )}

        {aiTriageResult.prob_green !== undefined && (
          <div>Verde: <strong>{(aiTriageResult.prob_green * 100).toFixed(1)}%</strong></div>
        )}
      </div>

      {aiTriageResult.reguli_siguranta_aplicate?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Reguli aplicate:</strong>
          <ul style={{ marginTop: 6, marginBottom: 0 }}>
            {aiTriageResult.reguli_siguranta_aplicate.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button
          onClick={applyAiRecommendation}
          disabled={isClosedVisit}
          style={{ padding: "8px 12px" }}
        >
          Aplică recomandarea AI
        </button>

        <select
          value={preform.triageColor || ""}
          onChange={(e) => changeManualTriageColor(e.target.value)}
          disabled={isClosedVisit}
          style={{ padding: "8px 12px" }}
        >
          <option value="">Modifică culoarea triajului</option>
          <option value="ROSU">Roșu</option>
          <option value="GALBEN">Galben</option>
          <option value="VERDE">Verde</option>
          <option value="CONSULT">Consult</option>
        </select>
      </div>
    </div>
  );
})()}

      {combinedPrintMode && (
        <div id="print-area">
          <PreformPrintView preform={preform} />
          <DischargePrintView discharge={discharge} preform={preform} />
        </div>
      )}

      <SignaturesSection
  preform={preform}
  setPreform={setPreform}
  discharge={discharge}
  setDischarge={setDischarge}
  readOnly={isClosedVisit}
/>

      <div
        style={{ display: "grid", gap: 14, marginTop: 14 }}
        onInputCapture={markEditing}
        onChangeCapture={markEditing}
      >
      <FormsToolbar
  loading={loading}
  exportCombined={exportCombined}
  status={status}
  setStatus={setStatus}
  updateStatus={updateStatus}
  msg={msg}
  readOnly={isClosedVisit}
  
/>

        <PreformSection
  preformOpen={preformOpen}
  setPreformOpen={setPreformOpen}
  preform={preform}
  setPreform={setPreform}
  onSave={savePreform}
  readOnly={isClosedVisit}
/>

      <DischargeSection
  dischargeOpen={dischargeOpen}
  setDischargeOpen={setDischargeOpen}
  discharge={discharge}
  setDischarge={setDischarge}
  preform={preform}
  onSave={saveDischarge}
  readOnly={isClosedVisit}
/>
      </div>
    </div>
  );
}