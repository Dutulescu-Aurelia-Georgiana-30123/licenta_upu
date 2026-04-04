export function getStatusLabel(status) {
  const labels = {
    REGISTERED: "Înregistrat",
    WAITING_TRIAGE: "În așteptare triaj",
    TRIAGE_DONE: "Triaj efectuat",
    WAITING_CONSULT: "În așteptare consult",
    IN_CONSULT: "În consult",
    IN_INVESTIGATION: "În investigații",
    OBSERVATION: "În observație",
    DISCHARGED: "Externat",
    ADMITTED: "Internat",
    TRANSFERRED: "Transferat",
  };

  return labels[status] || status || "-";
}