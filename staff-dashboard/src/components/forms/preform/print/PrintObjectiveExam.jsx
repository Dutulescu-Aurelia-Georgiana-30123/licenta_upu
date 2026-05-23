import { CheckItem, LrRow, SectionTitle, safe } from "./PrintCommon";

export default function PrintObjectiveExam({ preform }) {
  return (
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
        <div style={boxStyle}>
          <div style={titleStyle}>CAP</div>
          <CheckItem checked={preform.headNormal} label="30 - Normal" />
          <CheckItem checked={preform.headTraumaMark} label="31 - Marcă traumatică" />
          <CheckItem checked={preform.headOralLesions} label="32 - Leziuni cav. bucală" />
          <CheckItem checked={preform.headDentalLesions} label="33 - Leziuni dentare" />
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>GÂT</div>
          <CheckItem checked={preform.neckNormal} label="34 - Normal" />
          <CheckItem checked={preform.neckTraumaMark} label="35 - Marcă traumatică" />
          <CheckItem checked={preform.neckPalpableFormations} label="36 - Formațiuni palpabile" />
          <div style={{ marginTop: 6 }}>
            <b>Alte:</b> {safe(preform.neckOther)}
          </div>
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>NAS</div>
          <div style={{ fontWeight: 700 }}>NORMAL</div>
          <CheckItem checked={preform.noseNostrilsNormal} label="38 - Nări" />
          <CheckItem checked={preform.noseMucosaNormal} label="39 - Mucoasa nazală" />

          <div style={{ marginBottom: 8 }}>
            <b>Alte:</b> {safe(preform.noseOther)}
          </div>

          <LrRow leftChecked={preform.noseEpistaxisLeft} label="40 - Epistaxis - 41" rightChecked={preform.noseEpistaxisRight} />
          <LrRow leftChecked={preform.noseForeignBodyLeft} label="42 - Corpi străini - 43" rightChecked={preform.noseForeignBodyRight} />
          <LrRow leftChecked={preform.noseTraumaLeft} label="44 - Traumă - 44'" rightChecked={preform.noseTraumaRight} />
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>APARAT AUDITIV</div>
          <div style={{ fontWeight: 700 }}>NORMAL</div>
          <CheckItem checked={preform.earTympanicMembraneNormal} label="45 - Membrana timpanică" />
          <CheckItem checked={preform.earExternalCanalsNormal} label="46 - Căi auditive externe" />
          <CheckItem checked={preform.earAuricleNormal} label="47 - Pavilionul urechii" />

          <div style={{ marginBottom: 8 }}>
            <b>Alte:</b> {safe(preform.earOther)}
          </div>

          <LrRow leftChecked={preform.earOtorrhagiaLeft} label="48 - Otoragie - 49" rightChecked={preform.earOtorrhagiaRight} />
          <LrRow leftChecked={preform.earForeignBodyLeft} label="50 - Corpi străini - 51" rightChecked={preform.earForeignBodyRight} />
          <LrRow leftChecked={preform.earHemotympanumLeft} label="52 - Hemotimpan - 53" rightChecked={preform.earHemotympanumRight} />
          <LrRow leftChecked={preform.earTraumaLeft} label="Traumă" rightChecked={preform.earTraumaRight} />
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>OCHI</div>
          <div style={{ fontWeight: 700 }}>NORMAL</div>
          <CheckItem checked={preform.eyeMobilityNormal} label="54 - Mobilitate globi oculari" />
          <CheckItem checked={preform.eyePupilsNormal} label="55 - Pupile" />

          <div style={{ marginBottom: 8 }}>
            <b>Alte:</b> {safe(preform.eyeExamOther)}
          </div>

          <LrRow leftChecked={preform.eyeConjunctivitisLeft} label="56 - Conjunctivite - 57" rightChecked={preform.eyeConjunctivitisRight} />
          <LrRow leftChecked={preform.eyeMydriasisLeft} label="58 - Midriază - 59" rightChecked={preform.eyeMydriasisRight} />
          <LrRow leftChecked={preform.eyeMiosisLeft} label="60 - Mioză - 61" rightChecked={preform.eyeMiosisRight} />
          <LrRow leftChecked={preform.eyeNystagmusLeft} label="62 - Nistagmus - 63" rightChecked={preform.eyeNystagmusRight} />
          <LrRow leftChecked={preform.eyeDeviationLeft} label="64 - Deviere gl. oc. - 65" rightChecked={preform.eyeDeviationRight} />
          <LrRow leftChecked={preform.eyeTraumaExamLeft} label="247 - Traumă - 248" rightChecked={preform.eyeTraumaExamRight} />
        </div>

        <div style={boxStyle}>
          <div style={titleStyle}>APARAT CARDIOVASCULAR</div>

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

        <div style={{ gridColumn: "1 / -1", ...boxStyle }}>
          <div style={titleStyle}>TORACE / APARAT RESPIRATOR</div>

          <div style={{ fontWeight: 700 }}>NORMAL</div>
          <CheckItem checked={preform.respThoraxAspectNormal} label="90 - Aspectul toracelui" />
          <CheckItem checked={preform.respThoraxPercussionNormal} label="91 - Percuția toracelui" />
          <CheckItem checked={preform.respVesicularBilateralNormal} label="92 - Murmur vezicular bilat." />
          <CheckItem checked={preform.respOropharynxNormal} label="93 - Orofaringe" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            <div>
              <LrRow leftChecked={preform.respDiminishedMurmurLeft} label="94 - Murmur vezicular diminuat - 95" rightChecked={preform.respDiminishedMurmurRight} />
              <LrRow leftChecked={preform.respAbsentMurmurLeft} label="96 - Murmur vezicular absent - 95" rightChecked={preform.respAbsentMurmurRight} />
              <LrRow leftChecked={preform.respWheezingRalesLeft} label="94 - Raluri sibilante - 97" rightChecked={preform.respWheezingRalesRight} />
              <LrRow leftChecked={preform.respCrepitantRalesLeft} label="100 - Raluri crepitante - 101" rightChecked={preform.respCrepitantRalesRight} />
              <LrRow leftChecked={preform.respSubcrepitantRalesLeft} label="102 - Raluri subcrepitante - 103" rightChecked={preform.respSubcrepitantRalesRight} />
            </div>

            <div>
              <LrRow leftChecked={preform.respIntercostalRetractionLeft} label="104 - Tiraj intercost/supraclavic - 105" rightChecked={preform.respIntercostalRetractionRight} />
              <LrRow leftChecked={preform.respSubcutaneousEmphysemaLeft} label="106 - Emfizem subcutanat - 107" rightChecked={preform.respSubcutaneousEmphysemaRight} />
              <LrRow leftChecked={preform.respTracheaDeviationLeft} label="108 - Trahee deviată - 109" rightChecked={preform.respTracheaDeviationRight} />
              <CheckItem checked={preform.respWheezing} label="110 - Wheezing" />

              <div style={{ marginTop: 6 }}>
                <b>Alte:</b> {safe(preform.respOther)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
  <PrintBox title="ABDOMEN">
    <div style={gridThreeStyle}>
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
  </PrintBox>

  <PrintBox title="TEGUMENT">
    <div style={gridThreeStyle}>
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
  </PrintBox>

  <PrintBox title="GENITO URINAR">
    <div style={gridThreeStyle}>
      <CheckItem checked={preform.guExamNormal} label="Normal" />
      <CheckItem checked={preform.guExternalGenitals} label="160 - Organe genitale externe" />
      <CheckItem checked={preform.guRegularMenstruation} label="161 - Menstruație regulată" />
      <CheckItem checked={preform.guRectalExam} label="162 - Tuseu rectal" />
    </div>

    <div style={{ marginTop: 8 }}>
      <b>163 - Data ult. menstruație:</b> {safe(preform.guLastMenstruationDate)}
    </div>

    <div style={{ marginTop: 8, ...gridTwoStyle }}>
      <CheckItem checked={preform.guBloodyVaginalDischarge} label="164 - Scurgeri vaginale sanguinolente" />
      <CheckItem checked={preform.guLeucorrhea} label="165 - Leucoree" />
      <CheckItem checked={preform.guCervixSensitivity} label="166 - Sensibilitatea colului" />
      <CheckItem checked={preform.guEnlargedUterus} label="167 - Uter mărit" />
      <CheckItem checked={preform.guLateroUterineMass} label="168 - Formațiune latero-uterină" />
      <CheckItem checked={preform.guExamHematuria} label="177 - Hematurie" />
    </div>

    <div style={{ marginTop: 10 }}>
      <LrRow leftChecked={preform.guGiordanoLeft} label="169 - Giordano pozitiv - 170" rightChecked={preform.guGiordanoRight} />
      <LrRow leftChecked={preform.guTesticularSwellingLeft} label="171 - Tumefiere testicul - 172" rightChecked={preform.guTesticularSwellingRight} />
      <LrRow leftChecked={preform.guTesticularPainLeft} label="173 - Durere testicul - 174" rightChecked={preform.guTesticularPainRight} />
      <LrRow leftChecked={preform.guBreastMassLeft} label="175 - Formațiune mamară - 176" rightChecked={preform.guBreastMassRight} />
      <LrRow leftChecked={preform.guTraumaLeft} label="249 - Traumă - 250" rightChecked={preform.guTraumaRight} />
    </div>

    <div style={{ marginTop: 8 }}>
      <b>Alte:</b> {safe(preform.guExamOther)}
    </div>
  </PrintBox>

  <PrintBox title="AP. LOCOMOTOR">
    <div style={gridThreeStyle}>
      <CheckItem checked={preform.locomotorExamNormal} label="Normal" />
      <CheckItem checked={preform.locomotorHead} label="190 - Cap" />
      <CheckItem checked={preform.locomotorNeck} label="191 - Gât" />
      <CheckItem checked={preform.locomotorTrunk} label="192 - Trunchi" />
      <CheckItem checked={preform.locomotorUpperLimbs} label="193 - Membre superioare" />
      <CheckItem checked={preform.locomotorLowerLimbs} label="194 - Membre inferioare" />
    </div>

    <div style={{ marginTop: 10, fontWeight: 700 }}>Puls prezent</div>

    <div style={{ marginTop: 6 }}>
      <LrRow leftChecked={preform.locomotorPulseCarotidLeft} label="251 - Carotidă - 252" rightChecked={preform.locomotorPulseCarotidRight} />
      <LrRow leftChecked={preform.locomotorPulseBrachialLeft} label="194 - Brahială - 195" rightChecked={preform.locomotorPulseBrachialRight} />
      <LrRow leftChecked={preform.locomotorPulseRadialLeft} label="196 - Radială - 197" rightChecked={preform.locomotorPulseRadialRight} />
      <LrRow leftChecked={preform.locomotorPulseFemoralLeft} label="198 - Femurală - 199" rightChecked={preform.locomotorPulseFemoralRight} />
      <LrRow leftChecked={preform.locomotorPulsePoplitealLeft} label="200 - Poplitee - 201" rightChecked={preform.locomotorPulsePoplitealRight} />
      <LrRow leftChecked={preform.locomotorPulsePedialLeft} label="202 - Pedioasă - 203" rightChecked={preform.locomotorPulsePedialRight} />
    </div>

    <div style={{ marginTop: 10, ...gridThreeStyle }}>
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
  </PrintBox>

  <PrintBox title="NEURO PSIHIATRIC">
    <div style={gridThreeStyle}>
      <CheckItem checked={preform.neuroPsychNormal} label="Normal" />
      <CheckItem checked={preform.neuroPsychOriented} label="220 - Orientat temp-sp" />
      <CheckItem checked={preform.neuroPsychCranialNerves} label="221 - Nervi cranieni" />
      <CheckItem checked={preform.neuroPsychMotor} label="222 - Motor" />
      <CheckItem checked={preform.neuroPsychSensitive} label="223 - Senzitiv" />
      <CheckItem checked={preform.neuroPsychRot} label="224 - ROT" />
    </div>

    <div style={{ marginTop: 10, ...gridThreeStyle }}>
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
      <LrRow leftChecked={preform.neuroPsychPlegiaLeft} label="238 - Plegie - 239" rightChecked={preform.neuroPsychPlegiaRight} />
      <LrRow leftChecked={preform.neuroPsychParesisLeft} label="240 - Pareză - 241" rightChecked={preform.neuroPsychParesisRight} />
      <LrRow leftChecked={preform.neuroPsychAnesthesiaLeft} label="242 - Anestezie - 243" rightChecked={preform.neuroPsychAnesthesiaRight} />
      <LrRow leftChecked={preform.neuroPsychBabinskiLeft} label="244 - Babinski - 245" rightChecked={preform.neuroPsychBabinskiRight} />
    </div>

    <div style={{ marginTop: 8 }}>
      <b>Alte:</b> {safe(preform.neuroPsychOther)}
    </div>

    <div style={{ marginTop: 4 }}>
      <b>Observații:</b> {safe(preform.neuroPsychObservations)}
    </div>
  </PrintBox>
</div>
    </div>
  );
}

function PrintBox({ title, children }) {
  return (
    <div style={{ border: "1px solid #000", padding: 10, marginBottom: 14 }}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

const boxStyle = {
  border: "1px solid #000",
  padding: 8,
};

const titleStyle = {
  fontWeight: 700,
  marginBottom: 6,
};

const gridThreeStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 6,
};

const gridTwoStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 6,
};