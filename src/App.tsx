import { useI18n } from "./lib/LocaleContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  ChevronRight,
  PanelLeft,
  Sparkles,
  Library as LibraryIcon,
  CheckCircle2,
  X,
  LoaderCircle,
} from "lucide-react";
import { Brand, IconButton } from "./components/UI";
import { Sidebar } from "./components/Sidebar";
import { Reader, type Language, type Selection } from "./components/Reader";
import { Companion } from "./components/Companion";
import { Lesson } from "./components/Lesson";
import { Library } from "./components/Library";
import { samplePaper } from "./lib/sample";
import {
  deletePaper,
  getPapers,
  readNotes,
  savePaper,
  writeNotes,
} from "./lib/storage";
import type { HighlightKind, Note, Paper } from "./lib/types";
export default function App() {
  const { t, locale, setLocale } = useI18n();
  const [paper, setPaper] = useState<Paper>(samplePaper);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [active, setActive] = useState("abstract");
  const [language, setLanguage] = useState<Language>(() =>
    locale === "ko" ? "bilingual" : "en",
  );
  const [highlights, setHighlights] = useState<Record<HighlightKind, boolean>>({
    claim: true,
    method: true,
    result: true,
  });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [notes, setNotes] = useState<Note[]>(() => readNotes(samplePaper.id));
  const [showLibrary, setShowLibrary] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [tab, setTab] = useState("companion");
  const [focusMode, setFocusMode] = useState(false);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);
  const uploading = useRef(false);
  useEffect(() => {
    void getPapers()
      .then(setPapers)
      .catch(() =>
        setToast(
          "Browser storage is unavailable. You can still read papers in this session.",
        ),
      );
  }, []);
  useEffect(() => {
    try {
      setCompleted(
        JSON.parse(
          localStorage.getItem(`moonlight:lessons:${paper.id}`) || "[]",
        ),
      );
    } catch {
      setCompleted([]);
    }
  }, [paper.id]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowLibrary(false);
        setShowLesson(false);
        setOutlineOpen(false);
        setCompanionOpen(false);
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  const onActive = useCallback((id: string) => setActive(id), []);
  function navigate(id: string) {
    setActive(id);
    document
      .getElementById(`paper-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function openPaper(next: Paper) {
    setPaper(next);
    setActive(next.sections[0].id);
    setSelection(null);
    setNotes(readNotes(next.id));
    setShowLibrary(false);
    setError("");

    document.querySelector(".document-scroll")?.scrollTo(0, 0);
  }
  async function upload(file: File) {
    if (uploading.current) return;
    uploading.current = true;
    setLoading("Opening your paper…");
    setError("");
    setShowLibrary(false);
    try {
      const { readPdf } = await import("./lib/pdf");
      const next = await readPdf(file, setLoading);
      try {
        await savePaper(next);
      } catch {
        setToast(
          "Paper opened, but browser storage is full. It will be available for this session only.",
        );
      }
      setPapers((previous) => [
        next,
        ...previous.filter((p) => p.id !== next.id),
      ]);
      openPaper(next);
    } catch (e) {
      setError(
        e instanceof Error
          ? /password/i.test(e.message)
            ? t(
                "This PDF is password protected. Please upload an unlocked copy.",
              )
            : e.message
          : t("This PDF could not be opened. Please try another file."),
      );
    } finally {
      setLoading("");
      uploading.current = false;
      if (input.current) input.current.value = "";
    }
  }
  function updateNotes(next: Note[]) {
    setNotes(next);
    if (!writeNotes(paper.id, next))
      setToast("Note added for this session. Browser storage is full.");
  }
  function addNote(text: string, quote?: string, sectionId?: string) {
    updateNotes([
      ...notes,
      {
        id: crypto.randomUUID(),
        text,
        quote,
        sectionId: sectionId || selection?.section.id || active,
        createdAt: Date.now(),
      },
    ]);
    setToast("Saved to your notes");
  }
  function complete(id: string) {
    const next = [...new Set([...completed, id])];
    setCompleted(next);
    try {
      localStorage.setItem(
        `moonlight:lessons:${paper.id}`,
        JSON.stringify(next),
      );
    } catch {
      setToast("Lesson progress is available for this session.");
    }
  }
  return (
    <div
      className={`app ${focusMode ? "focus-mode" : ""}`}
      onDragEnter={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          dragCount.current++;
          setDragging(true);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        dragCount.current--;
        if (dragCount.current <= 0) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragCount.current = 0;
        setDragging(false);
        if (e.dataTransfer.files[0]) void upload(e.dataTransfer.files[0]);
      }}
    >
      <header className="app-header">
        <button
          className="brand-button"
          aria-label={t("Open library")}
          onClick={() => setShowLibrary(true)}
        >
          <Brand />
        </button>
        <div className="breadcrumb">
          <button onClick={() => setShowLibrary(true)}>{t("Library")}</button>
          <ChevronRight size={14} />
          <span>
            {paper.sample ? t("The science of learning") : paper.title}
          </span>
        </div>
        <div className="header-actions">
          <button
            className="locale-toggle"
            aria-label={
              locale === "en"
                ? "Switch interface to Korean"
                : "Switch interface to English"
            }
            onClick={() => {
              setLocale(locale === "en" ? "ko" : "en");
              setLanguage(locale === "en" ? "bilingual" : "en");
            }}
          >
            <span aria-hidden="true">가 / A</span>
            {locale === "en" ? "한국어" : "English"}
          </button>
          <span className="private-label">
            <span className="local-dot" />
            {t("A space for curious minds")}
          </span>
          <button
            className="upload-button"
            onClick={() => input.current?.click()}
            disabled={!!loading}
          >
            <Upload size={16} />
            <span>{t("Upload PDF")}</span>
          </button>
          <div className="avatar" title={t("Your local reading space")}>
            J
          </div>
        </div>
      </header>
      <div className="mobile-bar">
        <button onClick={() => setOutlineOpen(true)}>
          <PanelLeft size={17} />
          {t("Outline")}
        </button>
        <span>
          {t(paper.sections.find((s) => s.id === active)?.title || "")}
        </span>
        <button
          onClick={() => {
            setCompanionOpen(true);
            setTab("companion");
          }}
        >
          <Sparkles size={16} />
          {t("Companion")}
        </button>
      </div>
      <div className="workspace">
        <Sidebar
          paper={paper}
          active={active}
          onNavigate={navigate}
          highlights={highlights}
          onToggle={(kind) =>
            setHighlights((h) => ({ ...h, [kind]: !h[kind] }))
          }
          onLesson={() => setShowLesson(true)}
          mobileOpen={outlineOpen}
          onClose={() => setOutlineOpen(false)}
          completed={completed}
        />
        <Reader
          paper={paper}
          active={active}
          language={language}
          setLanguage={setLanguage}
          highlights={highlights}
          selection={selection}
          onSelect={(value) => {
            setSelection(value);
            setTab("companion");
          }}
          onExplain={() => {
            setCompanionOpen(true);
            setTab("companion");
          }}
          onNote={(value) =>
            addNote(t("Saved passage"), value.paragraph.text, value.section.id)
          }
          onActive={onActive}
          onLesson={() => setShowLesson(true)}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
        />
        <Companion
          paper={paper}
          section={
            paper.sections.find((s) => s.id === active) || paper.sections[0]
          }
          selection={selection}
          clearSelection={() => setSelection(null)}
          notes={notes}
          addNote={addNote}
          removeNote={(id) => updateNotes(notes.filter((n) => n.id !== id))}
          onNavigate={(id) => {
            navigate(id);
            setCompanionOpen(false);
          }}
          mobileOpen={companionOpen}
          onClose={() => setCompanionOpen(false)}
          tab={tab}
          setTab={setTab}
          korean={locale === "ko" || language === "ko"}
        />
      </div>
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        aria-label={t("Upload PDF file")}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) void upload(e.target.files[0]);
        }}
      />
      {showLibrary && (
        <Library
          papers={papers}
          currentId={paper.id}
          onOpen={openPaper}
          onUpload={() => input.current?.click()}
          onClose={() => setShowLibrary(false)}
          onDelete={(id) => {
            void deletePaper(id)
              .then(() => {
                setPapers((ps) => ps.filter((p) => p.id !== id));
                if (id === paper.id) openPaper(samplePaper);
              })
              .catch(() =>
                setError("The paper could not be removed. Please try again."),
              );
          }}
        />
      )}
      {showLesson && (
        <Lesson
          paper={paper}
          onClose={() => setShowLesson(false)}
          onNavigate={navigate}
          onComplete={complete}
        />
      )}
      {loading && (
        <div className="loading-overlay" role="status">
          <div>
            <LoaderCircle size={30} className="spin" />
            <h3>{t("Making room for a new idea.")}</h3>
            <p>{t(loading)}</p>
            <small>{t("Your PDF is processed on this device.")}</small>
          </div>
        </div>
      )}
      {error && (
        <div role="alert" className="error-toast">
          <span>{t(error)}</span>
          <IconButton label={t("Dismiss error")} onClick={() => setError("")}>
            <X size={16} />
          </IconButton>
        </div>
      )}
      {toast && (
        <div role="status" className="toast">
          <CheckCircle2 size={17} />
          {t(toast)}
        </div>
      )}
      {dragging && (
        <div className="drag-overlay">
          <Upload size={45} />
          <h2>{t("Drop your next discovery here.")}</h2>
          <p>{t("PDF files, up to 40 MB")}</p>
        </div>
      )}
    </div>
  );
}
