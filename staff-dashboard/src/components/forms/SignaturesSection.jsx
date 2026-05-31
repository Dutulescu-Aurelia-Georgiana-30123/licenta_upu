import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { theme } from "../../styles/theme";

export default function SignaturesSection({
  preform,
  setPreform,
  discharge,
  setDischarge,
  readOnly = false,
  onSavePreform,
  onSaveDischarge,
}) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const profileName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.email ||
    "";

  const applyProfileSignature = (type) => {
    if (readOnly) return;

    if (!user?.profileSignature) {
      showError("Nu ai o semnătură salvată în profil.");
      return;
    }

    const signedAt = new Date().toISOString();

    if (type === "doctor") {
      const updatedPreform = {
  ...preform,
  doctorName: profileName,
  doctorSignature: user.profileSignature,
  doctorSignedAt: signedAt,
};

const updatedDischarge = {
  ...discharge,
  doctorName: profileName,
  doctorSignature: user.profileSignature,
  doctorSignedAt: signedAt,
};

setPreform(updatedPreform);
setDischarge(updatedDischarge);

onSavePreform && onSavePreform(updatedPreform, true);
onSaveDischarge && onSaveDischarge(updatedDischarge, true);

      showSuccess("Semnătura a fost aplicată și fișele au fost salvate.");
      return;
    }

   const updatedPreform = {
  ...preform,
  nurseName: profileName,
  nurseSignature: user.profileSignature,
  nurseSignedAt: signedAt,
};

const updatedDischarge = {
  ...discharge,
  nurseName: profileName,
  nurseSignature: user.profileSignature,
  nurseSignedAt: signedAt,
};

setPreform(updatedPreform);
setDischarge(updatedDischarge);

onSavePreform && onSavePreform(updatedPreform, true);
onSaveDischarge && onSaveDischarge(updatedDischarge, true);

    showSuccess("Semnătura a fost aplicată și fișele au fost salvate.");
  };

  if (readOnly) return null;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a" }}>
          Semnături medicale
        </div>

        <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
          Inserează automat semnătura salvată în profil.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {user?.role === "NURSE" && (
          <button
            type="button"
            onClick={() => applyProfileSignature("nurse")}
            style={theme.button.primary}
          >
            Semnează ca asistent
          </button>
        )}

        {user?.role === "DOCTOR" && (
          <button
            type="button"
            onClick={() => applyProfileSignature("doctor")}
            style={theme.button.primary}
          >
            Semnează ca medic
          </button>
        )}
      </div>
    </div>
  );
}