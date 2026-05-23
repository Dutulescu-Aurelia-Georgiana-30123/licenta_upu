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
          checked={preform.noseNormal}
          onChange={(v) => setPreform({ ...preform, noseNormal: v })}
        />

        <CheckboxGrid
          preform={preform}
          setPreform={setPreform}
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
        </div>
      </div>

      <div style={boxStyle}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>NEURO-PSIHIC</div>

        <CheckboxGrid
          preform={preform}
          setPreform={setPreform}
          columns={3}
          items={[
            ["neuroPsychNormal", "230 - Normal"],
            ["neuroPsychConfusion", "231 - Confuzie"],
            ["neuroPsychComa", "232 - Comă"],
            ["neuroPsychAgitation", "233 - Agitație"],
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