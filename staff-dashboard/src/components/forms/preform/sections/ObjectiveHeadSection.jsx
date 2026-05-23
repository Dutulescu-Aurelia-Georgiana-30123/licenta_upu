import CheckboxField from "../../CheckboxField";
import TextField from "../../TextField";
import LrCheckboxRow from "../../LrCheckboxRow";

export default function ObjectiveHeadSection({ preform, setPreform }) {
  return (
    <>
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
                onChange={() =>
                  setPreform({ ...preform, objectiveGeneralState: value })
                }
              />{" "}
              {label}
            </label>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <div style={boxStyle}>
          <div style={titleStyle}>CAP</div>

          <div style={{ display: "grid", gap: 8 }}>
            <CheckboxField
              label="30 - Normal"
              checked={preform.headNormal}
              onChange={(v) => setPreform({ ...preform, headNormal: v })}
            />

            <CheckboxField
              label="31 - Marcă traumatică"
              checked={preform.headTraumaMark}
              onChange={(v) => setPreform({ ...preform, headTraumaMark: v })}
            />

            <CheckboxField
              label="32 - Leziuni cav. bucală"
              checked={preform.headOralLesions}
              onChange={(v) =>
                setPreform({ ...preform, headOralLesions: v })
              }
            />

            <CheckboxField
              label="33 - Leziuni dentare"
              checked={preform.headDentalLesions}
              onChange={(v) =>
                setPreform({ ...preform, headDentalLesions: v })
              }
            />
          </div>
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>GÂT</div>

          <div style={{ display: "grid", gap: 8 }}>
            <CheckboxField
              label="34 - Normal"
              checked={preform.neckNormal}
              onChange={(v) => setPreform({ ...preform, neckNormal: v })}
            />

            <CheckboxField
              label="35 - Marcă traumatică"
              checked={preform.neckTraumaMark}
              onChange={(v) =>
                setPreform({ ...preform, neckTraumaMark: v })
              }
            />

            <CheckboxField
              label="36 - Formațiuni palpabile"
              checked={preform.neckPalpableFormations}
              onChange={(v) =>
                setPreform({ ...preform, neckPalpableFormations: v })
              }
            />

            <TextField
              label="Alte"
              value={preform.neckOther}
              onChange={(v) => setPreform({ ...preform, neckOther: v })}
            />
          </div>
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>NAS</div>

          <CheckboxField
            label="NORMAL"
            checked={preform.noseNostrilsNormal && preform.noseMucosaNormal}
            onChange={(v) =>
              setPreform({
                ...preform,
                noseNostrilsNormal: v,
                noseMucosaNormal: v,
              })
            }
          />

          <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
            <CheckboxField
              label="38 - Nări"
              checked={preform.noseNostrilsNormal}
              onChange={(v) =>
                setPreform({ ...preform, noseNostrilsNormal: v })
              }
            />

            <CheckboxField
              label="39 - Mucoasa nazală"
              checked={preform.noseMucosaNormal}
              onChange={(v) =>
                setPreform({ ...preform, noseMucosaNormal: v })
              }
            />

            <TextField
              label="Alte"
              value={preform.noseOther}
              onChange={(v) => setPreform({ ...preform, noseOther: v })}
            />
          </div>

          <div style={{ display: "grid", gap: 10, width: "100%" }}>
            <LrCheckboxRow
              label="40 - Epistaxis - 41"
              leftChecked={preform.noseEpistaxisLeft}
              rightChecked={preform.noseEpistaxisRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, noseEpistaxisLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, noseEpistaxisRight: v })
              }
            />

            <LrCheckboxRow
              label="42 - Corpi străini - 43"
              leftChecked={preform.noseForeignBodyLeft}
              rightChecked={preform.noseForeignBodyRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, noseForeignBodyLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, noseForeignBodyRight: v })
              }
            />

            <LrCheckboxRow
              label="44 - Traumă - 44'"
              leftChecked={preform.noseTraumaLeft}
              rightChecked={preform.noseTraumaRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, noseTraumaLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, noseTraumaRight: v })
              }
            />
          </div>
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>APARAT AUDITIV</div>

          <CheckboxField
            label="NORMAL"
            checked={
              preform.earTympanicMembraneNormal &&
              preform.earExternalCanalsNormal &&
              preform.earAuricleNormal
            }
            onChange={(v) =>
              setPreform({
                ...preform,
                earTympanicMembraneNormal: v,
                earExternalCanalsNormal: v,
                earAuricleNormal: v,
              })
            }
          />

          <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
            <CheckboxField
              label="45 - Membrana timpanică"
              checked={preform.earTympanicMembraneNormal}
              onChange={(v) =>
                setPreform({ ...preform, earTympanicMembraneNormal: v })
              }
            />

            <CheckboxField
              label="46 - Căi auditive externe"
              checked={preform.earExternalCanalsNormal}
              onChange={(v) =>
                setPreform({ ...preform, earExternalCanalsNormal: v })
              }
            />

            <CheckboxField
              label="47 - Pavilionul urechii"
              checked={preform.earAuricleNormal}
              onChange={(v) =>
                setPreform({ ...preform, earAuricleNormal: v })
              }
            />

            <TextField
              label="Alte"
              value={preform.earOther}
              onChange={(v) => setPreform({ ...preform, earOther: v })}
            />
          </div>

          <div style={{ display: "grid", gap: 10, width: "100%" }}>
            <LrCheckboxRow
              label="48 - Otoragie - 49"
              leftChecked={preform.earOtorrhagiaLeft}
              rightChecked={preform.earOtorrhagiaRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, earOtorrhagiaLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, earOtorrhagiaRight: v })
              }
            />

            <LrCheckboxRow
              label="50 - Corpi străini - 51"
              leftChecked={preform.earForeignBodyLeft}
              rightChecked={preform.earForeignBodyRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, earForeignBodyLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, earForeignBodyRight: v })
              }
            />

            <LrCheckboxRow
              label="52 - Hemotimpan - 53"
              leftChecked={preform.earHemotympanumLeft}
              rightChecked={preform.earHemotympanumRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, earHemotympanumLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, earHemotympanumRight: v })
              }
            />

            <LrCheckboxRow
              label="Traumă"
              leftChecked={preform.earTraumaLeft}
              rightChecked={preform.earTraumaRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, earTraumaLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, earTraumaRight: v })
              }
            />
          </div>
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>OCHI</div>

          <CheckboxField
            label="NORMAL"
            checked={preform.eyeMobilityNormal && preform.eyePupilsNormal}
            onChange={(v) =>
              setPreform({
                ...preform,
                eyeMobilityNormal: v,
                eyePupilsNormal: v,
              })
            }
          />

          <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
            <CheckboxField
              label="54 - Mobilitate globi oculari"
              checked={preform.eyeMobilityNormal}
              onChange={(v) =>
                setPreform({ ...preform, eyeMobilityNormal: v })
              }
            />

            <CheckboxField
              label="55 - Pupile"
              checked={preform.eyePupilsNormal}
              onChange={(v) =>
                setPreform({ ...preform, eyePupilsNormal: v })
              }
            />

            <TextField
              label="Alte"
              value={preform.eyeExamOther}
              onChange={(v) => setPreform({ ...preform, eyeExamOther: v })}
            />
          </div>

          <div style={{ display: "grid", gap: 10, width: "100%" }}>
            <LrCheckboxRow
              label="56 - Conjunctivite - 57"
              leftChecked={preform.eyeConjunctivitisLeft}
              rightChecked={preform.eyeConjunctivitisRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, eyeConjunctivitisLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, eyeConjunctivitisRight: v })
              }
            />

            <LrCheckboxRow
              label="58 - Midriază - 59"
              leftChecked={preform.eyeMydriasisLeft}
              rightChecked={preform.eyeMydriasisRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, eyeMydriasisLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, eyeMydriasisRight: v })
              }
            />

            <LrCheckboxRow
              label="60 - Mioză - 61"
              leftChecked={preform.eyeMiosisLeft}
              rightChecked={preform.eyeMiosisRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, eyeMiosisLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, eyeMiosisRight: v })
              }
            />

            <LrCheckboxRow
              label="62 - Nistagmus - 63"
              leftChecked={preform.eyeNystagmusLeft}
              rightChecked={preform.eyeNystagmusRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, eyeNystagmusLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, eyeNystagmusRight: v })
              }
            />

            <LrCheckboxRow
              label="64 - Deviere gl. oc. - 65"
              leftChecked={preform.eyeDeviationLeft}
              rightChecked={preform.eyeDeviationRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, eyeDeviationLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, eyeDeviationRight: v })
              }
            />

            <LrCheckboxRow
              label="247 - Traumă - 248"
              leftChecked={preform.eyeTraumaExamLeft}
              rightChecked={preform.eyeTraumaExamRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, eyeTraumaExamLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, eyeTraumaExamRight: v })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

const boxStyle = {
  border: "1px solid #333",
  borderRadius: 8,
  padding: 12,
};

const titleStyle = {
  fontWeight: 700,
  marginBottom: 8,
};