import { theme } from "../../styles/theme";

export default function CheckboxField({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",
        cursor: "pointer",
        color: theme.colors.text,
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 16,
          height: 16,
          accentColor: theme.colors.primary,
          cursor: "pointer",
        }}
      />

      <span>{label}</span>
    </label>
  );
}