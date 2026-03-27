import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";

function SectionCard({ title, isOpen, onToggle, children }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 12,
        background: "#121212",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
          borderBottom: isOpen ? "1px solid #333" : "none",
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button onClick={onToggle} style={{ padding: "8px 12px" }}>
          {isOpen ? "Restrânge" : "Extinde"}
        </button>
      </div>

      {isOpen && <div style={{ padding: 14 }}>{children}</div>}
    </div>
  );
}

function getStatusLabel(status) {
  const labels = {
    REGISTERED: "Înregistrat",
    WAITING_TRIAGE: "În așteptare triaj",
    TRIAGE_DONE: "Triaj efectuat",
    WAITING_CONSULT: "În așteptare consult",
    IN_CONSULT: "În consult",
    IN_INVESTIGATION: "În investigații",
    OBSERVATION: "În observație",
    DISCHARGED: "Externat",
    ADMITTED: "Internat",
    TRANSFERRED: "Transferat",
  };

  return labels[status] || status || "-";
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />{" "}
      {label}
    </label>
  );
}

function TextField({ label, value, onChange, placeholder = "" }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: 8 }}
      />
    </label>
  );
}

function LrCheckboxRow({ label, leftChecked, rightChecked, onLeftChange, onRightChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr 56px",
        alignItems: "center",
        gap: 8,
      }}
    >
      <label style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <span>Stg</span>
        <input type="checkbox" checked={!!leftChecked} onChange={(e) => onLeftChange(e.target.checked)} />
      </label>

      <div>{label}</div>

      <label style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <span>Dr</span>
        <input type="checkbox" checked={!!rightChecked} onChange={(e) => onRightChange(e.target.checked)} />
      </label>
    </div>
  );
}

export default function FormsPage({ selected, onSelectVisit }) {
  const [searchMode, setSearchMode] = useState(false);
  const [preformOpen, setPreformOpen] = useState(false);
  const [dischargeOpen, setDischargeOpen] = useState(false);

  const [preform, setPreform] = useState({
    firstName: "",
    lastName: "",
    cnp: "",
    birthDate: "",
    sex: "",
    age: "",
    phoneNumber: "",
    email: "",

    sheetNumber: "",
    presentationDate: "",
    presentationTime: "",
    takenOverBy: "",

    county: "",
    locality: "",
    street: "",
    streetNumber: "",
    building: "",
    staircase: "",
    floor: "",
    apartment: "",

    patientStateCode: "",

    gcsHour: "",
    gcsM: "",
    gcsV: "",
    gcsO: "",
    gcs: "",

    broughtByCode: "",
    broughtByOther: "",

    broughtFromCode: "",
    broughtFromOther: "",

    pickupDeceased: false,
    pickupStopCr: false,
    pickupResuscitationInProgress: false,
    pickupTrauma: false,
    resuscitationHour: "",
    resuscitationSuccessful: false,
    resuscitationFailed: false,
    deathHour: "",
    resuscitationNotStartedReason: "",

    triageColor: "GALBEN",
    arrivalMode: "MIJLOACE_PROPRII",
    reason: "",

    respiratoryRate: "",
    av: "",
    pulse: "",
    systolicBp: "",
    diastolicBp: "",
    spo2: "",
    temperature: "",
    glycemia: "",
    trc: "",

    historyCardiac: false,
    historyNeurologic: false,
    historyRenal: false,
    historyPulmonary: false,
    historyTbc: false,
    historyHepatic: false,
    historyGastric: false,
    historyDiabetes: false,
    historyInfectious: false,
    historyStd: false,
    historyOther: "",

    anamnesis: "",

    heightCm: "",
    weightKg: "",

    triageFever: false,
    triageAsthenia: false,
    triageDizziness: false,

    objectiveGeneralState: "",

    headNormal: false,
    headTraumaMark: false,
    headOralLesions: false,
    headDentalLesions: false,

    neckNormal: false,
    neckTraumaMark: false,
    neckPalpableFormations: false,
    neckOther: "",

    noseNostrilsNormal: false,
    noseMucosaNormal: false,
    noseOther: "",
    noseEpistaxisLeft: false,
    noseEpistaxisRight: false,
    noseForeignBodyLeft: false,
    noseForeignBodyRight: false,
    noseTraumaLeft: false,
    noseTraumaRight: false,

    earTympanicMembraneNormal: false,
    earExternalCanalsNormal: false,
    earAuricleNormal: false,
    earOther: "",
    earOtorrhagiaLeft: false,
    earOtorrhagiaRight: false,
    earForeignBodyLeft: false,
    earForeignBodyRight: false,
    earHemotympanumLeft: false,
    earHemotympanumRight: false,
    earTraumaLeft: false,
    earTraumaRight: false,

    eyeMobilityNormal: false,
    eyePupilsNormal: false,
    eyeExamOther: "",
    eyeConjunctivitisLeft: false,
    eyeConjunctivitisRight: false,
    eyeMydriasisLeft: false,
    eyeMydriasisRight: false,
    eyeMiosisLeft: false,
    eyeMiosisRight: false,
    eyeNystagmusLeft: false,
    eyeNystagmusRight: false,
    eyeDeviationLeft: false,
    eyeDeviationRight: false,
    eyeTraumaExamLeft: false,
    eyeTraumaExamRight: false,

    cvRhythmNormal: false,
    cvPeripheralPulseNormal: false,
    cvHeartAuscultationNormal: false,
    cvIrregularPulse: false,
    cvFiliformPeripheralPulse: false,
    cvPulseDeficit: false,
    cvArrhythmicSounds: false,
    cvMuffledSounds: false,
    cvPericardialRub: false,
    cvJugularTurgor: false,
    cvSystolicMurmur: false,
    cvDiastolicMurmur: false,
    cvAorticMurmur: false,
    cvGallop: false,
    cvCarotidMurmur: false,
    cvObservations: "",

    respThoraxAspectNormal: false,
    respThoraxPercussionNormal: false,
    respVesicularBilateralNormal: false,
    respOropharynxNormal: false,
    respDiminishedMurmurLeft: false,
    respDiminishedMurmurRight: false,
    respAbsentMurmurLeft: false,
    respAbsentMurmurRight: false,
    respWheezingRalesLeft: false,
    respWheezingRalesRight: false,
    respCrepitantRalesLeft: false,
    respCrepitantRalesRight: false,
    respSubcrepitantRalesLeft: false,
    respSubcrepitantRalesRight: false,
    respIntercostalRetractionLeft: false,
    respIntercostalRetractionRight: false,
    respSubcutaneousEmphysemaLeft: false,
    respSubcutaneousEmphysemaRight: false,
    respTracheaDeviationLeft: false,
    respTracheaDeviationRight: false,
    respWheezing: false,
    respOther: "",

    eyeAcuteVisionLoss: false,
    eyeVisionDisorders: false,
    eyeForeignBody: false,
    eyeOtherManifestations: false,

    burnAirwayAffected: false,
    burnFlame: false,
    burnSolid: false,
    burnLiquid: false,
    burnVaporsGas: false,
    burnChemical: false,

    chestPain: false,
    dyspnea: false,
    hemoptysis: false,
    cough: false,
    expectoration: false,

    psychDepression: false,
    psychBehaviorDisorder: false,
    psychSuicide: false,
    psychHallucinations: false,
    psychDelirium: false,

    giNausea: false,
    giVomiting: false,
    giTransitDisorders: false,
    giRectorrhagia: false,
    giMelena: false,
    giHematemesis: false,
    giAbdominalPain: false,

    neuroConvulsions: false,
    neuroMyoclonus: false,
    neuroHeadache: false,
    neuroParalysis: false,

    guUrinationDisorders: false,
    guDysuria: false,
    guPollakiuria: false,
    guOliguria: false,
    guHematuria: false,
    guVaginalBleeding: false,
    guPregnancy: false,

    skinWarm: false,
    skinCold: false,
    skinWet: false,
    skinPale: false,
    skinCyanotic: false,
    skinJaundice: false,
    skinEcchymosis: false,
    skinRash: false,
    skinPruritus: false,
    skinBurns: false,

    locomotorInflammation: false,
    locomotorSwelling: false,
    locomotorPain: false,
    locomotorFunctionalImpairment: false,
    locomotorHematoma: false,

    allergies: "",
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
        ...(data
          ? {
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              cnp: data.cnp || "",
              birthDate: data.birthDate || "",
              sex: data.sex || "",
              age: data.age ?? "",
              phoneNumber: data.phoneNumber || "",
              email: data.email || "",

              sheetNumber: data.sheetNumber || "",
              presentationDate: data.presentationDate || "",
              presentationTime: data.presentationTime || "",
              takenOverBy: data.takenOverBy || "",

              county: data.county || "",
              locality: data.locality || "",
              street: data.street || "",
              streetNumber: data.streetNumber || "",
              building: data.building || "",
              staircase: data.staircase || "",
              floor: data.floor || "",
              apartment: data.apartment || "",

              patientStateCode: data.patientStateCode || "",

              gcsHour: data.gcsHour || "",
              gcsM: data.gcsM ?? "",
              gcsV: data.gcsV ?? "",
              gcsO: data.gcsO ?? "",
              gcs: data.gcs ?? "",

              broughtByCode: data.broughtByCode || "",
              broughtByOther: data.broughtByOther || "",

              broughtFromCode: data.broughtFromCode || "",
              broughtFromOther: data.broughtFromOther || "",

              pickupDeceased: data.pickupDeceased ?? false,
              pickupStopCr: data.pickupStopCr ?? false,
              pickupResuscitationInProgress: data.pickupResuscitationInProgress ?? false,
              pickupTrauma: data.pickupTrauma ?? false,
              resuscitationHour: data.resuscitationHour || "",
              resuscitationSuccessful: data.resuscitationSuccessful ?? false,
              resuscitationFailed: data.resuscitationFailed ?? false,
              deathHour: data.deathHour || "",
              resuscitationNotStartedReason: data.resuscitationNotStartedReason || "",

              triageColor: data.triageColor || prev.triageColor,
              arrivalMode: data.arrivalMode || prev.arrivalMode,
              reason: data.reason || "",

              respiratoryRate: data.respiratoryRate ?? "",
              av: data.av || "",
              pulse: data.pulse ?? "",
              systolicBp: data.systolicBp ?? "",
              diastolicBp: data.diastolicBp ?? "",
              spo2: data.spo2 ?? "",
              temperature: data.temperature ?? "",
              glycemia: data.glycemia ?? "",
              trc: data.trc || "",

              historyCardiac: data.historyCardiac ?? false,
              historyNeurologic: data.historyNeurologic ?? false,
              historyRenal: data.historyRenal ?? false,
              historyPulmonary: data.historyPulmonary ?? false,
              historyTbc: data.historyTbc ?? false,
              historyHepatic: data.historyHepatic ?? false,
              historyGastric: data.historyGastric ?? false,
              historyDiabetes: data.historyDiabetes ?? false,
              historyInfectious: data.historyInfectious ?? false,
              historyStd: data.historyStd ?? false,
              historyOther: data.historyOther || "",

              anamnesis: data.anamnesis || "",

              heightCm: data.heightCm ?? "",
              weightKg: data.weightKg ?? "",

              triageFever: data.triageFever ?? false,
              triageAsthenia: data.triageAsthenia ?? false,
              triageDizziness: data.triageDizziness ?? false,

              objectiveGeneralState: data.objectiveGeneralState || "",

              headNormal: data.headNormal ?? false,
              headTraumaMark: data.headTraumaMark ?? false,
              headOralLesions: data.headOralLesions ?? false,
              headDentalLesions: data.headDentalLesions ?? false,

              neckNormal: data.neckNormal ?? false,
              neckTraumaMark: data.neckTraumaMark ?? false,
              neckPalpableFormations: data.neckPalpableFormations ?? false,
              neckOther: data.neckOther || "",

              noseNostrilsNormal: data.noseNostrilsNormal ?? false,
              noseMucosaNormal: data.noseMucosaNormal ?? false,
              noseOther: data.noseOther || "",
              noseEpistaxisLeft: data.noseEpistaxisLeft ?? false,
              noseEpistaxisRight: data.noseEpistaxisRight ?? false,
              noseForeignBodyLeft: data.noseForeignBodyLeft ?? false,
              noseForeignBodyRight: data.noseForeignBodyRight ?? false,
              noseTraumaLeft: data.noseTraumaLeft ?? false,
              noseTraumaRight: data.noseTraumaRight ?? false,

              earTympanicMembraneNormal: data.earTympanicMembraneNormal ?? false,
              earExternalCanalsNormal: data.earExternalCanalsNormal ?? false,
              earAuricleNormal: data.earAuricleNormal ?? false,
              earOther: data.earOther || "",
              earOtorrhagiaLeft: data.earOtorrhagiaLeft ?? false,
              earOtorrhagiaRight: data.earOtorrhagiaRight ?? false,
              earForeignBodyLeft: data.earForeignBodyLeft ?? false,
              earForeignBodyRight: data.earForeignBodyRight ?? false,
              earHemotympanumLeft: data.earHemotympanumLeft ?? false,
              earHemotympanumRight: data.earHemotympanumRight ?? false,
              earTraumaLeft: data.earTraumaLeft ?? false,
              earTraumaRight: data.earTraumaRight ?? false,

              eyeMobilityNormal: data.eyeMobilityNormal ?? false,
              eyePupilsNormal: data.eyePupilsNormal ?? false,
              eyeExamOther: data.eyeExamOther || "",
              eyeConjunctivitisLeft: data.eyeConjunctivitisLeft ?? false,
              eyeConjunctivitisRight: data.eyeConjunctivitisRight ?? false,
              eyeMydriasisLeft: data.eyeMydriasisLeft ?? false,
              eyeMydriasisRight: data.eyeMydriasisRight ?? false,
              eyeMiosisLeft: data.eyeMiosisLeft ?? false,
              eyeMiosisRight: data.eyeMiosisRight ?? false,
              eyeNystagmusLeft: data.eyeNystagmusLeft ?? false,
              eyeNystagmusRight: data.eyeNystagmusRight ?? false,
              eyeDeviationLeft: data.eyeDeviationLeft ?? false,
              eyeDeviationRight: data.eyeDeviationRight ?? false,
              eyeTraumaExamLeft: data.eyeTraumaExamLeft ?? false,
              eyeTraumaExamRight: data.eyeTraumaExamRight ?? false,

              cvRhythmNormal: data.cvRhythmNormal ?? false,
              cvPeripheralPulseNormal: data.cvPeripheralPulseNormal ?? false,
              cvHeartAuscultationNormal: data.cvHeartAuscultationNormal ?? false,
              cvIrregularPulse: data.cvIrregularPulse ?? false,
              cvFiliformPeripheralPulse: data.cvFiliformPeripheralPulse ?? false,
              cvPulseDeficit: data.cvPulseDeficit ?? false,
              cvArrhythmicSounds: data.cvArrhythmicSounds ?? false,
              cvMuffledSounds: data.cvMuffledSounds ?? false,
              cvPericardialRub: data.cvPericardialRub ?? false,
              cvJugularTurgor: data.cvJugularTurgor ?? false,
              cvSystolicMurmur: data.cvSystolicMurmur ?? false,
              cvDiastolicMurmur: data.cvDiastolicMurmur ?? false,
              cvAorticMurmur: data.cvAorticMurmur ?? false,
              cvGallop: data.cvGallop ?? false,
              cvCarotidMurmur: data.cvCarotidMurmur ?? false,
              cvObservations: data.cvObservations || "",

              respThoraxAspectNormal: data.respThoraxAspectNormal ?? false,
              respThoraxPercussionNormal: data.respThoraxPercussionNormal ?? false,
              respVesicularBilateralNormal: data.respVesicularBilateralNormal ?? false,
              respOropharynxNormal: data.respOropharynxNormal ?? false,
              respDiminishedMurmurLeft: data.respDiminishedMurmurLeft ?? false,
              respDiminishedMurmurRight: data.respDiminishedMurmurRight ?? false,
              respAbsentMurmurLeft: data.respAbsentMurmurLeft ?? false,
              respAbsentMurmurRight: data.respAbsentMurmurRight ?? false,
              respWheezingRalesLeft: data.respWheezingRalesLeft ?? false,
              respWheezingRalesRight: data.respWheezingRalesRight ?? false,
              respCrepitantRalesLeft: data.respCrepitantRalesLeft ?? false,
              respCrepitantRalesRight: data.respCrepitantRalesRight ?? false,
              respSubcrepitantRalesLeft: data.respSubcrepitantRalesLeft ?? false,
              respSubcrepitantRalesRight: data.respSubcrepitantRalesRight ?? false,
              respIntercostalRetractionLeft: data.respIntercostalRetractionLeft ?? false,
              respIntercostalRetractionRight: data.respIntercostalRetractionRight ?? false,
              respSubcutaneousEmphysemaLeft: data.respSubcutaneousEmphysemaLeft ?? false,
              respSubcutaneousEmphysemaRight: data.respSubcutaneousEmphysemaRight ?? false,
              respTracheaDeviationLeft: data.respTracheaDeviationLeft ?? false,
              respTracheaDeviationRight: data.respTracheaDeviationRight ?? false,
              respWheezing: data.respWheezing ?? false,
              respOther: data.respOther || "",

              eyeAcuteVisionLoss: data.eyeAcuteVisionLoss ?? false,
              eyeVisionDisorders: data.eyeVisionDisorders ?? false,
              eyeForeignBody: data.eyeForeignBody ?? false,
              eyeOtherManifestations: data.eyeOtherManifestations ?? false,

              burnAirwayAffected: data.burnAirwayAffected ?? false,
              burnFlame: data.burnFlame ?? false,
              burnSolid: data.burnSolid ?? false,
              burnLiquid: data.burnLiquid ?? false,
              burnVaporsGas: data.burnVaporsGas ?? false,
              burnChemical: data.burnChemical ?? false,

              chestPain: data.chestPain ?? false,
              dyspnea: data.dyspnea ?? false,
              hemoptysis: data.hemoptysis ?? false,
              cough: data.cough ?? false,
              expectoration: data.expectoration ?? false,

              psychDepression: data.psychDepression ?? false,
              psychBehaviorDisorder: data.psychBehaviorDisorder ?? false,
              psychSuicide: data.psychSuicide ?? false,
              psychHallucinations: data.psychHallucinations ?? false,
              psychDelirium: data.psychDelirium ?? false,

              giNausea: data.giNausea ?? false,
              giVomiting: data.giVomiting ?? false,
              giTransitDisorders: data.giTransitDisorders ?? false,
              giRectorrhagia: data.giRectorrhagia ?? false,
              giMelena: data.giMelena ?? false,
              giHematemesis: data.giHematemesis ?? false,
              giAbdominalPain: data.giAbdominalPain ?? false,

              neuroConvulsions: data.neuroConvulsions ?? false,
              neuroMyoclonus: data.neuroMyoclonus ?? false,
              neuroHeadache: data.neuroHeadache ?? false,
              neuroParalysis: data.neuroParalysis ?? false,

              guUrinationDisorders: data.guUrinationDisorders ?? false,
              guDysuria: data.guDysuria ?? false,
              guPollakiuria: data.guPollakiuria ?? false,
              guOliguria: data.guOliguria ?? false,
              guHematuria: data.guHematuria ?? false,
              guVaginalBleeding: data.guVaginalBleeding ?? false,
              guPregnancy: data.guPregnancy ?? false,

              skinWarm: data.skinWarm ?? false,
              skinCold: data.skinCold ?? false,
              skinWet: data.skinWet ?? false,
              skinPale: data.skinPale ?? false,
              skinCyanotic: data.skinCyanotic ?? false,
              skinJaundice: data.skinJaundice ?? false,
              skinEcchymosis: data.skinEcchymosis ?? false,
              skinRash: data.skinRash ?? false,
              skinPruritus: data.skinPruritus ?? false,
              skinBurns: data.skinBurns ?? false,

              locomotorInflammation: data.locomotorInflammation ?? false,
              locomotorSwelling: data.locomotorSwelling ?? false,
              locomotorPain: data.locomotorPain ?? false,
              locomotorFunctionalImpairment: data.locomotorFunctionalImpairment ?? false,
              locomotorHematoma: data.locomotorHematoma ?? false,

              allergies: data.allergies || "",
            }
          : {}),
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

      <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Caută fișe vechi după pacient</div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Caută pacient după nume"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: 8, minWidth: 260 }}
          />
          <button onClick={searchPatients} style={{ padding: "8px 12px" }}>
            Caută
          </button>
        </div>

        {searchResults.length > 0 && (
          <div style={{ marginTop: 10, border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
            {searchResults.map((p, index) => (
              <div
                key={p.id}
                onClick={() => loadPatientVisits(p)}
                style={{
                  cursor: "pointer",
                  padding: 10,
                  borderBottom: index !== searchResults.length - 1 ? "1px solid #333" : "none",
                }}
              >
                {p.firstName} {p.lastName} (ID {p.id})
              </div>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              Vizitele pacientului: {selectedPatient.firstName} {selectedPatient.lastName}
            </div>

            {patientVisits.length === 0 ? (
              <div style={{ color: "#aaa" }}>Nu există vizite pentru acest pacient.</div>
            ) : (
              <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
                {patientVisits.map((v, index) => (
                  <div
                    key={v.id}
                    onClick={() => openVisitFromSearch(v)}
                    style={{
                      cursor: "pointer",
                      padding: 10,
                      borderBottom: index !== patientVisits.length - 1 ? "1px solid #333" : "none",
                    }}
                  >
                    Vizita #{v.id} — {getStatusLabel(v.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!searchMode && patientDetails && (
        <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Date pacient</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><b>Prenume:</b> {patientDetails.firstName}</div>
            <div><b>Nume:</b> {patientDetails.lastName}</div>
            <div><b>CNP:</b> {patientDetails.cnp || "-"}</div>
            <div><b>Telefon:</b> {patientDetails.phoneNumber || "-"}</div>
            <div><b>Email:</b> {patientDetails.email || "-"}</div>
            <div><b>ID pacient:</b> {patientDetails.id}</div>
          </div>
        </div>
      )}

      {!searchMode && (
        <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={savePreform} disabled={loading} style={{ padding: "8px 12px" }}>
              Salvează pre-spitalizarea
            </button>
            <button onClick={saveDischarge} disabled={loading} style={{ padding: "8px 12px" }}>
              Salvează externarea
            </button>
            <button onClick={exportCombined} style={{ padding: "8px 12px" }}>
              Export PDF combinat
            </button>
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: 8 }}
            >
              <option value="">Selectează status</option>
              <option value="REGISTERED">Înregistrat</option>
              <option value="TRIAGE_DONE">Triaj efectuat</option>
              <option value="WAITING_CONSULT">În așteptare consult</option>
              <option value="IN_CONSULT">În consult</option>
              <option value="IN_INVESTIGATION">În investigații</option>
              <option value="OBSERVATION">În observație</option>
              <option value="DISCHARGED">Externat</option>
              <option value="ADMITTED">Internat</option>
              <option value="TRANSFERRED">Transferat</option>
            </select>

            <button onClick={updateStatus} style={{ padding: "8px 12px" }}>
              Actualizează statusul
            </button>
          </div>

          {msg && <p style={{ marginTop: 10, color: "#ddd" }}>{msg}</p>}
        </div>
      )}

      {!searchMode && (
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <SectionCard
            title="Fișa de pre-spitalizare"
            isOpen={preformOpen}
            onToggle={() => setPreformOpen((prev) => !prev)}
          >
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 18, textAlign: "center" }}>
                SPITALUL CLINIC DE URGENȚĂ
              </div>

              <div style={{ fontWeight: 700, textAlign: "center" }}>
                UNITATE PRIMIRE URGENȚE
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <label>
                  Nr. fișă
                  <input value={preform.sheetNumber} onChange={(e) => setPreform({ ...preform, sheetNumber: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Data
                  <input type="date" value={preform.presentationDate} onChange={(e) => setPreform({ ...preform, presentationDate: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Ora
                  <input value={preform.presentationTime} onChange={(e) => setPreform({ ...preform, presentationTime: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Preluat de
                  <input value={preform.takenOverBy} onChange={(e) => setPreform({ ...preform, takenOverBy: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
              </div>

              <div style={{ fontWeight: 700 }}>PACIENT</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <label>
                  Prenume
                  <input value={preform.firstName} onChange={(e) => setPreform({ ...preform, firstName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Nume
                  <input value={preform.lastName} onChange={(e) => setPreform({ ...preform, lastName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Vârstă
                  <input value={preform.age} onChange={(e) => setPreform({ ...preform, age: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Data nașterii
                  <input type="date" value={preform.birthDate} onChange={(e) => setPreform({ ...preform, birthDate: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>

                <label>
                  CNP
                  <input value={preform.cnp} onChange={(e) => setPreform({ ...preform, cnp: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Telefon
                  <input value={preform.phoneNumber} onChange={(e) => setPreform({ ...preform, phoneNumber: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Email
                  <input value={preform.email} onChange={(e) => setPreform({ ...preform, email: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Sex
                  <select value={preform.sex} onChange={(e) => setPreform({ ...preform, sex: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                    <option value="">Selectează</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                  </select>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <label>
                  Județ
                  <input value={preform.county} onChange={(e) => setPreform({ ...preform, county: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Localitate
                  <input value={preform.locality} onChange={(e) => setPreform({ ...preform, locality: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Strada
                  <input value={preform.street} onChange={(e) => setPreform({ ...preform, street: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Nr.
                  <input value={preform.streetNumber} onChange={(e) => setPreform({ ...preform, streetNumber: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>

                <label>
                  Bl.
                  <input value={preform.building} onChange={(e) => setPreform({ ...preform, building: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Sc.
                  <input value={preform.staircase} onChange={(e) => setPreform({ ...preform, staircase: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Et.
                  <input value={preform.floor} onChange={(e) => setPreform({ ...preform, floor: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Ap.
                  <input value={preform.apartment} onChange={(e) => setPreform({ ...preform, apartment: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>STARE PACIENT</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[
                    ["30_RESUSCITARE", "30 - Resuscitare"],
                    ["31_CRITIC", "31 - Critic"],
                    ["32_URGENT", "32 - Urgent"],
                    ["33_NON_URGENT", "33 - Non-urgent"],
                    ["34_CONSULT", "34 - Consult"],
                  ].map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="patientStateCode"
                        checked={preform.patientStateCode === value}
                        onChange={() => setPreform({ ...preform, patientStateCode: value })}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <label>
                Motivul prezentării
                <textarea
                  value={preform.reason}
                  onChange={(e) => setPreform({ ...preform, reason: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                <label>
                  Ora GCS
                  <input value={preform.gcsHour} onChange={(e) => setPreform({ ...preform, gcsHour: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  M
                  <input value={preform.gcsM} onChange={(e) => setPreform({ ...preform, gcsM: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  V
                  <input value={preform.gcsV} onChange={(e) => setPreform({ ...preform, gcsV: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  O
                  <input value={preform.gcsO} onChange={(e) => setPreform({ ...preform, gcsO: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  GCS
                  <input value={preform.gcs} onChange={(e) => setPreform({ ...preform, gcs: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Adus de</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                  {[
                    ["13_SAJ", "13 - SAJ"],
                    ["14_SMURD", "14 - SMURD"],
                    ["15_MIJLOACE_PROPRII", "15 - Mijloace proprii"],
                    ["16_ALT", "16 - Alt"],
                  ].map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="broughtByCode"
                        checked={preform.broughtByCode === value}
                        onChange={() => setPreform({ ...preform, broughtByCode: value })}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </div>
                <input
                  placeholder="Completează dacă ai ales Alt"
                  value={preform.broughtByOther}
                  onChange={(e) => setPreform({ ...preform, broughtByOther: e.target.value })}
                  style={{ width: "100%", padding: 8 }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Adus de la</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                  {[
                    ["17_DOMICILIU", "17 - Domiciliu"],
                    ["18_UNITATE_SANITARA", "18 - Unitate sanitară"],
                    ["19_LOC_PUBLIC", "19 - Loc public"],
                    ["20_LOC_MUNCA", "20 - Loc muncă"],
                    ["21_ALTUL", "21 - Altul"],
                  ].map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="broughtFromCode"
                        checked={preform.broughtFromCode === value}
                        onChange={() => setPreform({ ...preform, broughtFromCode: value })}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </div>
                <input
                  placeholder="Completează dacă ai ales Altul"
                  value={preform.broughtFromOther}
                  onChange={(e) => setPreform({ ...preform, broughtFromOther: e.target.value })}
                  style={{ width: "100%", padding: 8 }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Funcții vitale la preluare</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  <CheckboxField
                    label="35 - Decedat"
                    checked={preform.pickupDeceased}
                    onChange={(value) => setPreform({ ...preform, pickupDeceased: value })}
                  />
                  <CheckboxField
                    label="36 - Stop CR"
                    checked={preform.pickupStopCr}
                    onChange={(value) => setPreform({ ...preform, pickupStopCr: value })}
                  />
                  <CheckboxField
                    label="37 - Cu manevre de resuscitare în curs de desfășurare"
                    checked={preform.pickupResuscitationInProgress}
                    onChange={(value) => setPreform({ ...preform, pickupResuscitationInProgress: value })}
                  />
                  <CheckboxField
                    label="38 - Traumă"
                    checked={preform.pickupTrauma}
                    onChange={(value) => setPreform({ ...preform, pickupTrauma: value })}
                  />

                  <label>
                    39 - Resuscitare la ora
                    <input
                      value={preform.resuscitationHour}
                      onChange={(e) => setPreform({ ...preform, resuscitationHour: e.target.value })}
                      style={{ width: "100%", padding: 8, marginTop: 6 }}
                    />
                  </label>

                  <CheckboxField
                    label="40 - Reușit"
                    checked={preform.resuscitationSuccessful}
                    onChange={(value) => setPreform({ ...preform, resuscitationSuccessful: value })}
                  />

                  <div>
                    <CheckboxField
                      label="41 - Nereușit"
                      checked={preform.resuscitationFailed}
                      onChange={(value) => setPreform({ ...preform, resuscitationFailed: value })}
                    />
                    <input
                      placeholder="Ora deces"
                      value={preform.deathHour}
                      onChange={(e) => setPreform({ ...preform, deathHour: e.target.value })}
                      style={{ width: "100%", padding: 8, marginTop: 6 }}
                    />
                  </div>

                  <label>
                    42 - Motivul neînceperii resuscitării
                    <input
                      value={preform.resuscitationNotStartedReason}
                      onChange={(e) =>
                        setPreform({ ...preform, resuscitationNotStartedReason: e.target.value })
                      }
                      style={{ width: "100%", padding: 8, marginTop: 6 }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <label>
                  Fr. Res.
                  <input value={preform.respiratoryRate} onChange={(e) => setPreform({ ...preform, respiratoryRate: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  AV
                  <input value={preform.av} onChange={(e) => setPreform({ ...preform, av: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Puls
                  <input value={preform.pulse} onChange={(e) => setPreform({ ...preform, pulse: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  TA sistolică
                  <input value={preform.systolicBp} onChange={(e) => setPreform({ ...preform, systolicBp: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>

                <label>
                  TA diastolică
                  <input value={preform.diastolicBp} onChange={(e) => setPreform({ ...preform, diastolicBp: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Sat O2
                  <input value={preform.spo2} onChange={(e) => setPreform({ ...preform, spo2: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Temp
                  <input value={preform.temperature} onChange={(e) => setPreform({ ...preform, temperature: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
                <label>
                  Gli
                  <input value={preform.glycemia} onChange={(e) => setPreform({ ...preform, glycemia: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>

                <label>
                  TRC
                  <input value={preform.trc} onChange={(e) => setPreform({ ...preform, trc: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </label>
              </div>

              <div style={{ fontWeight: 700 }}>Antecedente patologice</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                <CheckboxField label="Cardiace" checked={preform.historyCardiac} onChange={(value) => setPreform({ ...preform, historyCardiac: value })} />
                <CheckboxField label="Neurologice" checked={preform.historyNeurologic} onChange={(value) => setPreform({ ...preform, historyNeurologic: value })} />
                <CheckboxField label="Renale" checked={preform.historyRenal} onChange={(value) => setPreform({ ...preform, historyRenal: value })} />
                <CheckboxField label="Pulmonare" checked={preform.historyPulmonary} onChange={(value) => setPreform({ ...preform, historyPulmonary: value })} />
                <CheckboxField label="TBC" checked={preform.historyTbc} onChange={(value) => setPreform({ ...preform, historyTbc: value })} />
                <CheckboxField label="Hepatice" checked={preform.historyHepatic} onChange={(value) => setPreform({ ...preform, historyHepatic: value })} />
                <CheckboxField label="Gastrice" checked={preform.historyGastric} onChange={(value) => setPreform({ ...preform, historyGastric: value })} />
                <CheckboxField label="Diabet zaharat" checked={preform.historyDiabetes} onChange={(value) => setPreform({ ...preform, historyDiabetes: value })} />
                <CheckboxField label="Boli infecțio-contagioase" checked={preform.historyInfectious} onChange={(value) => setPreform({ ...preform, historyInfectious: value })} />
                <CheckboxField label="Boli cu transmitere sexuală" checked={preform.historyStd} onChange={(value) => setPreform({ ...preform, historyStd: value })} />
              </div>

              <label>
                Alte antecedente
                <input
                  value={preform.historyOther}
                  onChange={(e) => setPreform({ ...preform, historyOther: e.target.value })}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                />
              </label>

              <label>
                Anamneză
                <textarea
                  value={preform.anamnesis}
                  onChange={(e) => setPreform({ ...preform, anamnesis: e.target.value })}
                  rows={5}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                />
              </label>

              <div style={{ fontWeight: 700 }}>Triaj</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <label>
                  14 - Talie (cm)
                  <input
                    value={preform.heightCm}
                    onChange={(e) => setPreform({ ...preform, heightCm: e.target.value })}
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>
                <label>
                  15 - Greutate (kg)
                  <input
                    value={preform.weightKg}
                    onChange={(e) => setPreform({ ...preform, weightKg: e.target.value })}
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>General</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="16 - Febră" checked={preform.triageFever} onChange={(value) => setPreform({ ...preform, triageFever: value })} />
                  <CheckboxField label="17 - Astenie" checked={preform.triageAsthenia} onChange={(value) => setPreform({ ...preform, triageAsthenia: value })} />
                  <CheckboxField label="18 - Amețeli" checked={preform.triageDizziness} onChange={(value) => setPreform({ ...preform, triageDizziness: value })} />
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #333",
                  borderRadius: 10,
                  padding: 14,
                  background: "#0f0f0f",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>EXAMEN OBIECTIV</div>

                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>STARE GENERALĂ</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {[
                      ["10_NORMALA", "10 - Normală"],
                      ["11_INFLUENTATA", "11 - Influențată"],
                      ["12_ALTERATA", "12 - Alterată"],
                      ["13_PROFUND_ALTERATA", "13 - Profund alterată"],
                    ].map(([value, label]) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="objectiveGeneralState"
                          checked={preform.objectiveGeneralState === value}
                          onChange={() => setPreform({ ...preform, objectiveGeneralState: value })}
                        />{" "}
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>CAP</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      <CheckboxField label="30 - Normal" checked={preform.headNormal} onChange={(v) => setPreform({ ...preform, headNormal: v })} />
                      <CheckboxField label="31 - Marcă traumatică" checked={preform.headTraumaMark} onChange={(v) => setPreform({ ...preform, headTraumaMark: v })} />
                      <CheckboxField label="32 - Leziuni cav. bucală" checked={preform.headOralLesions} onChange={(v) => setPreform({ ...preform, headOralLesions: v })} />
                      <CheckboxField label="33 - Leziuni dentare" checked={preform.headDentalLesions} onChange={(v) => setPreform({ ...preform, headDentalLesions: v })} />
                    </div>
                  </div>

                  <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>GÂT</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      <CheckboxField label="34 - Normal" checked={preform.neckNormal} onChange={(v) => setPreform({ ...preform, neckNormal: v })} />
                      <CheckboxField label="35 - Marcă traumatică" checked={preform.neckTraumaMark} onChange={(v) => setPreform({ ...preform, neckTraumaMark: v })} />
                      <CheckboxField label="36 - Formațiuni palpabile" checked={preform.neckPalpableFormations} onChange={(v) => setPreform({ ...preform, neckPalpableFormations: v })} />
                      <TextField label="Alte" value={preform.neckOther} onChange={(v) => setPreform({ ...preform, neckOther: v })} />
                    </div>
                  </div>

                  <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>NAS</div>

                    <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
                    <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                      <CheckboxField label="38 - Nări" checked={preform.noseNostrilsNormal} onChange={(v) => setPreform({ ...preform, noseNostrilsNormal: v })} />
                      <CheckboxField label="39 - Mucoasa nazală" checked={preform.noseMucosaNormal} onChange={(v) => setPreform({ ...preform, noseMucosaNormal: v })} />
                      <TextField label="Alte" value={preform.noseOther} onChange={(v) => setPreform({ ...preform, noseOther: v })} />
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                      <LrCheckboxRow
                        label="40 - Epistaxis - 41"
                        leftChecked={preform.noseEpistaxisLeft}
                        rightChecked={preform.noseEpistaxisRight}
                        onLeftChange={(v) => setPreform({ ...preform, noseEpistaxisLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, noseEpistaxisRight: v })}
                      />
                      <LrCheckboxRow
                        label="42 - Corpi străini - 43"
                        leftChecked={preform.noseForeignBodyLeft}
                        rightChecked={preform.noseForeignBodyRight}
                        onLeftChange={(v) => setPreform({ ...preform, noseForeignBodyLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, noseForeignBodyRight: v })}
                      />
                      <LrCheckboxRow
                        label="44 - Traumă - 44'"
                        leftChecked={preform.noseTraumaLeft}
                        rightChecked={preform.noseTraumaRight}
                        onLeftChange={(v) => setPreform({ ...preform, noseTraumaLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, noseTraumaRight: v })}
                      />
                    </div>
                  </div>

                  <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>APARAT AUDITIV</div>

                    <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
                    <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                      <CheckboxField label="45 - Membrana timpanică" checked={preform.earTympanicMembraneNormal} onChange={(v) => setPreform({ ...preform, earTympanicMembraneNormal: v })} />
                      <CheckboxField label="46 - Căi auditive externe" checked={preform.earExternalCanalsNormal} onChange={(v) => setPreform({ ...preform, earExternalCanalsNormal: v })} />
                      <CheckboxField label="47 - Pavilionul urechii" checked={preform.earAuricleNormal} onChange={(v) => setPreform({ ...preform, earAuricleNormal: v })} />
                      <TextField label="Alte" value={preform.earOther} onChange={(v) => setPreform({ ...preform, earOther: v })} />
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                      <LrCheckboxRow
                        label="48 - Otoragie - 49"
                        leftChecked={preform.earOtorrhagiaLeft}
                        rightChecked={preform.earOtorrhagiaRight}
                        onLeftChange={(v) => setPreform({ ...preform, earOtorrhagiaLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, earOtorrhagiaRight: v })}
                      />
                      <LrCheckboxRow
                        label="50 - Corpi străini - 51"
                        leftChecked={preform.earForeignBodyLeft}
                        rightChecked={preform.earForeignBodyRight}
                        onLeftChange={(v) => setPreform({ ...preform, earForeignBodyLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, earForeignBodyRight: v })}
                      />
                      <LrCheckboxRow
                        label="52 - Hemotimpan - 53"
                        leftChecked={preform.earHemotympanumLeft}
                        rightChecked={preform.earHemotympanumRight}
                        onLeftChange={(v) => setPreform({ ...preform, earHemotympanumLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, earHemotympanumRight: v })}
                      />
                      <LrCheckboxRow
                        label="Traumă"
                        leftChecked={preform.earTraumaLeft}
                        rightChecked={preform.earTraumaRight}
                        onLeftChange={(v) => setPreform({ ...preform, earTraumaLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, earTraumaRight: v })}
                      />
                    </div>
                  </div>

                  <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>OCHI</div>

                    <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
                    <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                      <CheckboxField label="54 - Mobilitate globi oculari" checked={preform.eyeMobilityNormal} onChange={(v) => setPreform({ ...preform, eyeMobilityNormal: v })} />
                      <CheckboxField label="55 - Pupile" checked={preform.eyePupilsNormal} onChange={(v) => setPreform({ ...preform, eyePupilsNormal: v })} />
                      <TextField label="Alte" value={preform.eyeExamOther} onChange={(v) => setPreform({ ...preform, eyeExamOther: v })} />
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                      <LrCheckboxRow
                        label="56 - Conjunctivite - 57"
                        leftChecked={preform.eyeConjunctivitisLeft}
                        rightChecked={preform.eyeConjunctivitisRight}
                        onLeftChange={(v) => setPreform({ ...preform, eyeConjunctivitisLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, eyeConjunctivitisRight: v })}
                      />
                      <LrCheckboxRow
                        label="58 - Midriază - 59"
                        leftChecked={preform.eyeMydriasisLeft}
                        rightChecked={preform.eyeMydriasisRight}
                        onLeftChange={(v) => setPreform({ ...preform, eyeMydriasisLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, eyeMydriasisRight: v })}
                      />
                      <LrCheckboxRow
                        label="60 - Mioză - 61"
                        leftChecked={preform.eyeMiosisLeft}
                        rightChecked={preform.eyeMiosisRight}
                        onLeftChange={(v) => setPreform({ ...preform, eyeMiosisLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, eyeMiosisRight: v })}
                      />
                      <LrCheckboxRow
                        label="62 - Nistagmus - 63"
                        leftChecked={preform.eyeNystagmusLeft}
                        rightChecked={preform.eyeNystagmusRight}
                        onLeftChange={(v) => setPreform({ ...preform, eyeNystagmusLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, eyeNystagmusRight: v })}
                      />
                      <LrCheckboxRow
                        label="64 - Deviere gl. oc. - 65"
                        leftChecked={preform.eyeDeviationLeft}
                        rightChecked={preform.eyeDeviationRight}
                        onLeftChange={(v) => setPreform({ ...preform, eyeDeviationLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, eyeDeviationRight: v })}
                      />
                      <LrCheckboxRow
                        label="247 - Traumă - 248"
                        leftChecked={preform.eyeTraumaExamLeft}
                        rightChecked={preform.eyeTraumaExamRight}
                        onLeftChange={(v) => setPreform({ ...preform, eyeTraumaExamLeft: v })}
                        onRightChange={(v) => setPreform({ ...preform, eyeTraumaExamRight: v })}
                      />
                    </div>
                  </div>

                  <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>APARAT CARDIOVASCULAR</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <CheckboxField label="70 - Ritm cardiac" checked={preform.cvRhythmNormal} onChange={(v) => setPreform({ ...preform, cvRhythmNormal: v })} />
                      <CheckboxField label="78 - Jugulare turgesc." checked={preform.cvJugularTurgor} onChange={(v) => setPreform({ ...preform, cvJugularTurgor: v })} />

                      <CheckboxField label="71 - Puls periferic" checked={preform.cvPeripheralPulseNormal} onChange={(v) => setPreform({ ...preform, cvPeripheralPulseNormal: v })} />
                      <CheckboxField label="79 - Suflu sistolic" checked={preform.cvSystolicMurmur} onChange={(v) => setPreform({ ...preform, cvSystolicMurmur: v })} />

                      <CheckboxField label="72 - Ascultația cordului" checked={preform.cvHeartAuscultationNormal} onChange={(v) => setPreform({ ...preform, cvHeartAuscultationNormal: v })} />
                      <CheckboxField label="80 - Suflu diastolic" checked={preform.cvDiastolicMurmur} onChange={(v) => setPreform({ ...preform, cvDiastolicMurmur: v })} />

                      <CheckboxField label="73 - Puls neregulat" checked={preform.cvIrregularPulse} onChange={(v) => setPreform({ ...preform, cvIrregularPulse: v })} />
                      <CheckboxField label="81 - Suflu aortic" checked={preform.cvAorticMurmur} onChange={(v) => setPreform({ ...preform, cvAorticMurmur: v })} />

                      <CheckboxField label="74 - Puls perif. filiform" checked={preform.cvFiliformPeripheralPulse} onChange={(v) => setPreform({ ...preform, cvFiliformPeripheralPulse: v })} />
                      <CheckboxField label="86 - Galop" checked={preform.cvGallop} onChange={(v) => setPreform({ ...preform, cvGallop: v })} />

                      <CheckboxField label="75 - Deficit de puls" checked={preform.cvPulseDeficit} onChange={(v) => setPreform({ ...preform, cvPulseDeficit: v })} />
                      <CheckboxField label="83 - Suflu carotodian" checked={preform.cvCarotidMurmur} onChange={(v) => setPreform({ ...preform, cvCarotidMurmur: v })} />

                      <CheckboxField label="76 - Zgomote aritmice" checked={preform.cvArrhythmicSounds} onChange={(v) => setPreform({ ...preform, cvArrhythmicSounds: v })} />
                      <CheckboxField label="77 - Zgomote asurzite" checked={preform.cvMuffledSounds} onChange={(v) => setPreform({ ...preform, cvMuffledSounds: v })} />

                      <CheckboxField label="85 - Frecătură" checked={preform.cvPericardialRub} onChange={(v) => setPreform({ ...preform, cvPericardialRub: v })} />
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <TextField label="Observații" value={preform.cvObservations} onChange={(v) => setPreform({ ...preform, cvObservations: v })} />
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1", border: "1px solid #333", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>TORACE / APARAT RESPIRATOR</div>

                    <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 12 }}>
                      <CheckboxField label="90 - Aspectul toracelui" checked={preform.respThoraxAspectNormal} onChange={(v) => setPreform({ ...preform, respThoraxAspectNormal: v })} />
                      <CheckboxField label="91 - Percuția toracelui" checked={preform.respThoraxPercussionNormal} onChange={(v) => setPreform({ ...preform, respThoraxPercussionNormal: v })} />
                      <CheckboxField label="92 - Murmur vezicular bilat." checked={preform.respVesicularBilateralNormal} onChange={(v) => setPreform({ ...preform, respVesicularBilateralNormal: v })} />
                      <CheckboxField label="93 - Orofaringe" checked={preform.respOropharynxNormal} onChange={(v) => setPreform({ ...preform, respOropharynxNormal: v })} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ display: "grid", gap: 8 }}>
                        <LrCheckboxRow
                          label="94 - Murmur vezicular diminuat - 95"
                          leftChecked={preform.respDiminishedMurmurLeft}
                          rightChecked={preform.respDiminishedMurmurRight}
                          onLeftChange={(v) => setPreform({ ...preform, respDiminishedMurmurLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respDiminishedMurmurRight: v })}
                        />
                        <LrCheckboxRow
                          label="96 - Murmur vezicular absent - 95"
                          leftChecked={preform.respAbsentMurmurLeft}
                          rightChecked={preform.respAbsentMurmurRight}
                          onLeftChange={(v) => setPreform({ ...preform, respAbsentMurmurLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respAbsentMurmurRight: v })}
                        />
                        <LrCheckboxRow
                          label="94 - Raluri sibilante - 97"
                          leftChecked={preform.respWheezingRalesLeft}
                          rightChecked={preform.respWheezingRalesRight}
                          onLeftChange={(v) => setPreform({ ...preform, respWheezingRalesLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respWheezingRalesRight: v })}
                        />
                        <LrCheckboxRow
                          label="100 - Raluri crepitante - 101"
                          leftChecked={preform.respCrepitantRalesLeft}
                          rightChecked={preform.respCrepitantRalesRight}
                          onLeftChange={(v) => setPreform({ ...preform, respCrepitantRalesLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respCrepitantRalesRight: v })}
                        />
                        <LrCheckboxRow
                          label="102 - Raluri subcrepitante - 103"
                          leftChecked={preform.respSubcrepitantRalesLeft}
                          rightChecked={preform.respSubcrepitantRalesRight}
                          onLeftChange={(v) => setPreform({ ...preform, respSubcrepitantRalesLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respSubcrepitantRalesRight: v })}
                        />
                      </div>

                      <div style={{ display: "grid", gap: 8 }}>
                        <LrCheckboxRow
                          label="104 - Tiraj intercost/supraclavic - 105"
                          leftChecked={preform.respIntercostalRetractionLeft}
                          rightChecked={preform.respIntercostalRetractionRight}
                          onLeftChange={(v) => setPreform({ ...preform, respIntercostalRetractionLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respIntercostalRetractionRight: v })}
                        />
                        <LrCheckboxRow
                          label="106 - Emfizem subcutanat - 107"
                          leftChecked={preform.respSubcutaneousEmphysemaLeft}
                          rightChecked={preform.respSubcutaneousEmphysemaRight}
                          onLeftChange={(v) => setPreform({ ...preform, respSubcutaneousEmphysemaLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respSubcutaneousEmphysemaRight: v })}
                        />
                        <LrCheckboxRow
                          label="108 - Trahee deviată - 109"
                          leftChecked={preform.respTracheaDeviationLeft}
                          rightChecked={preform.respTracheaDeviationRight}
                          onLeftChange={(v) => setPreform({ ...preform, respTracheaDeviationLeft: v })}
                          onRightChange={(v) => setPreform({ ...preform, respTracheaDeviationRight: v })}
                        />
                        <CheckboxField
                          label="110 - Wheezing"
                          checked={preform.respWheezing}
                          onChange={(v) => setPreform({ ...preform, respWheezing: v })}
                        />
                        <TextField
                          label="Alte"
                          value={preform.respOther}
                          onChange={(v) => setPreform({ ...preform, respOther: v })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Ochi</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  <CheckboxField label="66 - Pierdere acută a vederii" checked={preform.eyeAcuteVisionLoss} onChange={(value) => setPreform({ ...preform, eyeAcuteVisionLoss: value })} />
                  <CheckboxField label="67 - Tulburări de vedere" checked={preform.eyeVisionDisorders} onChange={(value) => setPreform({ ...preform, eyeVisionDisorders: value })} />
                  <CheckboxField label="68 - Corp străin intraocular" checked={preform.eyeForeignBody} onChange={(value) => setPreform({ ...preform, eyeForeignBody: value })} />
                  <CheckboxField label="69 - Alte manifestări oculare" checked={preform.eyeOtherManifestations} onChange={(value) => setPreform({ ...preform, eyeOtherManifestations: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Arsuri</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="19 - Căi respiratorii afectate" checked={preform.burnAirwayAffected} onChange={(value) => setPreform({ ...preform, burnAirwayAffected: value })} />
                  <CheckboxField label="20 - Flacără" checked={preform.burnFlame} onChange={(value) => setPreform({ ...preform, burnFlame: value })} />
                  <CheckboxField label="21 - Solid" checked={preform.burnSolid} onChange={(value) => setPreform({ ...preform, burnSolid: value })} />
                  <CheckboxField label="22 - Lichid" checked={preform.burnLiquid} onChange={(value) => setPreform({ ...preform, burnLiquid: value })} />
                  <CheckboxField label="23 - Vapori/gaz" checked={preform.burnVaporsGas} onChange={(value) => setPreform({ ...preform, burnVaporsGas: value })} />
                  <CheckboxField label="24 - Chimic" checked={preform.burnChemical} onChange={(value) => setPreform({ ...preform, burnChemical: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Torace - respirație</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="111 - Durere toracică" checked={preform.chestPain} onChange={(value) => setPreform({ ...preform, chestPain: value })} />
                  <CheckboxField label="112 - Dispnee" checked={preform.dyspnea} onChange={(value) => setPreform({ ...preform, dyspnea: value })} />
                  <CheckboxField label="113 - Hemoptizie" checked={preform.hemoptysis} onChange={(value) => setPreform({ ...preform, hemoptysis: value })} />
                  <CheckboxField label="114 - Tuse" checked={preform.cough} onChange={(value) => setPreform({ ...preform, cough: value })} />
                  <CheckboxField label="115 - Expectorație" checked={preform.expectoration} onChange={(value) => setPreform({ ...preform, expectoration: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Psihiatric</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="246 - Depresie" checked={preform.psychDepression} onChange={(value) => setPreform({ ...preform, psychDepression: value })} />
                  <CheckboxField label="247 - Tulburări de comportament" checked={preform.psychBehaviorDisorder} onChange={(value) => setPreform({ ...preform, psychBehaviorDisorder: value })} />
                  <CheckboxField label="248 - Suicid" checked={preform.psychSuicide} onChange={(value) => setPreform({ ...preform, psychSuicide: value })} />
                  <CheckboxField label="225 - Halucinații" checked={preform.psychHallucinations} onChange={(value) => setPreform({ ...preform, psychHallucinations: value })} />
                  <CheckboxField label="226 - Delir" checked={preform.psychDelirium} onChange={(value) => setPreform({ ...preform, psychDelirium: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Gastrointestinal</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="132 - Greață" checked={preform.giNausea} onChange={(value) => setPreform({ ...preform, giNausea: value })} />
                  <CheckboxField label="133 - Vomă" checked={preform.giVomiting} onChange={(value) => setPreform({ ...preform, giVomiting: value })} />
                  <CheckboxField label="134 - Tulburări tranzit" checked={preform.giTransitDisorders} onChange={(value) => setPreform({ ...preform, giTransitDisorders: value })} />
                  <CheckboxField label="135 - Rectoragie" checked={preform.giRectorrhagia} onChange={(value) => setPreform({ ...preform, giRectorrhagia: value })} />
                  <CheckboxField label="136 - Melenă" checked={preform.giMelena} onChange={(value) => setPreform({ ...preform, giMelena: value })} />
                  <CheckboxField label="137 - Hematemeză" checked={preform.giHematemesis} onChange={(value) => setPreform({ ...preform, giHematemesis: value })} />
                  <CheckboxField label="138 - Dureri abdominale" checked={preform.giAbdominalPain} onChange={(value) => setPreform({ ...preform, giAbdominalPain: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Neurologic</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  <CheckboxField label="237 - Convulsii" checked={preform.neuroConvulsions} onChange={(value) => setPreform({ ...preform, neuroConvulsions: value })} />
                  <CheckboxField label="236 - Mioclonii" checked={preform.neuroMyoclonus} onChange={(value) => setPreform({ ...preform, neuroMyoclonus: value })} />
                  <CheckboxField label="249 - Cefalee" checked={preform.neuroHeadache} onChange={(value) => setPreform({ ...preform, neuroHeadache: value })} />
                  <CheckboxField label="250 - Paralizie" checked={preform.neuroParalysis} onChange={(value) => setPreform({ ...preform, neuroParalysis: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Genito-urinar</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="178 - Tulburări micționale" checked={preform.guUrinationDisorders} onChange={(value) => setPreform({ ...preform, guUrinationDisorders: value })} />
                  <CheckboxField label="179 - Disurie" checked={preform.guDysuria} onChange={(value) => setPreform({ ...preform, guDysuria: value })} />
                  <CheckboxField label="180 - Polakiurie" checked={preform.guPollakiuria} onChange={(value) => setPreform({ ...preform, guPollakiuria: value })} />
                  <CheckboxField label="181 - Oligurie" checked={preform.guOliguria} onChange={(value) => setPreform({ ...preform, guOliguria: value })} />
                  <CheckboxField label="177 - Hematurie" checked={preform.guHematuria} onChange={(value) => setPreform({ ...preform, guHematuria: value })} />
                  <CheckboxField label="182 - Sângerare vaginală" checked={preform.guVaginalBleeding} onChange={(value) => setPreform({ ...preform, guVaginalBleeding: value })} />
                  <CheckboxField label="183 - Sarcină" checked={preform.guPregnancy} onChange={(value) => setPreform({ ...preform, guPregnancy: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Tegumente</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="141 - Calde" checked={preform.skinWarm} onChange={(value) => setPreform({ ...preform, skinWarm: value })} />
                  <CheckboxField label="142 - Reci" checked={preform.skinCold} onChange={(value) => setPreform({ ...preform, skinCold: value })} />
                  <CheckboxField label="143 - Umede" checked={preform.skinWet} onChange={(value) => setPreform({ ...preform, skinWet: value })} />
                  <CheckboxField label="151 - Palide" checked={preform.skinPale} onChange={(value) => setPreform({ ...preform, skinPale: value })} />
                  <CheckboxField label="152 - Cianotice" checked={preform.skinCyanotic} onChange={(value) => setPreform({ ...preform, skinCyanotic: value })} />
                  <CheckboxField label="149 - Icterice" checked={preform.skinJaundice} onChange={(value) => setPreform({ ...preform, skinJaundice: value })} />
                  <CheckboxField label="146 - Echimoze" checked={preform.skinEcchymosis} onChange={(value) => setPreform({ ...preform, skinEcchymosis: value })} />
                  <CheckboxField label="154 - Erupții" checked={preform.skinRash} onChange={(value) => setPreform({ ...preform, skinRash: value })} />
                  <CheckboxField label="144 - Prurit" checked={preform.skinPruritus} onChange={(value) => setPreform({ ...preform, skinPruritus: value })} />
                  <CheckboxField label="155 - Arsuri" checked={preform.skinBurns} onChange={(value) => setPreform({ ...preform, skinBurns: value })} />
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Aparat locomotor</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <CheckboxField label="211 - Inflamație" checked={preform.locomotorInflammation} onChange={(value) => setPreform({ ...preform, locomotorInflammation: value })} />
                  <CheckboxField label="205 - Tumefacție" checked={preform.locomotorSwelling} onChange={(value) => setPreform({ ...preform, locomotorSwelling: value })} />
                  <CheckboxField label="204 - Durere" checked={preform.locomotorPain} onChange={(value) => setPreform({ ...preform, locomotorPain: value })} />
                  <CheckboxField label="207 - Impotență funcțională" checked={preform.locomotorFunctionalImpairment} onChange={(value) => setPreform({ ...preform, locomotorFunctionalImpairment: value })} />
                  <CheckboxField label="246 - Hematom" checked={preform.locomotorHematoma} onChange={(value) => setPreform({ ...preform, locomotorHematoma: value })} />
                </div>
              </div>

              <label>
                Alergic la
                <input
                  value={preform.allergies}
                  onChange={(e) => setPreform({ ...preform, allergies: e.target.value })}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard
            title="Fișa de externare"
            isOpen={dischargeOpen}
            onToggle={() => setDischargeOpen((prev) => !prev)}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              Tratament și recomandări
              <textarea
                value={discharge.treatmentAndRecommendations}
                onChange={(e) =>
                  setDischarge({ ...discharge, treatmentAndRecommendations: e.target.value })
                }
                rows={4}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
          </SectionCard>
        </div>
      )}
    </div>
  );
}