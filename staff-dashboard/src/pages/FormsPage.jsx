import { useEffect, useState } from "react";
import { initialPreformState, initialDischargeState } from "../forms/initialStates";
import PatientSearchPanel from "../components/forms/PatientSearchPanel";
import PatientDetailsPanel from "../components/forms/PatientDetailsPanel";
import FormsToolbar from "../components/forms/FormsToolbar";
import PreformSection from "../components/forms/PreformSection";
import DischargeSection from "../components/forms/DischargeSection";
import PreformPrintView from "../components/forms/PreFormPrintView";
import DischargePrintView from "../components/forms/DischargePrintView";
import { exportCombinedPdf, downloadCombinedPdf } from "./formsPrintActions";
import { buildPreformPayload, buildDischargePayload } from "./formsPayloadBuilders";
import { loadPreformIntoState, loadDischargeIntoState } from "./formsPageLoaders";
import {
  searchPatientsAction,
  loadPatientVisitsAction,
  openVisitFromSearchAction,
} from "./formsSearchActions";
import {
  loadPreformData,
  loadDischargeData,
  savePreformData,
  saveDischargeData,
  updateVisitStatusData,
  loadPatientVisitsData,
  searchPatientsData,
} from "./formsPageApi";

export default function FormsPage({ selected, onSelectVisit }) {
  const [searchMode, setSearchMode] = useState(false);
  const [preformOpen, setPreformOpen] = useState(false);
  const [dischargeOpen, setDischargeOpen] = useState(false);

  const [preform, setPreform] = useState(initialPreformState);
  const [discharge, setDischarge] = useState(initialDischargeState);

  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);

  const [combinedPrintMode, setCombinedPrintMode] = useState(false);


  useEffect(() => {
  if (!selected) return;

  setStatus(selected.status || "");
  setPreformOpen(false);
  setDischargeOpen(false);
  setSearchMode(false);
  setSearch("");
  setSearchResults([]);
  setSelectedPatient(null);
  setPatientVisits([]);
  setCombinedPrintMode(false);

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
    if (!selected) return;
    setMsg("");
    setLoading(true);

    const payload = buildPreformPayload(preform);

    try {
     await savePreformData(selected, payload);
      setMsg("Fișa de pre-spitalizare a fost salvată. ");
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

    const payload = buildDischargePayload(discharge);

    try {
      await saveDischargeData(selected, payload);
      setMsg("Fișa de externare a fost salvată.");
    } catch (e) {
      setMsg(`Eroare salvare externare: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!selected || !status) return;
    setMsg("");

    try {
      await updateVisitStatusData(selected, status);
      setMsg("Status actualizat.");
    } catch (e) {
      setMsg(`Eroare status: ${e}`);
    }
  };

  const exportCombined = async () => {
  if (!selected) return;

  setCombinedPrintMode(true);

  setTimeout(async () => {
    try {
      await exportCombinedPdf({ selected, setMsg });
    } catch (e) {
      console.error("Eroare exportCombined:", e);
      setMsg(`Eroare export PDF: ${e.message || e}`);
    }
  }, 500);
};
  

  const handlePrintCombined = async () => {
  if (!selected) return;

  setCombinedPrintMode(true);

  setTimeout(async () => {
    try {
      await downloadCombinedPdf({ selected, setMsg });
    } catch (e) {
      console.error("Eroare descarcare PDF:", e);
      setMsg(`Eroare la descărcarea PDF-ului: ${e.message || e}`);
    }
  }, 500);
};
const searchPatients = async () => {
  await searchPatientsAction({
    search,
    setSearchMode,
    setMsg,
    setSearchResults,
    setSelectedPatient,
    setPatientVisits,
    searchPatientsData,
  });
};

const loadPatientVisits = async (patient) => {
  await loadPatientVisitsAction({
    patient,
    setSelectedPatient,
    setMsg,
    setPatientVisits,
    loadPatientVisitsData,
  });
};

const openVisitFromSearch = (visit) => {
  openVisitFromSearchAction({
    visit,
    setSearchMode,
    setSearch,
    setSearchResults,
    setSelectedPatient,
    setPatientVisits,
    onSelectVisit,
  });
};

  if (!selected) {
    return (
      <div>
        <h2>Fișe</h2>
        <p>Selectează o vizită din “Vizite” ca să lucrezi pe fișe.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Fișe (vizita {selected.id})</h2>

      <PatientSearchPanel
        search={search}
        setSearch={setSearch}
        searchPatients={searchPatients}
        searchResults={searchResults}
        loadPatientVisits={loadPatientVisits}
        selectedPatient={selectedPatient}
        patientVisits={patientVisits}
        openVisitFromSearch={openVisitFromSearch}
      />

      {!searchMode && <PatientDetailsPanel patientDetails={patientDetails} />}

      {!searchMode && (
        <FormsToolbar
          loading={loading}
          savePreform={savePreform}
          saveDischarge={saveDischarge}
          exportCombined={exportCombined}
          status={status}
          setStatus={setStatus}
          updateStatus={updateStatus}
          msg={msg}
        />
      )}

      {!searchMode && (
        <>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={handlePrintCombined} style={{ padding: "8px 12px" }}>
              Printează fișele
            </button>

            <button
              onClick={() => setCombinedPrintMode((prev) => !prev)}
              style={{ padding: "8px 12px" }}
            >
              {combinedPrintMode
                ? "Ascunde previzualizarea fișelor"
                : "Arată previzualizarea fișelor"}
            </button>
          </div>

         {combinedPrintMode && (
  <div id="print-area">
    <PreformPrintView preform={preform} />
    <DischargePrintView discharge={discharge} preform={preform} />
  </div>
)}

          <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
            <PreformSection
              preformOpen={preformOpen}
              setPreformOpen={setPreformOpen}
              preform={preform}
              setPreform={setPreform}
            />

            <DischargeSection
              dischargeOpen={dischargeOpen}
              setDischargeOpen={setDischargeOpen}
              discharge={discharge}
              setDischarge={setDischarge}
              preform={preform}
            />
          </div>
        </>
      )}
    </div>
  );
}