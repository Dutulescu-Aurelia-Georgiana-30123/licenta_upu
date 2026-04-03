import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/api";
import { initialPreformState, initialDischargeState } from "../forms/initialStates";
import PatientSearchPanel from "../components/forms/PatientSearchPanel";
import PatientDetailsPanel from "../components/forms/PatientDetailsPanel";
import FormsToolbar from "../components/forms/FormsToolbar";
import PreformSection from "../components/forms/PreformSection";
import DischargeSection from "../components/forms/DischargeSection";
import PreformPrintView from "../components/forms/PreFormPrintView";
import DischargePrintView from "../components/forms/DischargePrintView";
import html2pdf from "html2pdf.js";

export default function FormsPage({ selected, onSelectVisit }) {
  const [searchMode, setSearchMode] = useState(false);
  const [preformOpen, setPreformOpen] = useState(false);
  const [dischargeOpen, setDischargeOpen] = useState(false);

  const [preform, setPreform] = useState(initialPreformState);
  const [discharge, setDischarge] = useState(initialDischargeState);

  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);

  const [combinedPrintMode, setCombinedPrintMode] = useState(false);

  const loadPreform = async () => {
    if (!selected) return;
    setLoading(true);
    setMsg("");

    try {
      const patient = await apiGet(`/patients/${selected.patientId}`);
      setPatientDetails(patient);

      let data = null;
      try {
        data = await apiGet(`/visits/${selected.id}/preform`);
      } catch {
        data = null;
      }

      setPreform((prev) => ({
        ...prev,
        ...(data ? data : {}),
        triageColor: data?.triageColor || prev.triageColor,
        arrivalMode: data?.arrivalMode || prev.arrivalMode,
        firstName: data?.firstName?.trim() ? data.firstName : patient.firstName || "",
        lastName: data?.lastName?.trim() ? data.lastName : patient.lastName || "",
        cnp: data?.cnp ? data.cnp : patient.cnp || "",
        phoneNumber: data?.phoneNumber ? data.phoneNumber : patient.phoneNumber || "",
        email: data?.email ? data.email : patient.email || "",
      }));
    } catch (e) {
      setMsg(`Eroare load preform: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const loadDischarge = async () => {
    if (!selected) return;
    setMsg("");

    try {
      const patient = await apiGet(`/patients/${selected.patientId}`);
      setPatientDetails(patient);

      let data = null;
      let preformData = null;

      try {
        data = await apiGet(`/visits/${selected.id}/discharge`);
      } catch {
        data = null;
      }

      try {
        preformData = await apiGet(`/visits/${selected.id}/preform`);
      } catch {
        preformData = null;
      }

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

      setDischarge((prev) => ({
        ...prev,
        ...(data ? data : {}),
        ...parsedDetails,
        hospitalName: data?.hospitalName || prev.hospitalName || "SPITALUL CLINIC DE URGENȚĂ",
        sectionName: data?.sectionName || prev.sectionName || "",
        foNumber: data?.foNumber || preformData?.sheetNumber || "",
        firstName: data?.firstName?.trim()
          ? data.firstName
          : preformData?.firstName || patient.firstName || "",
        lastName: data?.lastName?.trim()
          ? data.lastName
          : preformData?.lastName || patient.lastName || "",
        birthDate: data?.birthDate || preformData?.birthDate || "",
        age: data?.age ?? preformData?.age ?? "",
        dischargeHour: parsedDetails?.dischargeHour || currentHour,
      }));
    } catch (e) {
      setMsg(`Eroare load externare: ${e}`);
    }
  };

  useEffect(() => {
    if (!selected) return;
    setStatus(selected.status || "");
    setPreformOpen(false);
    setDischargeOpen(false);
    setSearchMode(false);
    setSearch("");
    setSearchResults([]);
    setSelectedPatient(null);
    setPatientVisits([]);
    setCombinedPrintMode(false);
    loadPreform();
    loadDischarge();
  }, [selected?.id]);

  const toIntOrNull = (v) =>
    v === "" ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null;

  const toFloatOrNull = (v) =>
    v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null;

  const savePreform = async () => {
    if (!selected) return;
    setMsg("");
    setLoading(true);

    const payload = {
      ...preform,
      age: toIntOrNull(preform.age),
      gcs: toIntOrNull(preform.gcs),
      gcsM: toIntOrNull(preform.gcsM),
      gcsV: toIntOrNull(preform.gcsV),
      gcsO: toIntOrNull(preform.gcsO),
      heightCm: toIntOrNull(preform.heightCm),
      weightKg: toFloatOrNull(preform.weightKg),
      respiratoryRate: toIntOrNull(preform.respiratoryRate),
      pulse: toIntOrNull(preform.pulse),
      systolicBp: toIntOrNull(preform.systolicBp),
      diastolicBp: toIntOrNull(preform.diastolicBp),
      spo2: toIntOrNull(preform.spo2),
      glycemia: toIntOrNull(preform.glycemia),
      temperature: toFloatOrNull(preform.temperature),

      details: JSON.stringify({
        objectiveGeneralState: preform.objectiveGeneralState || "",

        headNormal: preform.headNormal || false,
        headTraumaMark: preform.headTraumaMark || false,
        headOralLesions: preform.headOralLesions || false,
        headDentalLesions: preform.headDentalLesions || false,

        neckNormal: preform.neckNormal || false,
        neckTraumaMark: preform.neckTraumaMark || false,
        neckPalpableFormations: preform.neckPalpableFormations || false,
        neckOther: preform.neckOther || "",

        noseNostrilsNormal: preform.noseNostrilsNormal || false,
        noseMucosaNormal: preform.noseMucosaNormal || false,
        noseOther: preform.noseOther || "",
        noseEpistaxisLeft: preform.noseEpistaxisLeft || false,
        noseEpistaxisRight: preform.noseEpistaxisRight || false,
        noseForeignBodyLeft: preform.noseForeignBodyLeft || false,
        noseForeignBodyRight: preform.noseForeignBodyRight || false,
        noseTraumaLeft: preform.noseTraumaLeft || false,
        noseTraumaRight: preform.noseTraumaRight || false,

        earTympanicMembraneNormal: preform.earTympanicMembraneNormal || false,
        earExternalCanalsNormal: preform.earExternalCanalsNormal || false,
        earAuricleNormal: preform.earAuricleNormal || false,
        earOther: preform.earOther || "",
        earOtorrhagiaLeft: preform.earOtorrhagiaLeft || false,
        earOtorrhagiaRight: preform.earOtorrhagiaRight || false,
        earForeignBodyLeft: preform.earForeignBodyLeft || false,
        earForeignBodyRight: preform.earForeignBodyRight || false,
        earHemotympanumLeft: preform.earHemotympanumLeft || false,
        earHemotympanumRight: preform.earHemotympanumRight || false,
        earTraumaLeft: preform.earTraumaLeft || false,
        earTraumaRight: preform.earTraumaRight || false,

        eyeMobilityNormal: preform.eyeMobilityNormal || false,
        eyePupilsNormal: preform.eyePupilsNormal || false,
        eyeExamOther: preform.eyeExamOther || "",
        eyeConjunctivitisLeft: preform.eyeConjunctivitisLeft || false,
        eyeConjunctivitisRight: preform.eyeConjunctivitisRight || false,
        eyeMydriasisLeft: preform.eyeMydriasisLeft || false,
        eyeMydriasisRight: preform.eyeMydriasisRight || false,
        eyeMiosisLeft: preform.eyeMiosisLeft || false,
        eyeMiosisRight: preform.eyeMiosisRight || false,
        eyeNystagmusLeft: preform.eyeNystagmusLeft || false,
        eyeNystagmusRight: preform.eyeNystagmusRight || false,
        eyeDeviationLeft: preform.eyeDeviationLeft || false,
        eyeDeviationRight: preform.eyeDeviationRight || false,
        eyeTraumaExamLeft: preform.eyeTraumaExamLeft || false,
        eyeTraumaExamRight: preform.eyeTraumaExamRight || false,

        cvRhythmNormal: preform.cvRhythmNormal || false,
        cvPeripheralPulseNormal: preform.cvPeripheralPulseNormal || false,
        cvHeartAuscultationNormal: preform.cvHeartAuscultationNormal || false,
        cvIrregularPulse: preform.cvIrregularPulse || false,
        cvFiliformPeripheralPulse: preform.cvFiliformPeripheralPulse || false,
        cvPulseDeficit: preform.cvPulseDeficit || false,
        cvArrhythmicSounds: preform.cvArrhythmicSounds || false,
        cvMuffledSounds: preform.cvMuffledSounds || false,
        cvPericardialRub: preform.cvPericardialRub || false,
        cvJugularTurgor: preform.cvJugularTurgor || false,
        cvSystolicMurmur: preform.cvSystolicMurmur || false,
        cvDiastolicMurmur: preform.cvDiastolicMurmur || false,
        cvAorticMurmur: preform.cvAorticMurmur || false,
        cvGallop: preform.cvGallop || false,
        cvCarotidMurmur: preform.cvCarotidMurmur || false,
        cvObservations: preform.cvObservations || "",

        respThoraxAspectNormal: preform.respThoraxAspectNormal || false,
        respThoraxPercussionNormal: preform.respThoraxPercussionNormal || false,
        respVesicularBilateralNormal: preform.respVesicularBilateralNormal || false,
        respOropharynxNormal: preform.respOropharynxNormal || false,
        respDiminishedMurmurLeft: preform.respDiminishedMurmurLeft || false,
        respDiminishedMurmurRight: preform.respDiminishedMurmurRight || false,
        respAbsentMurmurLeft: preform.respAbsentMurmurLeft || false,
        respAbsentMurmurRight: preform.respAbsentMurmurRight || false,
        respWheezingRalesLeft: preform.respWheezingRalesLeft || false,
        respWheezingRalesRight: preform.respWheezingRalesRight || false,
        respCrepitantRalesLeft: preform.respCrepitantRalesLeft || false,
        respCrepitantRalesRight: preform.respCrepitantRalesRight || false,
        respSubcrepitantRalesLeft: preform.respSubcrepitantRalesLeft || false,
        respSubcrepitantRalesRight: preform.respSubcrepitantRalesRight || false,
        respIntercostalRetractionLeft: preform.respIntercostalRetractionLeft || false,
        respIntercostalRetractionRight: preform.respIntercostalRetractionRight || false,
        respSubcutaneousEmphysemaLeft: preform.respSubcutaneousEmphysemaLeft || false,
        respSubcutaneousEmphysemaRight: preform.respSubcutaneousEmphysemaRight || false,
        respTracheaDeviationLeft: preform.respTracheaDeviationLeft || false,
        respTracheaDeviationRight: preform.respTracheaDeviationRight || false,
        respWheezing: preform.respWheezing || false,
        respOther: preform.respOther || "",

        abdomenNormal: preform.abdomenNormal || false,
        abdomenPalpation: preform.abdomenPalpation || false,
        abdomenPercussion: preform.abdomenPercussion || false,
        abdomenBowelTransit: preform.abdomenBowelTransit || false,
        abdomenRectalExam: preform.abdomenRectalExam || false,
        abdomenDistended: preform.abdomenDistended || false,
        abdomenTransitAbsent: preform.abdomenTransitAbsent || false,
        abdomenHepatomegaly: preform.abdomenHepatomegaly || false,
        abdomenSplenomegaly: preform.abdomenSplenomegaly || false,
        abdomenPalpableMass: preform.abdomenPalpableMass || false,
        abdomenTenderness: preform.abdomenTenderness || false,
        abdomenRectalPositive: preform.abdomenRectalPositive || false,
        abdomenPeritonealIrritation: preform.abdomenPeritonealIrritation || false,
        abdomenObservations: preform.abdomenObservations || "",

        skinExamNormal: preform.skinExamNormal || false,
        skinExamWarm: preform.skinExamWarm || false,
        skinExamCold: preform.skinExamCold || false,
        skinExamWet: preform.skinExamWet || false,
        skinExamDry: preform.skinExamDry || false,
        skinExamPruritus: preform.skinExamPruritus || false,
        skinExamExcoriations: preform.skinExamExcoriations || false,
        skinExamEcchymosis: preform.skinExamEcchymosis || false,
        skinExamPetechiae: preform.skinExamPetechiae || false,
        skinExamPurpura: preform.skinExamPurpura || false,
        skinExamJaundice: preform.skinExamJaundice || false,
        skinExamWounds: preform.skinExamWounds || false,
        skinExamPale: preform.skinExamPale || false,
        skinExamCyanosis: preform.skinExamCyanosis || false,
        skinExamSweaty: preform.skinExamSweaty || false,
        skinExamOther: preform.skinExamOther || "",
        skinExamLocation: preform.skinExamLocation || "",

        guExamNormal: preform.guExamNormal || false,
        guExternalGenitals: preform.guExternalGenitals || false,
        guRegularMenstruation: preform.guRegularMenstruation || false,
        guRectalExam: preform.guRectalExam || false,
        guLastMenstruationDate: preform.guLastMenstruationDate || "",
        guBloodyVaginalDischarge: preform.guBloodyVaginalDischarge || false,
        guLeucorrhea: preform.guLeucorrhea || false,
        guCervixSensitivity: preform.guCervixSensitivity || false,
        guEnlargedUterus: preform.guEnlargedUterus || false,
        guLateroUterineMass: preform.guLateroUterineMass || false,
        guGiordanoLeft: preform.guGiordanoLeft || false,
        guGiordanoRight: preform.guGiordanoRight || false,
        guTesticularSwellingLeft: preform.guTesticularSwellingLeft || false,
        guTesticularSwellingRight: preform.guTesticularSwellingRight || false,
        guTesticularPainLeft: preform.guTesticularPainLeft || false,
        guTesticularPainRight: preform.guTesticularPainRight || false,
        guBreastMassLeft: preform.guBreastMassLeft || false,
        guBreastMassRight: preform.guBreastMassRight || false,
        guTraumaLeft: preform.guTraumaLeft || false,
        guTraumaRight: preform.guTraumaRight || false,
        guExamHematuria: preform.guExamHematuria || false,
        guExamOther: preform.guExamOther || "",

        locomotorExamNormal: preform.locomotorExamNormal || false,
        locomotorHead: preform.locomotorHead || false,
        locomotorNeck: preform.locomotorNeck || false,
        locomotorTrunk: preform.locomotorTrunk || false,
        locomotorUpperLimbs: preform.locomotorUpperLimbs || false,
        locomotorLowerLimbs: preform.locomotorLowerLimbs || false,
        locomotorPulseCarotidLeft: preform.locomotorPulseCarotidLeft || false,
        locomotorPulseCarotidRight: preform.locomotorPulseCarotidRight || false,
        locomotorPulseBrachialLeft: preform.locomotorPulseBrachialLeft || false,
        locomotorPulseBrachialRight: preform.locomotorPulseBrachialRight || false,
        locomotorPulseRadialLeft: preform.locomotorPulseRadialLeft || false,
        locomotorPulseRadialRight: preform.locomotorPulseRadialRight || false,
        locomotorPulseFemoralLeft: preform.locomotorPulseFemoralLeft || false,
        locomotorPulseFemoralRight: preform.locomotorPulseFemoralRight || false,
        locomotorPulsePoplitealLeft: preform.locomotorPulsePoplitealLeft || false,
        locomotorPulsePoplitealRight: preform.locomotorPulsePoplitealRight || false,
        locomotorPulsePedialLeft: preform.locomotorPulsePedialLeft || false,
        locomotorPulsePedialRight: preform.locomotorPulsePedialRight || false,
        locomotorExamPain: preform.locomotorExamPain || false,
        locomotorExamSwelling: preform.locomotorExamSwelling || false,
        locomotorExamEdema: preform.locomotorExamEdema || false,
        locomotorExamFunctionalImpairment: preform.locomotorExamFunctionalImpairment || false,
        locomotorExamCyanosis: preform.locomotorExamCyanosis || false,
        locomotorExamOpenFracture: preform.locomotorExamOpenFracture || false,
        locomotorExamClosedFracture: preform.locomotorExamClosedFracture || false,
        locomotorExamObservations: preform.locomotorExamObservations || "",

        neuroPsychNormal: preform.neuroPsychNormal || false,
        neuroPsychOriented: preform.neuroPsychOriented || false,
        neuroPsychCranialNerves: preform.neuroPsychCranialNerves || false,
        neuroPsychMotor: preform.neuroPsychMotor || false,
        neuroPsychSensitive: preform.neuroPsychSensitive || false,
        neuroPsychRot: preform.neuroPsychRot || false,
        neuroPsychHallucinations: preform.neuroPsychHallucinations || false,
        neuroPsychDelirium: preform.neuroPsychDelirium || false,
        neuroPsychBehaviorDisorders: preform.neuroPsychBehaviorDisorders || false,
        neuroPsychAgitated: preform.neuroPsychAgitated || false,
        neuroPsychObnubilated: preform.neuroPsychObnubilated || false,
        neuroPsychConfused: preform.neuroPsychConfused || false,
        neuroPsychPhotophobia: preform.neuroPsychPhotophobia || false,
        neuroPsychNeckStiffness: preform.neuroPsychNeckStiffness || false,
        neuroPsychParesthesia: preform.neuroPsychParesthesia || false,
        neuroPsychAtaxia: preform.neuroPsychAtaxia || false,
        neuroPsychAphasia: preform.neuroPsychAphasia || false,
        neuroPsychMyoclonus: preform.neuroPsychMyoclonus || false,
        neuroPsychConvulsions: preform.neuroPsychConvulsions || false,
        neuroPsychPlegiaLeft: preform.neuroPsychPlegiaLeft || false,
        neuroPsychPlegiaRight: preform.neuroPsychPlegiaRight || false,
        neuroPsychParesisLeft: preform.neuroPsychParesisLeft || false,
        neuroPsychParesisRight: preform.neuroPsychParesisRight || false,
        neuroPsychAnesthesiaLeft: preform.neuroPsychAnesthesiaLeft || false,
        neuroPsychAnesthesiaRight: preform.neuroPsychAnesthesiaRight || false,
        neuroPsychBabinskiLeft: preform.neuroPsychBabinskiLeft || false,
        neuroPsychBabinskiRight: preform.neuroPsychBabinskiRight || false,
        neuroPsychOther: preform.neuroPsychOther || "",
        neuroPsychObservations: preform.neuroPsychObservations || "",

        proceduresO2Mask: preform.proceduresO2Mask || false,
        proceduresO2MaskValue: preform.proceduresO2MaskValue || "",
        proceduresGuedelCannula: preform.proceduresGuedelCannula || false,
        proceduresOralCavityAspiration: preform.proceduresOralCavityAspiration || false,
        proceduresIotTubeAspiration: preform.proceduresIotTubeAspiration || false,
        proceduresIotTubeAspirationValue: preform.proceduresIotTubeAspirationValue || "",
        proceduresIotWithInduction: preform.proceduresIotWithInduction || false,
        proceduresIotWithoutInduction: preform.proceduresIotWithoutInduction || false,
        proceduresIntWithInduction: preform.proceduresIntWithInduction || false,
        proceduresCombitube: preform.proceduresCombitube || false,
        proceduresLaryngealMask: preform.proceduresLaryngealMask || false,
        proceduresNeedleThoracicDecompression: preform.proceduresNeedleThoracicDecompression || false,
        proceduresChestDrain: preform.proceduresChestDrain || false,
        proceduresChestDrainValue: preform.proceduresChestDrainValue || "",
        proceduresMiniCricothyrotomy: preform.proceduresMiniCricothyrotomy || false,
        proceduresTracheostomy: preform.proceduresTracheostomy || false,
        proceduresNonInvasiveVentilation: preform.proceduresNonInvasiveVentilation || false,
        proceduresMechanicalVentilation: preform.proceduresMechanicalVentilation || false,
        proceduresPeripheralVenousAccess: preform.proceduresPeripheralVenousAccess || false,
        proceduresPeripheralVenousAccessCount: preform.proceduresPeripheralVenousAccessCount || "",
        proceduresIntraosseousAccess: preform.proceduresIntraosseousAccess || false,
        proceduresIntraosseousAccessCount: preform.proceduresIntraosseousAccessCount || "",
        proceduresCentralVenousAccess: preform.proceduresCentralVenousAccess || false,
        proceduresCentralVenousAccessValue: preform.proceduresCentralVenousAccessValue || "",
        proceduresPvcMeasurement: preform.proceduresPvcMeasurement || false,
        proceduresThrombolysisAmi: preform.proceduresThrombolysisAmi || false,
        proceduresThrombolysisStroke: preform.proceduresThrombolysisStroke || false,
        proceduresThrombolysisPep: preform.proceduresThrombolysisPep || false,
        proceduresArterialAccess: preform.proceduresArterialAccess || false,
        proceduresIntramuscularInjection: preform.proceduresIntramuscularInjection || false,
        proceduresSubcutaneousInjection: preform.proceduresSubcutaneousInjection || false,
        proceduresIntradermalInjection: preform.proceduresIntradermalInjection || false,
        proceduresIntranasalAdministration: preform.proceduresIntranasalAdministration || false,
        proceduresNebulization: preform.proceduresNebulization || false,
        proceduresExternalChestCompressions: preform.proceduresExternalChestCompressions || false,
        proceduresInvasiveBpMeasurement: preform.proceduresInvasiveBpMeasurement || false,
        proceduresEkgMonitoring: preform.proceduresEkgMonitoring || false,
        proceduresO2SatMonitoring: preform.proceduresO2SatMonitoring || false,
        proceduresCapnometry: preform.proceduresCapnometry || false,
        proceduresOtherMonitoring: preform.proceduresOtherMonitoring || "",
        proceduresManualDefibrillation: preform.proceduresManualDefibrillation || false,
        proceduresAutomaticDefibrillation: preform.proceduresAutomaticDefibrillation || false,
        proceduresCardioversion: preform.proceduresCardioversion || false,
        proceduresTranscutaneousPm: preform.proceduresTranscutaneousPm || false,
        proceduresTranscutaneousPmValue: preform.proceduresTranscutaneousPmValue || "",
        proceduresTransvenousPm: preform.proceduresTransvenousPm || false,
        proceduresTransvenousPmValue: preform.proceduresTransvenousPmValue || "",
        proceduresAnalgosedation: preform.proceduresAnalgosedation || false,
        proceduresLocalAnesthesia: preform.proceduresLocalAnesthesia || false,
        proceduresShortIvAnesthesia: preform.proceduresShortIvAnesthesia || false,
        proceduresPericardialPuncture: preform.proceduresPericardialPuncture || false,
        proceduresPeritonealDiagnosticLavage: preform.proceduresPeritonealDiagnosticLavage || false,
        proceduresActiveRewarming: preform.proceduresActiveRewarming || false,
        proceduresPassiveRewarming: preform.proceduresPassiveRewarming || false,
        proceduresGastricLavage: preform.proceduresGastricLavage || false,
        proceduresGastricLavageValue: preform.proceduresGastricLavageValue || "",
        proceduresNasogastricTube: preform.proceduresNasogastricTube || false,
        proceduresNasogastricTubeValue: preform.proceduresNasogastricTubeValue || "",
        proceduresUrinaryCatheter: preform.proceduresUrinaryCatheter || false,
        proceduresUrinaryCatheterValue: preform.proceduresUrinaryCatheterValue || "",
        proceduresCervicalCollar: preform.proceduresCervicalCollar || false,
        proceduresScoopStretcher: preform.proceduresScoopStretcher || false,
        proceduresSpineBoard: preform.proceduresSpineBoard || false,
        proceduresLimbImmobilization: preform.proceduresLimbImmobilization || false,
        proceduresSplint: preform.proceduresSplint || false,
        proceduresSplintValue: preform.proceduresSplintValue || "",
        proceduresCastDevice: preform.proceduresCastDevice || false,
        proceduresWoundCleaning: preform.proceduresWoundCleaning || false,
        proceduresSuture: preform.proceduresSuture || false,
        proceduresMessage: preform.proceduresMessage || false,
        proceduresNasalPacking: preform.proceduresNasalPacking || false,
        proceduresShortSedation: preform.proceduresShortSedation || false,
        proceduresProceduralSedation: preform.proceduresProceduralSedation || false,
        proceduresLongSedation: preform.proceduresLongSedation || false,
        proceduresArterialPuncture: preform.proceduresArterialPuncture || false,
        proceduresOther: preform.proceduresOther || "",
        proceduresObservations: preform.proceduresObservations || "",
      }),
    };

    try {
      await apiPut(`/visits/${selected.id}/preform`, payload);
      setMsg("Fișa de pre-spitalizare a fost salvată ✅");
    } catch (e) {
      setMsg(`Eroare salvare preform: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const saveDischarge = async () => {
    if (!selected) return;
    setMsg("");
    setLoading(true);

    const hospitalizationOutcomeMap = {
      AMELIORAT: "AMELIORAT",
      STATIONAR: "STATIONAR",
      AGRAVAT: "AGRAVAT",
      DECEDAT: "DECEDAT",
    };

    let dischargeType = "EXTERNAT";
    if (discharge.transferredSection?.trim()) {
      dischargeType = "TRANSFERAT";
    } else if (discharge.admittedSection?.trim()) {
      dischargeType = "INTERNAT";
    }

    const payload = {
      ...discharge,
      details: JSON.stringify({
        appliedProcedures: discharge.appliedProcedures || "",
        patientStateAtDischarge: discharge.patientStateAtDischarge || "",
        dischargeHour: discharge.dischargeHour || "",
        admittedSection: discharge.admittedSection || "",
        transferredSection: discharge.transferredSection || "",
        leavesWithRecommendations: discharge.leavesWithRecommendations || false,
      }),
      citizenshipType: "ROMANA",
      insuranceStatus: "ASIGURAT_CNAS",
      admissionType: "URGENTA",
      hospitalizationOutcome:
        hospitalizationOutcomeMap[discharge.patientStateAtDischarge] || "AMELIORAT",
      dischargeType,
    };

    try {
      await apiPut(`/visits/${selected.id}/discharge`, payload);
      setMsg("Fișa de externare a fost salvată.");
    } catch (e) {
      setMsg(`Eroare salvare externare: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!selected || !status) return;
    setMsg("");

    try {
      await apiPut(`/visits/${selected.id}/status`, { status });
      setMsg("Status actualizat.");
    } catch (e) {
      setMsg(`Eroare status: ${e}`);
    }
  };

  const exportCombined = async () => {
  if (!selected) return;

  setMsg("Se generează PDF...");
  setCombinedPrintMode(true);

  setTimeout(async () => {
    try {
      const element = document.getElementById("print-area");

      if (!element) {
        throw new Error("Zona de print nu a fost găsită.");
      }

      const opt = {
        margin: 0.4,
        filename: `visit_${selected.id}.pdf`,
        image: { type: "jpeg", quality: 0.85 },
        html2canvas: { scale: 1.2, useCORS: true },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(element)
        .outputPdf("blob");

      const formData = new FormData();
      formData.append("file", pdfBlob, `visit_${selected.id}.pdf`);
      formData.append("visitId", selected.id);

      const response = await fetch("http://localhost:8081/archived-documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload eșuat: ${response.status} ${text}`);
      }

      setMsg("PDF salvat în arhivă.");
    } catch (e) {
      console.error("Eroare exportCombined:", e);
      setMsg(`Eroare export PDF: ${e.message || e}`);
    }
  }, 500);
};
   

  const handlePrintCombined = async () => {
  if (!selected) return;

  setMsg("Se generează PDF pentru descărcare...");
  setCombinedPrintMode(true);

  setTimeout(async () => {
    try {
      const element = document.getElementById("print-area");

      if (!element) {
        throw new Error("Zona de print nu a fost găsită.");
      }

      const opt = {
        margin: 0.4,
        filename: `fise_vizita_${selected.id}.pdf`,
        image: { type: "jpeg", quality: 0.9 },
        html2canvas: { scale: 1.2, useCORS: true },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();

      setMsg("PDF descărcat.");
    } catch (e) {
      console.error("Eroare descarcare PDF:", e);
      setMsg(`Eroare la descărcarea PDF-ului: ${e.message || e}`);
    }
  }, 500);
};

  const searchPatients = async () => {
    if (!search.trim()) {
      setSearchMode(false);
      setSearchResults([]);
      setSelectedPatient(null);
      setPatientVisits([]);
      return;
    }

    setSearchMode(true);
    setMsg("");

    try {
      const data = await apiGet("/patients");
      const filtered = data.filter((p) =>
        `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase().includes(search.trim().toLowerCase())
      );
      setSearchResults(filtered);
      setSelectedPatient(null);
      setPatientVisits([]);
    } catch (e) {
      setMsg(`Eroare căutare pacient: ${e}`);
    }
  };

  const loadPatientVisits = async (patient) => {
    setSelectedPatient(patient);
    setMsg("");

    try {
      const visits = await apiGet(`/visits/patient/${patient.id}`);
      setPatientVisits(visits);
    } catch (e) {
      setMsg(`Eroare încărcare vizite pacient: ${e}`);
    }
  };

  const openVisitFromSearch = (visit) => {
    setSearchMode(false);
    setSearch("");
    setSearchResults([]);
    setSelectedPatient(null);
    setPatientVisits([]);
    onSelectVisit && onSelectVisit(visit);
  };

  if (!selected) {
    return (
      <div>
        <h2>Fișe</h2>
        <p>Selectează o vizită din “Vizite” ca să lucrezi pe fișe.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Fișe (vizita {selected.id})</h2>

      <PatientSearchPanel
        search={search}
        setSearch={setSearch}
        searchPatients={searchPatients}
        searchResults={searchResults}
        loadPatientVisits={loadPatientVisits}
        selectedPatient={selectedPatient}
        patientVisits={patientVisits}
        openVisitFromSearch={openVisitFromSearch}
      />

      {!searchMode && <PatientDetailsPanel patientDetails={patientDetails} />}

      {!searchMode && (
        <FormsToolbar
          loading={loading}
          savePreform={savePreform}
          saveDischarge={saveDischarge}
          exportCombined={exportCombined}
          status={status}
          setStatus={setStatus}
          updateStatus={updateStatus}
          msg={msg}
        />
      )}

      {!searchMode && (
        <>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={handlePrintCombined} style={{ padding: "8px 12px" }}>
              Printează fișele
            </button>

            <button
              onClick={() => setCombinedPrintMode((prev) => !prev)}
              style={{ padding: "8px 12px" }}
            >
              {combinedPrintMode
                ? "Ascunde previzualizarea fișelor"
                : "Arată previzualizarea fișelor"}
            </button>
          </div>

         {combinedPrintMode && (
  <div id="print-area">
    <PreformPrintView preform={preform} />
    <DischargePrintView discharge={discharge} preform={preform} />
  </div>
)}

          <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
            <PreformSection
              preformOpen={preformOpen}
              setPreformOpen={setPreformOpen}
              preform={preform}
              setPreform={setPreform}
            />

            <DischargeSection
              dischargeOpen={dischargeOpen}
              setDischargeOpen={setDischargeOpen}
              discharge={discharge}
              setDischarge={setDischarge}
              preform={preform}
            />
          </div>
        </>
      )}
    </div>
  );
}