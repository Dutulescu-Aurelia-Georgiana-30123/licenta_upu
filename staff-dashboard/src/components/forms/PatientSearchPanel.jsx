import { getStatusLabel } from "../../utils/visitStatus";

export default function PatientSearchPanel({
  search,
  setSearch,
  searchPatients,
  searchResults,
  loadPatientVisits,
  selectedPatient,
  patientVisits,
  openVisitFromSearch,
}) {
  return (
    <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Caută fișe vechi după pacient</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Caută pacient după nume"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, minWidth: 260 }}
        />
        <button onClick={searchPatients} style={{ padding: "8px 12px" }}>
          Caută
        </button>
      </div>

      {searchResults.length > 0 && (
        <div style={{ marginTop: 10, border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
          {searchResults.map((p, index) => (
            <div
              key={p.id}
              onClick={() => loadPatientVisits(p)}
              style={{
                cursor: "pointer",
                padding: 10,
                borderBottom: index !== searchResults.length - 1 ? "1px solid #333" : "none",
              }}
            >
              {p.firstName} {p.lastName} (ID {p.id})
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Vizitele pacientului: {selectedPatient.firstName} {selectedPatient.lastName}
          </div>

          {patientVisits.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nu există vizite pentru acest pacient.</div>
          ) : (
            <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
              {patientVisits.map((v, index) => (
                <div
                  key={v.id}
                  onClick={() => openVisitFromSearch(v)}
                  style={{
                    cursor: "pointer",
                    padding: 10,
                    borderBottom: index !== patientVisits.length - 1 ? "1px solid #333" : "none",
                  }}
                >
                  Vizita #{v.id} — {getStatusLabel(v.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}