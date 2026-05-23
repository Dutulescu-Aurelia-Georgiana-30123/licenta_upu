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

const darkBoxStyle = {
  border: "1px solid #333",
  borderRadius: 8,
  padding: 12,
};

const titleStyle = {
  fontWeight: 700,
  marginBottom: 10,
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

export default function ObjectiveTorsoSection({ preform, setPreform }) {
  return (
    <>
      <div style={darkBoxStyle}>
        <div style={titleStyle}>APARAT CARDIOVASCULAR</div>

        <CheckboxGrid
          columns={2}
          preform={preform}
          setPreform={setPreform}
          items={[
            ["cvRhythmNormal", "70 - Ritm cardiac"],
            ["cvJugularTurgor", "78 - Jugulare turgesc."],
            ["cvPeripheralPulseNormal", "71 - Puls periferic"],
            ["cvSystolicMurmur", "79 - Suflu sistolic"],
            ["cvHeartAuscultationNormal", "72 - Ascultația cordului"],
            ["cvDiastolicMurmur", "80 - Suflu diastolic"],
            ["cvIrregularPulse", "73 - Puls neregulat"],
            ["cvAorticMurmur", "81 - Suflu aortic"],
            ["cvFiliformPeripheralPulse", "74 - Puls perif. filiform"],
            ["cvGallop", "86 - Galop"],
            ["cvPulseDeficit", "75 - Deficit de puls"],
            ["cvCarotidMurmur", "83 - Suflu carotidian"],
            ["cvArrhythmicSounds", "76 - Zgomote aritmice"],
            ["cvMuffledSounds", "77 - Zgomote asurzite"],
            ["cvPericardialRub", "85 - Frecătură"],
          ]}
        />

        <div style={{ marginTop: 12 }}>
          <TextField
            label="Observații"
            value={preform.cvObservations}
            onChange={(v) => setPreform({ ...preform, cvObservations: v })}
          />
        </div>
      </div>

      <div style={{ ...darkBoxStyle, gridColumn: "1 / -1" }}>
        <div style={titleStyle}>TORACE / APARAT RESPIRATOR</div>

        <CheckboxField
          label="NORMAL"
          checked={
            preform.respThoraxAspectNormal &&
            preform.respThoraxPercussionNormal &&
            preform.respVesicularBilateralNormal &&
            preform.respOropharynxNormal
          }
          onChange={(v) =>
            setPreform({
              ...preform,
              respThoraxAspectNormal: v,
              respThoraxPercussionNormal: v,
              respVesicularBilateralNormal: v,
              respOropharynxNormal: v,
            })
          }
        />

        <CheckboxGrid
          columns={2}
          preform={preform}
          setPreform={setPreform}
          items={[
            ["respThoraxAspectNormal", "90 - Aspectul toracelui"],
            ["respThoraxPercussionNormal", "91 - Percuția toracelui"],
            ["respVesicularBilateralNormal", "92 - Murmur vezicular bilat."],
            ["respOropharynxNormal", "93 - Orofaringe"],
          ]}
        />

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <div style={{ display: "grid", gap: 10, width: "100%" }}>
            <LrCheckboxRow
              label="94 - Murmur vezicular diminuat - 95"
              leftChecked={preform.respDiminishedMurmurLeft}
              rightChecked={preform.respDiminishedMurmurRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respDiminishedMurmurLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respDiminishedMurmurRight: v })
              }
            />

            <LrCheckboxRow
              label="96 - Murmur vezicular absent - 95"
              leftChecked={preform.respAbsentMurmurLeft}
              rightChecked={preform.respAbsentMurmurRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respAbsentMurmurLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respAbsentMurmurRight: v })
              }
            />

            <LrCheckboxRow
              label="94 - Raluri sibilante - 97"
              leftChecked={preform.respWheezingRalesLeft}
              rightChecked={preform.respWheezingRalesRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respWheezingRalesLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respWheezingRalesRight: v })
              }
            />

            <LrCheckboxRow
              label="100 - Raluri crepitante - 101"
              leftChecked={preform.respCrepitantRalesLeft}
              rightChecked={preform.respCrepitantRalesRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respCrepitantRalesLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respCrepitantRalesRight: v })
              }
            />

            <LrCheckboxRow
              label="102 - Raluri subcrepitante - 103"
              leftChecked={preform.respSubcrepitantRalesLeft}
              rightChecked={preform.respSubcrepitantRalesRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respSubcrepitantRalesLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respSubcrepitantRalesRight: v })
              }
            />
          </div>

          <div style={{ display: "grid", gap: 10, width: "100%" }}>
            <LrCheckboxRow
              label="104 - Tiraj intercost/supraclavic - 105"
              leftChecked={preform.respIntercostalRetractionLeft}
              rightChecked={preform.respIntercostalRetractionRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respIntercostalRetractionLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respIntercostalRetractionRight: v })
              }
            />

            <LrCheckboxRow
              label="106 - Emfizem subcutanat - 107"
              leftChecked={preform.respSubcutaneousEmphysemaLeft}
              rightChecked={preform.respSubcutaneousEmphysemaRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respSubcutaneousEmphysemaLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respSubcutaneousEmphysemaRight: v })
              }
            />

            <LrCheckboxRow
              label="108 - Trahee deviată - 109"
              leftChecked={preform.respTracheaDeviationLeft}
              rightChecked={preform.respTracheaDeviationRight}
              onLeftChange={(v) =>
                setPreform({ ...preform, respTracheaDeviationLeft: v })
              }
              onRightChange={(v) =>
                setPreform({ ...preform, respTracheaDeviationRight: v })
              }
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

      <div style={boxStyle}>
        <div style={titleStyle}>ABDOMEN</div>

        <CheckboxField
          label="NORMAL"
          checked={preform.abdomenNormal}
          onChange={(v) => setPreform({ ...preform, abdomenNormal: v })}
        />

        <CheckboxGrid
          columns={3}
          preform={preform}
          setPreform={setPreform}
          items={[
            ["abdomenPalpation", "120 - Palpare"],
            ["abdomenPercussion", "121 - Percuție"],
            ["abdomenBowelTransit", "122 - Tranzit intest."],
            ["abdomenRectalExam", "123 - Tuseu rectal"],
            ["abdomenDistended", "124 - Abd. destins"],
            ["abdomenTransitAbsent", "125 - Tranzit absent"],
            ["abdomenHepatomegaly", "126 - Hepatomegalie"],
            ["abdomenSplenomegaly", "127 - Splenomegalie"],
            ["abdomenPalpableMass", "128 - Formațiune palpabilă"],
            ["abdomenTenderness", "129 - Sensibil la palpare"],
            ["abdomenRectalPositive", "130 - Tuseu rectal pozitiv"],
            ["abdomenPeritonealIrritation", "131 - Iritație peritoneală"],
          ]}
        />

        <div style={{ marginTop: 12 }}>
          <TextField
            label="Observații"
            value={preform.abdomenObservations}
            onChange={(v) =>
              setPreform({ ...preform, abdomenObservations: v })
            }
          />
        </div>
      </div>

      <div style={boxStyle}>
        <div style={titleStyle}>TEGUMENT</div>

        <CheckboxGrid
          columns={3}
          preform={preform}
          setPreform={setPreform}
          items={[
            ["skinExamNormal", "140 - Normal"],
            ["skinExamWarm", "141 - Cald"],
            ["skinExamCold", "142 - Rece"],
            ["skinExamWet", "143 - Umed"],
            ["skinExamDry", "37 - Uscat"],
            ["skinExamPruritus", "144 - Prurit"],
            ["skinExamExcoriations", "145 - Escoriații"],
            ["skinExamEcchymosis", "146 - Echimoze"],
            ["skinExamPetechiae", "147 - Peteșii"],
            ["skinExamPurpura", "148 - Purpură"],
            ["skinExamJaundice", "149 - Icter"],
            ["skinExamWounds", "150 - Plăgi"],
            ["skinExamPale", "151 - Palid"],
            ["skinExamCyanosis", "152 - Cianoză"],
            ["skinExamSweaty", "153 - Transpirat"],
          ]}
        />

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <TextField
            label="Localizare"
            value={preform.skinExamLocation}
            onChange={(v) =>
              setPreform({ ...preform, skinExamLocation: v })
            }
          />
        </div>
      </div>

      <div style={boxStyle}>
        <div style={titleStyle}>GENITO URINAR</div>

        <CheckboxField
          label="NORMAL"
          checked={preform.guExamNormal}
          onChange={(v) => setPreform({ ...preform, guExamNormal: v })}
        />

        <CheckboxGrid
          columns={3}
          preform={preform}
          setPreform={setPreform}
          items={[
            ["guExternalGenitals", "160 - Organe genitale externe"],
            ["guRegularMenstruation", "161 - Menstruație regulată"],
            ["guRectalExam", "162 - Tuseu rectal"],
          ]}
        />

        <div style={{ marginTop: 12 }}>
          <TextField
            label="163 - Data ult. menstruație"
            value={preform.guLastMenstruationDate}
            onChange={(v) =>
              setPreform({ ...preform, guLastMenstruationDate: v })
            }
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <CheckboxGrid
            columns={2}
            preform={preform}
            setPreform={setPreform}
            items={[
              [
                "guBloodyVaginalDischarge",
                "164 - Scurgeri vaginale sanguinolente",
              ],
              ["guLeucorrhea", "165 - Leucoree"],
              ["guCervixSensitivity", "166 - Sensibilitatea colului"],
              ["guEnlargedUterus", "167 - Uter mărit"],
              ["guLateroUterineMass", "168 - Formațiune latero-uterină"],
              ["guExamHematuria", "177 - Hematurie"],
            ]}
          />
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <LrCheckboxRow
            label="169 - Giordano pozitiv - 170"
            leftChecked={preform.guGiordanoLeft}
            rightChecked={preform.guGiordanoRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, guGiordanoLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, guGiordanoRight: v })
            }
          />

          <LrCheckboxRow
            label="171 - Tumefiere testicul - 172"
            leftChecked={preform.guTesticularSwellingLeft}
            rightChecked={preform.guTesticularSwellingRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, guTesticularSwellingLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, guTesticularSwellingRight: v })
            }
          />

          <LrCheckboxRow
            label="173 - Durere testicul - 174"
            leftChecked={preform.guTesticularPainLeft}
            rightChecked={preform.guTesticularPainRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, guTesticularPainLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, guTesticularPainRight: v })
            }
          />

          <LrCheckboxRow
            label="175 - Formațiune mamară - 176"
            leftChecked={preform.guBreastMassLeft}
            rightChecked={preform.guBreastMassRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, guBreastMassLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, guBreastMassRight: v })
            }
          />

          <LrCheckboxRow
            label="249 - Traumă - 250"
            leftChecked={preform.guTraumaLeft}
            rightChecked={preform.guTraumaRight}
            onLeftChange={(v) =>
              setPreform({ ...preform, guTraumaLeft: v })
            }
            onRightChange={(v) =>
              setPreform({ ...preform, guTraumaRight: v })
            }
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <TextField
            label="Alte"
            value={preform.guExamOther}
            onChange={(v) => setPreform({ ...preform, guExamOther: v })}
          />
        </div>
      </div>
    </>
  );
}