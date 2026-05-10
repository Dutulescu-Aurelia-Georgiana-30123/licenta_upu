import { theme } from "../../styles/theme";

export default function FormsToolbar({
  loading,
  exportCombined,
  status,
  setStatus,
  updateStatus,
  readOnly = false,
  alreadyExported,
}) {
  return (
    <div>
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
          disabled={loading || alreadyExported}
          style={{
            ...theme.button.secondary,
            opacity: loading || alreadyExported ? 0.65 : 1,
            cursor:
              loading || alreadyExported ? "not-allowed" : "pointer",
          }}
        >
          {alreadyExported
            ? "Fișa deja exportată"
            : "Export PDF combinat"}
        </button>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={readOnly}
          style={{
            ...theme.input.base,
            minWidth: 240,
            cursor: readOnly ? "not-allowed" : "pointer",
          }}
        >
          <option value="">Selectează status</option>
          <option value="REGISTERED">Înregistrat</option>
          <option value="TRIAGE_DONE">Triaj efectuat</option>
          <option value="WAITING_CONSULT">
            În așteptare consult
          </option>
          <option value="IN_CONSULT">În consult</option>
          <option value="IN_INVESTIGATION">
            În investigații
          </option>
          <option value="OBSERVATION">În observație</option>
          <option value="DISCHARGED">Externat</option>
          <option value="ADMITTED">Internat</option>
          <option value="TRANSFERRED">Transferat</option>
        </select>

        <button
          onClick={updateStatus}
          disabled={loading || readOnly}
          style={{
            ...theme.button.primary,
            opacity: loading || readOnly ? 0.65 : 1,
            cursor:
              loading || readOnly ? "not-allowed" : "pointer",
          }}
        >
          Actualizează statusul
        </button>
      </div>
    </div>
  );
}