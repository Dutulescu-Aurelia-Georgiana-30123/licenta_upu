import CheckboxField from "../../CheckboxField";

const procedureCheckboxes = [
  ["proceduresGuedelCannula", "11 - Pipa Guedel"],
  ["proceduresOralCavityAspiration", "12 - Aspirare cavitate bucală"],
  ["proceduresIotWithInduction", "14 - IOT cu inducție"],
  ["proceduresIotWithoutInduction", "15 - IOT fără inducție"],
  ["proceduresIntWithInduction", "16 - INT cu inducție"],
  ["proceduresCombitube", "17 - Combitub"],
  ["proceduresLaryngealMask", "18 - Mască laringiană"],
  ["proceduresNeedleThoracicDecompression", "19 - Decompresie toracică pe ac"],
];

function CheckboxWithValue({
  checked,
  onCheckedChange,
  value,
  onValueChange,
  label,
  placeholder,
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />{" "}
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: 8 }}
      />
    </div>
  );
}

export default function ProceduresSection({ preform, setPreform }) {
  return (
    <div style={boxStyle}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>
        MANEVRE / PROCEDURI
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <CheckboxWithValue
            label="10 - O2 mască (l/min)"
            checked={preform.proceduresO2Mask}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresO2Mask: value })
            }
            value={preform.proceduresO2MaskValue}
            onValueChange={(value) =>
              setPreform({ ...preform, proceduresO2MaskValue: value })
            }
            placeholder="l/min"
          />

          <CheckboxWithValue
            label="13 - Aspirare pe sondă IOT (ml)"
            checked={preform.proceduresIotTubeAspiration}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresIotTubeAspiration: value })
            }
            value={preform.proceduresIotTubeAspirationValue}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresIotTubeAspirationValue: value,
              })
            }
            placeholder="ml"
          />

          {procedureCheckboxes.map(([field, label]) => (
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

        <div style={{ display: "grid", gap: 8 }}>
          <CheckboxWithValue
            label="20 - Drenaj toracic"
            checked={preform.proceduresChestDrain}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresChestDrain: value })
            }
            value={preform.proceduresChestDrainValue}
            onValueChange={(value) =>
              setPreform({ ...preform, proceduresChestDrainValue: value })
            }
            placeholder="Detalii"
          />

          {[
            ["proceduresVenousAccess", "Acces venos"],
            ["proceduresIntraosseousAccess", "Acces intraosos"],
            ["proceduresFluidResuscitation", "Perfuzie / resuscitare volemică"],
            ["proceduresImmobilization", "Imobilizare"],
            ["proceduresCervicalCollar", "Guler cervical"],
            ["proceduresSplint", "Atelă"],
            ["proceduresBandage", "Pansament"],
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

        <div style={{ display: "grid", gap: 8 }}>
          {[
            ["proceduresEcg", "EKG"],
            ["proceduresDefibrillation", "Defibrilare"],
            ["proceduresCardiacMassage", "Masaj cardiac extern"],
            ["proceduresMedication", "Medicație administrată"],
            ["proceduresMonitoring", "Monitorizare"],
            ["proceduresOther", "Alte proceduri"],
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

          <label>
            Observații proceduri
            <textarea
              value={preform.proceduresObservations || ""}
              onChange={(e) =>
                setPreform({
                  ...preform,
                  proceduresObservations: e.target.value,
                })
              }
              rows={4}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 14,
  background: "#ffffff",
  boxSizing: "border-box",
};