import { theme } from "../../styles/theme";

export default function TextField({ label, value, onChange, placeholder = "" }) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          marginBottom: 6,
          color: theme.colors.text,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {label}
      </div>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...theme.input.base,
          width: "100%",
        }}
      />
    </label>
  );
}