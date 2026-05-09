import SectionCard from "./SectionCard";
import "./DischargeSection.css";

export default function DischargeSection({
  dischargeOpen,
  setDischargeOpen,
  discharge,
  setDischarge,
  preform,
  onSave,
  readOnly=false,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
const isReception = user?.role === "RECEPTION";
const isRestricted = isReception || readOnly;
  return (
    <SectionCard
      title="Fișa de externare"
      isOpen={dischargeOpen}
      onToggle={() => setDischargeOpen((prev) => !prev)}
      hideTopButtonWhenOpen={true}
    >
      <div
  className="discharge-modern"
  style={{
    pointerEvents: isRestricted ? "none" : "auto",
  }}
>
      <fieldset
  style={{
    border: "none",
    padding: 0,
    margin: 0,
    minWidth: 0,
    pointerEvents: isRestricted ? "none" : "auto",
  }}
>
        <div style={{ fontWeight: 700, fontSize: 18, textAlign: "center" }}>
          {discharge.hospitalName || "SPITALUL CLINIC DE URGENȚĂ"}
        </div>

        <div style={{ fontWeight: 700, textAlign: "center" }}>
          {discharge.sectionName || "UNITATE PRIMIRE URGENȚE"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            Nr. F.O.
            <input
              value={discharge.foNumber || preform?.sheetNumber || ""}
              onChange={(e) => setDischarge({ ...discharge, foNumber: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
<label>
  Data
  <input
    type="date"
    value={preform?.presentationDate || ""}
    readOnly
    style={{ width: "100%", padding: 8, marginTop: 6, background: "#fcfcfc" }}
  />
</label>

          <label>
            Externat la ora
            <input
              value={discharge.dischargeHour || ""}
              onChange={(e) => setDischarge({ ...discharge, dischargeHour: e.target.value })}
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
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            Prenume
            <input
              value={discharge.firstName || preform?.firstName || ""}
              onChange={(e) => setDischarge({ ...discharge, firstName: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Nume
            <input
              value={discharge.lastName || preform?.lastName || ""}
              onChange={(e) => setDischarge({ ...discharge, lastName: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Data nașterii
            <input
              type="date"
              value={discharge.birthDate || preform?.birthDate || ""}
              onChange={(e) => setDischarge({ ...discharge, birthDate: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Vârstă
            <input
              value={discharge.age ?? preform?.age ?? ""}
              onChange={(e) => setDischarge({ ...discharge, age: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

        <label style={{ display: "block" }}>
          Diagnostic la internare
          <textarea
            value={discharge.diagnosisAtAdmission}
            onChange={(e) => setDischarge({ ...discharge, diagnosisAtAdmission: e.target.value })}
            rows={3}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          Manevre / proceduri aplicate pacientului
          <textarea
            value={discharge.appliedProcedures || ""}
            onChange={(e) => setDischarge({ ...discharge, appliedProcedures: e.target.value })}
            rows={4}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block" }}>
          Diagnostic la externare
          <textarea
            value={discharge.diagnosisAtDischarge}
            onChange={(e) => setDischarge({ ...discharge, diagnosisAtDischarge: e.target.value })}
            rows={3}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Stare pacient</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              ["AMELIORAT", "50 - Ameliorat"],
              ["STATIONAR", "51 - Staționar"],
              ["AGRAVAT", "52 - Agravat"],
              ["DECEDAT", "53 - Decedat"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="patientStateAtDischarge"
                  checked={discharge.patientStateAtDischarge === value}
                  onChange={() =>
                    setDischarge({ ...discharge, patientStateAtDischarge: value })
                  }
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Destinație pacient</div>
          <div style={{ display: "grid", gap: 12 }}>
            <label>
              57 - Internat secția
              <input
                value={discharge.admittedSection || ""}
                onChange={(e) =>
                  setDischarge({
                    ...discharge,
                    admittedSection: e.target.value,
                  })
                }
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <label>
              58 - Transferat secție
              <input
                value={discharge.transferredSection || ""}
                onChange={(e) =>
                  setDischarge({
                    ...discharge,
                    transferredSection: e.target.value,
                  })
                }
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={!!discharge.leavesWithRecommendations}
                onChange={(e) =>
                  setDischarge({
                    ...discharge,
                    leavesWithRecommendations: e.target.checked,
                  })
                }
              />{" "}
              59 - Pleacă cu recomandări
            </label>
          </div>
        </div>

        <label style={{ display: "block" }}>
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
        </fieldset>
                {dischargeOpen && (
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
           {!isRestricted && (
  <button onClick={onSave} style={{ padding: "8px 12px" }}>
    Salvează fișa
  </button>
)}

            <button
              onClick={() => setDischargeOpen(false)}
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