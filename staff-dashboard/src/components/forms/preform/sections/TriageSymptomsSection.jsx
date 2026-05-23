import CheckboxField from "../../CheckboxField";

const symptomGroups = [
  {
    title: "General",
    items: [
      ["triageFever", "16 - Febră"],
      ["triageAsthenia", "17 - Astenie"],
      ["triageDizziness", "18 - Amețeli"],
    ],
  },
  {
    title: "Ochi",
    columns: 2,
    items: [
      ["eyeAcuteVisionLoss", "66 - Pierdere acută a vederii"],
      ["eyeVisionDisorders", "67 - Tulburări de vedere"],
      ["eyeForeignBody", "68 - Corp străin intraocular"],
      ["eyeOtherManifestations", "69 - Alte manifestări oculare"],
    ],
  },
  {
    title: "Arsuri",
    items: [
      ["burnAirwayAffected", "19 - Căi respiratorii afectate"],
      ["burnFlame", "20 - Flacără"],
      ["burnSolid", "21 - Solid"],
      ["burnLiquid", "22 - Lichid"],
      ["burnVaporsGas", "23 - Vapori/gaz"],
      ["burnChemical", "24 - Chimic"],
    ],
  },
  {
    title: "Torace - respirație",
    items: [
      ["chestPain", "111 - Durere toracică"],
      ["dyspnea", "112 - Dispnee"],
      ["hemoptysis", "113 - Hemoptizie"],
      ["cough", "114 - Tuse"],
      ["expectoration", "115 - Expectorație"],
    ],
  },
  {
    title: "Psihiatric",
    items: [
      ["psychDepression", "246 - Depresie"],
      ["psychBehaviorDisorder", "247 - Tulburări de comportament"],
      ["psychSuicide", "248 - Suicid"],
      ["psychHallucinations", "225 - Halucinații"],
      ["psychDelirium", "226 - Delir"],
    ],
  },
  {
    title: "Gastrointestinal",
    items: [
      ["giNausea", "132 - Greață"],
      ["giVomiting", "133 - Vomă"],
      ["giTransitDisorders", "134 - Tulburări tranzit"],
      ["giRectorrhagia", "135 - Rectoragie"],
      ["giMelena", "136 - Melenă"],
      ["giHematemesis", "137 - Hematemeză"],
      ["giAbdominalPain", "138 - Dureri abdominale"],
    ],
  },
  {
    title: "Neurologic",
    columns: 2,
    items: [
      ["neuroConvulsions", "237 - Convulsii"],
      ["neuroMyoclonus", "236 - Mioclonii"],
      ["neuroHeadache", "249 - Cefalee"],
      ["neuroParalysis", "250 - Paralizie"],
    ],
  },
  {
    title: "Genito-urinar",
    items: [
      ["guUrinationDisorders", "178 - Tulburări micționale"],
      ["guDysuria", "179 - Disurie"],
      ["guPollakiuria", "180 - Polakiurie"],
      ["guOliguria", "181 - Oligurie"],
      ["guHematuria", "177 - Hematurie"],
      ["guVaginalBleeding", "182 - Sângerare vaginală"],
      ["guPregnancy", "183 - Sarcină"],
    ],
  },
  {
    title: "Tegumente",
    items: [
      ["skinWarm", "141 - Calde"],
      ["skinCold", "142 - Reci"],
      ["skinWet", "143 - Umede"],
      ["skinPale", "151 - Palide"],
      ["skinCyanotic", "152 - Cianotice"],
      ["skinJaundice", "149 - Icterice"],
      ["skinEcchymosis", "146 - Echimoze"],
      ["skinRash", "154 - Erupții"],
      ["skinPruritus", "144 - Prurit"],
      ["skinBurns", "155 - Arsuri"],
    ],
  },
  {
    title: "Aparat locomotor",
    items: [
      ["locomotorInflammation", "211 - Inflamație"],
      ["locomotorSwelling", "205 - Tumefacție"],
      ["locomotorPain", "204 - Durere"],
      ["locomotorFunctionalImpairment", "207 - Impotență funcțională"],
      ["locomotorHematoma", "246 - Hematom"],
    ],
  },
];

export default function TriageSymptomsSection({ preform, setPreform }) {
  return (
    <>
      <div style={{ fontWeight: 700 }}>Triaj</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <label>
          14 - Înălțime (cm)
          <input
            value={preform.heightCm}
            onChange={(e) =>
              setPreform({ ...preform, heightCm: e.target.value })
            }
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          15 - Greutate (kg)
          <input
            value={preform.weightKg}
            onChange={(e) =>
              setPreform({ ...preform, weightKg: e.target.value })
            }
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>
      </div>

      {symptomGroups.map((group) => (
        <div key={group.title}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            {group.title}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${group.columns || 3}, 1fr)`,
              gap: 10,
            }}
          >
            {group.items.map(([field, label]) => (
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
        </div>
      ))}
    </>
  );
}