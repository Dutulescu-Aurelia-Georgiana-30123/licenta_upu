export function getStatusLabel(status) {
  const labels = {
    REGISTERED: "Înregistrat",
    WAITING_CONSULT: "În așteptare consult",
    IN_CONSULT: "În consult",
    DISCHARGED: "Externat",
    ADMITTED: "Internat",
    TRANSFERRED: "Transferat",
  };

  return labels[status] || status || "-";
}