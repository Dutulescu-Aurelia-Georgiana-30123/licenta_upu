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
import { buildPreformPayload, buildDischargePayload } from "./formsPayloadBuilders";
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
} from "./formsPageApi";
import { useToast } from "../context/ToastContext";

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

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [patientsList, setPatientsList] = useState([]);

  const [combinedPrintMode, setCombinedPrintMode] = useState(false);
  const [alreadyExported, setAlreadyExported] = useState(false);

  const { showSuccess, showError, showInfo } = useToast();

  const lastEditAtRef = useRef(0);
  const isClosedVisit =
  selected?.status === "DISCHARGED" ||
  selected?.status === "ADMITTED" ||
  selected?.status === "TRANSFERRED";

  const markEditing = () => {
    lastEditAtRef.current = Date.now();
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
      <h2>Fișe ({selected.visitCode || `vizita ${selected.id}`})</h2>

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
      </div>

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