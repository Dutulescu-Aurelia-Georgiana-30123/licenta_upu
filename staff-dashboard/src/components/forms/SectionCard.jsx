export default function SectionCard({ title, isOpen, onToggle, children }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 12,
        background: "#121212",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
          borderBottom: isOpen ? "1px solid #333" : "none",
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button onClick={onToggle} style={{ padding: "8px 12px" }}>
          {isOpen ? "Restrânge" : "Extinde"}
        </button>
      </div>

      {isOpen && <div style={{ padding: 14 }}>{children}</div>}
    </div>
  );
}