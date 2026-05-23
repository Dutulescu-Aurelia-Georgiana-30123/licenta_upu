import CheckboxField from "../../CheckboxField";

export default function MedicalHistorySection({ preform, setPreform }) {
  return (
    <>
      <div style={{ fontWeight: 700 }}>Antecedente patologice</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          ["historyCardiac", "Cardiace"],
          ["historyNeurologic", "Neurologice"],
          ["historyRenal", "Renale"],
          ["historyPulmonary", "Pulmonare"],
          ["historyTbc", "TBC"],
          ["historyHepatic", "Hepatice"],
          ["historyGastric", "Gastrice"],
          ["historyDiabetes", "Diabet zaharat"],
          ["historyInfectious", "Boli infecțio-contagioase"],
          ["historyStd", "Boli cu transmitere sexuală"],
        ].map(([field, label]) => (
          <CheckboxField
            key={field}
            label={label}
            checked={preform[field]}
            onChange={(value) =>
              setPreform({ ...preform, [field]: value })
            }
          />
        ))}
      </div>

      <label>
        Alte antecedente
        <input
          value={preform.historyOther}
          onChange={(e) =>
            setPreform({ ...preform, historyOther: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Anamneză
        <textarea
          value={preform.anamnesis}
          onChange={(e) =>
            setPreform({ ...preform, anamnesis: e.target.value })
          }
          rows={5}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Alergic la
        <input
          value={preform.allergies}
          onChange={(e) =>
            setPreform({ ...preform, allergies: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>
    </>
  );
}