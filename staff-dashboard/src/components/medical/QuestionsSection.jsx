import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../api/api";
import { theme } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function QuestionsSection() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQuestions = async () => {
    try {
      const data = await apiGet("/patient-questions/open");
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

  const answerQuestion = async () => {
    if (!selectedQuestion || !answerText.trim()) {
      showError("Completează răspunsul.");
      return;
    }

    try {
      setLoading(true);

      await apiPut(
        `/patient-questions/${selectedQuestion.id}/answer`,
        {
          userId: user.id,
          answerText,
        }
      );

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
      <div style={{ marginBottom: 16 }}>
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
          Întrebări primite de la pacienți
        </div>
      </div>

      {questions.length === 0 ? (
        <div
          style={{
            padding: 20,
            borderRadius: 20,
            background: "#f8fafc",
            border: `1px dashed ${theme.colors.border}`,
            color: theme.colors.muted,
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          Nu există întrebări noi.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              style={{
                padding: 16,
                borderRadius: 20,
                border:
                  selectedQuestion?.id === q.id
                    ? "2px solid #08b8b3"
                    : `1px solid ${theme.colors.border}`,
                background:
                  selectedQuestion?.id === q.id
                    ? "#ecfeff"
                    : "#f8fafc",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  color: theme.colors.text,
                  marginBottom: 6,
                }}
              >
                {q.patientFirstName} {q.patientLastName}
              </div>

              <div
                style={{
                  color: "#334155",
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}
              >
                {q.questionText}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: theme.colors.muted,
                  fontWeight: 700,
                }}
              >
                {q.createdAt
                  ? new Date(q.createdAt).toLocaleString("ro-RO")
                  : "-"}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQuestion && (
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
            Răspunde întrebării
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Scrie răspunsul medical..."
            rows={5}
            style={{
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
            }}
          />

          <button
            onClick={answerQuestion}
            disabled={loading}
            style={{
              ...theme.button.primary,
              marginTop: 12,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Se trimite..." : "Trimite răspuns"}
          </button>
        </div>
      )}
    </div>
  );
}