export default function FormsToolbar({
  loading,
  savePreform,
  saveDischarge,
  exportCombined,
  status,
  setStatus,
  updateStatus,
  msg,
}) {
  return (
    <div style={{ marginTop: 10, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={savePreform} disabled={loading} style={{ padding: "8px 12px" }}>
          Salvează pre-spitalizarea
        </button>
        <button onClick={saveDischarge} disabled={loading} style={{ padding: "8px 12px" }}>
          Salvează externarea
        </button>
        <button onClick={exportCombined} style={{ padding: "8px 12px" }}>
          Export PDF combinat
        </button>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="">Selectează status</option>
          <option value="REGISTERED">Înregistrat</option>
          <option value="TRIAGE_DONE">Triaj efectuat</option>
          <option value="WAITING_CONSULT">În așteptare consult</option>
          <option value="IN_CONSULT">În consult</option>
          <option value="IN_INVESTIGATION">În investigații</option>
          <option value="OBSERVATION">În observație</option>
          <option value="DISCHARGED">Externat</option>
          <option value="ADMITTED">Internat</option>
          <option value="TRANSFERRED">Transferat</option>
        </select>

        <button onClick={updateStatus} style={{ padding: "8px 12px" }}>
          Actualizează statusul
        </button>
      </div>
      

      {msg && <p style={{ marginTop: 10, color: "#ddd" }}>{msg}</p>}
    </div>
  );
}