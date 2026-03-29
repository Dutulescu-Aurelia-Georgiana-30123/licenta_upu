import { useState } from "react";
import { apiGet } from "../api/api";

function getDocumentTypeLabel(type) {
  const labels = {
    COMBINED_VISIT_PDF: "PDF fișe combinate",
    PREHOSPITALIZATION_PDF: "PDF pre-spitalizare",
    DISCHARGE_PDF: "PDF externare",
  };

  return labels[type] || type || "-";
}

export default function ArchivePage() {
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPatients = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      setSelectedPatient(null);
      setPatientVisits([]);
      setSelectedVisit(null);
      setDocuments([]);
      return;
    }

    setMsg("");
    setLoading(true);

    try {
      const data = await apiGet("/patients");
      const filtered = data.filter((p) =>
        `${p.firstName || ""} ${p.lastName || ""}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );

      setSearchResults(filtered);
      setSelectedPatient(null);
      setPatientVisits([]);
      setSelectedVisit(null);
      setDocuments([]);
    } catch (e) {
      setMsg(`Eroare căutare pacient: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientVisits = async (patient) => {
    setSelectedPatient(patient);
    setSelectedVisit(null);
    setDocuments([]);
    setMsg("");
    setLoading(true);

    try {
      const visits = await apiGet(`/visits/patient/${patient.id}`);
      setPatientVisits(visits);
    } catch (e) {
      setMsg(`Eroare încărcare vizite: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const loadVisitDocuments = async (visit) => {
    setSelectedVisit(visit);
    setMsg("");
    setLoading(true);

    try {
      const docs = await apiGet(`/archived-documents/visit/${visit.id}`);
      setDocuments(docs || []);
    } catch (e) {
      setMsg(`Eroare încărcare documente: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (doc) => {
    setMsg("");

    try {
      const response = await fetch(`http://localhost:8081/archived-documents/${doc.id}/download`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Nu s-a putut descărca documentul");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName || "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      setMsg(`Eroare download: ${e.message || e}`);
    }
  };

  return (
    <div>
      <h2>Arhivă documente</h2>

      <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Caută pacient</div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Caută după nume"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: 8, minWidth: 260 }}
          />
          <button onClick={searchPatients} disabled={loading} style={{ padding: "8px 12px" }}>
            Caută
          </button>
        </div>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

        {searchResults.length > 0 && (
          <div style={{ marginTop: 12, border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
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
      </div>

      {selectedPatient && (
        <div style={{ marginTop: 14, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>
            Vizite pacient: {selectedPatient.firstName} {selectedPatient.lastName}
          </div>

          {patientVisits.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nu există vizite pentru acest pacient.</div>
          ) : (
            <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
              {patientVisits.map((visit, index) => (
                <div
                  key={visit.id}
                  onClick={() => loadVisitDocuments(visit)}
                  style={{
                    cursor: "pointer",
                    padding: 10,
                    borderBottom: index !== patientVisits.length - 1 ? "1px solid #333" : "none",
                  }}
                >
                  Vizita #{visit.id} — {visit.status || "-"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedVisit && (
        <div style={{ marginTop: 14, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>
            Documente arhivate pentru vizita #{selectedVisit.id}
          </div>

          {documents.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nu există documente arhivate pentru această vizită.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    border: "1px solid #333",
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{doc.fileName || "Document"}</div>
                    <div style={{ color: "#aaa", marginTop: 4 }}>
                      Tip: {getDocumentTypeLabel(doc.documentType)}
                    </div>
                    <div style={{ color: "#aaa", marginTop: 4 }}>
                      Creat la: {doc.createdAt || "-"}
                    </div>
                  </div>

                  <button onClick={() => downloadDocument(doc)} style={{ padding: "8px 12px" }}>
                    Descarcă
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}