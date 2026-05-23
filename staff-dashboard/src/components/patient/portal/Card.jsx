export default function Card({ title, subtitle, children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e5eef8",
        borderRadius: 28,
        padding: 24,
        boxShadow: "0 22px 55px rgba(15, 47, 95, 0.08)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {title && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 950, color: "#102033" }}>
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 14,
                color: "#667085",
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}