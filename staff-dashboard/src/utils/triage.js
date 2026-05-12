export function getTriageLabel(triageColor) {
  const labels = {
    ROSU: "Roșu",
    GALBEN: "Galben",
    VERDE: "Verde",
    CONSULT: "Consult",
  };

  return labels[triageColor] || "Netriat";
}

export function getTriageStyle(triageColor) {
  const styles = {
    ROSU: { background: "#fee2e2", color: "#991b1b" },
    GALBEN: { background: "#fef3c7", color: "#b8aa0d" },
    VERDE: { background: "#c2f8d5", color: "#166534" },
    CONSULT: { background: "#a6d2f4", color: "#0f13e8" },
  };

  return styles[triageColor] || {
    background: "#f1f5f9",
    color: "#64748b",
  };
}