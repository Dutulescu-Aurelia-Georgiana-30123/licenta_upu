function Box({ checked = false }) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: 14,
        height: 14,
        border: "1.5px solid #000",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        lineHeight: 1,
        marginRight: 6,
        verticalAlign: "middle",
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

function CheckItem({ checked, label }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <Box checked={checked} />
      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function FieldLine({ label, value }) {
  return (
    <div>
      <b>{label}</b> {value || "-"}
    </div>
  );
}

function LrRow({ leftChecked, label, rightChecked }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "26px 1fr 26px",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
      }}
    >
      <div>
        <Box checked={leftChecked} />
      </div>
      <div>{label}</div>
      <div style={{ textAlign: "right" }}>
        <Box checked={rightChecked} />
      </div>
    </div>
  );
}

function safe(value) {
  return value || "-";
}

export default function PreformPrintView({ preform }) {
  return (
    <div
      style={{
        background: "white",
        color: "black",
        padding: 24,
        borderRadius: 8,
        marginTop: 16,
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
      }}
    >
      <div
        style={{
          border: "1.5px solid #000",
          padding: 14,
        }}
      >
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>
          SPITALUL CLINIC DE URGENȚĂ
        </div>
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, marginTop: 4 }}>
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

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>PACIENT</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
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

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
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

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>MOTIVUL PREZENTĂRII</SectionTitle>
          <div style={{ minHeight: 42 }}>{safe(preform.reason)}</div>
        </div>

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>GLASGOW COMA SCALE</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            <FieldLine label="Ora GCS:" value={preform.gcsHour} />
            <FieldLine label="M:" value={preform.gcsM} />
            <FieldLine label="V:" value={preform.gcsV} />
            <FieldLine label="O:" value={preform.gcsO} />
            <FieldLine label="GCS:" value={preform.gcs} />
          </div>
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

            <CheckItem checked={preform.broughtByCode === "13_SAJ"} label="13 - SAJ" />
            <CheckItem checked={preform.broughtByCode === "14_SMURD"} label="14 - SMURD" />
            <CheckItem
              checked={preform.broughtByCode === "15_MIJLOACE_PROPRII"}
              label="15 - Mijloace proprii"
            />
            <CheckItem checked={preform.broughtByCode === "16_ALT"} label="16 - Alt" />

            <div style={{ marginTop: 8 }}>
              <b>Alte detalii:</b> {safe(preform.broughtByOther)}
            </div>
          </div>

          <div style={{ border: "1px solid #000", padding: 10 }}>
            <SectionTitle>ADUS DE LA</SectionTitle>

            <CheckItem checked={preform.broughtFromCode === "17_DOMICILIU"} label="17 - Domiciliu" />
            <CheckItem
              checked={preform.broughtFromCode === "18_UNITATE_SANITARA"}
              label="18 - Unitate sanitară"
            />
            <CheckItem checked={preform.broughtFromCode === "19_LOC_PUBLIC"} label="19 - Loc public" />
            <CheckItem checked={preform.broughtFromCode === "20_LOC_MUNCA"} label="20 - Loc muncă" />
            <CheckItem checked={preform.broughtFromCode === "21_ALTUL"} label="21 - Altul" />

            <div style={{ marginTop: 8 }}>
              <b>Alte detalii:</b> {safe(preform.broughtFromOther)}
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
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

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>PARAMETRI VITALI</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
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

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
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

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>ANAMNEZĂ</SectionTitle>
          <div style={{ minHeight: 50 }}>{safe(preform.anamnesis)}</div>
        </div>

        <div
          style={{
            border: "1px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>TRIAJ</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
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

        <div
          style={{
            border: "1.5px solid #000",
            padding: 10,
            marginBottom: 14,
          }}
        >
          <SectionTitle>EXAMEN OBIECTIV</SectionTitle>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>STARE GENERALĂ</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <CheckItem checked={preform.objectiveGeneralState === "10_NORMALA"} label="10 - Normală" />
              <CheckItem checked={preform.objectiveGeneralState === "11_INFLUENTATA"} label="11 - Influențată" />
              <CheckItem checked={preform.objectiveGeneralState === "12_ALTERATA"} label="12 - Alterată" />
              <CheckItem checked={preform.objectiveGeneralState === "13_PROFUND_ALTERATA"} label="13 - Profund alterată" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>CAP</div>
              <CheckItem checked={preform.headNormal} label="30 - Normal" />
              <CheckItem checked={preform.headTraumaMark} label="31 - Marcă traumatică" />
              <CheckItem checked={preform.headOralLesions} label="32 - Leziuni cav. bucală" />
              <CheckItem checked={preform.headDentalLesions} label="33 - Leziuni dentare" />
            </div>

            <div style={{ border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>GÂT</div>
              <CheckItem checked={preform.neckNormal} label="34 - Normal" />
              <CheckItem checked={preform.neckTraumaMark} label="35 - Marcă traumatică" />
              <CheckItem checked={preform.neckPalpableFormations} label="36 - Formațiuni palpabile" />
              <div style={{ marginTop: 6 }}>
                <b>Alte:</b> {safe(preform.neckOther)}
              </div>
            </div>

            <div style={{ border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>NAS</div>
              <div style={{ fontWeight: 700 }}>NORMAL</div>
              <CheckItem checked={preform.noseNostrilsNormal} label="38 - Nări" />
              <CheckItem checked={preform.noseMucosaNormal} label="39 - Mucoasa nazală" />
              <div style={{ marginBottom: 8 }}>
                <b>Alte:</b> {safe(preform.noseOther)}
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                <span style={{ marginRight: 10 }}>Stg</span>
                <span style={{ marginLeft: 130 }}>Dr</span>
              </div>

              <LrRow
                leftChecked={preform.noseEpistaxisLeft}
                label="40 - Epistaxis - 41"
                rightChecked={preform.noseEpistaxisRight}
              />
              <LrRow
                leftChecked={preform.noseForeignBodyLeft}
                label="42 - Corpi străini - 43"
                rightChecked={preform.noseForeignBodyRight}
              />
              <LrRow
                leftChecked={preform.noseTraumaLeft}
                label="44 - Traumă - 44'"
                rightChecked={preform.noseTraumaRight}
              />
            </div>

            <div style={{ border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>APARAT AUDITIV</div>
              <div style={{ fontWeight: 700 }}>NORMAL</div>
              <CheckItem checked={preform.earTympanicMembraneNormal} label="45 - Membrana timpanică" />
              <CheckItem checked={preform.earExternalCanalsNormal} label="46 - Căi auditive externe" />
              <CheckItem checked={preform.earAuricleNormal} label="47 - Pavilionul urechii" />
              <div style={{ marginBottom: 8 }}>
                <b>Alte:</b> {safe(preform.earOther)}
              </div>

              <LrRow
                leftChecked={preform.earOtorrhagiaLeft}
                label="48 - Otoragie - 49"
                rightChecked={preform.earOtorrhagiaRight}
              />
              <LrRow
                leftChecked={preform.earForeignBodyLeft}
                label="50 - Corpi străini - 51"
                rightChecked={preform.earForeignBodyRight}
              />
              <LrRow
                leftChecked={preform.earHemotympanumLeft}
                label="52 - Hemotimpan - 53"
                rightChecked={preform.earHemotympanumRight}
              />
              <LrRow
                leftChecked={preform.earTraumaLeft}
                label="Traumă"
                rightChecked={preform.earTraumaRight}
              />
            </div>

            <div style={{ border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>OCHI</div>
              <div style={{ fontWeight: 700 }}>NORMAL</div>
              <CheckItem checked={preform.eyeMobilityNormal} label="54 - Mobilitate globi oculari" />
              <CheckItem checked={preform.eyePupilsNormal} label="55 - Pupile" />
              <div style={{ marginBottom: 8 }}>
                <b>Alte:</b> {safe(preform.eyeExamOther)}
              </div>

              <LrRow
                leftChecked={preform.eyeConjunctivitisLeft}
                label="56 - Conjunctivite - 57"
                rightChecked={preform.eyeConjunctivitisRight}
              />
              <LrRow
                leftChecked={preform.eyeMydriasisLeft}
                label="58 - Midriază - 59"
                rightChecked={preform.eyeMydriasisRight}
              />
              <LrRow
                leftChecked={preform.eyeMiosisLeft}
                label="60 - Mioză - 61"
                rightChecked={preform.eyeMiosisRight}
              />
              <LrRow
                leftChecked={preform.eyeNystagmusLeft}
                label="62 - Nistagmus - 63"
                rightChecked={preform.eyeNystagmusRight}
              />
              <LrRow
                leftChecked={preform.eyeDeviationLeft}
                label="64 - Deviere gl. oc. - 65"
                rightChecked={preform.eyeDeviationRight}
              />
              <LrRow
                leftChecked={preform.eyeTraumaExamLeft}
                label="247 - Traumă - 248"
                rightChecked={preform.eyeTraumaExamRight}
              />
            </div>

            <div style={{ border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>APARAT CARDIOVASCULAR</div>

              <CheckItem checked={preform.cvRhythmNormal} label="70 - Ritm cardiac" />
              <CheckItem checked={preform.cvPeripheralPulseNormal} label="71 - Puls periferic" />
              <CheckItem checked={preform.cvHeartAuscultationNormal} label="72 - Ascultația cordului" />
              <CheckItem checked={preform.cvIrregularPulse} label="73 - Puls neregulat" />
              <CheckItem checked={preform.cvFiliformPeripheralPulse} label="74 - Puls perif. filiform" />
              <CheckItem checked={preform.cvPulseDeficit} label="75 - Deficit de puls" />
              <CheckItem checked={preform.cvArrhythmicSounds} label="76 - Zgomote aritmice" />
              <CheckItem checked={preform.cvMuffledSounds} label="77 - Zgomote asurzite" />
              <CheckItem checked={preform.cvJugularTurgor} label="78 - Jugulare turgesc." />
              <CheckItem checked={preform.cvSystolicMurmur} label="79 - Suflu sistolic" />
              <CheckItem checked={preform.cvDiastolicMurmur} label="80 - Suflu diastolic" />
              <CheckItem checked={preform.cvAorticMurmur} label="81 - Suflu aortic" />
              <CheckItem checked={preform.cvGallop} label="86 - Galop" />
              <CheckItem checked={preform.cvCarotidMurmur} label="83 - Suflu carotodian" />
              <CheckItem checked={preform.cvPericardialRub} label="85 - Frecătură" />

              <div style={{ marginTop: 8 }}>
                <b>Observații:</b> {safe(preform.cvObservations)}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", border: "1px solid #000", padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>TORACE / APARAT RESPIRATOR</div>

              <div style={{ fontWeight: 700 }}>NORMAL</div>
              <CheckItem checked={preform.respThoraxAspectNormal} label="90 - Aspectul toracelui" />
              <CheckItem checked={preform.respThoraxPercussionNormal} label="91 - Percuția toracelui" />
              <CheckItem checked={preform.respVesicularBilateralNormal} label="92 - Murmur vezicular bilat." />
              <CheckItem checked={preform.respOropharynxNormal} label="93 - Orofaringe" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                <div>
                  <LrRow
                    leftChecked={preform.respDiminishedMurmurLeft}
                    label="94 - Murmur vezicular diminuat - 95"
                    rightChecked={preform.respDiminishedMurmurRight}
                  />
                  <LrRow
                    leftChecked={preform.respAbsentMurmurLeft}
                    label="96 - Murmur vezicular absent - 95"
                    rightChecked={preform.respAbsentMurmurRight}
                  />
                  <LrRow
                    leftChecked={preform.respWheezingRalesLeft}
                    label="94 - Raluri sibilante - 97"
                    rightChecked={preform.respWheezingRalesRight}
                  />
                  <LrRow
                    leftChecked={preform.respCrepitantRalesLeft}
                    label="100 - Raluri crepitante - 101"
                    rightChecked={preform.respCrepitantRalesRight}
                  />
                  <LrRow
                    leftChecked={preform.respSubcrepitantRalesLeft}
                    label="102 - Raluri subcrepitante - 103"
                    rightChecked={preform.respSubcrepitantRalesRight}
                  />
                </div>

                <div>
                  <LrRow
                    leftChecked={preform.respIntercostalRetractionLeft}
                    label="104 - Tiraj intercost/supraclavic - 105"
                    rightChecked={preform.respIntercostalRetractionRight}
                  />
                  <LrRow
                    leftChecked={preform.respSubcutaneousEmphysemaLeft}
                    label="106 - Emfizem subcutanat - 107"
                    rightChecked={preform.respSubcutaneousEmphysemaRight}
                  />
                  <LrRow
                    leftChecked={preform.respTracheaDeviationLeft}
                    label="108 - Trahee deviată - 109"
                    rightChecked={preform.respTracheaDeviationRight}
                  />
                  <CheckItem checked={preform.respWheezing} label="110 - Wheezing" />
                  <div style={{ marginTop: 6 }}>
                    <b>Alte:</b> {safe(preform.respOther)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #000", padding: 10, marginBottom: 14 }}>
  <SectionTitle>ABDOMEN</SectionTitle>

  <div style={{ fontWeight: 700, marginBottom: 6 }}>NORMAL</div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
    <CheckItem checked={preform.abdomenNormal} label="Normal" />
    <CheckItem checked={preform.abdomenPalpation} label="120 - Palpare" />
    <CheckItem checked={preform.abdomenPercussion} label="121 - Percuție" />
    <CheckItem checked={preform.abdomenBowelTransit} label="122 - Tranzit intest." />
    <CheckItem checked={preform.abdomenRectalExam} label="123 - Tuseu rectal" />
    <CheckItem checked={preform.abdomenDistended} label="124 - Abd. destins" />
    <CheckItem checked={preform.abdomenTransitAbsent} label="125 - Tranzit absent" />
    <CheckItem checked={preform.abdomenHepatomegaly} label="126 - Hepatomegalie" />
    <CheckItem checked={preform.abdomenSplenomegaly} label="127 - Splenomegalie" />
    <CheckItem checked={preform.abdomenPalpableMass} label="128 - Formațiune palpabilă" />
    <CheckItem checked={preform.abdomenTenderness} label="129 - Sensibil la palpare" />
    <CheckItem checked={preform.abdomenRectalPositive} label="130 - Tuseu rectal pozitiv" />
    <CheckItem checked={preform.abdomenPeritonealIrritation} label="131 - Iritație peritoneală" />
  </div>

  <div style={{ marginTop: 8 }}>
    <b>Observații:</b> {safe(preform.abdomenObservations)}
  </div>
</div>

<div style={{ border: "1px solid #000", padding: 10, marginBottom: 14 }}>
  <SectionTitle>TEGUMENT</SectionTitle>

  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
    <CheckItem checked={preform.skinExamNormal} label="140 - Normal" />
    <CheckItem checked={preform.skinExamWarm} label="141 - Cald" />
    <CheckItem checked={preform.skinExamCold} label="142 - Rece" />
    <CheckItem checked={preform.skinExamWet} label="143 - Umed" />
    <CheckItem checked={preform.skinExamDry} label="37 - Uscat" />
    <CheckItem checked={preform.skinExamPruritus} label="144 - Prurit" />
    <CheckItem checked={preform.skinExamExcoriations} label="145 - Escoriații" />
    <CheckItem checked={preform.skinExamEcchymosis} label="146 - Echimoze" />
    <CheckItem checked={preform.skinExamPetechiae} label="147 - Peteșii" />
    <CheckItem checked={preform.skinExamPurpura} label="148 - Purpură" />
    <CheckItem checked={preform.skinExamJaundice} label="149 - Icter" />
    <CheckItem checked={preform.skinExamWounds} label="150 - Plăgi" />
    <CheckItem checked={preform.skinExamPale} label="151 - Palid" />
    <CheckItem checked={preform.skinExamCyanosis} label="152 - Cianoză" />
    <CheckItem checked={preform.skinExamSweaty} label="153 - Transpirat" />
  </div>

  <div style={{ marginTop: 8 }}>
    <b>Localizare:</b> {safe(preform.skinExamLocation)}
  </div>
</div>

<div style={{ border: "1px solid #000", padding: 10, marginBottom: 14 }}>
  <SectionTitle>GENITO URINAR</SectionTitle>

  <div style={{ fontWeight: 700, marginBottom: 6 }}>NORMAL</div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
    <CheckItem checked={preform.guExamNormal} label="Normal" />
    <CheckItem checked={preform.guExternalGenitals} label="160 - Organe genitale externe" />
    <CheckItem checked={preform.guRegularMenstruation} label="161 - Menstruație regulată" />
    <CheckItem checked={preform.guRectalExam} label="162 - Tuseu rectal" />
  </div>

  <div style={{ marginTop: 8 }}>
    <b>163 - Data ult. menstruație:</b> {safe(preform.guLastMenstruationDate)}
  </div>

  <div
    style={{
      marginTop: 8,
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 6,
    }}
  >
    <CheckItem checked={preform.guBloodyVaginalDischarge} label="164 - Scurgeri vaginale sanguinolente" />
    <CheckItem checked={preform.guLeucorrhea} label="165 - Leucoree" />
    <CheckItem checked={preform.guCervixSensitivity} label="166 - Sensibilitatea colului" />
    <CheckItem checked={preform.guEnlargedUterus} label="167 - Uter mărit" />
    <CheckItem checked={preform.guLateroUterineMass} label="168 - Formațiune latero-uterină" />
    <CheckItem checked={preform.guExamHematuria} label="177 - Hematurie" />
  </div>

  <div style={{ marginTop: 10 }}>
    <LrRow
      leftChecked={preform.guGiordanoLeft}
      label="169 - Giordano pozitiv - 170"
      rightChecked={preform.guGiordanoRight}
    />
    <LrRow
      leftChecked={preform.guTesticularSwellingLeft}
      label="171 - Tumefiere testicul - 172"
      rightChecked={preform.guTesticularSwellingRight}
    />
    <LrRow
      leftChecked={preform.guTesticularPainLeft}
      label="173 - Durere testicul - 174"
      rightChecked={preform.guTesticularPainRight}
    />
    <LrRow
      leftChecked={preform.guBreastMassLeft}
      label="175 - Formațiune mamară - 176"
      rightChecked={preform.guBreastMassRight}
    />
    <LrRow
      leftChecked={preform.guTraumaLeft}
      label="249 - Traumă - 250"
      rightChecked={preform.guTraumaRight}
    />
  </div>

  <div style={{ marginTop: 8 }}>
    <b>Alte:</b> {safe(preform.guExamOther)}
  </div>
</div>

<div style={{ border: "1px solid #000", padding: 10, marginBottom: 14 }}>
  <SectionTitle>AP. LOCOMOTOR</SectionTitle>

  <div style={{ fontWeight: 700, marginBottom: 6 }}>NORMAL</div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
    <CheckItem checked={preform.locomotorExamNormal} label="Normal" />
    <CheckItem checked={preform.locomotorHead} label="190 - Cap" />
    <CheckItem checked={preform.locomotorNeck} label="191 - Gât" />
    <CheckItem checked={preform.locomotorTrunk} label="192 - Trunchi" />
    <CheckItem checked={preform.locomotorUpperLimbs} label="193 - Membre superioare" />
    <CheckItem checked={preform.locomotorLowerLimbs} label="194 - Membre inferioare" />
  </div>

  <div style={{ marginTop: 10, fontWeight: 700 }}>Puls prezent</div>
  <div style={{ marginTop: 6 }}>
    <LrRow
      leftChecked={preform.locomotorPulseCarotidLeft}
      label="251 - Carotidă - 252"
      rightChecked={preform.locomotorPulseCarotidRight}
    />
    <LrRow
      leftChecked={preform.locomotorPulseBrachialLeft}
      label="194 - Brahială - 195"
      rightChecked={preform.locomotorPulseBrachialRight}
    />
    <LrRow
      leftChecked={preform.locomotorPulseRadialLeft}
      label="196 - Radială - 197"
      rightChecked={preform.locomotorPulseRadialRight}
    />
    <LrRow
      leftChecked={preform.locomotorPulseFemoralLeft}
      label="198 - Femurală - 199"
      rightChecked={preform.locomotorPulseFemoralRight}
    />
    <LrRow
      leftChecked={preform.locomotorPulsePoplitealLeft}
      label="200 - Poplitee - 201"
      rightChecked={preform.locomotorPulsePoplitealRight}
    />
    <LrRow
      leftChecked={preform.locomotorPulsePedialLeft}
      label="202 - Pedioasă - 203"
      rightChecked={preform.locomotorPulsePedialRight}
    />
  </div>

  <div
    style={{
      marginTop: 10,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6,
    }}
  >
    <CheckItem checked={preform.locomotorExamPain} label="204 - Durere" />
    <CheckItem checked={preform.locomotorExamSwelling} label="205 - Tumefiere" />
    <CheckItem checked={preform.locomotorExamEdema} label="206 - Edem" />
    <CheckItem checked={preform.locomotorExamFunctionalImpairment} label="207 - Impotență funcț." />
    <CheckItem checked={preform.locomotorExamCyanosis} label="208 - Cianoză" />
    <CheckItem checked={preform.locomotorExamOpenFracture} label="209 - Fract. deschisă" />
    <CheckItem checked={preform.locomotorExamClosedFracture} label="210 - Fract. închisă" />
  </div>

  <div style={{ marginTop: 8 }}>
    <b>Observații:</b> {safe(preform.locomotorExamObservations)}
  </div>
</div>

<div style={{ border: "1px solid #000", padding: 10, marginBottom: 14 }}>
  <SectionTitle>NEURO PSIHIATRIC</SectionTitle>

  <div style={{ fontWeight: 700, marginBottom: 6 }}>NORMAL</div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
    <CheckItem checked={preform.neuroPsychNormal} label="Normal" />
    <CheckItem checked={preform.neuroPsychOriented} label="220 - Orientat temp-sp" />
    <CheckItem checked={preform.neuroPsychCranialNerves} label="221 - Nervi cranieni" />
    <CheckItem checked={preform.neuroPsychMotor} label="222 - Motor" />
    <CheckItem checked={preform.neuroPsychSensitive} label="223 - Senzitiv" />
    <CheckItem checked={preform.neuroPsychRot} label="224 - ROT" />
  </div>

  <div
    style={{
      marginTop: 10,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6,
    }}
  >
    <CheckItem checked={preform.neuroPsychHallucinations} label="225 - Halucinații" />
    <CheckItem checked={preform.neuroPsychDelirium} label="226 - Delir" />
    <CheckItem checked={preform.neuroPsychBehaviorDisorders} label="227 - Tulb. comp" />
    <CheckItem checked={preform.neuroPsychAgitated} label="228 - Agitat" />
    <CheckItem checked={preform.neuroPsychObnubilated} label="229 - Obnubilat" />
    <CheckItem checked={preform.neuroPsychConfused} label="230 - Confuz" />
    <CheckItem checked={preform.neuroPsychPhotophobia} label="231 - Fotofobie" />
    <CheckItem checked={preform.neuroPsychNeckStiffness} label="232 - Redoarea cefei" />
    <CheckItem checked={preform.neuroPsychParesthesia} label="233 - Parestezii" />
    <CheckItem checked={preform.neuroPsychAtaxia} label="234 - Ataxie" />
    <CheckItem checked={preform.neuroPsychAphasia} label="235 - Afazie" />
    <CheckItem checked={preform.neuroPsychMyoclonus} label="236 - Mioclonii" />
    <CheckItem checked={preform.neuroPsychConvulsions} label="237 - Convulsii" />
  </div>

  <div style={{ marginTop: 10 }}>
    <LrRow
      leftChecked={preform.neuroPsychPlegiaLeft}
      label="238 - Plegie - 239"
      rightChecked={preform.neuroPsychPlegiaRight}
    />
    <LrRow
      leftChecked={preform.neuroPsychParesisLeft}
      label="240 - Pareză - 241"
      rightChecked={preform.neuroPsychParesisRight}
    />
    <LrRow
      leftChecked={preform.neuroPsychAnesthesiaLeft}
      label="242 - Anestezie - 243"
      rightChecked={preform.neuroPsychAnesthesiaRight}
    />
    <LrRow
      leftChecked={preform.neuroPsychBabinskiLeft}
      label="244 - Babinski - 245"
      rightChecked={preform.neuroPsychBabinskiRight}
    />
  </div>

  <div style={{ marginTop: 8 }}>
    <b>Alte:</b> {safe(preform.neuroPsychOther)}
  </div>
  <div style={{ marginTop: 4 }}>
    <b>Observații:</b> {safe(preform.neuroPsychObservations)}
  </div>
</div>

<div style={{ border: "1px solid #000", padding: 10 }}>
  <SectionTitle>MANEVRE / PROCEDURI</SectionTitle>

  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
    <div>
      <CheckItem checked={preform.proceduresO2Mask} label={`10 - O2 mască (l/min): ${safe(preform.proceduresO2MaskValue)}`} />
      <CheckItem checked={preform.proceduresGuedelCannula} label="11 - Pipa Guedel" />
      <CheckItem checked={preform.proceduresOralCavityAspiration} label="12 - Aspirare cavitate bucală" />
      <CheckItem checked={preform.proceduresIotTubeAspiration} label={`13 - Aspirare pe sondă IOT (ml): ${safe(preform.proceduresIotTubeAspirationValue)}`} />
      <CheckItem checked={preform.proceduresIotWithInduction} label="14 - IOT cu inducție" />
      <CheckItem checked={preform.proceduresIotWithoutInduction} label="15 - IOT fără inducție" />
      <CheckItem checked={preform.proceduresIntWithInduction} label="16 - INT cu inducție" />
      <CheckItem checked={preform.proceduresCombitube} label="17 - Combitub" />
      <CheckItem checked={preform.proceduresLaryngealMask} label="18 - Mască laringiană" />
      <CheckItem checked={preform.proceduresNeedleThoracicDecompression} label="19 - Decompresie toracică pe ac" />
      <CheckItem checked={preform.proceduresChestDrain} label={`20 - Drenaj toracic: ${safe(preform.proceduresChestDrainValue)}`} />
      <CheckItem checked={preform.proceduresMiniCricothyrotomy} label="21 - Minicricotirostomie" />
      <CheckItem checked={preform.proceduresTracheostomy} label="22 - Traheostomie" />
      <CheckItem checked={preform.proceduresNonInvasiveVentilation} label="23 - Ventilație noninvazivă" />
      <CheckItem checked={preform.proceduresMechanicalVentilation} label="24 - Ventilație mecanică" />
      <CheckItem checked={preform.proceduresPeripheralVenousAccess} label={`25 - Acces venos periferic - nr.: ${safe(preform.proceduresPeripheralVenousAccessCount)}`} />
      <CheckItem checked={preform.proceduresIntraosseousAccess} label={`26 - Acces intraosos - nr.: ${safe(preform.proceduresIntraosseousAccessCount)}`} />
      <CheckItem checked={preform.proceduresCentralVenousAccess} label={`27 - Acces venos central: ${safe(preform.proceduresCentralVenousAccessValue)}`} />
      <CheckItem checked={preform.proceduresPvcMeasurement} label="28 - Măsurare PVC" />
      <CheckItem checked={preform.proceduresThrombolysisAmi} label="Tromboliză IMA" />
      <CheckItem checked={preform.proceduresThrombolysisStroke} label="Tromboliză AVC" />
      <CheckItem checked={preform.proceduresThrombolysisPep} label="Tromboliză TEP" />
    </div>

    <div>
      <CheckItem checked={preform.proceduresArterialAccess} label="29 - Acces arterial" />
      <CheckItem checked={preform.proceduresIntramuscularInjection} label="30 - Inj. intramusculară" />
      <CheckItem checked={preform.proceduresSubcutaneousInjection} label="31 - Inj. subcutanată" />
      <CheckItem checked={preform.proceduresIntradermalInjection} label="32 - Inj. intradermică" />
      <CheckItem checked={preform.proceduresIntranasalAdministration} label="33 - Adm. intranazală" />
      <CheckItem checked={preform.proceduresNebulization} label="34 - Nebulizare" />
      <CheckItem checked={preform.proceduresExternalChestCompressions} label="35 - Compresiuni toracice externe" />
      <CheckItem checked={preform.proceduresInvasiveBpMeasurement} label="36 - Măsurare TA invazivă" />
      <CheckItem checked={preform.proceduresEkgMonitoring} label="37 - Monitorizare EKG" />
      <CheckItem checked={preform.proceduresO2SatMonitoring} label="38 - Monitorizare Sat O2" />
      <CheckItem checked={preform.proceduresCapnometry} label="39 - Capnometrie" />
      <div style={{ marginBottom: 4 }}><b>40 - Alte monitorizări:</b> {safe(preform.proceduresOtherMonitoring)}</div>
      <CheckItem checked={preform.proceduresManualDefibrillation} label="41 - Defibrilare manuală" />
      <CheckItem checked={preform.proceduresAutomaticDefibrillation} label="42 - Defibrilare automată" />
      <CheckItem checked={preform.proceduresCardioversion} label="43 - Cardioversie" />
      <CheckItem checked={preform.proceduresTranscutaneousPm} label={`PM transcutanat: ${safe(preform.proceduresTranscutaneousPmValue)}`} />
      <CheckItem checked={preform.proceduresTransvenousPm} label={`PM transvenos: ${safe(preform.proceduresTransvenousPmValue)}`} />
      <CheckItem checked={preform.proceduresAnalgosedation} label="Analgosedare" />
      <CheckItem checked={preform.proceduresLocalAnesthesia} label="Anestezie locală" />
      <CheckItem checked={preform.proceduresShortIvAnesthesia} label="Anestezie iv scurtă durată" />
    </div>

    <div>
      <CheckItem checked={preform.proceduresPericardialPuncture} label="45 - Puncție pericardică" />
      <CheckItem checked={preform.proceduresPeritonealDiagnosticLavage} label="46 - Lavaj peritoneal diag." />
      <CheckItem checked={preform.proceduresActiveRewarming} label="47 - Reîncălzire activă" />
      <CheckItem checked={preform.proceduresPassiveRewarming} label="48 - Reîncălzire pasivă" />
      <CheckItem checked={preform.proceduresGastricLavage} label={`49 - Lavaj gastric: ${safe(preform.proceduresGastricLavageValue)}`} />
      <CheckItem checked={preform.proceduresNasogastricTube} label={`50 - Sondă nazogastrică: ${safe(preform.proceduresNasogastricTubeValue)}`} />
      <CheckItem checked={preform.proceduresUrinaryCatheter} label={`51 - Sondă vezică urinară: ${safe(preform.proceduresUrinaryCatheterValue)}`} />
      <CheckItem checked={preform.proceduresCervicalCollar} label="52 - Guler cervical" />
      <CheckItem checked={preform.proceduresScoopStretcher} label="53 - Targă cu lopeți" />
      <CheckItem checked={preform.proceduresSpineBoard} label="54 - Targă coloană" />
      <CheckItem checked={preform.proceduresLimbImmobilization} label="55 - Imobilizare membre" />
      <CheckItem checked={preform.proceduresSplint} label={`56 - Atelă: ${safe(preform.proceduresSplintValue)}`} />
      <CheckItem checked={preform.proceduresCastDevice} label="57 - Aparat gipsat" />
      <CheckItem checked={preform.proceduresWoundCleaning} label="58 - Toaletă plagă" />
      <CheckItem checked={preform.proceduresSuture} label="59 - Sutură" />
      <CheckItem checked={preform.proceduresMessage} label="60 - Mesaj" />
      <CheckItem checked={preform.proceduresNasalPacking} label="61 - Tamponament nazal" />
      <CheckItem checked={preform.proceduresShortSedation} label="Sedare de scurtă durată" />
      <CheckItem checked={preform.proceduresProceduralSedation} label="Sedare procedurală" />
      <CheckItem checked={preform.proceduresLongSedation} label="Sedare de lungă durată" />
      <CheckItem checked={preform.proceduresArterialPuncture} label="Puncție arterială" />
      <div style={{ marginBottom: 4 }}><b>Alte:</b> {safe(preform.proceduresOther)}</div>
    </div>
  </div>

  <div style={{ marginTop: 10 }}>
    <b>Observații:</b> {safe(preform.proceduresObservations)}
  </div>
</div>
      </div>
    </div>
  );
}