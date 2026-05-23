import { CheckItem, FieldLine, SectionTitle, safe } from "./PrintCommon";

export default function PrintVitalsAndHistory({ preform }) {
  return (
    <>
      <div style={sectionBoxStyle}>
        <SectionTitle>GLASGOW COMA SCALE</SectionTitle>

        <div style={gridFiveStyle}>
          <FieldLine label="Ora GCS:" value={preform.gcsHour} />
          <FieldLine label="M:" value={preform.gcsM} />
          <FieldLine label="V:" value={preform.gcsV} />
          <FieldLine label="O:" value={preform.gcsO} />
          <FieldLine label="GCS:" value={preform.gcs} />
        </div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>FUNCȚII VITALE LA PRELUARE</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <CheckItem checked={preform.pickupDeceased} label="35 - Decedat" />
          <CheckItem checked={preform.pickupStopCr} label="36 - Stop CR" />
          <CheckItem
            checked={preform.pickupResuscitationInProgress}
            label="37 - Cu manevre de resuscitare în curs de desfășurare"
          />
          <CheckItem checked={preform.pickupTrauma} label="38 - Traumă" />

          <FieldLine label="39 - Resuscitare la ora:" value={preform.resuscitationHour} />
          <CheckItem checked={preform.resuscitationSuccessful} label="40 - Reușit" />
          <CheckItem checked={preform.resuscitationFailed} label="41 - Nereușit" />
          <FieldLine label="Ora deces:" value={preform.deathHour} />
        </div>

        <div style={{ marginTop: 8 }}>
          <b>42 - Motivul neînceperii resuscitării:</b>{" "}
          {safe(preform.resuscitationNotStartedReason)}
        </div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>PARAMETRI VITALI</SectionTitle>

        <div style={gridFourStyle}>
          <FieldLine label="Fr. Res.:" value={preform.respiratoryRate} />
          <FieldLine label="AV:" value={preform.av} />
          <FieldLine label="Puls:" value={preform.pulse} />
          <FieldLine label="TA sistolică:" value={preform.systolicBp} />

          <FieldLine label="TA diastolică:" value={preform.diastolicBp} />
          <FieldLine label="Sat O2:" value={preform.spo2} />
          <FieldLine label="Temp:" value={preform.temperature} />
          <FieldLine label="Gli:" value={preform.glycemia} />

          <FieldLine label="TRC:" value={preform.trc} />
        </div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>ANTECEDENTE PATOLOGICE</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          <CheckItem checked={preform.historyCardiac} label="Cardiace" />
          <CheckItem checked={preform.historyNeurologic} label="Neurologice" />
          <CheckItem checked={preform.historyRenal} label="Renale" />
          <CheckItem checked={preform.historyPulmonary} label="Pulmonare" />
          <CheckItem checked={preform.historyTbc} label="TBC" />
          <CheckItem checked={preform.historyHepatic} label="Hepatice" />
          <CheckItem checked={preform.historyGastric} label="Gastrice" />
          <CheckItem checked={preform.historyDiabetes} label="Diabet zaharat" />
          <CheckItem checked={preform.historyInfectious} label="Boli infecțio-contagioase" />
          <CheckItem checked={preform.historyStd} label="Boli cu transmitere sexuală" />
        </div>

        <div style={{ marginTop: 8 }}>
          <b>Alte antecedente:</b> {safe(preform.historyOther)}
        </div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>ANAMNEZĂ</SectionTitle>
        <div style={{ minHeight: 50 }}>{safe(preform.anamnesis)}</div>
      </div>

      <div style={sectionBoxStyle}>
        <SectionTitle>TRIAJ</SectionTitle>

        <div style={gridFourStyle}>
          <FieldLine label="14 - Talie (cm):" value={preform.heightCm} />
          <FieldLine label="15 - Greutate (kg):" value={preform.weightKg} />
        </div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>General</div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 4 }}>
          <CheckItem checked={preform.triageFever} label="16 - Febră" />
          <CheckItem checked={preform.triageAsthenia} label="17 - Astenie" />
          <CheckItem checked={preform.triageDizziness} label="18 - Amețeli" />
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

const gridFourStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 10,
};

const gridFiveStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 10,
};