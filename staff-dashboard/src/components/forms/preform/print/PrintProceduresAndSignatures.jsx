import { CheckItem, SectionTitle, SignatureBlock, safe } from "./PrintCommon";

export default function PrintProceduresAndSignatures({ preform }) {
  return (
    <>
      <div style={sectionBoxStyle}>
        <SectionTitle>MANEVRE / PROCEDURI</SectionTitle>

        <div style={columnsStyle}>
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
            <div style={{ marginBottom: 4 }}>
              <b>40 - Alte monitorizări:</b> {safe(preform.proceduresOtherMonitoring)}
            </div>
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
            <div style={{ marginBottom: 4 }}>
              <b>Alte:</b> {safe(preform.proceduresOther)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <b>Observații:</b> {safe(preform.proceduresObservations)}
        </div>
      </div>

      <div style={signatureGridStyle}>
        <SignatureBlock
          title="Semnătura asistent(ă)"
          name={preform.nurseName}
          signature={preform.nurseSignature}
          signedAt={preform.nurseSignedAt}
        />

        <SignatureBlock
          title="Semnătura medic"
          name={preform.doctorName}
          signature={preform.doctorSignature}
          signedAt={preform.doctorSignedAt}
        />
      </div>
    </>
  );
}

const sectionBoxStyle = {
  border: "1px solid #000",
  padding: 10,
  marginBottom: 14,
};

const columnsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

const signatureGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};