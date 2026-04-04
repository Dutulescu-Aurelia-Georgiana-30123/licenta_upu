import { apiGet, apiPut } from "../api/api";

export async function loadPreformData(selected) {
  if (!selected) return null;

  const patient = await apiGet(`/patients/${selected.patientId}`);

  let data = null;
  try {
    data = await apiGet(`/visits/${selected.id}/preform`);
  } catch {
    data = null;
  }

  return { patient, data };
}

export async function loadDischargeData(selected) {
  if (!selected) return null;

  const patient = await apiGet(`/patients/${selected.patientId}`);

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

  return { patient, data, preformData };
}

export async function savePreformData(selected, payload) {
  return apiPut(`/visits/${selected.id}/preform`, payload);
}

export async function saveDischargeData(selected, payload) {
  return apiPut(`/visits/${selected.id}/discharge`, payload);
}

export async function updateVisitStatusData(selected, status) {
  return apiPut(`/visits/${selected.id}/status`, { status });
}

export async function loadPatientVisitsData(patient) {
  return apiGet(`/visits/patient/${patient.id}`);
}

export async function searchPatientsData() {
  return apiGet("/patients");
}