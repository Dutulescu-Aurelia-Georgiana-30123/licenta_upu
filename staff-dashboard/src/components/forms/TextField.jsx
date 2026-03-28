export default function TextField({ label, value, onChange, placeholder = "" }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: 8 }}
      />
    </label>
  );
}