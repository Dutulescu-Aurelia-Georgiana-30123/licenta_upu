import {
  CheckItem,
  FieldLine,
  SectionTitle,
  safe,
} from "./PrintCommon";

export default function PrintPatientAndArrival({ preform }) {
  return (
    <>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>
        SPITALUL CLINIC DE URGENȚĂ
      </div>

      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          marginTop: 4,
        }}
      >
        UNITATE PRIMIRE URGENȚE
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginTop: 16,
          marginBottom: 14,
        }}
      >
        <FieldLine label="Nr. fișă:" value={preform.sheetNumber} />
        <FieldLine label="Data:" value={preform.presentationDate} />
        <FieldLine label="Ora:" value={preform.presentationTime} />
        <FieldLine label="Preluat de:" value={preform.takenOverBy} />
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>PACIENT</SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          <FieldLine label="Prenume:" value={preform.firstName} />
          <FieldLine label="Nume:" value={preform.lastName} />
          <FieldLine label="Vârstă:" value={preform.age} />
          <FieldLine label="Data nașterii:" value={preform.birthDate} />

          <FieldLine label="CNP:" value={preform.cnp} />
          <FieldLine label="Telefon:" value={preform.phoneNumber} />
          <FieldLine label="Email:" value={preform.email} />
          <FieldLine label="Sex:" value={preform.sex} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginTop: 10,
          }}
        >
          <FieldLine label="Județ:" value={preform.county} />
          <FieldLine label="Localitate:" value={preform.locality} />
          <FieldLine label="Strada:" value={preform.street} />
          <FieldLine label="Nr.:" value={preform.streetNumber} />

          <FieldLine label="Bl.:" value={preform.building} />
          <FieldLine label="Sc.:" value={preform.staircase} />
          <FieldLine label="Et.:" value={preform.floor} />
          <FieldLine label="Ap.:" value={preform.apartment} />
        </div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>STARE PACIENT</SectionTitle>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <CheckItem
            checked={preform.patientStateCode === "30_RESUSCITARE"}
            label="30 - Resuscitare"
          />
          <CheckItem
            checked={preform.patientStateCode === "31_CRITIC"}
            label="31 - Critic"
          />
          <CheckItem
            checked={preform.patientStateCode === "32_URGENT"}
            label="32 - Urgent"
          />
          <CheckItem
            checked={preform.patientStateCode === "33_NON_URGENT"}
            label="33 - Non-urgent"
          />
          <CheckItem
            checked={preform.patientStateCode === "34_CONSULT"}
            label="34 - Consult"
          />
        </div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>MOTIVUL PREZENTĂRII</SectionTitle>
        <div style={{ minHeight: 42 }}>{safe(preform.reason)}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ border: "1px solid #000", padding: 10 }}>
          <SectionTitle>ADUS DE</SectionTitle>

          <CheckItem
            checked={preform.broughtByCode === "13_SAJ"}
            label="13 - SAJ"
          />
          <CheckItem
            checked={preform.broughtByCode === "14_SMURD"}
            label="14 - SMURD"
          />
          <CheckItem
            checked={preform.broughtByCode === "15_MIJLOACE_PROPRII"}
            label="15 - Mijloace proprii"
          />
          <CheckItem
            checked={preform.broughtByCode === "16_ALT"}
            label="16 - Alt"
          />

          <div style={{ marginTop: 8 }}>
            <b>Alte detalii:</b> {safe(preform.broughtByOther)}
          </div>
        </div>

        <div style={{ border: "1px solid #000", padding: 10 }}>
          <SectionTitle>ADUS DE LA</SectionTitle>

          <CheckItem
            checked={preform.broughtFromCode === "17_DOMICILIU"}
            label="17 - Domiciliu"
          />
          <CheckItem
            checked={preform.broughtFromCode === "18_UNITATE_SANITARA"}
            label="18 - Unitate sanitară"
          />
          <CheckItem
            checked={preform.broughtFromCode === "19_LOC_PUBLIC"}
            label="19 - Loc public"
          />
          <CheckItem
            checked={preform.broughtFromCode === "20_LOC_MUNCA"}
            label="20 - Loc muncă"
          />
          <CheckItem
            checked={preform.broughtFromCode === "21_ALTUL"}
            label="21 - Altul"
          />

          <div style={{ marginTop: 8 }}>
            <b>Alte detalii:</b> {safe(preform.broughtFromOther)}
          </div>
        </div>
      </div>
    </>
  );
}

const sectionBoxStyle = {
  border: "1px solid #000",
  padding: 10,
  marginBottom: 14,
};