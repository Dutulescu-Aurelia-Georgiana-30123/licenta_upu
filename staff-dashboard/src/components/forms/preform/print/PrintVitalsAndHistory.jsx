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

        <div style={{ marginTop: 10, fontWeight: 700 }}>Ochi</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.eyeAcuteVisionLoss} label="Pierderea acută a vederii" />
  <CheckItem checked={preform.eyeVisionDisorders} label="Tulburări de vedere" />
  <CheckItem checked={preform.eyeForeignBody} label="Corp străin" />
  <CheckItem checked={preform.eyeOtherManifestations} label="Alte manifestări" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Arsuri</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.burnAirwayAffected} label="Căi aeriene afectate" />
  <CheckItem checked={preform.burnFlame} label="Flacără" />
  <CheckItem checked={preform.burnSolid} label="Solid" />
  <CheckItem checked={preform.burnLiquid} label="Lichid" />
  <CheckItem checked={preform.burnVaporsGas} label="Vapori / gaz" />
  <CheckItem checked={preform.burnChemical} label="Chimic" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Cardio-respirator</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.chestPain} label="Durere toracică" />
  <CheckItem checked={preform.dyspnea} label="Dispnee" />
  <CheckItem checked={preform.hemoptysis} label="Hemoptizie" />
  <CheckItem checked={preform.cough} label="Tuse" />
  <CheckItem checked={preform.expectoration} label="Expectorație" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Psihiatric</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.psychDepression} label="Depresie" />
  <CheckItem checked={preform.psychBehaviorDisorder} label="Tulburări comportament" />
  <CheckItem checked={preform.psychSuicide} label="Tentativă suicid" />
  <CheckItem checked={preform.psychHallucinations} label="Halucinații" />
  <CheckItem checked={preform.psychDelirium} label="Delir" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Digestiv</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.giNausea} label="Greață" />
  <CheckItem checked={preform.giVomiting} label="Vărsături" />
  <CheckItem checked={preform.giTransitDisorders} label="Tulburări tranzit" />
  <CheckItem checked={preform.giRectorrhagia} label="Rectoragie" />
  <CheckItem checked={preform.giMelena} label="Melenă" />
  <CheckItem checked={preform.giHematemesis} label="Hematemeză" />
  <CheckItem checked={preform.giAbdominalPain} label="Durere abdominală" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Neurologic</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.neuroConvulsions} label="Convulsii" />
  <CheckItem checked={preform.neuroMyoclonus} label="Mioclonii" />
  <CheckItem checked={preform.neuroHeadache} label="Cefalee" />
  <CheckItem checked={preform.neuroParalysis} label="Paralizie" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Genito-urinar</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.guUrinationDisorders} label="Tulburări urinare" />
  <CheckItem checked={preform.guDysuria} label="Disurie" />
  <CheckItem checked={preform.guPollakiuria} label="Polakiurie" />
  <CheckItem checked={preform.guOliguria} label="Oligurie" />
  <CheckItem checked={preform.guHematuria} label="Hematurie" />
  <CheckItem checked={preform.guVaginalBleeding} label="Sângerare vaginală" />
  <CheckItem checked={preform.guPregnancy} label="Sarcină" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Tegument</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.skinWarm} label="Cald" />
  <CheckItem checked={preform.skinCold} label="Rece" />
  <CheckItem checked={preform.skinWet} label="Umed" />
  <CheckItem checked={preform.skinPale} label="Palid" />
  <CheckItem checked={preform.skinCyanotic} label="Cianotic" />
  <CheckItem checked={preform.skinJaundice} label="Icter" />
  <CheckItem checked={preform.skinEcchymosis} label="Echimoze" />
  <CheckItem checked={preform.skinRash} label="Erupții" />
  <CheckItem checked={preform.skinPruritus} label="Prurit" />
  <CheckItem checked={preform.skinBurns} label="Arsuri" />
</div>

<div style={{ marginTop: 10, fontWeight: 700 }}>Locomotor</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
  <CheckItem checked={preform.locomotorInflammation} label="Inflamație" />
  <CheckItem checked={preform.locomotorSwelling} label="Tumefacție" />
  <CheckItem checked={preform.locomotorPain} label="Durere" />
  <CheckItem checked={preform.locomotorFunctionalImpairment} label="Impotență funcțională" />
  <CheckItem checked={preform.locomotorHematoma} label="Hematom" />
</div>

<div style={{ marginTop: 10 }}>
  <b>Alergii:</b> {safe(preform.allergies)}
</div>

      </div>
    </>
  );
}

const sectionBoxStyle = {
  border: "1px solid #000",
  padding: 10,
  marginBottom: 14,
  breakInside: "avoid",
  pageBreakInside: "avoid",
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