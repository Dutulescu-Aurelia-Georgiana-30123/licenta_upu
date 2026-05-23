import PrintPatientAndArrival from "./preform/print/PrintPatientAndArrival";
import PrintVitalsAndHistory from "./preform/print/PrintVitalsAndHistory";
import PrintObjectiveExam from "./preform/print/PrintObjectiveExam";
import PrintProceduresAndSignatures from "./preform/print/PrintProceduresAndSignatures";

export default function PreformPrintView({ preform }) {
  return (
    <div
      style={{
        background: "white",
        color: "black",
        padding: 24,
        borderRadius: 8,
        marginTop: 16,
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
      }}
    >
      <div
        style={{
          border: "1.5px solid #000",
          padding: 14,
        }}
      >
        <PrintPatientAndArrival preform={preform} />
        <PrintVitalsAndHistory preform={preform} />
        <PrintObjectiveExam preform={preform} />
        <PrintProceduresAndSignatures preform={preform} />
      </div>
    </div>
  );
}