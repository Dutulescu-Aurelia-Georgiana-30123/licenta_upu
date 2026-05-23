import { useEffect, useState } from "react";
import axios from "axios";

export default function usePatientPortalData(user) {
  const [activeVisit, setActiveVisit] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [documentsByVisit, setDocumentsByVisit] = useState({});
  const [visitLoading, setVisitLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionLoading, setQuestionLoading] = useState(true);
  const [questionSending, setQuestionSending] = useState(false);

  const loadPatientData = async () => {
    if (!user?.cnp) {
      setVisitLoading(false);
      setQuestionLoading(false);
      return;
    }

    try {
      const activeRes = await axios.get(
        `http://localhost:8081/visits/by-cnp/${user.cnp}/active`
      );

      setActiveVisit(activeRes.data || null);

      const historyRes = await axios.get(
        `http://localhost:8081/visits/by-cnp/${user.cnp}`
      );

      const visits = historyRes.data || [];
      setVisitHistory(visits);

      const docsMap = {};

      for (const visit of visits) {
        try {
          const docsRes = await axios.get(
            `http://localhost:8081/archived-documents/visit/${visit.id}`
          );

          docsMap[visit.id] = docsRes.data || [];
        } catch {
          docsMap[visit.id] = [];
        }
      }

      setDocumentsByVisit(docsMap);
    } catch (err) {
      console.error(err);
      setActiveVisit(null);
      setVisitHistory([]);
      setDocumentsByVisit({});
    } finally {
      setVisitLoading(false);
    }

    try {
      const questionsRes = await axios.get(
        `http://localhost:8081/patient-questions/by-cnp/${user.cnp}`
      );

      setQuestions(questionsRes.data || []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    } finally {
      setQuestionLoading(false);
    }
  };

  const reloadQuestions = async () => {
    if (!user?.cnp) return;

    try {
      const questionsRes = await axios.get(
        `http://localhost:8081/patient-questions/by-cnp/${user.cnp}`
      );

      setQuestions(questionsRes.data || []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    }
  };

  const handleSendQuestion = async () => {
    const cleanText = questionText.trim();

    if (!cleanText) {
      alert("Scrie întrebarea înainte de trimitere.");
      return;
    }

    setQuestionSending(true);

    try {
      await axios.post(
        `http://localhost:8081/patient-questions/by-cnp/${user.cnp}`,
        { questionText: cleanText }
      );

      setQuestionText("");
      await reloadQuestions();
    } catch (err) {
      console.error(err);
      alert("Nu s-a putut trimite întrebarea.");
    } finally {
      setQuestionSending(false);
    }
  };

  useEffect(() => {
    loadPatientData();

    const interval = setInterval(() => {
      loadPatientData();
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.cnp]);

  return {
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
  };
}