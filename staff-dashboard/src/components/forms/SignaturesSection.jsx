import SignaturePad from "./SignaturePad";

export default function SignaturesSection({
  preform,
  setPreform,
  discharge,
  setDischarge,
  readOnly=false,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 14,
      }}
    >
      <SignaturePad
        title="Semnătura asistent(ă)"
        nameValue={preform.nurseName || discharge.nurseName || ""}
        onNameChange={(value) => {
          setPreform((prev) => ({ ...prev, nurseName: value }));
          setDischarge((prev) => ({ ...prev, nurseName: value }));
        }}
        signatureValue={preform.nurseSignature || discharge.nurseSignature || ""}
        onSignatureChange={(value) => {
          setPreform((prev) => ({ ...prev, nurseSignature: value }));
          setDischarge((prev) => ({ ...prev, nurseSignature: value }));
        }}
        signedAtValue={preform.nurseSignedAt || discharge.nurseSignedAt || null}
        onSignedAtChange={(value) => {
          setPreform((prev) => ({ ...prev, nurseSignedAt: value }));
          setDischarge((prev) => ({ ...prev, nurseSignedAt: value }));
        }}
        readOnly={readOnly}
      />

      <SignaturePad
        title="Semnătura medic"
        nameValue={preform.doctorName || discharge.doctorName || ""}
        onNameChange={(value) => {
          setPreform((prev) => ({ ...prev, doctorName: value }));
          setDischarge((prev) => ({ ...prev, doctorName: value }));
        }}
        signatureValue={preform.doctorSignature || discharge.doctorSignature || ""}
        onSignatureChange={(value) => {
          setPreform((prev) => ({ ...prev, doctorSignature: value }));
          setDischarge((prev) => ({ ...prev, doctorSignature: value }));
        }}
        signedAtValue={preform.doctorSignedAt || discharge.doctorSignedAt || null}
        onSignedAtChange={(value) => {
          setPreform((prev) => ({ ...prev, doctorSignedAt: value }));
          setDischarge((prev) => ({ ...prev, doctorSignedAt: value }));
        }}
        readOnly={readOnly}
      />
    </div>
  );
}