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

const teal = "#08b8b3";
const tealDark = "#069a96";

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

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid #e5eef8",
  borderRadius: 28,
  padding: 22,
  boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
  backdropFilter: "blur(14px)",
};

const primaryButtonStyle = {
  padding: "12px 16px",
  borderRadius: 16,
  border: "none",
  background: `linear-gradient(135deg, ${teal}, ${tealDark})`,
  color: "white",
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(8,184,179,0.24)",
};

const secondaryButtonStyle = {
  padding: "11px 15px",
  borderRadius: 16,
  border: "1px solid rgba(8,184,179,0.25)",
  background: "#e6fffd",
  color: tealDark,
  fontWeight: 900,
  cursor: "pointer",
};

const inputStyle = {
  padding: "12px 14px",
  minWidth: 340,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#102033",
  outline: "none",
  fontWeight: 800,
};

const tableHeadCellStyle = {
  padding: "12px 10px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: 13,
  fontWeight: 800,
};

const tableCellStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontWeight: 600,
  verticalAlign: "middle",
};

function getTriageBadgeStyle(triageColor) {
  if (triageColor === "ROSU") {
    return { background: "#fee2e2", color: "#991b1b" };
  }

  if (triageColor === "GALBEN") {
    return { background: "#fef3c7", color: "#92400e" };
  }

  if (triageColor === "VERDE") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (triageColor === "CONSULT") {
  return { background: "#e6fffd", color: tealDark };
}

  return { background: "#f1f5f9", color: "#64748b" };
}

export default function FormsPage({ selected, onSelectVisit, previewOnly = false }) {
  const user = JSON.parse(localStorage.getItem("user"));
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
  const [aiMissingFields, setAiMissingFields] = useState([]);

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

    await updateVisitStatusData(selected, "WAITING_CONSULT");
    setStatus("WAITING_CONSULT");

    lastEditAtRef.current = 0;
    hasUserEditedRef.current = false;

    setMsg("Fișa de pre-spitalizare a fost salvată. Pacientul este în așteptare consult.");
    showSuccess("Fișa salvată. Pacientul este în așteptare consult.");
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

    const missingFields = getMissingRequiredAiFields(preform);

    if (missingFields.length > 0) {
  setAiMissingFields(missingFields);

  const message = `Completează înainte de AI: ${missingFields.join(", ")}.`;
  setMsg(message);
  showError(message);
  return;
}

setAiMissingFields([]);

    const recommendedMissingFields = getMissingRecommendedAiFields(preform);

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
      <div style={{ width: "100%" }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              color: "#0f172a",
              letterSpacing: -0.6,
            }}
          >
            Fișe pacienți
          </h2>
          <div style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            Caută pacientul și selectează vizita pentru completarea fișelor
          </div>
        </div>

        {msg && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 14,
              background: msg.startsWith("Eroare") ? "#fee2e2" : "#eff6ff",
              color: msg.startsWith("Eroare") ? "#991b1b" : "#1d4ed8",
              fontWeight: 700,
            }}
          >
            {msg}
          </div>
        )}

        <div style={{ marginTop: 18, ...cardStyle }}>
          <input
            type="text"
            placeholder="Caută pacient după nume sau CNP"
            value={patientsSearch}
            onChange={(e) => setPatientsSearch(e.target.value)}
            style={inputStyle}
          />

          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                width: "100%",
                background: "#ffffff",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeadCellStyle}>Prenume</th>
                  <th style={tableHeadCellStyle}>Nume</th>
                  <th style={tableHeadCellStyle}>CNP</th>
                  <th style={tableHeadCellStyle}>Telefon</th>
                  <th style={tableHeadCellStyle}>Email</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatientsList.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => loadPatientVisits(p)}
                    style={{
                      cursor: "pointer",
                      background: selectedPatient?.id === p.id ? "#eff6ff" : "#ffffff",
                    }}
                  >
                    <td style={tableCellStyle}>{p.firstName || "-"}</td>
                    <td style={tableCellStyle}>{p.lastName || "-"}</td>
                    <td style={tableCellStyle}>{p.cnp || "-"}</td>
                    <td style={tableCellStyle}>{p.phoneNumber || "-"}</td>
                    <td style={tableCellStyle}>{p.email || "-"}</td>
                  </tr>
                ))}

                {filteredPatientsList.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
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
        </div>

        {selectedPatient && (
          <div style={{ marginTop: 16, ...cardStyle }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a" }}>
                Fișele pacientului: {selectedPatient.firstName} {selectedPatient.lastName}
              </div>
              <div style={{ color: "#64748b", marginTop: 4, fontSize: 13 }}>
                Selectează o vizită pentru a continua
              </div>
            </div>

            {patientVisits.length === 0 ? (
              <div style={{ color: "#64748b", fontWeight: 700 }}>
                Nu există vizite pentru acest pacient.
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 18,
                  overflow: "hidden",
                }}
              >
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
                        padding: 14,
                        borderBottom:
                          index !== patientVisits.length - 1 ? "1px solid #edf2f7" : "none",
                        background: "#ffffff",
                        color: "#334155",
                        fontWeight: 700,
                      }}
                    >
                      Vizita {visit.visitCode}, {visitDate} —{" "}
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

  const triageBadgeStyle = getTriageBadgeStyle(preform.triageColor);

if (previewOnly && selected) {
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: 24,
        padding: 20,
        border: "1px solid #e5eef8",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: "#0f172a" }}>
          Previzualizare vizită veche
        </h2>

        <div style={{ color: "#64748b", marginTop: 4 }}>
          {selected.visitCode || `Vizita ${selected.id}`}
        </div>
      </div>

      <div id="print-area">
        <PreformPrintView preform={preform} />

        <div style={{ height: 24 }} />

        <DischargePrintView
          discharge={discharge}
          preform={preform}
        />
      </div>
    </div>
  );
}
  
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
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
            Fișe ({selected.visitCode || `vizita ${selected.id}`})
          </h2>

          <div style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
            Fișă pre-spitalizare, externare și suport AI pentru triaj
          </div>
        </div>

        {preform.triageColor && (
          <div
            style={{
              padding: "8px 13px",
              borderRadius: 999,
              fontWeight: 900,
              fontSize: 13,
              background: triageBadgeStyle.background,
              color: triageBadgeStyle.color,
            }}
          >
            TRIAJ: {preform.triageColor}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <PatientDetailsPanel patientDetails={patientDetails} />
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setCombinedPrintMode((prev) => !prev)}
          style={secondaryButtonStyle}
        >
          {combinedPrintMode
            ? "Ascunde previzualizarea fișelor"
            : "Arată previzualizarea fișelor"}
        </button>

        <button onClick={handlePrintCombined} style={secondaryButtonStyle}>
          Printează fișele
        </button>

        {user?.role === "RECEPTION" && (
  <button
    onClick={runAiTriage}
    disabled={loading || isClosedVisit}
    style={{
      ...primaryButtonStyle,
      opacity: loading ? 0.7 : 1,
      cursor: loading ? "not-allowed" : "pointer",
      minWidth: 170,
    }}
  >
    {loading ? "Se generează..." : "Generează triaj AI"}
  </button>
)}
      </div>

      {aiTriageResult &&
        (() => {
          const label = aiTriageResult.predictie_finala;

          const colorMap = {
            rosu: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
            galben: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
            verde: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
            consult: { bg: "#e6fffd", text: tealDark, border: "#b8f3ef" },
          };

          const labelMap = {
            rosu: "ROȘU",
            galben: "GALBEN",
            verde: "VERDE",
            consult: "CONSULT",
          };

          const colors = colorMap[label] || {
            bg: "#f1f5f9",
            text: "#475569",
            border: "#e2e8f0",
          };

          return (
            <div
              style={{
                marginTop: 14,
                padding: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                background: "#ffffff",
                boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
                color: "#0f172a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: 17 }}>
                    Recomandare AI
                  </div>
                  <div style={{ color: "#64748b", marginTop: 4, fontSize: 13 }}>
                    Rezultat generat pe baza datelor clinice introduse
                  </div>
                </div>

                <div
                  style={{
                    padding: "8px 13px",
                    borderRadius: 999,
                    background: colors.bg,
                    color: colors.text,
                    fontWeight: 900,
                    alignSelf: "flex-start",
                    fontSize: 13,
                  }}
                >
                  {labelMap[label] || label}
                </div>
              </div>

              <div style={{ marginTop: 14, color: "#334155", fontWeight: 700 }}>
                Triaj final ales:{" "}
                <strong style={{ color: "#0f172a" }}>
                  {preform.triageColor || "NEALES"}
                </strong>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                {aiTriageResult.decizie_etapa_1 && (
                  <div style={{ color: "#334155" }}>
                    Etapa: <strong>{aiTriageResult.decizie_etapa_1}</strong>
                  </div>
                )}

                {aiTriageResult.prob_urgent !== undefined && (
                  <div style={{ color: "#334155" }}>
                    Urgent:{" "}
                    <strong>{(aiTriageResult.prob_urgent * 100).toFixed(1)}%</strong>
                  </div>
                )}

                {aiTriageResult.prob_red !== undefined && (
                  <div style={{ color: "#334155" }}>
                    Roșu:{" "}
                    <strong>{(aiTriageResult.prob_red * 100).toFixed(1)}%</strong>
                  </div>
                )}

                {aiTriageResult.prob_green !== undefined && (
                  <div style={{ color: "#334155" }}>
                    Verde:{" "}
                    <strong>{(aiTriageResult.prob_green * 100).toFixed(1)}%</strong>
                  </div>
                )}
              </div>

              {aiTriageResult.reguli_siguranta_aplicate?.length > 0 && (
                <div style={{ marginTop: 14, color: "#334155" }}>
                  <strong>Reguli aplicate:</strong>
                  <ul style={{ marginTop: 6, marginBottom: 0 }}>
                    {aiTriageResult.reguli_siguranta_aplicate.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <button
                  onClick={applyAiRecommendation}
                  disabled={isClosedVisit}
                  style={primaryButtonStyle}
                >
                  Aplică recomandarea AI
                </button>

                <select
                  value={preform.triageColor || ""}
                  onChange={(e) => changeManualTriageColor(e.target.value)}
                  disabled={isClosedVisit}
                  style={{
                    ...inputStyle,
                    minWidth: 240,
                    cursor: isClosedVisit ? "not-allowed" : "pointer",
                  }}
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

      <div
        style={{ display: "grid", gap: 14, marginTop: 14 }}
        onInputCapture={markEditing}
        onChangeCapture={markEditing}
      >
        <div style={cardStyle}>
          <FormsToolbar
            loading={loading}
            exportCombined={exportCombined}
            status={status}
            setStatus={setStatus}
            updateStatus={updateStatus}
            msg={msg}
            readOnly={isClosedVisit}
            alreadyExported={alreadyExported}
          />
        </div>

        <PreformSection
          preformOpen={preformOpen}
          setPreformOpen={setPreformOpen}
          preform={preform}
          setPreform={setPreform}
          onSave={savePreform}
          readOnly={isClosedVisit}
          aiMissingFields={aiMissingFields}
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