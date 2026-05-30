import {
  cardStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  tableHeadCellStyle,
  tableCellStyle,
} from "./adminStyles";

export default function AdminPatients({
  patientsSearch,
  setPatientsSearch,
  editingPatient,
  editPatientForm,
  setEditPatientForm,
  loadingPatients,
  filteredPatients,
  onReloadPatients,
  onEditPatient,
  onUpdatePatient,
  onCancelEditPatient,
  onDeletePatient,

  selectedPatientRecord,
  patientVisits,
  loadingPatientRecord,
  onOpenPatientRecord,
  onClosePatientRecord,

  selectedRecordVisit,
  recordVisitDocuments,
  loadingRecordDocuments,
  onOpenVisitDocuments,
  onCloseVisitDocuments,
  apiBase,
}) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 24 }}>Pacienți</h2>
          <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
            Listă pacienți înregistrați în sistem
          </div>
        </div>

        <button type="button" onClick={onReloadPatients} style={secondaryButtonStyle}>
          Reîncarcă
        </button>
      </div>

      <input
        type="text"
        placeholder="Caută după nume, CNP, email sau telefon"
        value={patientsSearch}
        onChange={(e) => setPatientsSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 12,
          borderRadius: 16,
          border: "1px solid #cbd5e1",
          marginBottom: 18,
          fontWeight: 700,
        }}
      />

      {editingPatient && (
        <form onSubmit={onUpdatePatient} style={{ marginBottom: 18, padding: 18, borderRadius: 24, background: "#f8fafc", border: "1px solid #e2e8f0", display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 900, color: "#102033" }}>
            Editează pacient: {editingPatient.firstName} {editingPatient.lastName}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <input type="text" placeholder="Prenume" value={editPatientForm.firstName} onChange={(e) => setEditPatientForm({ ...editPatientForm, firstName: e.target.value })} required style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <input type="text" placeholder="Nume" value={editPatientForm.lastName} onChange={(e) => setEditPatientForm({ ...editPatientForm, lastName: e.target.value })} required style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <input type="text" placeholder="CNP" value={editPatientForm.cnp} onChange={(e) => setEditPatientForm({ ...editPatientForm, cnp: e.target.value })} required style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <input type="text" placeholder="Telefon" value={editPatientForm.phoneNumber} onChange={(e) => setEditPatientForm({ ...editPatientForm, phoneNumber: e.target.value })} required style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <input type="email" placeholder="Email" value={editPatientForm.email} onChange={(e) => setEditPatientForm({ ...editPatientForm, email: e.target.value })} required style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onCancelEditPatient} style={secondaryButtonStyle}>
              Anulează
            </button>
            <button type="submit" style={primaryButtonStyle}>
              Salvează modificările
            </button>
          </div>
        </form>
      )}

      {selectedPatientRecord && (
        <div style={{ marginBottom: 18, padding: 18, borderRadius: 24, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, color: "#102033", fontSize: 18 }}>
                Dosar pacient
              </div>
              <div style={{ color: "#64748b" }}>
                {selectedPatientRecord.firstName} {selectedPatientRecord.lastName}
              </div>
            </div>

            <button type="button" onClick={onClosePatientRecord} style={secondaryButtonStyle}>
              Închide
            </button>
          </div>

          {loadingPatientRecord ? (
            <div>Se încarcă vizitele...</div>
          ) : patientVisits.length === 0 ? (
            <div>Pacientul nu are vizite.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={tableHeadCellStyle}>Cod</th>
                    <th style={tableHeadCellStyle}>Data</th>
                    <th style={tableHeadCellStyle}>Status</th>
                    <th style={tableHeadCellStyle}>Motiv prezentare</th>
                    <th style={tableHeadCellStyle}>Documente</th>
                  </tr>
                </thead>

                <tbody>
                  {patientVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td style={tableCellStyle}>{visit.visitCode || "-"}</td>
                      <td style={tableCellStyle}>
                        {visit.createdAt ? new Date(visit.createdAt).toLocaleString("ro-RO") : "-"}
                      </td>
                      <td style={tableCellStyle}>{visit.status || "-"}</td>
                      <td style={tableCellStyle}>{visit.presentationReason || "-"}</td>
                      <td style={tableCellStyle}>
                        <button type="button" onClick={() => onOpenVisitDocuments(visit)} style={secondaryButtonStyle}>
                          Vezi documente
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedRecordVisit && (
            <div style={{ marginTop: 18, padding: 16, borderRadius: 20, background: "white", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 900, color: "#102033" }}>
                  Documente pentru vizita {selectedRecordVisit.visitCode || selectedRecordVisit.id}
                </div>

                <button type="button" onClick={onCloseVisitDocuments} style={secondaryButtonStyle}>
                  Închide documente
                </button>
              </div>

              {loadingRecordDocuments ? (
                <div>Se încarcă documentele...</div>
              ) : recordVisitDocuments.length === 0 ? (
                <div style={{ color: "#64748b", fontWeight: 800 }}>
                  Nu există documente arhivate pentru această vizită.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {recordVisitDocuments.map((doc) => (
                    <div key={doc.id} style={{ padding: 14, borderRadius: 16, border: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 900, color: "#102033" }}>
                          {doc.documentType || "Document medical"}
                        </div>
                        <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>
                          Creat la: {doc.createdAt ? new Date(doc.createdAt).toLocaleString("ro-RO") : "-"}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => window.open(`${apiBase}/archived-documents/${doc.id}/view`, "_blank")}
                        style={secondaryButtonStyle}
                      >
                        Previzualizează
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#ffffff" }}>
          <thead>
            <tr>
              <th style={tableHeadCellStyle}>Nume</th>
              <th style={tableHeadCellStyle}>CNP</th>
              <th style={tableHeadCellStyle}>Telefon</th>
              <th style={tableHeadCellStyle}>Email</th>
              <th style={tableHeadCellStyle}>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            {loadingPatients && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                  Se încarcă...
                </td>
              </tr>
            )}

            {!loadingPatients &&
              filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td style={tableCellStyle}>{patient.firstName} {patient.lastName}</td>
                  <td style={tableCellStyle}>{patient.cnp || "-"}</td>
                  <td style={tableCellStyle}>{patient.phoneNumber || "-"}</td>
                  <td style={tableCellStyle}>{patient.email || "-"}</td>

                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => onEditPatient(patient)} style={secondaryButtonStyle}>
                        Editează
                      </button>

                      <button type="button" onClick={() => onOpenPatientRecord(patient)} style={secondaryButtonStyle}>
                        Dosar
                      </button>

                      <button type="button" onClick={() => onDeletePatient(patient.id)} style={secondaryButtonStyle}>
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loadingPatients && filteredPatients.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 22, color: "#64748b", fontWeight: 800 }}>
                  Nu există pacienți pentru criteriul căutat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}