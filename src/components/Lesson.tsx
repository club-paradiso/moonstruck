import { useI18n } from "../lib/LocaleContext";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw, BookOpen, Sparkles } from "lucide-react";
import { Bunny, Modal } from "./UI";
import type { Paper } from "../lib/types";
const lessons = [
  {
    match: /abstract/i,
    title: "Start with the big picture",
    label: "Abstract",
    description:
      "Think of the abstract as a tiny version of the whole paper. It helps you decide what the researchers asked, how they explored it, and what they found.",
    question: "Which three things should you look for in an abstract?",
    options: [
      "Every citation, table, and equation",
      "The question, the method, and the main finding",
      "Only the authors’ final opinion",
    ],
    answer: 1,
    feedback:
      "Exactly. Those three anchors give you a map for everything that follows.",
  },
  {
    match: /introduction|background/i,
    title: "Find the missing piece",
    label: "Introduction",
    description:
      "An introduction sets the scene. It connects what researchers already know to something they still need to understand. That missing piece motivates the study.",
    question: "What usually motivates a new research question?",
    options: [
      "A gap or unresolved problem in existing knowledge",
      "The number of pages in the paper",
      "A list of all the authors’ previous work",
    ],
    answer: 0,
    feedback:
      "Yes! Look for phrases such as “however,” “remains unclear,” and “we investigate.”",
  },
  {
    match: /method|study/i,
    title: "See how the question was tested",
    label: "Methods",
    description:
      "Methods are the recipe. Look for who or what was studied, which conditions were compared, and how outcomes were measured. A clear recipe lets you evaluate the evidence.",
    question: "Which detail helps you evaluate a study’s methods?",
    options: [
      "Whether the title sounds convincing",
      "How often the authors use technical words",
      "How participants were assigned and outcomes measured",
    ],
    answer: 2,
    feedback:
      "Right. The study design determines which conclusions the evidence can support.",
  },
  {
    match: /result/i,
    title: "Separate findings from meaning",
    label: "Results",
    description:
      "Results tell you what the researchers observed. The discussion explains what it might mean. Keep those two jobs separate, and always leave room for uncertainty.",
    question: "Which statement belongs most clearly in a results section?",
    options: [
      "Future research should explore other ages",
      "The retrieval group recalled 72% of the ideas",
      "This could transform education everywhere",
    ],
    answer: 1,
    feedback:
      "You’ve got it. A measured observation is a result; its wider meaning belongs in the discussion.",
  },
];
export function Lesson({
  paper,
  onClose,
  onNavigate,
  onComplete,
}: {
  paper: Paper;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState(false);
  const lesson = lessons[step];
  const section = paper.sections.find((s) => lesson.match.test(s.title));
  const correct = answer === lesson.answer;
  return (
    <Modal title={t("A little lesson with Lumi")} onClose={onClose} wide>
      <div className="lesson-body">
        <div
          className="lesson-progress"
          aria-label={
            locale === "ko"
              ? `4단계 중 ${done ? 4 : step + 1}단계`
              : `Lesson ${done ? 4 : step + 1} of 4`
          }
        >
          {lessons.map((_, i) => (
            <span key={i} className={i <= step ? "filled" : ""} />
          ))}
        </div>
        {done ? (
          <div className="lesson-finished">
            <Bunny />
            <span className="completion-symbol">
              <Check size={22} />
            </span>
            <h2>{t("A paper feels a little less puzzling.")}</h2>
            <p>
              {t(
                "You’ve explored the question, the method, and the finding. Next time you read a paper, look for those three anchors.",
              )}
            </p>
            <button className="primary-button" onClick={onClose}>
              {t("Back to my paper")}
              <ArrowRight size={16} />
            </button>
            <button
              className="text-button"
              onClick={() => {
                setStep(0);
                setAnswer(null);
                setDone(false);
              }}
            >
              <RotateCcw size={14} />
              {t("Try the lesson again")}
            </button>
          </div>
        ) : (
          <>
            <div className="lesson-intro">
              <div>
                <span className="lesson-step">
                  {String(step + 1).padStart(2, "0")} / 04 · {t(lesson.label)}
                </span>
                <h2>{t(lesson.title)}</h2>
                <p>{t(lesson.description)}</p>
              </div>
              <Bunny />
            </div>
            {section ? (
              <button
                className="lesson-passage"
                aria-expanded={preview}
                onClick={() => {
                  onNavigate(section.id);
                  setPreview((v) => !v);
                }}
              >
                <BookOpen size={16} />
                <span>
                  {locale === "ko" ? (
                    <>
                      <strong>{t(section.title)}</strong> 본문 보기
                    </>
                  ) : (
                    <>
                      Find <strong>{section.title}</strong> in your paper
                    </>
                  )}
                </span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <p className="lesson-missing">
                {t(
                  "This heading was not detected in your PDF. You can still practice identifying its role.",
                )}
              </p>
            )}
            {preview && section && (
              <blockquote className="lesson-excerpt">
                {(locale === "ko"
                  ? section.paragraphs[0]?.ko || section.paragraphs[0]?.text
                  : section.paragraphs[0]?.text) ||
                  t(
                    "This section has no extracted text. Check the original PDF.",
                  )}
              </blockquote>
            )}
            <div className="lesson-quiz">
              <h3>{t(lesson.question)}</h3>
              <div role="group" aria-label={t("Answer choices")}>
                {lesson.options.map((option, i) => (
                  <button
                    key={option}
                    disabled={correct}
                    className={`quiz-option ${answer === i ? (correct ? "correct" : "incorrect") : ""}`}
                    onClick={() => setAnswer(i)}
                  >
                    <span>
                      {answer === i && correct ? (
                        <Check size={15} />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    {t(option)}
                  </button>
                ))}
              </div>
              <div aria-live="polite">
                {answer !== null && (
                  <p className={`quiz-feedback ${correct ? "correct" : ""}`}>
                    {correct
                      ? t(lesson.feedback)
                      : t(
                          "Not quite. Think about the specific job this section does, then try again.",
                        )}
                  </p>
                )}
              </div>
            </div>
            <div className="lesson-footer">
              <span>
                <Sparkles size={14} />
                {t("Understanding takes practice.")}
              </span>
              <button
                className="primary-button"
                disabled={!correct}
                onClick={() => {
                  if (section) onComplete(section.id);
                  if (step === lessons.length - 1) setDone(true);
                  else {
                    setStep((s) => s + 1);
                    setAnswer(null);
                    setPreview(false);
                  }
                }}
              >
                {step === 3 ? t("Finish lesson") : t("Next little step")}
                <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
