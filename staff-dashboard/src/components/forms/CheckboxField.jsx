export default function CheckboxField({ label, checked, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />{" "}
      {label}
    </label>
  );
}