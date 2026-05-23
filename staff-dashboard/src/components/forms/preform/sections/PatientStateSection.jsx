export default function PatientStateSection({
  preform,
  setPreform,
  aiFieldStyle,
}) {
  return (
    <>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>STARE PACIENT</div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            ["30_RESUSCITARE", "30 - Resuscitare"],
            ["31_CRITIC", "31 - Critic"],
            ["32_URGENT", "32 - Urgent"],
            ["33_NON_URGENT", "33 - Non-urgent"],
            ["34_CONSULT", "34 - Consult"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="patientStateCode"
                checked={preform.patientStateCode === value}
                onChange={() =>
                  setPreform({ ...preform, patientStateCode: value })
                }
              />{" "}
              {label}
            </label>
          ))}
        </div>
      </div>

      <label>
        Motivul prezentării
        <textarea
          value={preform.reason}
          onChange={(e) =>
            setPreform({ ...preform, reason: e.target.value })
          }
          rows={3}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 6,
            borderRadius: 12,
            ...aiFieldStyle("reason"),
          }}
        />
      </label>
    </>
  );
}