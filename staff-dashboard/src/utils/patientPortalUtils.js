export function formatVisitStatus(status) {
  const labels = {
    REGISTERED: "Înregistrat",
    WAITING_CONSULT: "În așteptare pentru consultație",
    IN_CONSULT: "În consultație",
    DISCHARGED: "Externat",
    ADMITTED: "Internat",
    TRANSFERRED: "Transferat",
  };

  return labels[status] || status || "—";
}

export function getTriageColor(color) {
  switch (color) {
    case "ROSU":
      return "#dc2626";
    case "GALBEN":
      return "#ca8a04";
    case "VERDE":
      return "#16a34a";
    default:
      return "#64748b";
  }
}

export function getTriageBackground(color) {
  switch (color) {
    case "ROSU":
      return "#fee2e2";
    case "GALBEN":
      return "#fef9c3";
    case "VERDE":
      return "#dcfce7";
    default:
      return "#f1f5f9";
  }
}

export function formatDateTime(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}