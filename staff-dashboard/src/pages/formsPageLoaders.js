function extractSheetNumber(visitCode) {
  if (!visitCode) return "";
  return visitCode.replace("UPU-", "");
}

function getTodayDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildAppliedProceduresFromPreform(preformData) {
  if (!preformData) return "";

  const procedures = [];

  const addIfChecked = (checked, label, value) => {
    if (!checked) return;

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      procedures.push(`${label}: ${String(value).trim()}`);
    } else {
      procedures.push(label);
    }
  };

  addIfChecked(preformData.proceduresO2Mask, "O2 mască", preformData.proceduresO2MaskValue);
  addIfChecked(preformData.proceduresGuedelCannula, "Pipa Guedel");
  addIfChecked(preformData.proceduresOralCavityAspiration, "Aspirare cavitate bucală");
  addIfChecked(
    preformData.proceduresIotTubeAspiration,
    "Aspirare pe sondă IOT",
    preformData.proceduresIotTubeAspirationValue
  );
  addIfChecked(preformData.proceduresIotWithInduction, "IOT cu inducție");
  addIfChecked(preformData.proceduresIotWithoutInduction, "IOT fără inducție");
  addIfChecked(preformData.proceduresIntWithInduction, "INT cu inducție");
  addIfChecked(preformData.proceduresCombitube, "Combitub");
  addIfChecked(preformData.proceduresLaryngealMask, "Mască laringiană");
  addIfChecked(preformData.proceduresNeedleThoracicDecompression, "Decompresie toracică pe ac");
  addIfChecked(
    preformData.proceduresChestDrain,
    "Drenaj toracic",
    preformData.proceduresChestDrainValue
  );
  addIfChecked(preformData.proceduresMiniCricothyrotomy, "Minicricotirostomie");
  addIfChecked(preformData.proceduresTracheostomy, "Traheostomie");
  addIfChecked(preformData.proceduresNonInvasiveVentilation, "Ventilație noninvazivă");
  addIfChecked(preformData.proceduresMechanicalVentilation, "Ventilație mecanică");
  addIfChecked(
    preformData.proceduresPeripheralVenousAccess,
    "Acces venos periferic",
    preformData.proceduresPeripheralVenousAccessCount
  );
  addIfChecked(
    preformData.proceduresIntraosseousAccess,
    "Acces intraosos",
    preformData.proceduresIntraosseousAccessCount
  );
  addIfChecked(
    preformData.proceduresCentralVenousAccess,
    "Acces venos central",
    preformData.proceduresCentralVenousAccessValue
  );
  addIfChecked(preformData.proceduresPvcMeasurement, "Măsurare PVC");
  addIfChecked(preformData.proceduresThrombolysisAmi, "Tromboliză IMA");
  addIfChecked(preformData.proceduresThrombolysisStroke, "Tromboliză AVC");
  addIfChecked(preformData.proceduresThrombolysisPep, "Tromboliză TEP");
  addIfChecked(preformData.proceduresArterialAccess, "Acces arterial");
  addIfChecked(preformData.proceduresIntramuscularInjection, "Injecție intramusculară");
  addIfChecked(preformData.proceduresSubcutaneousInjection, "Injecție subcutanată");
  addIfChecked(preformData.proceduresIntradermalInjection, "Injecție intradermică");
  addIfChecked(preformData.proceduresIntranasalAdministration, "Administrare intranazală");
  addIfChecked(preformData.proceduresNebulization, "Nebulizare");
  addIfChecked(preformData.proceduresExternalChestCompressions, "Compresiuni toracice externe");
  addIfChecked(preformData.proceduresInvasiveBpMeasurement, "Măsurare TA invazivă");
  addIfChecked(preformData.proceduresEkgMonitoring, "Monitorizare EKG");
  addIfChecked(preformData.proceduresO2SatMonitoring, "Monitorizare Sat O2");
  addIfChecked(preformData.proceduresCapnometry, "Capnometrie");

  if (preformData.proceduresOtherMonitoring?.trim()) {
    procedures.push(`Alte monitorizări: ${preformData.proceduresOtherMonitoring.trim()}`);
  }

  addIfChecked(preformData.proceduresManualDefibrillation, "Defibrilare manuală");
  addIfChecked(preformData.proceduresAutomaticDefibrillation, "Defibrilare automată");
  addIfChecked(preformData.proceduresCardioversion, "Cardioversie");
  addIfChecked(
    preformData.proceduresTranscutaneousPm,
    "PM transcutanat",
    preformData.proceduresTranscutaneousPmValue
  );
  addIfChecked(
    preformData.proceduresTransvenousPm,
    "PM transvenos",
    preformData.proceduresTransvenousPmValue
  );
  addIfChecked(preformData.proceduresAnalgosedation, "Analgosedare");
  addIfChecked(preformData.proceduresLocalAnesthesia, "Anestezie locală");
  addIfChecked(preformData.proceduresShortIvAnesthesia, "Anestezie IV scurtă durată");
  addIfChecked(preformData.proceduresPericardialPuncture, "Puncție pericardică");
  addIfChecked(preformData.proceduresPeritonealDiagnosticLavage, "Lavaj peritoneal diagnostic");
  addIfChecked(preformData.proceduresActiveRewarming, "Reîncălzire activă");
  addIfChecked(preformData.proceduresPassiveRewarming, "Reîncălzire pasivă");
  addIfChecked(
    preformData.proceduresGastricLavage,
    "Lavaj gastric",
    preformData.proceduresGastricLavageValue
  );
  addIfChecked(
    preformData.proceduresNasogastricTube,
    "Sondă nazogastrică",
    preformData.proceduresNasogastricTubeValue
  );
  addIfChecked(
    preformData.proceduresUrinaryCatheter,
    "Sondă vezică urinară",
    preformData.proceduresUrinaryCatheterValue
  );
  addIfChecked(preformData.proceduresCervicalCollar, "Guler cervical");
  addIfChecked(preformData.proceduresScoopStretcher, "Targă cu lopeți");
  addIfChecked(preformData.proceduresSpineBoard, "Targă coloană");
  addIfChecked(preformData.proceduresLimbImmobilization, "Imobilizare membre");
  addIfChecked(preformData.proceduresSplint, "Atelă", preformData.proceduresSplintValue);
  addIfChecked(preformData.proceduresCastDevice, "Aparat gipsat");
  addIfChecked(preformData.proceduresWoundCleaning, "Toaletă plagă");
  addIfChecked(preformData.proceduresSuture, "Sutură");
  addIfChecked(preformData.proceduresMessage, "Mesaj");
  addIfChecked(preformData.proceduresNasalPacking, "Tamponament nazal");
  addIfChecked(preformData.proceduresShortSedation, "Sedare de scurtă durată");
  addIfChecked(preformData.proceduresProceduralSedation, "Sedare procedurală");
  addIfChecked(preformData.proceduresLongSedation, "Sedare de lungă durată");
  addIfChecked(preformData.proceduresArterialPuncture, "Puncție arterială");

  if (preformData.proceduresOther?.trim()) {
  procedures.push(preformData.proceduresOther.trim());
}

  return procedures.join(", ");
}

export async function loadPreformIntoState({
  selected,
  setLoading,
  setMsg,
  setPatientDetails,
  setPreform,
  setAiTriageResult,
  loadPreformData,
}) {
  if (!selected) return;

  setLoading(true);
  setMsg("");

  try {
    const result = await loadPreformData(selected);
    const patient = result.patient;
    const data = result.data;

    setPatientDetails(patient);

    let parsedDetails = {};
    try {
      parsedDetails = data?.details ? JSON.parse(data.details) : {};
    } catch {
      parsedDetails = {};
    }
    
    if (setAiTriageResult) {
  setAiTriageResult(parsedDetails.aiTriageResult || null);
}

    setPreform((prev) => ({
      ...prev,
      ...(data ? data : {}),
      ...parsedDetails,
      triageColor: data?.triageColor || "",
      arrivalMode: data?.arrivalMode || prev.arrivalMode,
      sheetNumber: data?.sheetNumber || extractSheetNumber(selected.visitCode),
      presentationDate: data?.presentationDate || getTodayDate(),
      presentationTime: data?.presentationTime || getCurrentTime(),
      firstName: data?.firstName?.trim() ? data.firstName : patient.firstName || "",
      lastName: data?.lastName?.trim() ? data.lastName : patient.lastName || "",
      cnp: data?.cnp ? data.cnp : patient.cnp || "",
      phoneNumber: data?.phoneNumber ? data.phoneNumber : patient.phoneNumber || "",
      email: data?.email ? data.email : patient.email || "",
      doctorName: data?.doctorName || prev.doctorName || "",
      doctorSignature: data?.doctorSignature || prev.doctorSignature || "",
      doctorSignedAt: data?.doctorSignedAt || prev.doctorSignedAt || null,
      nurseName: data?.nurseName || prev.nurseName || "",
      nurseSignature: data?.nurseSignature || prev.nurseSignature || "",
      nurseSignedAt: data?.nurseSignedAt || prev.nurseSignedAt || null,
    }));
  } catch (e) {
    setMsg(`Eroare load preform: ${e}`);
  } finally {
    setLoading(false);
  }
}

export async function loadDischargeIntoState({
  selected,
  setMsg,
  setPatientDetails,
  setDischarge,
  loadDischargeData,
}) {
  if (!selected) return;

  setMsg("");

  try {
    const result = await loadDischargeData(selected);
    const patient = result.patient;
    const data = result.data;
    const preformData = result.preformData;

    setPatientDetails(patient);

    const currentHour = new Date().toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let parsedDetails = {};
    try {
      parsedDetails = data?.details ? JSON.parse(data.details) : {};
    } catch {
      parsedDetails = {};
    }

    let parsedPreformDetails = {};
    try {
      parsedPreformDetails = preformData?.details ? JSON.parse(preformData.details) : {};
    } catch {
      parsedPreformDetails = {};
    }

    const mergedPreformData = {
      ...(preformData || {}),
      ...parsedPreformDetails,
    };

    setDischarge((prev) => ({
      ...prev,
      ...(data ? data : {}),
      ...parsedDetails,
      hospitalName: data?.hospitalName || prev.hospitalName || "SPITALUL CLINIC DE URGENȚĂ",
      sectionName: data?.sectionName || prev.sectionName || "",
      foNumber: data?.foNumber || mergedPreformData?.sheetNumber || "",
      firstName: data?.firstName?.trim()
        ? data.firstName
        : mergedPreformData?.firstName || patient.firstName || "",
      lastName: data?.lastName?.trim()
        ? data.lastName
        : mergedPreformData?.lastName || patient.lastName || "",
      birthDate: data?.birthDate || mergedPreformData?.birthDate || "",
      age: data?.age ?? mergedPreformData?.age ?? "",
      diagnosisAtAdmission:
        data?.diagnosisAtAdmission?.trim()
          ? data.diagnosisAtAdmission
          : mergedPreformData?.anamnesis || "",
      appliedProcedures:
        data?.appliedProcedures?.trim()
          ? data.appliedProcedures
          : buildAppliedProceduresFromPreform(mergedPreformData),
      dischargeHour: parsedDetails?.dischargeHour || currentHour,
      doctorName: data?.doctorName || prev.doctorName || "",
      doctorSignature: data?.doctorSignature || prev.doctorSignature || "",
      doctorSignedAt: data?.doctorSignedAt || prev.doctorSignedAt || null,
      nurseName: data?.nurseName || prev.nurseName || "",
      nurseSignature: data?.nurseSignature || prev.nurseSignature || "",
      nurseSignedAt: data?.nurseSignedAt || prev.nurseSignedAt || null,
    }));
  } catch (e) {
    setMsg(`Eroare load externare: ${e}`);
  }
}