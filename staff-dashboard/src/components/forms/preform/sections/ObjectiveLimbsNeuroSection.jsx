import CheckboxField from "../../CheckboxField";
import TextField from "../../TextField";
import LrCheckboxRow from "../../LrCheckboxRow";

const boxStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 14,
  background: "#ffffff",
  boxSizing: "border-box",
};

function CheckboxGrid({ items, columns = 3, preform, setPreform }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
      }}
    >
      {items.map(([field, label]) => (
        <CheckboxField
          key={field}
          label={label}
          checked={preform[field]}
          onChange={(v) => setPreform({ ...preform, [field]: v })}
        />
      ))}
    </div>
  );
}

export default function ObjectiveLimbsNeuroSection({ preform, setPreform }) {
  return (
    <>
      <div style={boxStyle}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>AP. LOCOMOTOR</div>

        <CheckboxField
          label="NORMAL"
          checked={preform.locomotorExamNormal}
          onChange={(v) => setPreform({ ...preform, locomotorExamNormal: v })}
        />

        <CheckboxGrid
          preform={preform}
          setPreform={setPreform}
          columns={3}
          items={[
            ["locomotorHead", "190 - Cap"],
            ["locomotorNeck", "191 - Gât"],
            ["locomotorTrunk", "192 - Trunchi"],
            ["locomotorUpperLimbs", "193 - Membre superioare"],
            ["locomotorLowerLimbs", "194 - Membre inferioare"],
          ]}
        />

        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <LrCheckboxRow
            label="251 - Carotidă - 252"
            leftChecked={preform.locomotorPulseCarotidLeft}
            rightChecked={preform.locomotorPulseCarotidRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, locomotorPulseCarotidLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, locomotorPulseCarotidRight: v })
            }
          />

          <LrCheckboxRow
            label="194 - Brahială - 195"
            leftChecked={preform.locomotorPulseBrachialLeft}
            rightChecked={preform.locomotorPulseBrachialRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, locomotorPulseBrachialLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, locomotorPulseBrachialRight: v })
            }
          />

          <LrCheckboxRow
            label="196 - Radială - 197"
            leftChecked={preform.locomotorPulseRadialLeft}
            rightChecked={preform.locomotorPulseRadialRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, locomotorPulseRadialLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, locomotorPulseRadialRight: v })
            }
          />

          <LrCheckboxRow
            label="198 - Femurală - 199"
            leftChecked={preform.locomotorPulseFemoralLeft}
            rightChecked={preform.locomotorPulseFemoralRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, locomotorPulseFemoralLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, locomotorPulseFemoralRight: v })
            }
          />

          <LrCheckboxRow
            label="200 - Poplitee - 201"
            leftChecked={preform.locomotorPulsePoplitealLeft}
            rightChecked={preform.locomotorPulsePoplitealRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, locomotorPulsePoplitealLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, locomotorPulsePoplitealRight: v })
            }
          />

          <LrCheckboxRow
            label="202 - Pedioasă - 203"
            leftChecked={preform.locomotorPulsePedialLeft}
            rightChecked={preform.locomotorPulsePedialRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, locomotorPulsePedialLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, locomotorPulsePedialRight: v })
            }
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <CheckboxGrid
            preform={preform}
            setPreform={setPreform}
            columns={2}
            items={[
              ["locomotorExamPain", "204 - Durere"],
              ["locomotorExamSwelling", "205 - Tumefiere"],
              ["locomotorExamEdema", "206 - Edem"],
              ["locomotorExamFunctionalImpairment", "207 - Impotență funcțională"],
              ["locomotorExamCyanosis", "208 - Cianoză"],
              ["locomotorExamOpenFracture", "209 - Fractură deschisă"],
              ["locomotorExamClosedFracture", "210 - Fractură închisă"],
            ]}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <TextField
            label="Observații"
            value={preform.locomotorExamObservations}
            onChange={(v) =>
              setPreform({ ...preform, locomotorExamObservations: v })
            }
          />
        </div>
      </div>

      <div style={boxStyle}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>NEURO-PSIHIC</div>

        <CheckboxGrid
          preform={preform}
          setPreform={setPreform}
          columns={3}
          items={[
            ["neuroPsychNormal", "Normal"],
            ["neuroPsychOriented", "220 - Orientat temp-sp"],
            ["neuroPsychCranialNerves", "221 - Nervi cranieni"],
            ["neuroPsychMotor", "222 - Motor"],
            ["neuroPsychSensitive", "223 - Senzitiv"],
            ["neuroPsychRot", "224 - ROT"],
            ["neuroPsychHallucinations", "225 - Halucinații"],
            ["neuroPsychDelirium", "226 - Delir"],
            ["neuroPsychBehaviorDisorders", "227 - Tulb. comp."],
            ["neuroPsychAgitated", "228 - Agitat"],
            ["neuroPsychObnubilated", "229 - Obnubilat"],
            ["neuroPsychConfused", "230 - Confuz"],
            ["neuroPsychPhotophobia", "231 - Fotofobie"],
            ["neuroPsychNeckStiffness", "232 - Redoarea cefei"],
            ["neuroPsychParesthesia", "233 - Parestezii"],
            ["neuroPsychAtaxia", "234 - Ataxie"],
            ["neuroPsychAphasia", "235 - Afazie"],
            ["neuroPsychMyoclonus", "236 - Mioclonii"],
            ["neuroPsychConvulsions", "237 - Convulsii"],
          ]}
        />

        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <LrCheckboxRow
            label="238 - Plegie - 239"
            leftChecked={preform.neuroPsychPlegiaLeft}
            rightChecked={preform.neuroPsychPlegiaRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, neuroPsychPlegiaLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, neuroPsychPlegiaRight: v })
            }
          />

          <LrCheckboxRow
            label="240 - Pareză - 241"
            leftChecked={preform.neuroPsychParesisLeft}
            rightChecked={preform.neuroPsychParesisRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, neuroPsychParesisLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, neuroPsychParesisRight: v })
            }
          />

          <LrCheckboxRow
            label="242 - Anestezie - 243"
            leftChecked={preform.neuroPsychAnesthesiaLeft}
            rightChecked={preform.neuroPsychAnesthesiaRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, neuroPsychAnesthesiaLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, neuroPsychAnesthesiaRight: v })
            }
          />

          <LrCheckboxRow
            label="244 - Babinski - 245"
            leftChecked={preform.neuroPsychBabinskiLeft}
            rightChecked={preform.neuroPsychBabinskiRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, neuroPsychBabinskiLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, neuroPsychBabinskiRight: v })
            }
          />
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <TextField
            label="Alte"
            value={preform.neuroPsychOther}
            onChange={(v) => setPreform({ ...preform, neuroPsychOther: v })}
          />

          <TextField
            label="Observații"
            value={preform.neuroPsychObservations}
            onChange={(v) =>
              setPreform({ ...preform, neuroPsychObservations: v })
            }
          />
        </div>
      </div>
    </>
  );
}