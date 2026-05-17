import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPut } from "../../api/api";
import { theme } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const LIMIT = 4;

function StatusBadge({ status }) {
  const isAnswered = status === "ANSWERED";

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        background: isAnswered ? "#dcfce7" : "#fef3c7",
        color: isAnswered ? "#166534" : "#92400e",
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {isAnswered ? "Răspunsă" : "Nouă"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QuestionsSection() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedOpen, setExpandedOpen] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(false);

  const loadQuestions = async () => {
    try {
      const data = await apiGet("/patient-questions");
      setQuestions(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadQuestions();

    const interval = setInterval(loadQuestions, 10000);

    return () => clearInterval(interval);
  }, []);

  const openQuestions = useMemo(
    () => questions.filter((q) => q.status === "OPEN"),
    [questions]
  );

  const answeredQuestions = useMemo(
    () => questions.filter((q) => q.status === "ANSWERED"),
    [questions]
  );

  const visibleOpenQuestions = expandedOpen
    ? openQuestions
    : openQuestions.slice(0, LIMIT);

  const visibleAnsweredQuestions = expandedHistory
    ? answeredQuestions
    : answeredQuestions.slice(0, LIMIT);

  const selectQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswerText("");
  };

  const answerQuestion = async () => {
    if (!selectedQuestion || !answerText.trim()) {
      showError("Completează răspunsul.");
      return;
    }

    try {
      setLoading(true);

      await apiPut(`/patient-questions/${selectedQuestion.id}/answer`, {
        userId: user.id,
        answerText,
      });

      showSuccess("Răspuns trimis.");

      setAnswerText("");
      setSelectedQuestion(null);

      await loadQuestions();
    } catch (e) {
      console.error(e);
      showError("Eroare la trimiterea răspunsului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={theme.card.base}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 950,
              color: theme.colors.text,
            }}
          >
            Întrebări pacienți
          </div>

          <div
            style={{
              color: theme.colors.muted,
              fontSize: 13,
              marginTop: 4,
              fontWeight: 700,
            }}
          >
            {openQuestions.length} întrebări noi · {answeredQuestions.length} răspunsuri în istoric
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory((prev) => !prev)}
          style={theme.button.secondary}
        >
          {showHistory ? "Ascunde istoricul" : "Istoric răspunsuri"}
        </button>
      </div>

      <div style={sectionTitleStyle}>
        Întrebări noi
        <StatusBadge status="OPEN" />
      </div>

      {openQuestions.length === 0 ? (
        <div style={emptyStyle}>Nu există întrebări noi.</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {visibleOpenQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                selected={selectedQuestion?.id === q.id}
                onClick={() => selectQuestion(q)}
              />
            ))}
          </div>

          {openQuestions.length > LIMIT && (
            <button
              type="button"
              onClick={() => setExpandedOpen((prev) => !prev)}
              style={{
                ...theme.button.secondary,
                width: "100%",
                marginTop: 12,
              }}
            >
              {expandedOpen
                ? "Restrânge lista ↑"
                : `Vezi încă ${openQuestions.length - LIMIT} întrebări ↓`}
            </button>
          )}
        </>
      )}

      {selectedQuestion && selectedQuestion.status === "OPEN" && (
        <div
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              marginBottom: 10,
              fontWeight: 900,
              color: theme.colors.text,
            }}
          >
            Răspunde lui {selectedQuestion.patientFirstName}{" "}
            {selectedQuestion.patientLastName}
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 18,
              background: "#f8fafc",
              border: `1px solid ${theme.colors.border}`,
              color: "#334155",
              fontWeight: 700,
              lineHeight: 1.5,
              marginBottom: 12,
            }}
          >
            {selectedQuestion.questionText}
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Scrie răspunsul medical..."
            rows={5}
            style={textareaStyle}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            <button
              onClick={answerQuestion}
              disabled={loading}
              style={{
                ...theme.button.primary,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Se trimite..." : "Trimite răspuns"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedQuestion(null);
                setAnswerText("");
              }}
              style={theme.button.secondary}
            >
              Anulează
            </button>
          </div>
        </div>
      )}

      {showHistory && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <div style={sectionTitleStyle}>
            Istoric răspunsuri
            <StatusBadge status="ANSWERED" />
          </div>

          {answeredQuestions.length === 0 ? (
            <div style={emptyStyle}>Nu există răspunsuri în istoric.</div>
          ) : (
            <>
              <div style={{ display: "grid", gap: 12 }}>
                {visibleAnsweredQuestions.map((q) => (
                  <AnsweredQuestionCard key={q.id} question={q} />
                ))}
              </div>

              {answeredQuestions.length > LIMIT && (
                <button
                  type="button"
                  onClick={() => setExpandedHistory((prev) => !prev)}
                  style={{
                    ...theme.button.secondary,
                    width: "100%",
                    marginTop: 12,
                  }}
                >
                  {expandedHistory
                    ? "Restrânge istoricul ↑"
                    : `Vezi încă ${answeredQuestions.length - LIMIT} răspunsuri ↓`}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        borderRadius: 20,
        border: selected ? "2px solid #08b8b3" : `1px solid ${theme.colors.border}`,
        background: selected ? "#ecfeff" : "#f8fafc",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 900, color: theme.colors.text }}>
          {question.patientFirstName} {question.patientLastName}
        </div>

        <StatusBadge status={question.status} />
      </div>

      <div style={questionTextStyle}>{question.questionText}</div>

      <div style={metaTextStyle}>Trimisă la {formatDate(question.createdAt)}</div>
    </div>
  );
}

function AnsweredQuestionCard({ question }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 20,
        background: "#f8fafc",
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 900, color: theme.colors.text }}>
          {question.patientFirstName} {question.patientLastName}
        </div>

        <StatusBadge status={question.status} />
      </div>

      <div style={questionTextStyle}>{question.questionText}</div>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 16,
          background: "#ffffff",
          border: `1px solid ${theme.colors.border}`,
          color: "#334155",
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            color: theme.colors.muted,
            fontSize: 12,
            fontWeight: 900,
            marginBottom: 5,
          }}
        >
          Răspuns
        </div>

        {question.answerText || "-"}
      </div>

      <div style={metaTextStyle}>
        Răspuns de {question.answeredByName || question.answeredByEmail || "-"} ·{" "}
        {formatDate(question.answeredAt)}
      </div>
    </div>
  );
}

const sectionTitleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 12,
  color: theme.colors.text,
  fontSize: 15,
  fontWeight: 950,
};

const emptyStyle = {
  padding: 20,
  borderRadius: 20,
  background: "#f8fafc",
  border: `1px dashed ${theme.colors.border}`,
  color: theme.colors.muted,
  textAlign: "center",
  fontWeight: 800,
};

const questionTextStyle = {
  color: "#334155",
  lineHeight: 1.5,
  fontWeight: 700,
};

const metaTextStyle = {
  marginTop: 10,
  fontSize: 12,
  color: theme.colors.muted,
  fontWeight: 700,
};

const textareaStyle = {
  width: "100%",
  resize: "vertical",
  boxSizing: "border-box",
  padding: 14,
  borderRadius: 18,
  border: "1px solid #dbe4ee",
  background: "#ffffff",
  fontFamily: "inherit",
  fontSize: 14,
  outline: "none",
};