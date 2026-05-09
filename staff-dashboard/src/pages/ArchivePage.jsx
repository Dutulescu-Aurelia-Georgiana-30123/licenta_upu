import { useEffect, useState } from "react";
import { apiGet, API_BASE } from "../api/api";
import { useToast } from "../context/ToastContext";

function getDocumentTypeLabel(type) {
  const labels = {
    COMBINED_VISIT_PDF: "PDF fișe combinate",
    PRE_FORM_PDF: "PDF pre-spitalizare",
    DISCHARGE_FORM_PDF: "PDF externare",
  };

  return labels[type] || type || "-";
}

function getStatusLabel(status) {
  const labels = {
    REGISTERED: "Înregistrat",
    WAITING_TRIAGE: "În așteptare triaj",
    TRIAGE_DONE: "Triaj efectuat",
    WAITING_CONSULT: "În așteptare consult",
    IN_CONSULT: "În consult",
    IN_INVESTIGATION: "În investigații",
    OBSERVATION: "În observație",
    DISCHARGED: "Externat",
    ADMITTED: "Internat",
    TRANSFERRED: "Transferat",
  };

  return labels[status] || status || "-";
}

function formatDateTime(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString("ro-RO");
}

function Card({ children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5eef8",
        borderRadius: 24,
        padding: 18,
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ color: "#64748b", marginTop: 4, fontSize: 13 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#f1f5f9",
        color: "#475569",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}

const inputStyle = {
  padding: "12px 14px",
  minWidth: 320,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  fontWeight: 700,
};

export default function ArchivePage() {
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError, showInfo } = useToast();

  const searchPatients = async (value) => {
    const q = (value || "").trim().toLowerCase();

    if (q.length < 2) {
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
      const filtered = (data || []).filter((p) => {
        const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
        const cnp = (p.cnp || "").toLowerCase();

        return fullName.includes(q) || cnp.includes(q);
      });

      setSearchResults(filtered);
      setSelectedPatient(null);
      setPatientVisits([]);
      setSelectedVisit(null);
      setDocuments([]);
    } catch (e) {
      setMsg(`Eroare căutare pacient: ${e}`);
      showError("Eroare la căutarea pacientului");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchPatients(search);
    }, 250);

    return () => clearTimeout(timeout);
  }, [search]);

  const loadPatientVisits = async (patient) => {
    setSelectedPatient(patient);
    setSelectedVisit(null);
    setDocuments([]);
    setMsg("");
    setLoading(true);

    try {
      const visits = await apiGet(`/visits/patient/${patient.id}`);
      setPatientVisits(visits || []);
      setSearchResults([]);
      showInfo("Pacient selectat");
    } catch (e) {
      setMsg(`Eroare încărcare vizite: ${e}`);
      showError("Eroare la încărcarea vizitelor");
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
      showInfo("Vizită selectată");
    } catch (e) {
      setMsg(`Eroare încărcare documente: ${e}`);
      showError("Eroare la încărcarea documentelor");
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (doc) => {
    setMsg("");

    try {
      const response = await fetch(`${API_BASE}/archived-documents/${doc.id}/download`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Nu s-a putut descărca documentul");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const visitDate = selectedVisit?.createdAt
        ? new Date(selectedVisit.createdAt).toLocaleString("ro-RO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const fileName = `Vizita ${selectedVisit?.visitCode || selectedVisit?.id}, ${visitDate}.pdf`;

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      showSuccess("Document descărcat");
    } catch (e) {
      setMsg(`Eroare download: ${e.message || e}`);
      showError("Eroare la descărcarea documentului");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            color: "#0f172a",
            letterSpacing: -0.6,
          }}
        >
          Arhivă documente
        </h2>
        <div style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>
          Caută pacienți, vizite și documente PDF arhivate
        </div>
      </div>

      {msg && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            background: msg.startsWith("Eroare") ? "#fee2e2" : "#eff6ff",
            color: msg.startsWith("Eroare") ? "#991b1b" : "#1d4ed8",
            fontWeight: 700,
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <Card>
          <SectionTitle
            title="Caută pacient"
            subtitle="Introdu minimum 2 caractere din nume sau CNP"
          />

          <input
            placeholder="Caută după nume sau CNP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          {loading && (
            <div style={{ color: "#64748b", marginTop: 10, fontSize: 13 }}>
              Se încarcă...
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              style={{
                marginTop: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              {searchResults.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => loadPatientVisits(p)}
                  style={{
                    cursor: "pointer",
                    padding: "13px 14px",
                    borderBottom:
                      index !== searchResults.length - 1 ? "1px solid #edf2f7" : "none",
                    background: "#ffffff",
                    color: "#334155",
                    fontWeight: 700,
                  }}
                >
                  {p.firstName} {p.lastName}
                  <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                    {" "}— {p.cnp || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {selectedPatient && (
        <div style={{ marginTop: 16 }}>
          <Card>
            <SectionTitle
              title={`Vizite pacient: ${selectedPatient.firstName} ${selectedPatient.lastName}`}
              subtitle="Selectează vizita pentru care vrei să vezi documentele"
            />

            {patientVisits.length === 0 ? (
              <div style={{ color: "#64748b", fontWeight: 700 }}>
                Nu există vizite pentru acest pacient.
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 18,
                  overflow: "hidden",
                }}
              >
                {patientVisits.map((visit, index) => {
                  const visitDate = visit.createdAt
                    ? new Date(visit.createdAt).toLocaleString("ro-RO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  const selected = selectedVisit?.id === visit.id;

                  return (
                    <div
                      key={visit.id}
                      onClick={() => loadVisitDocuments(visit)}
                      style={{
                        cursor: "pointer",
                        padding: "14px",
                        borderBottom:
                          index !== patientVisits.length - 1 ? "1px solid #edf2f7" : "none",
                        background: selected ? "#eff6ff" : "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ fontWeight: 800, color: "#0f172a" }}>
                        Vizita {visit.visitCode || `UPU-${visit.id}`}
                        <span style={{ color: "#64748b", fontWeight: 600 }}>
                          {" "}— {visitDate}
                        </span>
                      </div>

                      <StatusBadge status={visit.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {selectedVisit && (
        <div style={{ marginTop: 16 }}>
          <Card>
            <SectionTitle
              title={`Documente arhivate pentru ${selectedVisit.visitCode || `vizita ${selectedVisit.id}`}`}
              subtitle="Documentele PDF generate și salvate pentru vizita selectată"
            />

            {documents.length === 0 ? (
              <div style={{ color: "#64748b", fontWeight: 700 }}>
                Nu există documente arhivate pentru această vizită.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 18,
                      padding: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      background: "#f8fafc",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 900, color: "#0f172a" }}>
                        Vizita {selectedVisit?.visitCode || selectedVisit?.id},{" "}
                        {selectedVisit?.createdAt
                          ? new Date(selectedVisit.createdAt).toLocaleString("ro-RO", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>

                      <div style={{ color: "#64748b", marginTop: 5, fontSize: 13 }}>
                        Tip: {getDocumentTypeLabel(doc.documentType)}
                      </div>

                      <div style={{ color: "#64748b", marginTop: 3, fontSize: 13 }}>
                        Creat la: {formatDateTime(doc.createdAt)}
                      </div>
                    </div>

                    <button
                      onClick={() => downloadDocument(doc)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: "#2563eb",
                        color: "white",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 12px 25px rgba(37, 99, 235, 0.18)",
                      }}
                    >
                      Descarcă
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}