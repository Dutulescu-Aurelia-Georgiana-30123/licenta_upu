import { calculateGcsValue } from "../utils/preformHelpers";

export default function GcsSection({ preform, setPreform }) {
  const updateGcsPart = (field, value) => {
    const nextPreform = {
      ...preform,
      [field]: value,
    };

    nextPreform.gcs = calculateGcsValue(nextPreform);

    setPreform(nextPreform);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
      }}
    >
      <label>
        Ora GCS
        <input
          value={preform.gcsHour}
          onChange={(e) =>
            setPreform({ ...preform, gcsHour: e.target.value })
          }
          onFocus={() => {
            if (!preform.gcsHour) {
              const currentTime = new Date().toLocaleTimeString("ro-RO", {
                hour: "2-digit",
                minute: "2-digit",
              });

              setPreform((prev) => ({
                ...prev,
                gcsHour: currentTime,
              }));
            }
          }}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        M
        <input
          value={preform.gcsM}
          onChange={(e) => updateGcsPart("gcsM", e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        V
        <input
          value={preform.gcsV}
          onChange={(e) => updateGcsPart("gcsV", e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        O
        <input
          value={preform.gcsO}
          onChange={(e) => updateGcsPart("gcsO", e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        GCS
        <input
          value={calculateGcsValue(preform)}
          readOnly
          style={{
            width: "100%",
            padding: 8,
            marginTop: 6,
            background: "#f8fafc",
            fontWeight: 700,
          }}
        />
      </label>
    </div>
  );
}