import html2pdf from "html2pdf.js";
import { API_BASE } from "../api/api";

export async function exportCombinedPdf({ selected, setMsg }) {
  if (!selected) return false;

  setMsg("Se generează PDF...");

  const element = document.getElementById("print-area");

  if (!element) {
    throw new Error("Zona de print nu a fost găsită.");
  }

  const opt = {
    margin: 0.4,
    filename: `visit_${selected.id}.pdf`,
    image: { type: "jpeg", quality: 0.85 },
    html2canvas: { scale: 1.2, useCORS: true },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
  };

  const pdfBlob = await html2pdf()
    .set(opt)
    .from(element)
    .outputPdf("blob");

  const formData = new FormData();
  formData.append("file", pdfBlob, `visit_${selected.id}.pdf`);
  formData.append("visitId", selected.id);

  const response = await fetch(`${API_BASE}/archived-documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
  let errorMessage = "Eroare upload PDF";

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    const text = await response.text();
    errorMessage = text || errorMessage;
  }

  throw new Error(errorMessage);
}

  setMsg("PDF salvat în arhivă.");
  return true; 
}

export async function downloadCombinedPdf({ selected, setMsg }) {
  if (!selected) return;

  setMsg("Se generează PDF pentru descărcare...");

  const element = document.getElementById("print-area");

  if (!element) {
    throw new Error("Zona de print nu a fost găsită.");
  }

  const opt = {
    margin: 0.4,
    filename: `fise_vizita_${selected.id}.pdf`,
    image: { type: "jpeg", quality: 0.9 },
    html2canvas: { scale: 1.2, useCORS: true },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(opt).from(element).save();

  setMsg("PDF descărcat.");
}