import SectionCard from "./SectionCard";
import CheckboxField from "./CheckboxField";
import TextField from "./TextField";
import LrCheckboxRow from "./LrCheckboxRow";

function formatBirthDateInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function calculateAgeFromBirthDate(value) {
  const parts = value.split("/");
  if (parts.length !== 3) return "";

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (!day || !month || !year) return "";

  const birthDate = new Date(year, month - 1, day);
  if (Number.isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age >= 0 ? String(age) : "";
}

export default function PreformSection({
  preformOpen,
  setPreformOpen,
  preform,
  setPreform,
  onSave,
  readOnly=false,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
const isReception = user?.role === "RECEPTION";
const isRestricted = isReception || readOnly;

  return (
    <SectionCard
      title="Fișa de pre-spitalizare"
      isOpen={preformOpen}
      onToggle={() => setPreformOpen((prev) => !prev)}
      hideTopButtonWhenOpen={true}
    >
      <div
  style={{
    display: "grid",
    gap: 16,
    pointerEvents: isRestricted ? "none" : "auto",
    opacity: isRestricted ? 0.6 : 1,
  }}
>
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

        <div style={{ fontWeight: 700 }}>PACIENT</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            Prenume
            <input
              value={preform.firstName}
              onChange={(e) => setPreform({ ...preform, firstName: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Nume
            <input
              value={preform.lastName}
              onChange={(e) => setPreform({ ...preform, lastName: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Vârstă
            <input
              value={preform.age} readOnly
              onChange={(e) => setPreform({ ...preform, age: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Data nașterii
            <input
  type="text"
  placeholder="zz/ll/aaaa"
  value={preform.birthDate}
  onChange={(e) => {
    const formatted = formatBirthDateInput(e.target.value);

    setPreform({
      ...preform,
      birthDate: formatted,
      age: calculateAgeFromBirthDate(formatted),
    });
  }}
  style={{ width: "100%", padding: 8, marginTop: 6 }}
/>
          </label>

          <label>
            CNP
            <input
              value={preform.cnp}
              onChange={(e) => setPreform({ ...preform, cnp: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Telefon
            <input
              value={preform.phoneNumber}
              onChange={(e) => setPreform({ ...preform, phoneNumber: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Email
            <input
              value={preform.email}
              onChange={(e) => setPreform({ ...preform, email: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Sex
            <select
              value={preform.sex}
              onChange={(e) => setPreform({ ...preform, sex: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            >
              <option value="">Selectează</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            Județ
            <input
              value={preform.county}
              onChange={(e) => setPreform({ ...preform, county: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Localitate
            <input
              value={preform.locality}
              onChange={(e) => setPreform({ ...preform, locality: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Strada
            <input
              value={preform.street}
              onChange={(e) => setPreform({ ...preform, street: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Nr.
            <input
              value={preform.streetNumber}
              onChange={(e) => setPreform({ ...preform, streetNumber: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Bl.
            <input
              value={preform.building}
              onChange={(e) => setPreform({ ...preform, building: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Sc.
            <input
              value={preform.staircase}
              onChange={(e) => setPreform({ ...preform, staircase: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Et.
            <input
              value={preform.floor}
              onChange={(e) => setPreform({ ...preform, floor: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Ap.
            <input
              value={preform.apartment}
              onChange={(e) => setPreform({ ...preform, apartment: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>STARE PACIENT</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              ["30_RESUSCITARE", "30 - Resuscitare"],
              ["31_CRITIC", "31 - Critic"],
              ["32_URGENT", "32 - Urgent"],
              ["33_NON_URGENT", "33 - Non-urgent"],
              ["34_CONSULT", "34 - Consult"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="patientStateCode"
                  checked={preform.patientStateCode === value}
                  onChange={() => setPreform({ ...preform, patientStateCode: value })}
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </div>

        <label>
          Motivul prezentării
          <textarea
            value={preform.reason}
            onChange={(e) => setPreform({ ...preform, reason: e.target.value })}
            rows={3}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          <label>
            Ora GCS
            <input
  value={preform.gcsHour}
  onChange={(e) =>
    setPreform({ ...preform, gcsHour: e.target.value })
  }
  onFocus={() => {
    if (!preform.gcsHour) {
      const currentTime = new Date().toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setPreform((prev) => ({
        ...prev,
        gcsHour: currentTime,
      }));
    }
  }}
  style={{ width: "100%", padding: 8, marginTop: 6 }}
/>
          </label>
          <label>
            M
            <input
              value={preform.gcsM}
              onChange={(e) => setPreform({ ...preform, gcsM: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            V
            <input
              value={preform.gcsV}
              onChange={(e) => setPreform({ ...preform, gcsV: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            O
            <input
              value={preform.gcsO}
              onChange={(e) => setPreform({ ...preform, gcsO: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            GCS
            <input
              value={preform.gcs}
              onChange={(e) => setPreform({ ...preform, gcs: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Adus de</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {[
              ["13_SAJ", "13 - SAJ"],
              ["14_SMURD", "14 - SMURD"],
              ["15_MIJLOACE_PROPRII", "15 - Mijloace proprii"],
              ["16_ALT", "16 - Alt"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="broughtByCode"
                  checked={preform.broughtByCode === value}
                  onChange={() => setPreform({ ...preform, broughtByCode: value })}
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <input
            placeholder="Completează dacă ai ales Alt"
            value={preform.broughtByOther}
            onChange={(e) => setPreform({ ...preform, broughtByOther: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Adus de la</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {[
              ["17_DOMICILIU", "17 - Domiciliu"],
              ["18_UNITATE_SANITARA", "18 - Unitate sanitară"],
              ["19_LOC_PUBLIC", "19 - Loc public"],
              ["20_LOC_MUNCA", "20 - Loc muncă"],
              ["21_ALTUL", "21 - Altul"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="broughtFromCode"
                  checked={preform.broughtFromCode === value}
                  onChange={() => setPreform({ ...preform, broughtFromCode: value })}
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <input
            placeholder="Completează dacă ai ales Altul"
            value={preform.broughtFromOther}
            onChange={(e) => setPreform({ ...preform, broughtFromOther: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Funcții vitale la preluare</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            <CheckboxField
              label="35 - Decedat"
              checked={preform.pickupDeceased}
              onChange={(value) => setPreform({ ...preform, pickupDeceased: value })}
            />
            <CheckboxField
              label="36 - Stop CR"
              checked={preform.pickupStopCr}
              onChange={(value) => setPreform({ ...preform, pickupStopCr: value })}
            />
            <CheckboxField
              label="37 - Cu manevre de resuscitare în curs de desfășurare"
              checked={preform.pickupResuscitationInProgress}
              onChange={(value) => setPreform({ ...preform, pickupResuscitationInProgress: value })}
            />
            <CheckboxField
              label="38 - Traumă"
              checked={preform.pickupTrauma}
              onChange={(value) => setPreform({ ...preform, pickupTrauma: value })}
            />

            <label>
              39 - Resuscitare la ora
              <input
                value={preform.resuscitationHour}
                onChange={(e) => setPreform({ ...preform, resuscitationHour: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>

            <CheckboxField
              label="40 - Reușit"
              checked={preform.resuscitationSuccessful}
              onChange={(value) => setPreform({ ...preform, resuscitationSuccessful: value })}
            />

            <div>
              <CheckboxField
                label="41 - Nereușit"
                checked={preform.resuscitationFailed}
                onChange={(value) => setPreform({ ...preform, resuscitationFailed: value })}
              />
              <input
                placeholder="Ora deces"
                value={preform.deathHour}
                onChange={(e) => setPreform({ ...preform, deathHour: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </div>

            <label>
              42 - Motivul neînceperii resuscitării
              <input
                value={preform.resuscitationNotStartedReason}
                onChange={(e) =>
                  setPreform({ ...preform, resuscitationNotStartedReason: e.target.value })
                }
                style={{ width: "100%", padding: 8, marginTop: 6 }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            Fr. Res.
            <input
              value={preform.respiratoryRate}
              onChange={(e) => setPreform({ ...preform, respiratoryRate: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            AV
            <input
              value={preform.av}
              onChange={(e) => setPreform({ ...preform, av: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Puls
            <input
              value={preform.pulse}
              onChange={(e) => setPreform({ ...preform, pulse: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            TA sistolică
            <input
              value={preform.systolicBp}
              onChange={(e) => setPreform({ ...preform, systolicBp: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            TA diastolică
            <input
              value={preform.diastolicBp}
              onChange={(e) => setPreform({ ...preform, diastolicBp: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Sat O2
            <input
              value={preform.spo2}
              onChange={(e) => setPreform({ ...preform, spo2: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Temp
            <input
              value={preform.temperature}
              onChange={(e) => setPreform({ ...preform, temperature: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            Gli
            <input
              value={preform.glycemia}
              onChange={(e) => setPreform({ ...preform, glycemia: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            TRC
            <input
              value={preform.trc}
              onChange={(e) => setPreform({ ...preform, trc: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

        <div style={{ fontWeight: 700 }}>Antecedente patologice</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <CheckboxField label="Cardiace" checked={preform.historyCardiac} onChange={(value) => setPreform({ ...preform, historyCardiac: value })} />
          <CheckboxField label="Neurologice" checked={preform.historyNeurologic} onChange={(value) => setPreform({ ...preform, historyNeurologic: value })} />
          <CheckboxField label="Renale" checked={preform.historyRenal} onChange={(value) => setPreform({ ...preform, historyRenal: value })} />
          <CheckboxField label="Pulmonare" checked={preform.historyPulmonary} onChange={(value) => setPreform({ ...preform, historyPulmonary: value })} />
          <CheckboxField label="TBC" checked={preform.historyTbc} onChange={(value) => setPreform({ ...preform, historyTbc: value })} />
          <CheckboxField label="Hepatice" checked={preform.historyHepatic} onChange={(value) => setPreform({ ...preform, historyHepatic: value })} />
          <CheckboxField label="Gastrice" checked={preform.historyGastric} onChange={(value) => setPreform({ ...preform, historyGastric: value })} />
          <CheckboxField label="Diabet zaharat" checked={preform.historyDiabetes} onChange={(value) => setPreform({ ...preform, historyDiabetes: value })} />
          <CheckboxField label="Boli infecțio-contagioase" checked={preform.historyInfectious} onChange={(value) => setPreform({ ...preform, historyInfectious: value })} />
          <CheckboxField label="Boli cu transmitere sexuală" checked={preform.historyStd} onChange={(value) => setPreform({ ...preform, historyStd: value })} />
        </div>

        <label>
          Alte antecedente
          <input
            value={preform.historyOther}
            onChange={(e) => setPreform({ ...preform, historyOther: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Anamneză
          <textarea
            value={preform.anamnesis}
            onChange={(e) => setPreform({ ...preform, anamnesis: e.target.value })}
            rows={5}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <div style={{ fontWeight: 700 }}>Triaj</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <label>
            14 - Înălțime (cm)
            <input
              value={preform.heightCm}
              onChange={(e) => setPreform({ ...preform, heightCm: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
          <label>
            15 - Greutate (kg)
            <input
              value={preform.weightKg}
              onChange={(e) => setPreform({ ...preform, weightKg: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>General</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="16 - Febră" checked={preform.triageFever} onChange={(value) => setPreform({ ...preform, triageFever: value })} />
            <CheckboxField label="17 - Astenie" checked={preform.triageAsthenia} onChange={(value) => setPreform({ ...preform, triageAsthenia: value })} />
            <CheckboxField label="18 - Amețeli" checked={preform.triageDizziness} onChange={(value) => setPreform({ ...preform, triageDizziness: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Ochi</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            <CheckboxField label="66 - Pierdere acută a vederii" checked={preform.eyeAcuteVisionLoss} onChange={(value) => setPreform({ ...preform, eyeAcuteVisionLoss: value })} />
            <CheckboxField label="67 - Tulburări de vedere" checked={preform.eyeVisionDisorders} onChange={(value) => setPreform({ ...preform, eyeVisionDisorders: value })} />
            <CheckboxField label="68 - Corp străin intraocular" checked={preform.eyeForeignBody} onChange={(value) => setPreform({ ...preform, eyeForeignBody: value })} />
            <CheckboxField label="69 - Alte manifestări oculare" checked={preform.eyeOtherManifestations} onChange={(value) => setPreform({ ...preform, eyeOtherManifestations: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Arsuri</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="19 - Căi respiratorii afectate" checked={preform.burnAirwayAffected} onChange={(value) => setPreform({ ...preform, burnAirwayAffected: value })} />
            <CheckboxField label="20 - Flacără" checked={preform.burnFlame} onChange={(value) => setPreform({ ...preform, burnFlame: value })} />
            <CheckboxField label="21 - Solid" checked={preform.burnSolid} onChange={(value) => setPreform({ ...preform, burnSolid: value })} />
            <CheckboxField label="22 - Lichid" checked={preform.burnLiquid} onChange={(value) => setPreform({ ...preform, burnLiquid: value })} />
            <CheckboxField label="23 - Vapori/gaz" checked={preform.burnVaporsGas} onChange={(value) => setPreform({ ...preform, burnVaporsGas: value })} />
            <CheckboxField label="24 - Chimic" checked={preform.burnChemical} onChange={(value) => setPreform({ ...preform, burnChemical: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Torace - respirație</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="111 - Durere toracică" checked={preform.chestPain} onChange={(value) => setPreform({ ...preform, chestPain: value })} />
            <CheckboxField label="112 - Dispnee" checked={preform.dyspnea} onChange={(value) => setPreform({ ...preform, dyspnea: value })} />
            <CheckboxField label="113 - Hemoptizie" checked={preform.hemoptysis} onChange={(value) => setPreform({ ...preform, hemoptysis: value })} />
            <CheckboxField label="114 - Tuse" checked={preform.cough} onChange={(value) => setPreform({ ...preform, cough: value })} />
            <CheckboxField label="115 - Expectorație" checked={preform.expectoration} onChange={(value) => setPreform({ ...preform, expectoration: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Psihiatric</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="246 - Depresie" checked={preform.psychDepression} onChange={(value) => setPreform({ ...preform, psychDepression: value })} />
            <CheckboxField label="247 - Tulburări de comportament" checked={preform.psychBehaviorDisorder} onChange={(value) => setPreform({ ...preform, psychBehaviorDisorder: value })} />
            <CheckboxField label="248 - Suicid" checked={preform.psychSuicide} onChange={(value) => setPreform({ ...preform, psychSuicide: value })} />
            <CheckboxField label="225 - Halucinații" checked={preform.psychHallucinations} onChange={(value) => setPreform({ ...preform, psychHallucinations: value })} />
            <CheckboxField label="226 - Delir" checked={preform.psychDelirium} onChange={(value) => setPreform({ ...preform, psychDelirium: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Gastrointestinal</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="132 - Greață" checked={preform.giNausea} onChange={(value) => setPreform({ ...preform, giNausea: value })} />
            <CheckboxField label="133 - Vomă" checked={preform.giVomiting} onChange={(value) => setPreform({ ...preform, giVomiting: value })} />
            <CheckboxField label="134 - Tulburări tranzit" checked={preform.giTransitDisorders} onChange={(value) => setPreform({ ...preform, giTransitDisorders: value })} />
            <CheckboxField label="135 - Rectoragie" checked={preform.giRectorrhagia} onChange={(value) => setPreform({ ...preform, giRectorrhagia: value })} />
            <CheckboxField label="136 - Melenă" checked={preform.giMelena} onChange={(value) => setPreform({ ...preform, giMelena: value })} />
            <CheckboxField label="137 - Hematemeză" checked={preform.giHematemesis} onChange={(value) => setPreform({ ...preform, giHematemesis: value })} />
            <CheckboxField label="138 - Dureri abdominale" checked={preform.giAbdominalPain} onChange={(value) => setPreform({ ...preform, giAbdominalPain: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Neurologic</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            <CheckboxField label="237 - Convulsii" checked={preform.neuroConvulsions} onChange={(value) => setPreform({ ...preform, neuroConvulsions: value })} />
            <CheckboxField label="236 - Mioclonii" checked={preform.neuroMyoclonus} onChange={(value) => setPreform({ ...preform, neuroMyoclonus: value })} />
            <CheckboxField label="249 - Cefalee" checked={preform.neuroHeadache} onChange={(value) => setPreform({ ...preform, neuroHeadache: value })} />
            <CheckboxField label="250 - Paralizie" checked={preform.neuroParalysis} onChange={(value) => setPreform({ ...preform, neuroParalysis: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Genito-urinar</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="178 - Tulburări micționale" checked={preform.guUrinationDisorders} onChange={(value) => setPreform({ ...preform, guUrinationDisorders: value })} />
            <CheckboxField label="179 - Disurie" checked={preform.guDysuria} onChange={(value) => setPreform({ ...preform, guDysuria: value })} />
            <CheckboxField label="180 - Polakiurie" checked={preform.guPollakiuria} onChange={(value) => setPreform({ ...preform, guPollakiuria: value })} />
            <CheckboxField label="181 - Oligurie" checked={preform.guOliguria} onChange={(value) => setPreform({ ...preform, guOliguria: value })} />
            <CheckboxField label="177 - Hematurie" checked={preform.guHematuria} onChange={(value) => setPreform({ ...preform, guHematuria: value })} />
            <CheckboxField label="182 - Sângerare vaginală" checked={preform.guVaginalBleeding} onChange={(value) => setPreform({ ...preform, guVaginalBleeding: value })} />
            <CheckboxField label="183 - Sarcină" checked={preform.guPregnancy} onChange={(value) => setPreform({ ...preform, guPregnancy: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Tegumente</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="141 - Calde" checked={preform.skinWarm} onChange={(value) => setPreform({ ...preform, skinWarm: value })} />
            <CheckboxField label="142 - Reci" checked={preform.skinCold} onChange={(value) => setPreform({ ...preform, skinCold: value })} />
            <CheckboxField label="143 - Umede" checked={preform.skinWet} onChange={(value) => setPreform({ ...preform, skinWet: value })} />
            <CheckboxField label="151 - Palide" checked={preform.skinPale} onChange={(value) => setPreform({ ...preform, skinPale: value })} />
            <CheckboxField label="152 - Cianotice" checked={preform.skinCyanotic} onChange={(value) => setPreform({ ...preform, skinCyanotic: value })} />
            <CheckboxField label="149 - Icterice" checked={preform.skinJaundice} onChange={(value) => setPreform({ ...preform, skinJaundice: value })} />
            <CheckboxField label="146 - Echimoze" checked={preform.skinEcchymosis} onChange={(value) => setPreform({ ...preform, skinEcchymosis: value })} />
            <CheckboxField label="154 - Erupții" checked={preform.skinRash} onChange={(value) => setPreform({ ...preform, skinRash: value })} />
            <CheckboxField label="144 - Prurit" checked={preform.skinPruritus} onChange={(value) => setPreform({ ...preform, skinPruritus: value })} />
            <CheckboxField label="155 - Arsuri" checked={preform.skinBurns} onChange={(value) => setPreform({ ...preform, skinBurns: value })} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Aparat locomotor</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="211 - Inflamație" checked={preform.locomotorInflammation} onChange={(value) => setPreform({ ...preform, locomotorInflammation: value })} />
            <CheckboxField label="205 - Tumefacție" checked={preform.locomotorSwelling} onChange={(value) => setPreform({ ...preform, locomotorSwelling: value })} />
            <CheckboxField label="204 - Durere" checked={preform.locomotorPain} onChange={(value) => setPreform({ ...preform, locomotorPain: value })} />
            <CheckboxField label="207 - Impotență funcțională" checked={preform.locomotorFunctionalImpairment} onChange={(value) => setPreform({ ...preform, locomotorFunctionalImpairment: value })} />
            <CheckboxField label="246 - Hematom" checked={preform.locomotorHematoma} onChange={(value) => setPreform({ ...preform, locomotorHematoma: value })} />
          </div>
        </div>

        <label>
          Alergic la
          <input
            value={preform.allergies}
            onChange={(e) => setPreform({ ...preform, allergies: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>
<fieldset
  style={{
    border: "none",
    padding: 0,
    margin: 0,
    minWidth: 0,
    pointerEvents: isRestricted ? "none" : "auto",
    opacity: 1,
  }}
>
        <div
          style={{
            border: "1px solid #333",
            borderRadius: 10,
            padding: 14,
            background: "#0f0f0f",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>EXAMEN OBIECTIV</div>

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
                    onChange={() => setPreform({ ...preform, objectiveGeneralState: value })}
                  />{" "}
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>CAP</div>
              <div style={{ display: "grid", gap: 8 }}>
                <CheckboxField label="30 - Normal" checked={preform.headNormal} onChange={(v) => setPreform({ ...preform, headNormal: v })} />
                <CheckboxField label="31 - Marcă traumatică" checked={preform.headTraumaMark} onChange={(v) => setPreform({ ...preform, headTraumaMark: v })} />
                <CheckboxField label="32 - Leziuni cav. bucală" checked={preform.headOralLesions} onChange={(v) => setPreform({ ...preform, headOralLesions: v })} />
                <CheckboxField label="33 - Leziuni dentare" checked={preform.headDentalLesions} onChange={(v) => setPreform({ ...preform, headDentalLesions: v })} />
              </div>
            </div>

            <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>GÂT</div>
              <div style={{ display: "grid", gap: 8 }}>
                <CheckboxField label="34 - Normal" checked={preform.neckNormal} onChange={(v) => setPreform({ ...preform, neckNormal: v })} />
                <CheckboxField label="35 - Marcă traumatică" checked={preform.neckTraumaMark} onChange={(v) => setPreform({ ...preform, neckTraumaMark: v })} />
                <CheckboxField label="36 - Formațiuni palpabile" checked={preform.neckPalpableFormations} onChange={(v) => setPreform({ ...preform, neckPalpableFormations: v })} />
                <TextField label="Alte" value={preform.neckOther} onChange={(v) => setPreform({ ...preform, neckOther: v })} />
              </div>
            </div>

            <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>NAS</div>

              <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
              <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                <CheckboxField label="38 - Nări" checked={preform.noseNostrilsNormal} onChange={(v) => setPreform({ ...preform, noseNostrilsNormal: v })} />
                <CheckboxField label="39 - Mucoasa nazală" checked={preform.noseMucosaNormal} onChange={(v) => setPreform({ ...preform, noseMucosaNormal: v })} />
                <TextField label="Alte" value={preform.noseOther} onChange={(v) => setPreform({ ...preform, noseOther: v })} />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <LrCheckboxRow
                  label="40 - Epistaxis - 41"
                  leftChecked={preform.noseEpistaxisLeft}
                  rightChecked={preform.noseEpistaxisRight}
                  onLeftChange={(v) => setPreform({ ...preform, noseEpistaxisLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, noseEpistaxisRight: v })}
                />
                <LrCheckboxRow
                  label="42 - Corpi străini - 43"
                  leftChecked={preform.noseForeignBodyLeft}
                  rightChecked={preform.noseForeignBodyRight}
                  onLeftChange={(v) => setPreform({ ...preform, noseForeignBodyLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, noseForeignBodyRight: v })}
                />
                <LrCheckboxRow
                  label="44 - Traumă - 44'"
                  leftChecked={preform.noseTraumaLeft}
                  rightChecked={preform.noseTraumaRight}
                  onLeftChange={(v) => setPreform({ ...preform, noseTraumaLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, noseTraumaRight: v })}
                />
              </div>
            </div>

            <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>APARAT AUDITIV</div>

              <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
              <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                <CheckboxField label="45 - Membrana timpanică" checked={preform.earTympanicMembraneNormal} onChange={(v) => setPreform({ ...preform, earTympanicMembraneNormal: v })} />
                <CheckboxField label="46 - Căi auditive externe" checked={preform.earExternalCanalsNormal} onChange={(v) => setPreform({ ...preform, earExternalCanalsNormal: v })} />
                <CheckboxField label="47 - Pavilionul urechii" checked={preform.earAuricleNormal} onChange={(v) => setPreform({ ...preform, earAuricleNormal: v })} />
                <TextField label="Alte" value={preform.earOther} onChange={(v) => setPreform({ ...preform, earOther: v })} />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <LrCheckboxRow
                  label="48 - Otoragie - 49"
                  leftChecked={preform.earOtorrhagiaLeft}
                  rightChecked={preform.earOtorrhagiaRight}
                  onLeftChange={(v) => setPreform({ ...preform, earOtorrhagiaLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, earOtorrhagiaRight: v })}
                />
                <LrCheckboxRow
                  label="50 - Corpi străini - 51"
                  leftChecked={preform.earForeignBodyLeft}
                  rightChecked={preform.earForeignBodyRight}
                  onLeftChange={(v) => setPreform({ ...preform, earForeignBodyLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, earForeignBodyRight: v })}
                />
                <LrCheckboxRow
                  label="52 - Hemotimpan - 53"
                  leftChecked={preform.earHemotympanumLeft}
                  rightChecked={preform.earHemotympanumRight}
                  onLeftChange={(v) => setPreform({ ...preform, earHemotympanumLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, earHemotympanumRight: v })}
                />
                <LrCheckboxRow
                  label="Traumă"
                  leftChecked={preform.earTraumaLeft}
                  rightChecked={preform.earTraumaRight}
                  onLeftChange={(v) => setPreform({ ...preform, earTraumaLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, earTraumaRight: v })}
                />
              </div>
            </div>

            <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>OCHI</div>

              <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
              <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                <CheckboxField label="54 - Mobilitate globi oculari" checked={preform.eyeMobilityNormal} onChange={(v) => setPreform({ ...preform, eyeMobilityNormal: v })} />
                <CheckboxField label="55 - Pupile" checked={preform.eyePupilsNormal} onChange={(v) => setPreform({ ...preform, eyePupilsNormal: v })} />
                <TextField label="Alte" value={preform.eyeExamOther} onChange={(v) => setPreform({ ...preform, eyeExamOther: v })} />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <LrCheckboxRow
                  label="56 - Conjunctivite - 57"
                  leftChecked={preform.eyeConjunctivitisLeft}
                  rightChecked={preform.eyeConjunctivitisRight}
                  onLeftChange={(v) => setPreform({ ...preform, eyeConjunctivitisLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, eyeConjunctivitisRight: v })}
                />
                <LrCheckboxRow
                  label="58 - Midriază - 59"
                  leftChecked={preform.eyeMydriasisLeft}
                  rightChecked={preform.eyeMydriasisRight}
                  onLeftChange={(v) => setPreform({ ...preform, eyeMydriasisLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, eyeMydriasisRight: v })}
                />
                <LrCheckboxRow
                  label="60 - Mioză - 61"
                  leftChecked={preform.eyeMiosisLeft}
                  rightChecked={preform.eyeMiosisRight}
                  onLeftChange={(v) => setPreform({ ...preform, eyeMiosisLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, eyeMiosisRight: v })}
                />
                <LrCheckboxRow
                  label="62 - Nistagmus - 63"
                  leftChecked={preform.eyeNystagmusLeft}
                  rightChecked={preform.eyeNystagmusRight}
                  onLeftChange={(v) => setPreform({ ...preform, eyeNystagmusLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, eyeNystagmusRight: v })}
                />
                <LrCheckboxRow
                  label="64 - Deviere gl. oc. - 65"
                  leftChecked={preform.eyeDeviationLeft}
                  rightChecked={preform.eyeDeviationRight}
                  onLeftChange={(v) => setPreform({ ...preform, eyeDeviationLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, eyeDeviationRight: v })}
                />
                <LrCheckboxRow
                  label="247 - Traumă - 248"
                  leftChecked={preform.eyeTraumaExamLeft}
                  rightChecked={preform.eyeTraumaExamRight}
                  onLeftChange={(v) => setPreform({ ...preform, eyeTraumaExamLeft: v })}
                  onRightChange={(v) => setPreform({ ...preform, eyeTraumaExamRight: v })}
                />
              </div>
            </div>

            <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>APARAT CARDIOVASCULAR</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <CheckboxField label="70 - Ritm cardiac" checked={preform.cvRhythmNormal} onChange={(v) => setPreform({ ...preform, cvRhythmNormal: v })} />
                <CheckboxField label="78 - Jugulare turgesc." checked={preform.cvJugularTurgor} onChange={(v) => setPreform({ ...preform, cvJugularTurgor: v })} />

                <CheckboxField label="71 - Puls periferic" checked={preform.cvPeripheralPulseNormal} onChange={(v) => setPreform({ ...preform, cvPeripheralPulseNormal: v })} />
                <CheckboxField label="79 - Suflu sistolic" checked={preform.cvSystolicMurmur} onChange={(v) => setPreform({ ...preform, cvSystolicMurmur: v })} />

                <CheckboxField label="72 - Ascultația cordului" checked={preform.cvHeartAuscultationNormal} onChange={(v) => setPreform({ ...preform, cvHeartAuscultationNormal: v })} />
                <CheckboxField label="80 - Suflu diastolic" checked={preform.cvDiastolicMurmur} onChange={(v) => setPreform({ ...preform, cvDiastolicMurmur: v })} />

                <CheckboxField label="73 - Puls neregulat" checked={preform.cvIrregularPulse} onChange={(v) => setPreform({ ...preform, cvIrregularPulse: v })} />
                <CheckboxField label="81 - Suflu aortic" checked={preform.cvAorticMurmur} onChange={(v) => setPreform({ ...preform, cvAorticMurmur: v })} />

                <CheckboxField label="74 - Puls perif. filiform" checked={preform.cvFiliformPeripheralPulse} onChange={(v) => setPreform({ ...preform, cvFiliformPeripheralPulse: v })} />
                <CheckboxField label="86 - Galop" checked={preform.cvGallop} onChange={(v) => setPreform({ ...preform, cvGallop: v })} />

                <CheckboxField label="75 - Deficit de puls" checked={preform.cvPulseDeficit} onChange={(v) => setPreform({ ...preform, cvPulseDeficit: v })} />
                <CheckboxField label="83 - Suflu carotodian" checked={preform.cvCarotidMurmur} onChange={(v) => setPreform({ ...preform, cvCarotidMurmur: v })} />

                <CheckboxField label="76 - Zgomote aritmice" checked={preform.cvArrhythmicSounds} onChange={(v) => setPreform({ ...preform, cvArrhythmicSounds: v })} />
                <CheckboxField label="77 - Zgomote asurzite" checked={preform.cvMuffledSounds} onChange={(v) => setPreform({ ...preform, cvMuffledSounds: v })} />

                <CheckboxField label="85 - Frecătură" checked={preform.cvPericardialRub} onChange={(v) => setPreform({ ...preform, cvPericardialRub: v })} />
              </div>

              <div style={{ marginTop: 12 }}>
                <TextField label="Observații" value={preform.cvObservations} onChange={(v) => setPreform({ ...preform, cvObservations: v })} />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>TORACE / APARAT RESPIRATOR</div>

              <div style={{ fontWeight: 600, marginBottom: 6 }}>NORMAL</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 12 }}>
                <CheckboxField label="90 - Aspectul toracelui" checked={preform.respThoraxAspectNormal} onChange={(v) => setPreform({ ...preform, respThoraxAspectNormal: v })} />
                <CheckboxField label="91 - Percuția toracelui" checked={preform.respThoraxPercussionNormal} onChange={(v) => setPreform({ ...preform, respThoraxPercussionNormal: v })} />
                <CheckboxField label="92 - Murmur vezicular bilat." checked={preform.respVesicularBilateralNormal} onChange={(v) => setPreform({ ...preform, respVesicularBilateralNormal: v })} />
                <CheckboxField label="93 - Orofaringe" checked={preform.respOropharynxNormal} onChange={(v) => setPreform({ ...preform, respOropharynxNormal: v })} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <LrCheckboxRow
                    label="94 - Murmur vezicular diminuat - 95"
                    leftChecked={preform.respDiminishedMurmurLeft}
                    rightChecked={preform.respDiminishedMurmurRight}
                    onLeftChange={(v) => setPreform({ ...preform, respDiminishedMurmurLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respDiminishedMurmurRight: v })}
                  />
                  <LrCheckboxRow
                    label="96 - Murmur vezicular absent - 95"
                    leftChecked={preform.respAbsentMurmurLeft}
                    rightChecked={preform.respAbsentMurmurRight}
                    onLeftChange={(v) => setPreform({ ...preform, respAbsentMurmurLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respAbsentMurmurRight: v })}
                  />
                  <LrCheckboxRow
                    label="94 - Raluri sibilante - 97"
                    leftChecked={preform.respWheezingRalesLeft}
                    rightChecked={preform.respWheezingRalesRight}
                    onLeftChange={(v) => setPreform({ ...preform, respWheezingRalesLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respWheezingRalesRight: v })}
                  />
                  <LrCheckboxRow
                    label="100 - Raluri crepitante - 101"
                    leftChecked={preform.respCrepitantRalesLeft}
                    rightChecked={preform.respCrepitantRalesRight}
                    onLeftChange={(v) => setPreform({ ...preform, respCrepitantRalesLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respCrepitantRalesRight: v })}
                  />
                  <LrCheckboxRow
                    label="102 - Raluri subcrepitante - 103"
                    leftChecked={preform.respSubcrepitantRalesLeft}
                    rightChecked={preform.respSubcrepitantRalesRight}
                    onLeftChange={(v) => setPreform({ ...preform, respSubcrepitantRalesLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respSubcrepitantRalesRight: v })}
                  />
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <LrCheckboxRow
                    label="104 - Tiraj intercost/supraclavic - 105"
                    leftChecked={preform.respIntercostalRetractionLeft}
                    rightChecked={preform.respIntercostalRetractionRight}
                    onLeftChange={(v) => setPreform({ ...preform, respIntercostalRetractionLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respIntercostalRetractionRight: v })}
                  />
                  <LrCheckboxRow
                    label="106 - Emfizem subcutanat - 107"
                    leftChecked={preform.respSubcutaneousEmphysemaLeft}
                    rightChecked={preform.respSubcutaneousEmphysemaRight}
                    onLeftChange={(v) => setPreform({ ...preform, respSubcutaneousEmphysemaLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respSubcutaneousEmphysemaRight: v })}
                  />
                  <LrCheckboxRow
                    label="108 - Trahee deviată - 109"
                    leftChecked={preform.respTracheaDeviationLeft}
                    rightChecked={preform.respTracheaDeviationRight}
                    onLeftChange={(v) => setPreform({ ...preform, respTracheaDeviationLeft: v })}
                    onRightChange={(v) => setPreform({ ...preform, respTracheaDeviationRight: v })}
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
          </div>
        </div>
               <div style={{ border: "1px solid #333", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>ABDOMEN</div>

          <div style={{ fontWeight: 600, marginBottom: 8 }}>NORMAL</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="120 - Palpare" checked={preform.abdomenPalpation} onChange={(v) => setPreform({ ...preform, abdomenPalpation: v })} />
            <CheckboxField label="121 - Percuție" checked={preform.abdomenPercussion} onChange={(v) => setPreform({ ...preform, abdomenPercussion: v })} />
            <CheckboxField label="122 - Tranzit intest." checked={preform.abdomenBowelTransit} onChange={(v) => setPreform({ ...preform, abdomenBowelTransit: v })} />
            <CheckboxField label="123 - Tuseu rectal" checked={preform.abdomenRectalExam} onChange={(v) => setPreform({ ...preform, abdomenRectalExam: v })} />
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="124 - Abd. destins" checked={preform.abdomenDistended} onChange={(v) => setPreform({ ...preform, abdomenDistended: v })} />
            <CheckboxField label="125 - Tranzit absent" checked={preform.abdomenTransitAbsent} onChange={(v) => setPreform({ ...preform, abdomenTransitAbsent: v })} />
            <CheckboxField label="126 - Hepatomegalie" checked={preform.abdomenHepatomegaly} onChange={(v) => setPreform({ ...preform, abdomenHepatomegaly: v })} />
            <CheckboxField label="127 - Splenomegalie" checked={preform.abdomenSplenomegaly} onChange={(v) => setPreform({ ...preform, abdomenSplenomegaly: v })} />
            <CheckboxField label="128 - Formațiune palpabilă" checked={preform.abdomenPalpableMass} onChange={(v) => setPreform({ ...preform, abdomenPalpableMass: v })} />
            <CheckboxField label="129 - Sensibil la palpare" checked={preform.abdomenTenderness} onChange={(v) => setPreform({ ...preform, abdomenTenderness: v })} />
            <CheckboxField label="130 - Tuseu rectal pozitiv" checked={preform.abdomenRectalPositive} onChange={(v) => setPreform({ ...preform, abdomenRectalPositive: v })} />
            <CheckboxField label="131 - Iritație peritoneală" checked={preform.abdomenPeritonealIrritation} onChange={(v) => setPreform({ ...preform, abdomenPeritonealIrritation: v })} />
          </div>

          <div style={{ marginTop: 12 }}>
            <TextField
              label="Observații"
              value={preform.abdomenObservations}
              onChange={(v) => setPreform({ ...preform, abdomenObservations: v })}
            />
          </div>
        </div>
                        <div style={{ border: "1px solid #333", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>TEGUMENT</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="140 - Normal" checked={preform.skinExamNormal} onChange={(v) => setPreform({ ...preform, skinExamNormal: v })} />
            <CheckboxField label="141 - Cald" checked={preform.skinExamWarm} onChange={(v) => setPreform({ ...preform, skinExamWarm: v })} />
            <CheckboxField label="142 - Rece" checked={preform.skinExamCold} onChange={(v) => setPreform({ ...preform, skinExamCold: v })} />
            <CheckboxField label="143 - Umed" checked={preform.skinExamWet} onChange={(v) => setPreform({ ...preform, skinExamWet: v })} />
            <CheckboxField label="37 - Uscat" checked={preform.skinExamDry} onChange={(v) => setPreform({ ...preform, skinExamDry: v })} />
            <CheckboxField label="144 - Prurit" checked={preform.skinExamPruritus} onChange={(v) => setPreform({ ...preform, skinExamPruritus: v })} />
            <CheckboxField label="145 - Escoriații" checked={preform.skinExamExcoriations} onChange={(v) => setPreform({ ...preform, skinExamExcoriations: v })} />
            <CheckboxField label="146 - Echimoze" checked={preform.skinExamEcchymosis} onChange={(v) => setPreform({ ...preform, skinExamEcchymosis: v })} />
            <CheckboxField label="147 - Peteșii" checked={preform.skinExamPetechiae} onChange={(v) => setPreform({ ...preform, skinExamPetechiae: v })} />
            <CheckboxField label="148 - Purpură" checked={preform.skinExamPurpura} onChange={(v) => setPreform({ ...preform, skinExamPurpura: v })} />
            <CheckboxField label="149 - Icter" checked={preform.skinExamJaundice} onChange={(v) => setPreform({ ...preform, skinExamJaundice: v })} />
            <CheckboxField label="150 - Plăgi" checked={preform.skinExamWounds} onChange={(v) => setPreform({ ...preform, skinExamWounds: v })} />
            <CheckboxField label="151 - Palid" checked={preform.skinExamPale} onChange={(v) => setPreform({ ...preform, skinExamPale: v })} />
            <CheckboxField label="152 - Cianoză" checked={preform.skinExamCyanosis} onChange={(v) => setPreform({ ...preform, skinExamCyanosis: v })} />
            <CheckboxField label="153 - Transpirat" checked={preform.skinExamSweaty} onChange={(v) => setPreform({ ...preform, skinExamSweaty: v })} />
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TextField
              label="Localizare"
              value={preform.skinExamLocation}
              onChange={(v) => setPreform({ ...preform, skinExamLocation: v })}
            />
          </div>
        </div>

                <div style={{ border: "1px solid #333", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>GENITO URINAR</div>

          <div style={{ fontWeight: 600, marginBottom: 8 }}>NORMAL</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="160 - Organe genitale externe" checked={preform.guExternalGenitals} onChange={(v) => setPreform({ ...preform, guExternalGenitals: v })} />
            <CheckboxField label="161 - Menstruație regulată" checked={preform.guRegularMenstruation} onChange={(v) => setPreform({ ...preform, guRegularMenstruation: v })} />
            <CheckboxField label="162 - Tuseu rectal" checked={preform.guRectalExam} onChange={(v) => setPreform({ ...preform, guRectalExam: v })} />
            <CheckboxField label="Normal" checked={preform.guExamNormal} onChange={(v) => setPreform({ ...preform, guExamNormal: v })} />
          </div>

          <div style={{ marginTop: 12 }}>
            <TextField
              label="163 - Data ult. menstruație"
              value={preform.guLastMenstruationDate}
              onChange={(v) => setPreform({ ...preform, guLastMenstruationDate: v })}
            />
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            <CheckboxField label="164 - Scurgeri vaginale sanguinolente" checked={preform.guBloodyVaginalDischarge} onChange={(v) => setPreform({ ...preform, guBloodyVaginalDischarge: v })} />
            <CheckboxField label="165 - Leucoree" checked={preform.guLeucorrhea} onChange={(v) => setPreform({ ...preform, guLeucorrhea: v })} />
            <CheckboxField label="166 - Sensibilitatea colului" checked={preform.guCervixSensitivity} onChange={(v) => setPreform({ ...preform, guCervixSensitivity: v })} />
            <CheckboxField label="167 - Uter mărit" checked={preform.guEnlargedUterus} onChange={(v) => setPreform({ ...preform, guEnlargedUterus: v })} />
            <CheckboxField label="168 - Formațiune latero-uterină" checked={preform.guLateroUterineMass} onChange={(v) => setPreform({ ...preform, guLateroUterineMass: v })} />
            <CheckboxField label="177 - Hematurie" checked={preform.guExamHematuria} onChange={(v) => setPreform({ ...preform, guExamHematuria: v })} />
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <LrCheckboxRow
              label="169 - Giordano pozitiv - 170"
              leftChecked={preform.guGiordanoLeft}
              rightChecked={preform.guGiordanoRight}
              onLeftChange={(v) => setPreform({ ...preform, guGiordanoLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, guGiordanoRight: v })}
            />
            <LrCheckboxRow
              label="171 - Tumefiere testicul - 172"
              leftChecked={preform.guTesticularSwellingLeft}
              rightChecked={preform.guTesticularSwellingRight}
              onLeftChange={(v) => setPreform({ ...preform, guTesticularSwellingLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, guTesticularSwellingRight: v })}
            />
            <LrCheckboxRow
              label="173 - Durere testicul - 174"
              leftChecked={preform.guTesticularPainLeft}
              rightChecked={preform.guTesticularPainRight}
              onLeftChange={(v) => setPreform({ ...preform, guTesticularPainLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, guTesticularPainRight: v })}
            />
            <LrCheckboxRow
              label="175 - Formațiune mamară - 176"
              leftChecked={preform.guBreastMassLeft}
              rightChecked={preform.guBreastMassRight}
              onLeftChange={(v) => setPreform({ ...preform, guBreastMassLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, guBreastMassRight: v })}
            />
            <LrCheckboxRow
              label="249 - Traumă - 250"
              leftChecked={preform.guTraumaLeft}
              rightChecked={preform.guTraumaRight}
              onLeftChange={(v) => setPreform({ ...preform, guTraumaLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, guTraumaRight: v })}
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

                <div style={{ border: "1px solid #333", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>AP. LOCOMOTOR</div>

          <div style={{ fontWeight: 600, marginBottom: 8 }}>NORMAL</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="190 - Cap" checked={preform.locomotorHead} onChange={(v) => setPreform({ ...preform, locomotorHead: v })} />
            <CheckboxField label="191 - Gât" checked={preform.locomotorNeck} onChange={(v) => setPreform({ ...preform, locomotorNeck: v })} />
            <CheckboxField label="192 - Trunchi" checked={preform.locomotorTrunk} onChange={(v) => setPreform({ ...preform, locomotorTrunk: v })} />
            <CheckboxField label="193 - Membre superioare" checked={preform.locomotorUpperLimbs} onChange={(v) => setPreform({ ...preform, locomotorUpperLimbs: v })} />
            <CheckboxField label="194 - Membre inferioare" checked={preform.locomotorLowerLimbs} onChange={(v) => setPreform({ ...preform, locomotorLowerLimbs: v })} />
          </div>
<br></br>
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            <LrCheckboxRow
              label="251 - Carotidă - 252"
              leftChecked={preform.locomotorPulseCarotidLeft}
              rightChecked={preform.locomotorPulseCarotidRight}
              onLeftChange={(v) => setPreform({ ...preform, locomotorPulseCarotidLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, locomotorPulseCarotidRight: v })}
            />
            <LrCheckboxRow
              label="194 - Brahială - 195"
              leftChecked={preform.locomotorPulseBrachialLeft}
              rightChecked={preform.locomotorPulseBrachialRight}
              onLeftChange={(v) => setPreform({ ...preform, locomotorPulseBrachialLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, locomotorPulseBrachialRight: v })}
            />
            <LrCheckboxRow
              label="196 - Radială - 197"
              leftChecked={preform.locomotorPulseRadialLeft}
              rightChecked={preform.locomotorPulseRadialRight}
              onLeftChange={(v) => setPreform({ ...preform, locomotorPulseRadialLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, locomotorPulseRadialRight: v })}
            />
            <LrCheckboxRow
              label="198 - Femurală - 199"
              leftChecked={preform.locomotorPulseFemoralLeft}
              rightChecked={preform.locomotorPulseFemoralRight}
              onLeftChange={(v) => setPreform({ ...preform, locomotorPulseFemoralLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, locomotorPulseFemoralRight: v })}
            />
            <LrCheckboxRow
              label="200 - Poplitee - 201"
              leftChecked={preform.locomotorPulsePoplitealLeft}
              rightChecked={preform.locomotorPulsePoplitealRight}
              onLeftChange={(v) => setPreform({ ...preform, locomotorPulsePoplitealLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, locomotorPulsePoplitealRight: v })}
            />
            <LrCheckboxRow
              label="202 - Pedioasă - 203"
              leftChecked={preform.locomotorPulsePedialLeft}
              rightChecked={preform.locomotorPulsePedialRight}
              onLeftChange={(v) => setPreform({ ...preform, locomotorPulsePedialLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, locomotorPulsePedialRight: v })}
            />
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="204 - Durere" checked={preform.locomotorExamPain} onChange={(v) => setPreform({ ...preform, locomotorExamPain: v })} />
            <CheckboxField label="205 - Tumefiere" checked={preform.locomotorExamSwelling} onChange={(v) => setPreform({ ...preform, locomotorExamSwelling: v })} />
            <CheckboxField label="206 - Edem" checked={preform.locomotorExamEdema} onChange={(v) => setPreform({ ...preform, locomotorExamEdema: v })} />
            <CheckboxField label="207 - Impotență funcț." checked={preform.locomotorExamFunctionalImpairment} onChange={(v) => setPreform({ ...preform, locomotorExamFunctionalImpairment: v })} />
            <CheckboxField label="208 - Cianoză" checked={preform.locomotorExamCyanosis} onChange={(v) => setPreform({ ...preform, locomotorExamCyanosis: v })} />
            <CheckboxField label="209 - Fract. deschisă" checked={preform.locomotorExamOpenFracture} onChange={(v) => setPreform({ ...preform, locomotorExamOpenFracture: v })} />
            <CheckboxField label="210 - Fract. închisă" checked={preform.locomotorExamClosedFracture} onChange={(v) => setPreform({ ...preform, locomotorExamClosedFracture: v })} />
          </div>

          <div style={{ marginTop: 12 }}>
            <TextField
              label="Observații"
              value={preform.locomotorExamObservations}
              onChange={(v) => setPreform({ ...preform, locomotorExamObservations: v })}
            />
          </div>
        </div>
                <div style={{ border: "1px solid #333", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>NEURO PSIHIATRIC</div>

          <div style={{ fontWeight: 600, marginBottom: 8 }}>NORMAL</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="220 - Orientat temp-sp" checked={preform.neuroPsychOriented} onChange={(v) => setPreform({ ...preform, neuroPsychOriented: v })} />
            <CheckboxField label="221 - Nervi cranieni" checked={preform.neuroPsychCranialNerves} onChange={(v) => setPreform({ ...preform, neuroPsychCranialNerves: v })} />
            <CheckboxField label="222 - Motor" checked={preform.neuroPsychMotor} onChange={(v) => setPreform({ ...preform, neuroPsychMotor: v })} />
            <CheckboxField label="223 - Senzitiv" checked={preform.neuroPsychSensitive} onChange={(v) => setPreform({ ...preform, neuroPsychSensitive: v })} />
            <CheckboxField label="224 - ROT" checked={preform.neuroPsychRot} onChange={(v) => setPreform({ ...preform, neuroPsychRot: v })} />
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <CheckboxField label="225 - Halucinații" checked={preform.neuroPsychHallucinations} onChange={(v) => setPreform({ ...preform, neuroPsychHallucinations: v })} />
            <CheckboxField label="226 - Delir" checked={preform.neuroPsychDelirium} onChange={(v) => setPreform({ ...preform, neuroPsychDelirium: v })} />
            <CheckboxField label="227 - Tulb. comp" checked={preform.neuroPsychBehaviorDisorders} onChange={(v) => setPreform({ ...preform, neuroPsychBehaviorDisorders: v })} />
            <CheckboxField label="228 - Agitat" checked={preform.neuroPsychAgitated} onChange={(v) => setPreform({ ...preform, neuroPsychAgitated: v })} />
            <CheckboxField label="229 - Obnubilat" checked={preform.neuroPsychObnubilated} onChange={(v) => setPreform({ ...preform, neuroPsychObnubilated: v })} />
            <CheckboxField label="230 - Confuz" checked={preform.neuroPsychConfused} onChange={(v) => setPreform({ ...preform, neuroPsychConfused: v })} />
            <CheckboxField label="231 - Fotofobie" checked={preform.neuroPsychPhotophobia} onChange={(v) => setPreform({ ...preform, neuroPsychPhotophobia: v })} />
            <CheckboxField label="232 - Redoarea cefei" checked={preform.neuroPsychNeckStiffness} onChange={(v) => setPreform({ ...preform, neuroPsychNeckStiffness: v })} />
            <CheckboxField label="233 - Parestezii" checked={preform.neuroPsychParesthesia} onChange={(v) => setPreform({ ...preform, neuroPsychParesthesia: v })} />
            <CheckboxField label="234 - Ataxie" checked={preform.neuroPsychAtaxia} onChange={(v) => setPreform({ ...preform, neuroPsychAtaxia: v })} />
            <CheckboxField label="235 - Afazie" checked={preform.neuroPsychAphasia} onChange={(v) => setPreform({ ...preform, neuroPsychAphasia: v })} />
            <CheckboxField label="236 - Mioclonii" checked={preform.neuroPsychMyoclonus} onChange={(v) => setPreform({ ...preform, neuroPsychMyoclonus: v })} />
            <CheckboxField label="237 - Convulsii" checked={preform.neuroPsychConvulsions} onChange={(v) => setPreform({ ...preform, neuroPsychConvulsions: v })} />
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <LrCheckboxRow
              label="238 - Plegie - 239"
              leftChecked={preform.neuroPsychPlegiaLeft}
              rightChecked={preform.neuroPsychPlegiaRight}
              onLeftChange={(v) => setPreform({ ...preform, neuroPsychPlegiaLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, neuroPsychPlegiaRight: v })}
            />
            <LrCheckboxRow
              label="240 - Pareză - 241"
              leftChecked={preform.neuroPsychParesisLeft}
              rightChecked={preform.neuroPsychParesisRight}
              onLeftChange={(v) => setPreform({ ...preform, neuroPsychParesisLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, neuroPsychParesisRight: v })}
            />
            <LrCheckboxRow
              label="242 - Anestezie - 243"
              leftChecked={preform.neuroPsychAnesthesiaLeft}
              rightChecked={preform.neuroPsychAnesthesiaRight}
              onLeftChange={(v) => setPreform({ ...preform, neuroPsychAnesthesiaLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, neuroPsychAnesthesiaRight: v })}
            />
            <LrCheckboxRow
              label="244 - Babinski - 245"
              leftChecked={preform.neuroPsychBabinskiLeft}
              rightChecked={preform.neuroPsychBabinskiRight}
              onLeftChange={(v) => setPreform({ ...preform, neuroPsychBabinskiLeft: v })}
              onRightChange={(v) => setPreform({ ...preform, neuroPsychBabinskiRight: v })}
            />
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TextField
              label="Alte"
              value={preform.neuroPsychOther}
              onChange={(v) => setPreform({ ...preform, neuroPsychOther: v })}
            />
            <TextField
              label="Observații"
              value={preform.neuroPsychObservations}
              onChange={(v) => setPreform({ ...preform, neuroPsychObservations: v })}
            />
          </div>
        </div>
                <div style={{ border: "1px solid #333", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>MANEVRE / PROCEDURI</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresO2Mask}
                  onChange={(e) => setPreform({ ...preform, proceduresO2Mask: e.target.checked })}
                />{" "}
                10 - O2 mască (l/min)
              </label>
              <input
                value={preform.proceduresO2MaskValue}
                onChange={(e) => setPreform({ ...preform, proceduresO2MaskValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="11 - Pipa Guedel" checked={preform.proceduresGuedelCannula} onChange={(v) => setPreform({ ...preform, proceduresGuedelCannula: v })} />
              <CheckboxField label="12 - Aspirare cavitate bucală" checked={preform.proceduresOralCavityAspiration} onChange={(v) => setPreform({ ...preform, proceduresOralCavityAspiration: v })} />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresIotTubeAspiration}
                  onChange={(e) => setPreform({ ...preform, proceduresIotTubeAspiration: e.target.checked })}
                />{" "}
                13 - Aspirare pe sondă IOT (ml)
              </label>
              <input
                value={preform.proceduresIotTubeAspirationValue}
                onChange={(e) => setPreform({ ...preform, proceduresIotTubeAspirationValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="14 - IOT cu inducție" checked={preform.proceduresIotWithInduction} onChange={(v) => setPreform({ ...preform, proceduresIotWithInduction: v })} />
              <CheckboxField label="15 - IOT fără inducție" checked={preform.proceduresIotWithoutInduction} onChange={(v) => setPreform({ ...preform, proceduresIotWithoutInduction: v })} />
              <CheckboxField label="16 - INT cu inducție" checked={preform.proceduresIntWithInduction} onChange={(v) => setPreform({ ...preform, proceduresIntWithInduction: v })} />
              <CheckboxField label="17 - Combitub" checked={preform.proceduresCombitube} onChange={(v) => setPreform({ ...preform, proceduresCombitube: v })} />
              <CheckboxField label="18 - Mască laringiană" checked={preform.proceduresLaryngealMask} onChange={(v) => setPreform({ ...preform, proceduresLaryngealMask: v })} />
              <CheckboxField label="19 - Decompresie toracică pe ac" checked={preform.proceduresNeedleThoracicDecompression} onChange={(v) => setPreform({ ...preform, proceduresNeedleThoracicDecompression: v })} />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresChestDrain}
                  onChange={(e) => setPreform({ ...preform, proceduresChestDrain: e.target.checked })}
                />{" "}
                20 - Drenaj toracic (ml)
              </label>
              <input
                value={preform.proceduresChestDrainValue}
                onChange={(e) => setPreform({ ...preform, proceduresChestDrainValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="21 - Minicricotirostomie" checked={preform.proceduresMiniCricothyrotomy} onChange={(v) => setPreform({ ...preform, proceduresMiniCricothyrotomy: v })} />
              <CheckboxField label="22 - Traheostomie" checked={preform.proceduresTracheostomy} onChange={(v) => setPreform({ ...preform, proceduresTracheostomy: v })} />
              <CheckboxField label="23 - Ventilație noninvazivă" checked={preform.proceduresNonInvasiveVentilation} onChange={(v) => setPreform({ ...preform, proceduresNonInvasiveVentilation: v })} />
              <CheckboxField label="24 - Ventilație mecanică" checked={preform.proceduresMechanicalVentilation} onChange={(v) => setPreform({ ...preform, proceduresMechanicalVentilation: v })} />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresPeripheralVenousAccess}
                  onChange={(e) => setPreform({ ...preform, proceduresPeripheralVenousAccess: e.target.checked })}
                />{" "}
                25 - Acces venos periferic - nr.
              </label>
              <input
                value={preform.proceduresPeripheralVenousAccessCount}
                onChange={(e) => setPreform({ ...preform, proceduresPeripheralVenousAccessCount: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresIntraosseousAccess}
                  onChange={(e) => setPreform({ ...preform, proceduresIntraosseousAccess: e.target.checked })}
                />{" "}
                26 - Acces intraosos - nr.
              </label>
              <input
                value={preform.proceduresIntraosseousAccessCount}
                onChange={(e) => setPreform({ ...preform, proceduresIntraosseousAccessCount: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresCentralVenousAccess}
                  onChange={(e) => setPreform({ ...preform, proceduresCentralVenousAccess: e.target.checked })}
                />{" "}
                27 - Acces venos central
              </label>
              <input
                value={preform.proceduresCentralVenousAccessValue}
                onChange={(e) => setPreform({ ...preform, proceduresCentralVenousAccessValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="28 - Măsurare PVC" checked={preform.proceduresPvcMeasurement} onChange={(v) => setPreform({ ...preform, proceduresPvcMeasurement: v })} />
              <CheckboxField label="Tromboliză IMA" checked={preform.proceduresThrombolysisAmi} onChange={(v) => setPreform({ ...preform, proceduresThrombolysisAmi: v })} />
              <CheckboxField label="Tromboliză AVC" checked={preform.proceduresThrombolysisStroke} onChange={(v) => setPreform({ ...preform, proceduresThrombolysisStroke: v })} />
              <CheckboxField label="Tromboliză TEP" checked={preform.proceduresThrombolysisPep} onChange={(v) => setPreform({ ...preform, proceduresThrombolysisPep: v })} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <CheckboxField label="29 - Acces arterial" checked={preform.proceduresArterialAccess} onChange={(v) => setPreform({ ...preform, proceduresArterialAccess: v })} />
              <CheckboxField label="30 - Inj. intramusculară" checked={preform.proceduresIntramuscularInjection} onChange={(v) => setPreform({ ...preform, proceduresIntramuscularInjection: v })} />
              <CheckboxField label="31 - Inj. subcutanată" checked={preform.proceduresSubcutaneousInjection} onChange={(v) => setPreform({ ...preform, proceduresSubcutaneousInjection: v })} />
              <CheckboxField label="32 - Inj. intradermică" checked={preform.proceduresIntradermalInjection} onChange={(v) => setPreform({ ...preform, proceduresIntradermalInjection: v })} />
              <CheckboxField label="33 - Adm. intranazală" checked={preform.proceduresIntranasalAdministration} onChange={(v) => setPreform({ ...preform, proceduresIntranasalAdministration: v })} />
              <CheckboxField label="34 - Nebulizare" checked={preform.proceduresNebulization} onChange={(v) => setPreform({ ...preform, proceduresNebulization: v })} />
              <CheckboxField label="35 - Compresiuni toracice externe" checked={preform.proceduresExternalChestCompressions} onChange={(v) => setPreform({ ...preform, proceduresExternalChestCompressions: v })} />
              <CheckboxField label="36 - Măsurare TA invazivă" checked={preform.proceduresInvasiveBpMeasurement} onChange={(v) => setPreform({ ...preform, proceduresInvasiveBpMeasurement: v })} />
              <CheckboxField label="37 - Monitorizare EKG" checked={preform.proceduresEkgMonitoring} onChange={(v) => setPreform({ ...preform, proceduresEkgMonitoring: v })} />
              <CheckboxField label="38 - Monitorizare Sat O2" checked={preform.proceduresO2SatMonitoring} onChange={(v) => setPreform({ ...preform, proceduresO2SatMonitoring: v })} />
              <CheckboxField label="39 - Capnometrie" checked={preform.proceduresCapnometry} onChange={(v) => setPreform({ ...preform, proceduresCapnometry: v })} />

              <TextField
                label="40 - Alte monitorizări"
                value={preform.proceduresOtherMonitoring}
                onChange={(v) => setPreform({ ...preform, proceduresOtherMonitoring: v })}
              />

              <CheckboxField label="41 - Defibrilare manuală" checked={preform.proceduresManualDefibrillation} onChange={(v) => setPreform({ ...preform, proceduresManualDefibrillation: v })} />
              <CheckboxField label="42 - Defibrilare automată" checked={preform.proceduresAutomaticDefibrillation} onChange={(v) => setPreform({ ...preform, proceduresAutomaticDefibrillation: v })} />
              <CheckboxField label="43 - Cardioversie" checked={preform.proceduresCardioversion} onChange={(v) => setPreform({ ...preform, proceduresCardioversion: v })} />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresTranscutaneousPm}
                  onChange={(e) => setPreform({ ...preform, proceduresTranscutaneousPm: e.target.checked })}
                />{" "}
                PM transcutanat
              </label>
              <input
                value={preform.proceduresTranscutaneousPmValue}
                onChange={(e) => setPreform({ ...preform, proceduresTranscutaneousPmValue: e.target.value })}
                placeholder="mA/Frecv"
                style={{ width: "100%", padding: 8 }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresTransvenousPm}
                  onChange={(e) => setPreform({ ...preform, proceduresTransvenousPm: e.target.checked })}
                />{" "}
                PM transvenos
              </label>
              <input
                value={preform.proceduresTransvenousPmValue}
                onChange={(e) => setPreform({ ...preform, proceduresTransvenousPmValue: e.target.value })}
                placeholder="mA/Frecv"
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="Analgosedare" checked={preform.proceduresAnalgosedation} onChange={(v) => setPreform({ ...preform, proceduresAnalgosedation: v })} />
              <CheckboxField label="Anestezie locală" checked={preform.proceduresLocalAnesthesia} onChange={(v) => setPreform({ ...preform, proceduresLocalAnesthesia: v })} />
              <CheckboxField label="Anestezie iv scurtă durată" checked={preform.proceduresShortIvAnesthesia} onChange={(v) => setPreform({ ...preform, proceduresShortIvAnesthesia: v })} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <CheckboxField label="45 - Puncție pericardică" checked={preform.proceduresPericardialPuncture} onChange={(v) => setPreform({ ...preform, proceduresPericardialPuncture: v })} />
              <CheckboxField label="46 - Lavaj peritoneal diag." checked={preform.proceduresPeritonealDiagnosticLavage} onChange={(v) => setPreform({ ...preform, proceduresPeritonealDiagnosticLavage: v })} />
              <CheckboxField label="47 - Reîncălzire activă" checked={preform.proceduresActiveRewarming} onChange={(v) => setPreform({ ...preform, proceduresActiveRewarming: v })} />
              <CheckboxField label="48 - Reîncălzire pasivă" checked={preform.proceduresPassiveRewarming} onChange={(v) => setPreform({ ...preform, proceduresPassiveRewarming: v })} />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresGastricLavage}
                  onChange={(e) => setPreform({ ...preform, proceduresGastricLavage: e.target.checked })}
                />{" "}
                49 - Lavaj gastric
              </label>
              <input
                value={preform.proceduresGastricLavageValue}
                onChange={(e) => setPreform({ ...preform, proceduresGastricLavageValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresNasogastricTube}
                  onChange={(e) => setPreform({ ...preform, proceduresNasogastricTube: e.target.checked })}
                />{" "}
                50 - Sondă nazogastrică
              </label>
              <input
                value={preform.proceduresNasogastricTubeValue}
                onChange={(e) => setPreform({ ...preform, proceduresNasogastricTubeValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresUrinaryCatheter}
                  onChange={(e) => setPreform({ ...preform, proceduresUrinaryCatheter: e.target.checked })}
                />{" "}
                51 - Sondă vezică urinară
              </label>
              <input
                value={preform.proceduresUrinaryCatheterValue}
                onChange={(e) => setPreform({ ...preform, proceduresUrinaryCatheterValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="52 - Guler cervical" checked={preform.proceduresCervicalCollar} onChange={(v) => setPreform({ ...preform, proceduresCervicalCollar: v })} />
              <CheckboxField label="53 - Targă cu lopeți" checked={preform.proceduresScoopStretcher} onChange={(v) => setPreform({ ...preform, proceduresScoopStretcher: v })} />
              <CheckboxField label="54 - Targă coloană" checked={preform.proceduresSpineBoard} onChange={(v) => setPreform({ ...preform, proceduresSpineBoard: v })} />
              <CheckboxField label="55 - Imobilizare membre" checked={preform.proceduresLimbImmobilization} onChange={(v) => setPreform({ ...preform, proceduresLimbImmobilization: v })} />

              <label>
                <input
                  type="checkbox"
                  checked={preform.proceduresSplint}
                  onChange={(e) => setPreform({ ...preform, proceduresSplint: e.target.checked })}
                />{" "}
                56 - Atelă
              </label>
              <input
                value={preform.proceduresSplintValue}
                onChange={(e) => setPreform({ ...preform, proceduresSplintValue: e.target.value })}
                style={{ width: "100%", padding: 8 }}
              />

              <CheckboxField label="57 - Aparat gipsat" checked={preform.proceduresCastDevice} onChange={(v) => setPreform({ ...preform, proceduresCastDevice: v })} />
              <CheckboxField label="58 - Toaletă plagă" checked={preform.proceduresWoundCleaning} onChange={(v) => setPreform({ ...preform, proceduresWoundCleaning: v })} />
              <CheckboxField label="59 - Sutură" checked={preform.proceduresSuture} onChange={(v) => setPreform({ ...preform, proceduresSuture: v })} />
              <CheckboxField label="60 - Mesaj" checked={preform.proceduresMessage} onChange={(v) => setPreform({ ...preform, proceduresMessage: v })} />
              <CheckboxField label="61 - Tamponament nazal" checked={preform.proceduresNasalPacking} onChange={(v) => setPreform({ ...preform, proceduresNasalPacking: v })} />

              <CheckboxField label="Sedare de scurtă durată" checked={preform.proceduresShortSedation} onChange={(v) => setPreform({ ...preform, proceduresShortSedation: v })} />
              <CheckboxField label="Sedare procedurală" checked={preform.proceduresProceduralSedation} onChange={(v) => setPreform({ ...preform, proceduresProceduralSedation: v })} />
              <CheckboxField label="Sedare de lungă durată" checked={preform.proceduresLongSedation} onChange={(v) => setPreform({ ...preform, proceduresLongSedation: v })} />
              <CheckboxField label="Puncție arterială" checked={preform.proceduresArterialPuncture} onChange={(v) => setPreform({ ...preform, proceduresArterialPuncture: v })} />

              <TextField
                label="Alte"
                value={preform.proceduresOther}
                onChange={(v) => setPreform({ ...preform, proceduresOther: v })}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block" }}>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>Observații</div>
              <textarea
                value={preform.proceduresObservations}
                onChange={(e) => setPreform({ ...preform, proceduresObservations: e.target.value })}
                rows={4}
                style={{ width: "100%", padding: 8 }}
              />
            </label>
          </div>
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
            {!isRestricted && (
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