import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";
import { initialPreformState, initialDischargeState } from "../forms/initialStates";
import PatientSearchPanel from "../components/forms/PatientSearchPanel";
import PatientDetailsPanel from "../components/forms/PatientDetailsPanel";
import FormsToolbar from "../components/forms/FormsToolbar";
import PreformSection from "../components/forms/PreformSection";
import DischargeSection from "../components/forms/DischargeSection";

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
        ...(data ? data : {}),
        triageColor: data?.triageColor || prev.triageColor,
        arrivalMode: data?.arrivalMode || prev.arrivalMode,
        firstName: data?.firstName?.trim() ? data.firstName : patient.firstName || "",
        lastName: data?.lastName?.trim() ? data.lastName : patient.lastName || "",
        cnp: data?.cnp ? data.cnp : patient.cnp || "",
        phoneNumber: data?.phoneNumber ? data.phoneNumber : patient.phoneNumber || "",
        email: data?.email ? data.email : patient.email || "",
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
      let preformData = null;

      try {
        data = await apiGet(`/visits/${selected.id}/discharge`);
      } catch {
        data = null;
      }

      try {
        preformData = await apiGet(`/visits/${selected.id}/preform`);
      } catch {
        preformData = null;
      }

      const currentHour = new Date().toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setDischarge((prev) => ({
        ...prev,
        ...(data ? data : {}),
        hospitalName: data?.hospitalName || prev.hospitalName || "SPITALUL CLINIC DE URGENȚĂ",
        sectionName: data?.sectionName || prev.sectionName || "",
        foNumber: data?.foNumber || preformData?.sheetNumber || "",
        firstName: data?.firstName?.trim()
          ? data.firstName
          : preformData?.firstName || patient.firstName || "",
        lastName: data?.lastName?.trim()
          ? data.lastName
          : preformData?.lastName || patient.lastName || "",
        birthDate: data?.birthDate || preformData?.birthDate || "",
        age: data?.age ?? preformData?.age ?? "",
        dischargeHour: data?.dischargeHour || currentHour,
      }));
    } catch (e) {
      setMsg(`Eroare load externare: ${e}`);
    }
  };

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
      age: toIntOrNull(preform.age),
      gcs: toIntOrNull(preform.gcs),
      gcsM: toIntOrNull(preform.gcsM),
      gcsV: toIntOrNull(preform.gcsV),
      gcsO: toIntOrNull(preform.gcsO),
      heightCm: toIntOrNull(preform.heightCm),
      weightKg: toFloatOrNull(preform.weightKg),
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
      setMsg("Fișa de pre-spitalizare a fost salvată ✅");
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

    const hospitalizationOutcomeMap = {
      AMELIORAT: "AMELIORAT",
      STATIONAR: "STATIONAR",
      AGRAVAT: "AGRAVAT",
      DECEDAT: "DECEDAT",
    };

    let dischargeType = "EXTERNAT";
    if (discharge.transferredSection?.trim()) {
      dischargeType = "TRANSFERAT";
    } else if (discharge.admittedSection?.trim()) {
      dischargeType = "INTERNAT";
    }

    const payload = {
      ...discharge,
      details: JSON.stringify({
        appliedProcedures: discharge.appliedProcedures || "",
        patientStateAtDischarge: discharge.patientStateAtDischarge || "",
        dischargeHour: discharge.dischargeHour || "",
        admittedSection: discharge.admittedSection || "",
        transferredSection: discharge.transferredSection || "",
        leavesWithRecommendations: discharge.leavesWithRecommendations || false,
      }),
      citizenshipType: "ROMANA",
      insuranceStatus: "ASIGURAT_CNAS",
      admissionType: "URGENTA",
      hospitalizationOutcome:
        hospitalizationOutcomeMap[discharge.patientStateAtDischarge] || "AMELIORAT",
      dischargeType,
    };

    try {
      await apiPut(`/visits/${selected.id}/discharge`, payload);
      setMsg("Fișa de externare a fost salvată ✅");
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
      await apiPut(`/visits/${selected.id}/status`, { status });
      setMsg("Status actualizat ✅");
    } catch (e) {
      setMsg(`Eroare status: ${e}`);
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

  const searchPatients = async () => {
    if (!search.trim()) {
      setSearchMode(false);
      setSearchResults([]);
      setSelectedPatient(null);
      setPatientVisits([]);
      return;
    }

    setSearchMode(true);
    setMsg("");

    try {
      const data = await apiGet("/patients");
      const filtered = data.filter((p) =>
        `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase().includes(search.trim().toLowerCase())
      );
      setSearchResults(filtered);
      setSelectedPatient(null);
      setPatientVisits([]);
    } catch (e) {
      setMsg(`Eroare căutare pacient: ${e}`);
    }
  };

  const loadPatientVisits = async (patient) => {
    setSelectedPatient(patient);
    setMsg("");

    try {
      const visits = await apiGet(`/visits/patient/${patient.id}`);
      setPatientVisits(visits);
    } catch (e) {
      setMsg(`Eroare încărcare vizite pacient: ${e}`);
    }
  };

  const openVisitFromSearch = (visit) => {
    setSearchMode(false);
    setSearch("");
    setSearchResults([]);
    setSelectedPatient(null);
    setPatientVisits([]);
    onSelectVisit && onSelectVisit(visit);
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
      )}
    </div>
  );
}