import Card from "./Card";
import AccordionSection from "./AccordionSection";
import {
  answerBoxStyle,
  answeredByStyle,
  askButtonStyle,
  emptyTextStyle,
  questionCardStyle,
  questionDateStyle,
  questionHeaderStyle,
  questionsLayoutStyle,
  questionStatusStyle,
  questionTextStyle,
  sectionMiniTitleStyle,
  singleColumnGridStyle,
  statusBoxStyle,
  textareaStyle,
} from "../../../styles/patientPortalStyles";
import { formatDateTime } from "../../../utils/patientPortalUtils";

export default function QuestionsSection({
  questionsOpen,
  setQuestionsOpen,
  questions,
  questionText,
  setQuestionText,
  questionLoading,
  questionSending,
  handleSendQuestion,
  isMobile,
}) {
  return (
    <Card style={{ marginTop: 20 }}>
      <AccordionSection
        title="Întreabă un medic"
        open={questionsOpen}
        setOpen={setQuestionsOpen}
      >
        <div style={isMobile ? singleColumnGridStyle : questionsLayoutStyle}>
          <div>
            <textarea
              placeholder="Scrie întrebarea ta aici..."
              rows={5}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              style={textareaStyle}
            />

            <button
              onClick={handleSendQuestion}
              disabled={questionSending}
              style={{
                ...askButtonStyle,
                opacity: questionSending ? 0.7 : 1,
                cursor: questionSending ? "not-allowed" : "pointer",
              }}
            >
              {questionSending ? "Se trimite..." : "Trimite întrebare"}
            </button>
          </div>

          <div>
            <div style={sectionMiniTitleStyle}>Întrebările mele</div>

            {questionLoading ? (
              <div style={statusBoxStyle}>Se încarcă întrebările...</div>
            ) : questions.length === 0 ? (
              <div style={emptyTextStyle}>Nu ai trimis încă întrebări.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {questions.map((q) => (
                  <div key={q.id} style={questionCardStyle}>
                    <div style={questionHeaderStyle}>
                      <div style={questionDateStyle}>
                        {formatDateTime(q.createdAt)}
                      </div>

                      <div
                        style={{
                          ...questionStatusStyle,
                          color:
                            q.status === "ANSWERED" ? "#166534" : "#92400e",
                          background:
                            q.status === "ANSWERED" ? "#dcfce7" : "#fef3c7",
                        }}
                      >
                        {q.status === "ANSWERED"
                          ? "Răspunsă"
                          : "În așteptare"}
                      </div>
                    </div>

                    <div style={questionTextStyle}>{q.questionText}</div>

                    {q.answerText && (
                      <div style={answerBoxStyle}>
                        <div style={{ fontWeight: 950, marginBottom: 4 }}>
                          Răspuns medic
                        </div>

                        {q.answerText}

                        {q.answeredByName && (
                          <div style={answeredByStyle}>
                            Răspuns oferit de: {q.answeredByName}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AccordionSection>
    </Card>
  );
}