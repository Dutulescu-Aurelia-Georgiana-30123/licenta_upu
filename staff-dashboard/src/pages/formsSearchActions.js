export async function searchPatientsAction({
  search,
  setSearchMode,
  setMsg,
  setSearchResults,
  setSelectedPatient,
  setPatientVisits,
  searchPatientsData,
}) {
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
    const data = await searchPatientsData();
    const filtered = data.filter((p) =>
      `${p.firstName || ""} ${p.lastName || ""}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );

    setSearchResults(filtered);
    setSelectedPatient(null);
    setPatientVisits([]);
  } catch (e) {
    setMsg(`Eroare căutare pacient: ${e}`);
  }
}

export async function loadPatientVisitsAction({
  patient,
  setSelectedPatient,
  setMsg,
  setPatientVisits,
  loadPatientVisitsData,
}) {
  setSelectedPatient(patient);
  setMsg("");

  try {
    const visits = await loadPatientVisitsData(patient);
    setPatientVisits(visits);
  } catch (e) {
    setMsg(`Eroare încărcare vizite pacient: ${e}`);
  }
}

export function openVisitFromSearchAction({
  visit,
  setSearchMode,
  setSearch,
  setSearchResults,
  setSelectedPatient,
  setPatientVisits,
  onSelectVisit,
}) {
  setSearchMode(false);
  setSearch("");
  setSearchResults([]);
  setSelectedPatient(null);
  setPatientVisits([]);
  onSelectVisit && onSelectVisit(visit);
}