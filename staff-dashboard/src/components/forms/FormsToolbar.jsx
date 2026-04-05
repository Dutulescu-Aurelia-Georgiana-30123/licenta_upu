export default function FormsToolbar({
  loading,
  exportCombined,
  status,
  setStatus,
  updateStatus,
  msg,
}) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        border: "1px solid #333",
        borderRadius: 12,
        background: "#121212",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={exportCombined}
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          Export PDF combinat
        </button>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: 10,
            minWidth: 200,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#121212",
            color: "#eaeaea",
          }}
        >
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

        <button
          onClick={updateStatus}
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          Actualizează statusul
        </button>
      </div>

      {msg && (
        <p style={{ marginTop: 12, color: "#ddd" }}>
          {msg}
        </p>
      )}
    </div>
  );
}