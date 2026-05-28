import SectionCard from "./SectionCard";
import "./PreformSection.css";
import PatientInfoSection from "./preform/sections/PatientInfoSection";
import PatientStateSection from "./preform/sections/PatientStateSection";
import GcsSection from "./preform/sections/GcsSection";
import ArrivalSection from "./preform/sections/ArrivalSection";
import PickupVitalFunctionsSection from "./preform/sections/PickupVitalFunctionsSection";
import VitalSignsSection from "./preform/sections/VitalSignsSection";
import MedicalHistorySection from "./preform/sections/MedicalHistorySection";
import TriageSymptomsSection from "./preform/sections/TriageSymptomsSection";
import ObjectiveHeadSection from "./preform/sections/ObjectiveHeadSection";
import ObjectiveTorsoSection from "./preform/sections/ObjectiveTorsoSection";
import ObjectiveLimbsNeuroSection from "./preform/sections/ObjectiveLimbsNeuroSection";
import ProceduresSection from "./preform/sections/ProceduresSection";

export default function PreformSection({
  preformOpen,
  setPreformOpen,
  preform,
  setPreform,
  onSave,
  readOnly = false,
medicalReadOnly = false,
aiMissingFields = [],
}) {
  const isFormLocked = readOnly;
const isObjectiveRestricted = medicalReadOnly;

const isAiMissing = (field) => aiMissingFields.includes(field);

const aiFieldStyle = (field) => ({
  border: isAiMissing(field)
    ? "2px solid #dc2626"
    : "1px solid #dbe3ec",
  background: isAiMissing(field)
    ? "#fef2f2"
    : "#ffffff",
});


  return (
    <SectionCard
      title="Fișa de pre-spitalizare"
      isOpen={preformOpen}
      onToggle={() => setPreformOpen((prev) => !prev)}
      hideTopButtonWhenOpen={true}
    >
      <div
  className="preform-modern"
  style={{
    opacity: 1,
  }}
>
  <fieldset
  disabled={isFormLocked}
  style={{
    border: "none",
    padding: 0,
    margin: 0,
    minWidth: 0,
  }}
></fieldset>
        <div style={{ fontWeight: 700, fontSize: 18, textAlign: "center" }}>
          SPITALUL CLINIC DE URGENȚĂ
        </div>

        <div style={{ fontWeight: 700, textAlign: "center" }}>
          UNITATE PRIMIRE URGENȚE
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            Nr. fișă
            <input
              value={preform.sheetNumber}
              onChange={(e) => setPreform({ ...preform, sheetNumber: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Data
            <input
              type="date"
              value={preform.presentationDate}
              onChange={(e) => setPreform({ ...preform, presentationDate: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Ora
            <input
              value={preform.presentationTime}
              onChange={(e) => setPreform({ ...preform, presentationTime: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Preluat de
            <input
              value={preform.takenOverBy}
              onChange={(e) => setPreform({ ...preform, takenOverBy: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

      <PatientInfoSection preform={preform} setPreform={setPreform} />

        <PatientStateSection
  preform={preform}
  setPreform={setPreform}
  aiFieldStyle={aiFieldStyle}
/>

        <GcsSection preform={preform} setPreform={setPreform} />

<ArrivalSection preform={preform} setPreform={setPreform} />

        <PickupVitalFunctionsSection
  preform={preform}
  setPreform={setPreform}
/>
<VitalSignsSection preform={preform} setPreform={setPreform} />
<MedicalHistorySection preform={preform} setPreform={setPreform} />
<TriageSymptomsSection preform={preform} setPreform={setPreform} />

        
<fieldset
  style={{
    border: "none",
    padding: 0,
    margin: 0,
    minWidth: 0,
    pointerEvents: isObjectiveRestricted ? "none" : "auto",
    opacity: 1,
  }}
>
  <div
    style={{
      border: "1px solid #e2e8f0",
      borderRadius: 24,
      padding: 18,
      background: "#f8fafc",
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 18,
        marginBottom: 14,
      }}
    >
      EXAMEN OBIECTIV
    </div>

    <ObjectiveHeadSection preform={preform} setPreform={setPreform} />
    <ObjectiveTorsoSection preform={preform} setPreform={setPreform} />
    <ObjectiveLimbsNeuroSection preform={preform} setPreform={setPreform} />
    <ProceduresSection preform={preform} setPreform={setPreform} />
  </div>
</fieldset>
        {preformOpen && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid #333",
            }}
          >
            {!readOnly && (
  <button onClick={onSave} style={{ padding: "8px 12px" }}>
    Salvează fișa
  </button>
)}

            <button
              onClick={() => setPreformOpen(false)}
              style={{ padding: "8px 12px" }}
            >
              Restrânge
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}