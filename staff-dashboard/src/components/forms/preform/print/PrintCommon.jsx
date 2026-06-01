export function Box({ checked = false }) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: 14,
        height: 14,
        border: "1.5px solid #000",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        lineHeight: 1,
        marginRight: 6,
        verticalAlign: "middle",
      }}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

export function CheckItem({ checked, label }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <Box checked={checked} />
      <span>{label}</span>
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

export function FieldLine({ label, value }) {
  return (
    <div>
      <b>{label}</b> {value || "-"}
    </div>
  );
}

export function LrRow({ leftChecked, label, rightChecked }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "26px 1fr 26px",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
      }}
    >
      <div>
        <Box checked={leftChecked} />
      </div>
      <div>{label}</div>
      <div style={{ textAlign: "right" }}>
        <Box checked={rightChecked} />
      </div>
    </div>
  );
}

export function safe(value) {
  return value || "-";
}

function formatLocalDateTime(value) {
  if (!value) return "-";

  const text = String(value);
  const [datePart, timePartWithMs] = text.split("T");
  const timePart = timePartWithMs?.split(".")?.[0];

  if (!datePart || !timePart) return text;

  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return `${day}.${month}.${year}, ${hour}:${minute}`;
}

export function SignatureBlock({ title, name, signature, signedAt }) {
  return (
    <div
      style={{
        border: "1px solid #000",
        padding: 12,
        minHeight: 180,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>

      <div style={{ marginBottom: 8 }}>
        <b>Nume:</b> {safe(name)}
      </div>

      <div
        style={{
          height: 90,
          border: "1px solid #bbb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        {signature ? (
          <img
            src={signature}
            alt={title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "#666" }}>Fără semnătură</span>
        )}
      </div>

      <div>
        <b>Semnat la:</b>{" "}
        {formatLocalDateTime(signedAt)}
      </div>
    </div>
  );
}