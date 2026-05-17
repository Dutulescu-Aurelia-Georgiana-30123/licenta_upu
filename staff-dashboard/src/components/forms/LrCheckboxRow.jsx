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
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: 700,
          minWidth: 42,
        }}
      >
        Stg
        <input
          type="checkbox"
          checked={leftChecked}
          onChange={(e) => onLeftChange(e.target.checked)}
        />
      </label>

      <div
        style={{
          flex: "0 1 auto",
        }}
      >
        {label}
      </div>

      <label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 700,
    minWidth: 42,
  }}
>
  <input
    type="checkbox"
    checked={rightChecked}
    onChange={(e) => onRightChange(e.target.checked)}
  />
  Dr
</label>
    </div>
  );
}