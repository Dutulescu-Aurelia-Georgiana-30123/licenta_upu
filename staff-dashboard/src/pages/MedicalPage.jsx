import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/api";
import FormsPage from "./FormsPage";
import MedicalHeader from "../components/medical/MedicalHeader";
import CurrentPatientSection from "../components/medical/CurrentPatientSection";
import WaitingPatientsSection from "../components/medical/WaitingPatientsSection";
import MyPatientsSection from "../components/medical/MyPatientsSection";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import MedicalProfilePage from "./MedicalProfilePage";
import QuestionsSection from "../components/medical/QuestionsSection";
import {
  exportCombinedPdf,
  downloadCombinedPdf,
} from "./formsPrintActions";

export default function MedicalPage() {
  const { user, logout } = useAuth();

const isDoctor = user?.role === "DOCTOR";
const isNurse = user?.role === "NURSE";

  const [visits, setVisits] = useState([]);
  const [myVisits, setMyVisits] = useState([]);
  const [showForms, setShowForms] = useState(false);
  const [historyVisits, setHistoryVisits] = useState([]);
  const [selectedVisitForForms, setSelectedVisitForForms] = useState(null);
  const [finalStatus, setFinalStatus] = useState("");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { showSuccess, showError } = useToast();

  const [availabilityStatus, setAvailabilityStatus] = useState(
    user?.availabilityStatus || "AVAILABLE"
  );

  const isFinalStatus = (status) =>
    status === "DISCHARGED" ||
    status === "ADMITTED" ||
    status === "TRANSFERRED";

  const currentVisit = myVisits.find((v) => !isFinalStatus(v.status));

  const load = async () => {
  if (!user?.id) return;

  try {
    const allVisits = await apiGet("/visits");
    setVisits(allVisits || []);

    const mine = isDoctor
      ? await apiGet(`/visits/doctor/${user.id}`)
      : await apiGet(`/visits/nurse/${user.id}`);

    setMyVisits(mine || []);

    const activeVisit = (mine || []).find(
      (v) => !isFinalStatus(v.status)
    );

    if (activeVisit) {
      setAvailabilityStatus("BUSY");
    } else {
      setAvailabilityStatus("AVAILABLE");
    }

    if (activeVisit?.patientId) {
      const patientVisits = await apiGet(
        `/visits/patient/${activeVisit.patientId}`
      );

      setHistoryVisits(patientVisits || []);
    } else {
      setHistoryVisits([]);
    }
  } catch (e) {
    console.error(e);
  }
}; 

  useEffect(() => {
  if (!user?.id) return;

  load();

  const interval = setInterval(() => {
    if (!showForms && !showProfile) {
      load();
    }
  }, 7000);

  return () => clearInterval(interval);
}, [user?.id, showForms, showProfile]);

  const updateAvailability = async (nextStatus) => {
    if (!user?.id) return;

    const hasActivePatient = myVisits.some((v) => !isFinalStatus(v.status));

    if (nextStatus === "AVAILABLE" && hasActivePatient) {
      showError("Nu te poți marca disponibil cât timp ai un pacient activ.");
      return;
    }

    try {
      await apiPut(`/auth/users/${user.id}/availability`, {
        availabilityStatus: nextStatus,
      });

      setAvailabilityStatus(nextStatus);
    } catch (e) {
      showError(e.message || "Eroare la actualizarea disponibilității");
    }
  };

  const takePatient = async (visitId) => {
  if (!user?.id) return;

  if (currentVisit) {
    showError(
      isDoctor
        ? "Medicul are deja un pacient activ."
        : "Asistentul are deja un pacient activ."
    );
    return;
  }

  try {
    if (isDoctor) {
      await apiPut(`/visits/${visitId}/assign-doctor`, {
        doctorId: user.id,
      });

      await apiPut(`/visits/${visitId}/status`, {
        status: "IN_CONSULT",
      });
    }

    if (isNurse) {
      await apiPut(`/visits/${visitId}/assign-nurse`, {
        nurseId: user.id,
      });
    }

    setAvailabilityStatus("BUSY");

    setPreviewOnly(false);
    setShowForms(false);
    setSelectedVisitForForms(null);

    await load();

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 150);

    showSuccess(
      isDoctor
        ? "Pacient preluat de medic."
        : "Pacient preluat de asistent."
    );
  } catch (e) {
    console.error(e);

    showError(
      e.message ||
        (isDoctor
          ? "Nu poți prelua pacientul ca medic"
          : "Nu poți prelua pacientul ca asistent")
    );
  }
};

  const finishCurrentPatient = async () => {
    if (!currentVisit || !finalStatus) {
      showError("Alege statusul final: externat, internat sau transferat.");
      return;
    }

    try {
      await apiPut(`/visits/${currentVisit.id}/status`, {
        status: finalStatus,
      });

      setFinalStatus("");
      setShowForms(false);
      setPreviewOnly(false);
      setSelectedVisitForForms(null);

      await load();

      await apiPut(`/auth/users/${user.id}/availability`, {
        availabilityStatus: "AVAILABLE",
      });
      setAvailabilityStatus("AVAILABLE");
    } catch (e) {
      showError("Eroare la finalizare");
    }
  };


  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#102033",
        }}
      >
        Se încarcă...
      </div>
    );
  }

  return (
  <div
    style={{
      minHeight: "100vh",
      padding: 28,
      boxSizing: "border-box",
      background:
        "radial-gradient(circle at top left, rgba(8,184,179,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 32%), linear-gradient(135deg, #eefdfa 0%, #f8fbff 45%, #e6fffd 100%)",
      color: "#102033",
    }}
  >
    <div
      style={{
        maxWidth: 1600,
        margin: "0 auto",
        display: "grid",
        gap: 18,
        overflow: "visible",
      }}
    >
      <MedicalHeader
        user={user}
        onLogout={logout}
        availabilityStatus={availabilityStatus}
        onAvailabilityChange={updateAvailability}
        onOpenProfile={() => setShowProfile(true)}
      />

      {showProfile ? (
  <MedicalProfilePage
    user={user}
    onBack={() => setShowProfile(false)}
  />
) : showForms && selectedVisitForForms ? (

        <div
          style={{
            background: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(255,255,255,0.8)",
            borderRadius: 34,
            padding: 24,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setShowForms(false);
              setPreviewOnly(false);
              setSelectedVisitForForms(null);
            }}
            style={{
              marginBottom: 18,
              padding: "11px 15px",
              borderRadius: 16,
              border: "1px solid rgba(8,184,179,0.25)",
              background: "#e6fffd",
              color: "#069a96",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ← Înapoi la pacienți
          </button>

          <FormsPage
            selected={selectedVisitForForms}
            onSelectVisit={(visit) => {
  setSelectedVisitForForms(visit);

  if (!visit) {
    setShowForms(false);
    setPreviewOnly(false);
    load();
  }
}}
            previewOnly={previewOnly}
          />
        </div>
      ) : (
        <>
          <CurrentPatientSection
            currentVisit={currentVisit}
            showForms={showForms}
            onToggleForms={() => {
              if (!currentVisit) return;

              setSelectedVisitForForms(currentVisit);
              setPreviewOnly(false);
              setShowForms(true);
            }}
            onFinishPatient={finishCurrentPatient}
            canFinish={isDoctor}
            finalStatus={finalStatus}
            setFinalStatus={setFinalStatus}
            historyVisits={historyVisits}
            onOpenPreviousVisit={(visit) => {
              setSelectedVisitForForms(visit);
              setPreviewOnly(true);
              setShowForms(true);
            }}
          />

          <div
  style={{
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 18,
    alignItems: "start",
  }}
>
  <div style={{ display: "grid", gap: 18 }}>
    <WaitingPatientsSection
      visits={visits}
      onTakePatient={takePatient}
      isDoctor={isDoctor}
      isNurse={isNurse}
    />

    {isDoctor && <QuestionsSection />}
  </div>

  <div style={{ display: "grid", gap: 18 }}>
    <MyPatientsSection
  myVisits={myVisits}
  onOpenVisit={(visit) => {
    setSelectedVisitForForms(visit);
    setPreviewOnly(true);
    setShowForms(true);
  }}
/>
  </div>
</div>
        </>
      )}
    </div>
  </div>
);
}