function safe(value) {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

function formatLocalDateTime(value) {
  if (!value) return "-";

  const text = String(value);

  const [datePart, timePartWithMs] = text.split("T");
  const timePart = timePartWithMs?.split(".")?.[0];

  if (!datePart || !timePart) {
    return text;
  }

  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return `${day}.${month}.${year}, ${hour}:${minute}`;
}

function CheckItem({ checked, label }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontWeight: 700, marginRight: 6 }}>{checked ? "☑" : "☐"}</span>
      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 700,
        fontSize: 18,
        marginBottom: 10,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function SignatureBlock({ title, name, signature, signedAt }) {
  return (
    <div
      style={{
        border: "1px solid #000",
        padding: 12,
        minHeight: 180,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>

      <div style={{ marginBottom: 8 }}>
        <b>Nume:</b> {safe(name)}
      </div>

      <div
        style={{
          height: 90,
          border: "1px solid #bbb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        {signature ? (
          <img
            src={signature}
            alt={title}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ color: "#666" }}>Fără semnătură</span>
        )}
      </div>

      <div>
        <b>Semnat la:</b>{" "}
        {formatLocalDateTime(signedAt)}
      </div>
    </div>
  );
}

export default function DischargePrintView({ discharge, preform }) {
  const patientStateLabel =
    discharge.patientStateAtDischarge === "AMELIORAT"
      ? "50 - Ameliorat"
      : discharge.patientStateAtDischarge === "STATIONAR"
      ? "51 - Staționar"
      : discharge.patientStateAtDischarge === "AGRAVAT"
      ? "52 - Agravat"
      : discharge.patientStateAtDischarge === "DECEDAT"
      ? "53 - Decedat"
      : "-";

  return (
    <div
      style={{
        background: "white",
        color: "black",
        padding: 24,
        borderRadius: 8,
        marginTop: 16,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>
          {safe(discharge.hospitalName || "SPITALUL CLINIC DE URGENȚĂ")}
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 6 }}>
          FIȘA DE EXTERNARE
        </div>
      </div>

      <div
        style={{
          border: "1px solid #000",
          padding: 12,
          marginBottom: 14,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
        }}
      >
        <div>
          <b>Nr. F.O.:</b> {safe(discharge.foNumber || preform?.sheetNumber)}
        </div>
        <div>
          <b>Data:</b> {safe(preform?.presentationDate)}
        </div>
        <div>
          <b>Ora externării:</b> {safe(discharge.dischargeHour)}
        </div>
        <div>
          <b>Secția:</b> {safe(discharge.sectionName)}
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Date pacient</SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          <div>
            <b>Prenume:</b> {safe(discharge.firstName || preform?.firstName)}
          </div>
          <div>
            <b>Nume:</b> {safe(discharge.lastName || preform?.lastName)}
          </div>
          <div>
            <b>Data nașterii:</b> {safe(discharge.birthDate || preform?.birthDate)}
          </div>
          <div>
            <b>Vârstă:</b> {safe(discharge.age ?? preform?.age)}
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Diagnostic la internare</SectionTitle>
        <div style={{ whiteSpace: "pre-wrap", minHeight: 60 }}>
          {safe(discharge.diagnosisAtAdmission)}
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Manevre / proceduri aplicate pacientului</SectionTitle>
        <div style={{ whiteSpace: "pre-wrap", minHeight: 80 }}>
          {safe(discharge.appliedProcedures)}
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Diagnostic la externare</SectionTitle>
        <div style={{ whiteSpace: "pre-wrap", minHeight: 60 }}>
          {safe(discharge.diagnosisAtDischarge)}
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Stare pacient</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <CheckItem checked={discharge.patientStateAtDischarge === "AMELIORAT"} label="50 - Ameliorat" />
          <CheckItem checked={discharge.patientStateAtDischarge === "STATIONAR"} label="51 - Staționar" />
          <CheckItem checked={discharge.patientStateAtDischarge === "AGRAVAT"} label="52 - Agravat" />
          <CheckItem checked={discharge.patientStateAtDischarge === "DECEDAT"} label="53 - Decedat" />
        </div>

        <div style={{ marginTop: 10 }}>
          <b>Stare selectată:</b> {patientStateLabel}
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Destinație pacient</SectionTitle>

        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>57 - Internat secția:</b> {safe(discharge.admittedSection)}
          </div>
          <div>
            <b>58 - Transferat secție:</b> {safe(discharge.transferredSection)}
          </div>
          <CheckItem
            checked={!!discharge.leavesWithRecommendations}
            label="59 - Pleacă cu recomandări"
          />
        </div>
      </div>

      <div style={{ border: "1px solid #000", padding: 12, marginBottom: 14 }}>
        <SectionTitle>Tratament și recomandări</SectionTitle>
        <div style={{ whiteSpace: "pre-wrap", minHeight: 100 }}>
          {safe(discharge.treatmentAndRecommendations)}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <SignatureBlock
          title="Semnătura asistent(ă)"
          name={discharge.nurseName}
          signature={discharge.nurseSignature}
          signedAt={discharge.nurseSignedAt}
        />

        <SignatureBlock
          title="Semnătura medic"
          name={discharge.doctorName}
          signature={discharge.doctorSignature}
          signedAt={discharge.doctorSignedAt}
        />
      </div>
    </div>
  );
}