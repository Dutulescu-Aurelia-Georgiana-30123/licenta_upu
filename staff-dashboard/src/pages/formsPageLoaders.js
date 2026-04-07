export async function loadPreformIntoState({
  selected,
  setLoading,
  setMsg,
  setPatientDetails,
  setPreform,
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