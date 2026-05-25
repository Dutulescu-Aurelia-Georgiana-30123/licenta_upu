import CheckboxField from "../../CheckboxField";

const checkboxItems = [
  ["proceduresGuedelCannula", "11 - Pipa Guedel"],
  ["proceduresOralCavityAspiration", "12 - Aspirare cavitate bucală"],
  ["proceduresIotWithInduction", "14 - IOT cu inducție"],
  ["proceduresIotWithoutInduction", "15 - IOT fără inducție"],
  ["proceduresIntWithInduction", "16 - INT cu inducție"],
  ["proceduresCombitube", "17 - Combitub"],
  ["proceduresLaryngealMask", "18 - Mască laringiană"],
  ["proceduresNeedleThoracicDecompression", "19 - Decompresie toracică pe ac"],
  ["proceduresMiniCricothyrotomy", "21 - Minicricotirostomie"],
  ["proceduresTracheostomy", "22 - Traheostomie"],
  ["proceduresNonInvasiveVentilation", "23 - Ventilație noninvazivă"],
  ["proceduresMechanicalVentilation", "24 - Ventilație mecanică"],
  ["proceduresPvcMeasurement", "28 - Măsurare PVC"],
  ["proceduresArterialAccess", "29 - Acces arterial"],
  ["proceduresIntramuscularInjection", "30 - Injecție intramusculară"],
  ["proceduresSubcutaneousInjection", "31 - Injecție subcutanată"],
  ["proceduresIntradermalInjection", "32 - Injecție intradermică"],
  ["proceduresIntranasalAdministration", "33 - Administrare intranazală"],
  ["proceduresNebulization", "34 - Nebulizare"],
  ["proceduresExternalChestCompressions", "35 - Compresiuni toracice externe"],
  ["proceduresInvasiveBpMeasurement", "36 - Măsurare TA invazivă"],
  ["proceduresEkgMonitoring", "37 - Monitorizare EKG"],
  ["proceduresO2SatMonitoring", "38 - Monitorizare Sat O2"],
  ["proceduresCapnometry", "39 - Capnometrie"],
  ["proceduresManualDefibrillation", "41 - Defibrilare manuală"],
  ["proceduresAutomaticDefibrillation", "42 - Defibrilare automată"],
  ["proceduresCardioversion", "44 - Cardioversie"],
  ["proceduresPericardialPuncture", "48 - Puncție pericardică"],
  ["proceduresPeritonealDiagnosticLavage", "49 - Lavaj peritoneal"],
  ["proceduresPassiveRewarming", "50 - Reîncălzire pasivă"],
  ["proceduresActiveRewarming", "51 - Reîncălzire activă"],
  ["proceduresCervicalCollar", "55 - Guler cervical"],
  ["proceduresScoopStretcher", "56 - Targă cu lopeți"],
  ["proceduresSpineBoard", "57 - Targă coloană"],
  ["proceduresLimbImmobilization", "58 - Imobilizare membre"],
  ["proceduresCastDevice", "60 - Aparat gipsat"],
  ["proceduresSuture", "61 - Sutură"],
  ["proceduresMessage", "62 - Mesaj"],
  ["proceduresWoundCleaning", "63 - Toaletă plagă"],
  ["proceduresNasalPacking", "64 - Tamponament nazal"],
  ["proceduresShortSedation", "65 - Sedare de scurtă durată"],
  ["proceduresProceduralSedation", "66 - Sedare procedurală"],
  ["proceduresLongSedation", "67 - Sedare de lungă durată"],
  ["proceduresAnalgosedation", "68 - Analgosedare"],
  ["proceduresLocalAnesthesia", "69 - Anestezie locală"],
  ["proceduresShortIvAnesthesia", "70 - Anestezie de scurtă durată"],
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
          checked={checked || false}
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

function ProcedureCheckbox({ preform, setPreform, field, label }) {
  return (
    <CheckboxField
      label={label}
      checked={preform[field]}
      onChange={(value) => setPreform({ ...preform, [field]: value })}
    />
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
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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

          <ProcedureCheckbox
            preform={preform}
            setPreform={setPreform}
            field="proceduresGuedelCannula"
            label="11 - Pipa Guedel"
          />

          <ProcedureCheckbox
            preform={preform}
            setPreform={setPreform}
            field="proceduresOralCavityAspiration"
            label="12 - Aspirare cavitate bucală"
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

          {checkboxItems.slice(2, 18).map(([field, label]) => (
            <ProcedureCheckbox
              key={field}
              preform={preform}
              setPreform={setPreform}
              field={field}
              label={label}
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

          <CheckboxWithValue
            label="25 - Acces venos periferic"
            checked={preform.proceduresPeripheralVenousAccess}
            onCheckedChange={(value) =>
              setPreform({
                ...preform,
                proceduresPeripheralVenousAccess: value,
              })
            }
            value={preform.proceduresPeripheralVenousAccessCount}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresPeripheralVenousAccessCount: value,
              })
            }
            placeholder="Nr. / detalii"
          />

          <CheckboxWithValue
            label="26 - Acces intraosos"
            checked={preform.proceduresIntraosseousAccess}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresIntraosseousAccess: value })
            }
            value={preform.proceduresIntraosseousAccessCount}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresIntraosseousAccessCount: value,
              })
            }
            placeholder="Nr. / detalii"
          />

          <CheckboxWithValue
            label="27 - Acces venos central"
            checked={preform.proceduresCentralVenousAccess}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresCentralVenousAccess: value })
            }
            value={preform.proceduresCentralVenousAccessValue}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresCentralVenousAccessValue: value,
              })
            }
            placeholder="Detalii"
          />

          {checkboxItems.slice(18, 34).map(([field, label]) => (
            <ProcedureCheckbox
              key={field}
              preform={preform}
              setPreform={setPreform}
              field={field}
              label={label}
            />
          ))}

          <CheckboxWithValue
            label="46 - PM transcutanat"
            checked={preform.proceduresTranscutaneousPm}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresTranscutaneousPm: value })
            }
            value={preform.proceduresTranscutaneousPmValue}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresTranscutaneousPmValue: value,
              })
            }
            placeholder="Detalii"
          />

          <CheckboxWithValue
            label="47 - PM transvenos"
            checked={preform.proceduresTransvenousPm}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresTransvenousPm: value })
            }
            value={preform.proceduresTransvenousPmValue}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresTransvenousPmValue: value,
              })
            }
            placeholder="Detalii"
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <CheckboxWithValue
            label="52 - Lavaj gastric"
            checked={preform.proceduresGastricLavage}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresGastricLavage: value })
            }
            value={preform.proceduresGastricLavageValue}
            onValueChange={(value) =>
              setPreform({ ...preform, proceduresGastricLavageValue: value })
            }
            placeholder="Detalii"
          />

          <CheckboxWithValue
            label="53 - Sondă nazogastrică"
            checked={preform.proceduresNasogastricTube}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresNasogastricTube: value })
            }
            value={preform.proceduresNasogastricTubeValue}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresNasogastricTubeValue: value,
              })
            }
            placeholder="Detalii"
          />

          <CheckboxWithValue
            label="54 - Sondă vezică urinară"
            checked={preform.proceduresUrinaryCatheter}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresUrinaryCatheter: value })
            }
            value={preform.proceduresUrinaryCatheterValue}
            onValueChange={(value) =>
              setPreform({
                ...preform,
                proceduresUrinaryCatheterValue: value,
              })
            }
            placeholder="Detalii"
          />

          <CheckboxWithValue
            label="59 - Atelă"
            checked={preform.proceduresSplint}
            onCheckedChange={(value) =>
              setPreform({ ...preform, proceduresSplint: value })
            }
            value={preform.proceduresSplintValue}
            onValueChange={(value) =>
              setPreform({ ...preform, proceduresSplintValue: value })
            }
            placeholder="Detalii"
          />

          {checkboxItems.slice(34).map(([field, label]) => (
            <ProcedureCheckbox
              key={field}
              preform={preform}
              setPreform={setPreform}
              field={field}
              label={label}
            />
          ))}

          <label>
            Alte proceduri
            <input
              value={preform.proceduresOther || ""}
              onChange={(e) =>
                setPreform({ ...preform, proceduresOther: e.target.value })
              }
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

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