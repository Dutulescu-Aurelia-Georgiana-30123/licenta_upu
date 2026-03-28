export default function LrCheckboxRow({
  label,
  leftChecked,
  rightChecked,
  onLeftChange,
  onRightChange,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr 56px",
        alignItems: "center",
        gap: 8,
      }}
    >
      <label style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <span>Stg</span>
        <input type="checkbox" checked={!!leftChecked} onChange={(e) => onLeftChange(e.target.checked)} />
      </label>

      <div>{label}</div>

      <label style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <span>Dr</span>
        <input type="checkbox" checked={!!rightChecked} onChange={(e) => onRightChange(e.target.checked)} />
      </label>
    </div>
  );
}