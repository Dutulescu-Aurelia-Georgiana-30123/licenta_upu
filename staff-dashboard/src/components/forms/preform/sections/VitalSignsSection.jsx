export default function VitalSignsSection({ preform, setPreform }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
      <label>
        Fr. Res.
        <input
          value={preform.respiratoryRate}
          onChange={(e) =>
            setPreform({ ...preform, respiratoryRate: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        AV
        <input
          value={preform.av}
          onChange={(e) => setPreform({ ...preform, av: e.target.value })}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Puls
        <input
          value={preform.pulse}
          onChange={(e) => setPreform({ ...preform, pulse: e.target.value })}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        TA sistolică
        <input
          value={preform.systolicBp}
          onChange={(e) =>
            setPreform({ ...preform, systolicBp: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        TA diastolică
        <input
          value={preform.diastolicBp}
          onChange={(e) =>
            setPreform({ ...preform, diastolicBp: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Sat O2
        <input
          value={preform.spo2}
          onChange={(e) => setPreform({ ...preform, spo2: e.target.value })}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Temp
        <input
          value={preform.temperature}
          onChange={(e) =>
            setPreform({ ...preform, temperature: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Gli
        <input
          value={preform.glycemia}
          onChange={(e) =>
            setPreform({ ...preform, glycemia: e.target.value })
          }
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>

      <label>
        Scor durere 1-10
        <div style={{ marginTop: 8 }}>
          <input
            type="range"
            min="1"
            max="10"
            value={preform.painScale || 1}
            onChange={(e) =>
              setPreform({ ...preform, painScale: e.target.value })
            }
            style={{ width: "100%" }}
          />

          <div
            style={{
              marginTop: 6,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {preform.painScale || 1}
          </div>
        </div>
      </label>

      <label>
        TRC
        <input
          value={preform.trc}
          onChange={(e) => setPreform({ ...preform, trc: e.target.value })}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </label>
    </div>
  );
}