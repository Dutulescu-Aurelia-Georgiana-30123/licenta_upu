import { useEffect, useState } from "react";
import { apiGet, API_BASE } from "../api/api";
import { useToast } from "../context/ToastContext";

const teal = "#08b8b3";
const tealDark = "#069a96";

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
    WAITING_CONSULT: "În așteptare consult",
    IN_CONSULT: "În consult",
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

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 28,
        padding: 22,
        boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 950, color: "#102033" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ color: "#667085", marginTop: 5, fontSize: 13, fontWeight: 700 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    REGISTERED: { background: "#fef3c7", color: "#92400e" },
    WAITING_CONSULT: { background: "#ffedd5", color: "#9a3412" },
    IN_CONSULT: { background: "#ccfbf1", color: "#0f766e" },
    DISCHARGED: { background: "#dcfce7", color: "#166534" },
    ADMITTED: { background: "#e0f2fe", color: "#0369a1" },
    TRANSFERRED: { background: "#fee2e2", color: "#991b1b" },
  };

  const config = styles[status] || { background: "#f1f5f9", color: "#475569" };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 11px",
        borderRadius: 999,
        background: config.background,
        color: config.color,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 22,
        padding: 16,
        boxShadow: "0 18px 45px rgba(15,47,95,0.07)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ color: "#667085", fontSize: 12, fontWeight: 800 }}>
            {label}
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#102033",
              fontSize: 28,
              fontWeight: 950,
              letterSpacing: -0.8,
            }}
          >
            {value ?? 0}
          </div>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            background: "#e6fffd",
            color: tealDark,
            display: "grid",
            placeItems: "center",
            fontWeight: 950,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  minWidth: 340,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#102033",
  outline: "none",
  fontWeight: 800,
  boxShadow: "0 10px 24px rgba(15,47,95,0.04)",
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

  const { showSuccess, showError} = useToast();

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
  const interval = setInterval(async () => {
    try {
      if (selectedPatient) {
        const visits = await apiGet(`/visits/patient/${selectedPatient.id}`);
        setPatientVisits(visits || []);
      }

      if (selectedVisit) {
        const docs = await apiGet(
          `/archived-documents/visit/${selectedVisit.id}`
        );
        setDocuments(docs || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, 7000);

  return () => clearInterval(interval);
}, [selectedPatient, selectedVisit]);

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
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          padding: 26,
          backgroundImage: `
  linear-gradient(
    135deg,
    rgba(8,184,179,0.88),
    rgba(6,154,150,0.78)
  ),
  url("/images/receptie.jpg")
`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
          color: "white",
          boxShadow: "0 28px 80px rgba(8, 184, 179, 0.20)",
        }}
      >

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 13px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              fontWeight: 900,
              marginBottom: 16,
            }}
          >
            📁 Arhivă documente
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 34,
              letterSpacing: -1.1,
              lineHeight: 1.1,
            }}
          >
            Documente medicale arhivate
          </h2>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              maxWidth: 720,
              lineHeight: 1.65,
              opacity: 0.92,
              fontWeight: 600,
            }}
          >
            Caută pacienți, selectează vizitele și descarcă documentele PDF
            generate pentru fluxul medical.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <MiniStat label="Rezultate căutare" value={searchResults.length} icon="🔎" />
        <MiniStat label="Vizite pacient" value={patientVisits.length} icon="📋" />
        <MiniStat label="Documente" value={documents.length} icon="PDF" />
      </div>

      {msg && (
        <div
          style={{
            marginTop: 16,
            padding: 13,
            borderRadius: 16,
            background: msg.startsWith("Eroare") ? "#fee2e2" : "#e6fffd",
            color: msg.startsWith("Eroare") ? "#991b1b" : tealDark,
            fontWeight: 800,
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Card>
          <SectionTitle
            title="Caută pacient"
            subtitle="Introdu minimum 2 caractere din nume sau CNP"
          />

          <input
            placeholder="Caută după nume sau CNP"
            value={search}
            onChange={(e) => {
  setSearch(e.target.value);
  searchPatients(e.target.value);
}}
            style={inputStyle}
          />

          {loading && (
            <div style={{ color: "#667085", marginTop: 12, fontSize: 13, fontWeight: 800 }}>
              Se încarcă...
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              style={{
                marginTop: 16,
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              {searchResults.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => loadPatientVisits(p)}
                  style={{
                    cursor: "pointer",
                    padding: "14px 15px",
                    borderBottom:
                      index !== searchResults.length - 1 ? "1px solid #edf2f7" : "none",
                    background: "#ffffff",
                    color: "#334155",
                    fontWeight: 800,
                  }}
                >
                  {p.firstName} {p.lastName}
                  <span style={{ color: "#8a97a8", fontWeight: 700 }}>
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
              <div style={{ color: "#667085", fontWeight: 800 }}>
                Nu există vizite pentru acest pacient.
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
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
                        padding: "15px",
                        borderBottom:
                          index !== patientVisits.length - 1 ? "1px solid #edf2f7" : "none",
                        background: selected ? "#e6fffd" : "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ fontWeight: 900, color: "#102033" }}>
                        Vizita {visit.visitCode || `UPU-${visit.id}`}
                        <span style={{ color: "#667085", fontWeight: 700 }}>
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
              <div style={{ color: "#667085", fontWeight: 800 }}>
                Nu există documente arhivate pentru această vizită.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 20,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      background: "#f8fafc",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 950, color: "#102033" }}>
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

                      <div style={{ color: "#667085", marginTop: 6, fontSize: 13, fontWeight: 700 }}>
                        Tip: {getDocumentTypeLabel(doc.documentType)}
                      </div>

                      <div style={{ color: "#667085", marginTop: 3, fontSize: 13, fontWeight: 700 }}>
                        Creat la: {formatDateTime(doc.createdAt)}
                      </div>
                    </div>

                  <div
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
  }}
>
  <button
    onClick={() =>
      window.open(
        `${API_BASE}/archived-documents/${doc.id}/view`,
        "_blank"
      )
    }
    style={{
      padding: "10px 18px",
      borderRadius: 14,
      border: "1px solid #d1d5db",
      background: "white",
      color: "#102033",
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    Previzualizează
  </button>

  <button
    onClick={() => downloadDocument(doc)}
    style={{
      padding: "10px 18px",
      borderRadius: 14,
      border: "none",
      background: "#08b8b3",
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    Descarcă
  </button>
</div>


                    
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