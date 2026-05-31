import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NearbyHospitalsMap from "../components/patient/NearbyHospitalsMap";
import Card from "../components/patient/portal/Card";
import PatientProfileSection from "../components/patient/portal/PatientProfileSection";
import ActiveVisitCard from "../components/patient/portal/ActiveVisitCard";
import VisitHistorySection from "../components/patient/portal/VisitHistorySection";
import QuestionsSection from "../components/patient/portal/QuestionsSection";
import useIsMobile from "../hooks/useIsMobile";
import usePatientPortalData from "../hooks/usePatientPortalData";
import { apiGet } from "../api/api";
import {
  headerStyle,
  headerSubtitleStyle,
  headerTitleStyle,
  logoutButtonStyle,
  pageStyle,
  shellStyle,
} from "../styles/patientPortalStyles";

export default function PatientPortal() {
  const { user, logout, login } = useAuth();
  useEffect(() => {
  if (!user?.id) return;

  const refreshUser = async () => {
    try {
      const freshUser = await apiGet(`/auth/users/${user.id}`);
      login(freshUser);
    } catch (err) {
      console.error("Eroare refresh date pacient:", err);
    }
  };

  refreshUser();
}, [user?.id]);

  const isMobile = useIsMobile();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const {
    activeVisit,
    visitHistory,
    documentsByVisit,
    visitLoading,
    questions,
    questionText,
    setQuestionText,
    questionLoading,
    questionSending,
    handleSendQuestion,
  } = usePatientPortalData(user);

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <div style={headerTitleStyle}>Portal pacient</div>
          <div style={headerSubtitleStyle}>
            Acces la date personale, vizite și documente medicale
          </div>
        </div>

        <button onClick={logout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>

      <div style={shellStyle}>
        <PatientProfileSection user={user} login={login} isMobile={isMobile} />

        <ActiveVisitCard
          activeVisit={activeVisit}
          visitLoading={visitLoading}
          isMobile={isMobile}
        />

        <VisitHistorySection
          historyOpen={historyOpen}
          setHistoryOpen={setHistoryOpen}
          visitLoading={visitLoading}
          visitHistory={visitHistory}
          documentsByVisit={documentsByVisit}
        />

        <QuestionsSection
          questionsOpen={questionsOpen}
          setQuestionsOpen={setQuestionsOpen}
          questions={questions}
          questionText={questionText}
          setQuestionText={setQuestionText}
          questionLoading={questionLoading}
          questionSending={questionSending}
          handleSendQuestion={handleSendQuestion}
          isMobile={isMobile}
        />

        <Card
          title="Spitale de urgență apropiate"
          subtitle="Hartă cu unități medicale de urgență"
          style={{ marginTop: 20 }}
        >
          <NearbyHospitalsMap />
        </Card>
      </div>
    </div>
  );
}