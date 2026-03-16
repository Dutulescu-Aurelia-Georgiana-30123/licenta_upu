import { useEffect, useState } from "react";
import { apiGet, API_BASE } from "../api/api";

export default function ArchivePage({ selected }) {
  const [combinedDoc, setCombinedDoc] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCombinedDoc(null);
    setError("");
    if (!selected) return;

    apiGet(`/visits/${selected.id}/documents`)
      .then((docs) => {
        const doc = docs.find((d) => d.documentType === "COMBINED_VISIT_PDF") || null;
        setCombinedDoc(doc);
      })
      .catch((e) => setError(String(e)));
  }, [selected]);

  if (!selected) {
    return (
      <div style={{ padding: 16, width: "100%" }}>
        <h2>Arhivă</h2>
        <p>Selectează o vizită din “Vizite” ca să vezi documentul combinat.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, width: "100%" }}>
      <h2>Arhivă (vizita {selected.id})</h2>

      {error && <p style={{ color: "red" }}>Eroare: {error}</p>}

      {!combinedDoc ? (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <p style={{ marginTop: 0 }}>Nu există încă PDF combinat pentru această vizită.</p>
        </div>
      ) : (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          <p style={{ marginTop: 0 }}>
            PDF combinat disponibil: <b>{combinedDoc.fileName}</b>
          </p>
          <a href={`${API_BASE}/documents/${combinedDoc.id}/download`} target="_blank" rel="noreferrer">
            Descarcă PDF combinat
          </a>
        </div>
      )}
    </div>
  );
}