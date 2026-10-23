import { useI18n } from "../lib/LocaleContext";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  FileText,
  FlaskConical,
  Lightbulb,
  ChevronRight,
  ArrowUp,
  ArrowUpRight,
  X,
  Plus,
  Trash2,
  Download,
  Bookmark,
  Languages,
  LoaderCircle,
} from "lucide-react";
import { Bunny, IconButton } from "./UI";
import { askCompanion, explainSection } from "../lib/analysis";
import type { Message, Note, Paper, Section } from "../lib/types";
import type { Selection } from "./Reader";
export function Companion({
  paper,
  section,
  selection,
  clearSelection,
  notes,
  addNote,
  removeNote,
  onNavigate,
  mobileOpen,
  onClose,
  tab,
  setTab,
  korean,
}: {
  paper: Paper;
  section: Section;
  selection: Selection | null;
  clearSelection: () => void;
  notes: Note[];
  addNote: (text: string, quote?: string) => void;
  removeNote: (id: string) => void;
  onNavigate: (id: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
  tab: string;
  setTab: (tab: string) => void;
  korean: boolean;
}) {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [translated, setTranslated] = useState(false);
  const history = useRef<HTMLDivElement>(null);
  const generation = useRef(0);
  const sending = useRef(false);
  useEffect(() => {
    generation.current++;
    sending.current = false;
    setMessages([]);
    setBusy(false);
    setDraft("");
    setQuestion("");
  }, [paper.id]);
  useEffect(() => {
    setTranslated(false);
  }, [selection?.paragraph.id]);
  useEffect(() => {
    if (messages.length)
      history.current?.scrollTo({
        top: history.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages, busy]);
  async function send(value: string) {
    if (!value.trim() || sending.current) return;
    sending.current = true;
    const version = generation.current;
    setBusy(true);
    setQuestion("");
    setTab("companion");
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", text: value },
    ]);
    try {
      const answer = await askCompanion(
        value,
        paper,
        selection?.section || section,
        korean,
      );
      if (generation.current === version)
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: "assistant", ...answer },
        ]);
    } finally {
      if (generation.current === version) {
        sending.current = false;
        setBusy(false);
      }
    }
  }
  function exportNotes() {
    const text = `# ${paper.title}\n\n${notes.map((n) => `${n.quote ? `> ${n.quote}\n\n` : ""}${n.text}\n\n— ${paper.sections.find((s) => s.id === n.sectionId)?.title || t("Paper")}`).join("\n\n---\n\n")}`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/markdown" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "moonstruck-notes.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div
        className={`drawer-shade companion-shade ${mobileOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`companion-panel ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="companion-tabs">
          <button
            className={tab === "companion" ? "active" : ""}
            onClick={() => setTab("companion")}
          >
            <Sparkles size={15} />
            {t("Companion")}
          </button>
          <button
            className={tab === "notes" ? "active" : ""}
            onClick={() => setTab("notes")}
          >
            {t("Notes")}
            {notes.length > 0 && <span>{notes.length}</span>}
          </button>
          <span className="mobile-only">
            <IconButton label={t("Close companion")} onClick={onClose}>
              <X size={18} />
            </IconButton>
          </span>
        </div>
        {tab === "notes" ? (
          <div className="notes-view">
            <div className="notes-heading">
              <h3>{t("Your little discoveries")}</h3>
              <IconButton
                label={t("Export notes")}
                disabled={!notes.length}
                onClick={exportNotes}
              >
                <Download size={16} />
              </IconButton>
            </div>
            <p className="muted">
              {t("Ideas worth coming back to. Saved on this device.")}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) {
                  addNote(draft.trim());
                  setDraft("");
                }
              }}
            >
              <textarea
                aria-label={t("New note")}
                placeholder={t("Write a thought about this section…")}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={10000}
              />
              <button className="primary-button" disabled={!draft.trim()}>
                <Plus size={15} />
                {t("Add note")}
              </button>
            </form>
            {notes.length === 0 && (
              <div className="empty-notes">
                <Bookmark size={28} />
                <p>{t("Your notes start here.")}</p>
                <small>
                  {t("Select a passage to save it, or write a thought above.")}
                </small>
              </div>
            )}
            {notes.map((note) => (
              <div className="note" key={note.id}>
                {note.quote && <blockquote>{note.quote}</blockquote>}
                <p>{note.text}</p>
                <footer>
                  <button onClick={() => onNavigate(note.sectionId)}>
                    {t(
                      paper.sections.find((s) => s.id === note.sectionId)
                        ?.title || "",
                    )}
                    <ArrowUpRight size={12} />
                  </button>
                  <IconButton
                    label={t("Delete note")}
                    onClick={() => removeNote(note.id)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </footer>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="companion-content" ref={history}>
              {selection ? (
                <div className="selection-explanation">
                  <div className="selection-heading">
                    <span>
                      <Sparkles size={15} />
                      {t("A closer look")}
                    </span>
                    <IconButton
                      label={t("Clear selected passage")}
                      onClick={clearSelection}
                    >
                      <X size={16} />
                    </IconButton>
                  </div>
                  <span className="section-tag">
                    {t(selection.section.title)}
                  </span>
                  <blockquote>
                    {selection.quote || selection.paragraph.text}
                  </blockquote>
                  <h3>{t("In simpler terms")}</h3>
                  <p>
                    {korean
                      ? selection.paragraph.explanationKo ||
                        explainSection(selection.section, true)
                      : selection.paragraph.explanation ||
                        explainSection(selection.section, false)}
                  </p>
                  <div className="selection-actions">
                    <button
                      className="secondary-button"
                      onClick={() => setTranslated((v) => !v)}
                    >
                      <Languages size={14} />{" "}
                      {translated ? t("Hide translation") : "한국어 번역"}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() =>
                        addNote(
                          t("Saved passage"),
                          selection.quote || selection.paragraph.text,
                        )
                      }
                    >
                      <Bookmark size={14} />
                      {t("Save")}
                    </button>
                  </div>
                  {translated && (
                    <p lang="ko" className="translation">
                      {selection.paragraph.ko ||
                        "이 문장의 번역은 데모에 포함되어 있지 않습니다. 업로드한 논문을 번역하려면 언어 모델을 연결해야 합니다."}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="companion-intro">
                    <span className="sparkle-orb">
                      <Sparkles size={24} strokeWidth={1.4} />
                    </span>
                    <h2>{t("A little clarity, right here.")}</h2>
                    <p>
                      {t("Select a passage.")}
                      <br />
                      {t("Let’s make sense of it together.")}
                    </p>
                  </div>
                  <div className="big-picture">
                    <div>
                      <Sparkles size={12} />
                      <span>{t("THE BIG PICTURE")}</span>
                    </div>
                    <p>
                      {paper.sample
                        ? t(
                            "Remembering is part of learning. This paper explores why testing yourself can help ideas stick longer than simply rereading.",
                          )
                        : t(
                            "Start with the abstract, then explore the methods and results. Select any passage for a section guide.",
                          )}
                    </p>
                    <span className="picture-footnote">
                      {t("A good place to begin")}
                      <span>↗</span>
                    </span>
                  </div>
                  <div className="suggested-prompts">
                    {[
                      { text: t("Summarize this paper"), icon: FileText },
                      { text: t("Explain the methods"), icon: FlaskConical },
                      { text: t("What should I look for?"), icon: Lightbulb },
                    ].map(({ text, icon: Icon }) => (
                      <button
                        key={text}
                        disabled={busy}
                        onClick={() => void send(text)}
                      >
                        <Icon size={16} />
                        <span>{text}</span>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                </>
              )}
              {messages.length > 0 && (
                <div className="chat-history" aria-live="polite">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${message.role}`}
                    >
                      <span className="message-author">
                        {message.role === "user"
                          ? t("You")
                          : t("Lumi · local companion")}
                      </span>
                      <p>{message.text}</p>
                      {message.sectionId && (
                        <button onClick={() => onNavigate(message.sectionId!)}>
                          <FileText size={12} />
                          {locale === "ko" ? "출처: " : "View "}
                          {t(
                            paper.sections.find(
                              (s) => s.id === message.sectionId,
                            )?.title || "",
                          )}
                          <ArrowUpRight size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {busy && (
                <div className="thinking" role="status">
                  <LoaderCircle size={14} className="spin" />
                  {t("Finding our place in the paper…")}
                </div>
              )}
            </div>
            <div
              className={`chat-bottom ${messages.length ? "has-messages" : ""}`}
            >
              {!messages.length && !selection && (
                <div className="mascot-scene">
                  <span>
                    {t("Small steps,")}
                    <br />
                    {t("bright ideas.")}
                  </span>
                  <Bunny />
                  <span className="mascot-star">✧</span>
                </div>
              )}
              <form
                className="chat-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(question);
                }}
              >
                <input
                  aria-label={t("Ask about this paper")}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t("Ask anything about this paper…")}
                  maxLength={2000}
                />
                <button
                  type="submit"
                  aria-label={t("Send message")}
                  disabled={!question.trim() || busy}
                >
                  <ArrowUp size={18} />
                </button>
              </form>
              <div className="chat-caption">
                <span className="local-dot" />
                {t("Local demo companion")}{" "}
                <span
                  title={t(
                    "No external model is connected. Answers use paper excerpts and reading guides.",
                  )}
                >
                  {t("No API needed")}
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
