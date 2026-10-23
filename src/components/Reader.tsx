import { useI18n } from "../lib/LocaleContext";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Globe2,
  Minus,
  Plus,
  Maximize2,
  Sparkles,
  ArrowRight,
  X,
  Languages,
  MessageCircle,
  BookmarkPlus,
  ChevronDown,
} from "lucide-react";
import { Bunny, IconButton } from "./UI";
import type { HighlightKind, Paper, Paragraph, Section } from "../lib/types";
const PdfCanvas = lazy(() =>
  import("./PdfCanvas").then((m) => ({ default: m.PdfCanvas })),
);
export type Language = "en" | "bilingual" | "ko";
export type Selection = {
  paragraph: Paragraph;
  section: Section;
  quote?: string;
};
function ParagraphBlock({
  paragraph,
  section,
  language,
  highlights,
  selected,
  onSelect,
  onExplain,
  onNote,
}: {
  paragraph: Paragraph;
  section: Section;
  language: Language;
  highlights: Record<HighlightKind, boolean>;
  selected: boolean;
  onSelect: (value: Selection) => void;
  onExplain: () => void;
  onNote: (selection: Selection) => void;
}) {
  const { t, locale } = useI18n();
  const [translated, setTranslated] = useState(false);
  const isMarked = paragraph.kind && highlights[paragraph.kind];
  const firstSentenceEnd = paragraph.text.search(/[.!?](?:\s|$)/);
  const splitAt =
    firstSentenceEnd >= 0 ? firstSentenceEnd + 1 : paragraph.text.length;
  const select = () =>
    onSelect({
      paragraph,
      section,
      quote: window.getSelection()?.toString().trim() || undefined,
    });
  return (
    <div className={`paragraph-block ${selected ? "selected" : ""}`}>
      {language !== "ko" && (
        <p
          tabIndex={0}
          className="paper-paragraph"
          onMouseUp={select}
          onClick={select}
          onKeyDown={(e) => {
            if (e.key === "Enter") select();
          }}
          aria-label={`${locale === "ko" ? "문장 살펴보기" : "Explore passage"}: ${paragraph.text.slice(0, 65)}`}
        >
          {isMarked ? (
            <>
              <mark className={paragraph.kind}>
                {paragraph.text.slice(0, splitAt)}
              </mark>
              {paragraph.text.slice(splitAt)}
            </>
          ) : (
            paragraph.text
          )}
        </p>
      )}
      {(language !== "en" || translated) && (
        <div
          lang="ko"
          className={`translation ${language === "ko" ? "primary-translation" : ""}`}
          onClick={select}
        >
          {paragraph.ko ||
            "이 문장의 번역은 데모에 포함되어 있지 않습니다. 업로드한 논문을 번역하려면 언어 모델을 연결해야 합니다."}
        </div>
      )}
      {selected && (
        <div className="passage-tools">
          <button
            onClick={() => setTranslated((v) => !v)}
            aria-pressed={translated}
          >
            <Languages size={14} />
            {translated ? t("Hide translation") : t("Translate")}
          </button>
          <button onClick={onExplain}>
            <Sparkles size={14} />
            {t("Explain")}
          </button>
          <button onClick={() => onNote({ paragraph, section })}>
            <BookmarkPlus size={14} />
            {t("Save passage")}
          </button>
        </div>
      )}
    </div>
  );
}
export function Reader({
  paper,
  active,
  language,
  setLanguage,
  highlights,
  selection,
  onSelect,
  onExplain,
  onNote,
  onActive,
  onLesson,
  focusMode,
  setFocusMode,
}: {
  paper: Paper;
  active: string;
  language: Language;
  setLanguage: (l: Language) => void;
  highlights: Record<HighlightKind, boolean>;
  selection: Selection | null;
  onSelect: (value: Selection) => void;
  onExplain: () => void;
  onNote: (selection: Selection) => void;
  onActive: (id: string) => void;
  onLesson: () => void;
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
}) {
  const { t, locale } = useI18n();
  const [view, setView] = useState("reading");
  const [zoom, setZoom] = useState(100);
  const [banner, setBanner] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setView(
      paper.sections.every((s) => !s.paragraphs.length) && paper.bytes
        ? "pdf"
        : "reading",
    );
    setZoom(100);
  }, [paper.id]);
  useEffect(() => {
    if (view !== "reading") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) onActive(visible[0].target.id.replace("paper-", ""));
      },
      { root: root.current, rootMargin: "0px 0px -65% 0px", threshold: 0 },
    );
    root.current
      ?.querySelectorAll("section[data-section]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [paper.id, view, onActive]);
  return (
    <main className="reader-region">
      <div className="reader-toolbar">
        <div className="toolbar-select view-select">
          <BookOpen size={17} />
          <select
            aria-label={t("Document view")}
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="reading">{t("Reading view")}</option>
            {paper.bytes && <option value="pdf">{t("Original PDF")}</option>}
          </select>
          <ChevronDown size={13} />
        </div>
        <div className="toolbar-right">
          <div className="toolbar-select language-select">
            <Globe2 size={15} />
            <select
              aria-label={t("Reading language")}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">{t("English")}</option>
              <option value="bilingual">EN + 한국어</option>
              <option value="ko">한국어</option>
            </select>
            <ChevronDown size={12} />
          </div>
          <span className="toolbar-divider" />
          <IconButton
            label={t("Zoom out")}
            onClick={() => setZoom((z) => Math.max(75, z - 10))}
            disabled={zoom <= 75}
          >
            <Minus size={13} />
          </IconButton>
          <span className="zoom-value">{zoom}%</span>
          <IconButton
            label={t("Zoom in")}
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            disabled={zoom >= 150}
          >
            <Plus size={13} />
          </IconButton>
          <span className="toolbar-divider" />
          <IconButton
            label={focusMode ? t("Exit focus mode") : t("Focus mode")}
            onClick={() => setFocusMode(!focusMode)}
          >
            <Maximize2 size={16} />
          </IconButton>
        </div>
      </div>
      <div className="document-scroll" ref={root}>
        {view === "pdf" && paper.bytes ? (
          <Suspense fallback={<p>{t("Loading PDF viewer…")}</p>}>
            <PdfCanvas
              bytes={paper.bytes}
              initialPage={
                paper.sections.find((s) => s.id === active)?.page || 1
              }
              zoom={zoom}
            />
          </Suspense>
        ) : (
          <article
            className="paper"
            style={{ "--paper-zoom": zoom / 100 } as React.CSSProperties}
          >
            <div className="paper-meta">
              <span>{t(paper.publication)}</span>
              <span>
                {paper.sample
                  ? t("A guide to reading research")
                  : t(`${paper.pageCount} pages`)}
              </span>
            </div>
            <h1>
              {paper.sample ? (
                <>
                  {t("Learning how to learn:")}
                  <br />
                  {t("The power of retrieval practice")}
                </>
              ) : (
                paper.title
              )}
            </h1>
            <div className="paper-byline">
              <p>{t(paper.authors)}</p>
              {paper.sample && (
                <span className="sample-badge">{t("SAMPLE PAPER")}</span>
              )}
            </div>
            <p className="paper-affiliation">
              {paper.sample
                ? t(
                    "An illustrative paper for curious minds. All study details are fictional.",
                  )
                : paper.fileName}
            </p>
            {paper.sections.map((section, index) => (
              <section
                id={`paper-${section.id}`}
                key={section.id}
                data-section
                className="paper-section"
              >
                <h2>
                  {index > 0 && <span>{index}</span>}
                  {t(section.title)}
                </h2>
                {section.paragraphs.length ? (
                  section.paragraphs.map((paragraph) => (
                    <ParagraphBlock
                      key={paragraph.id}
                      paragraph={paragraph}
                      section={section}
                      language={language}
                      highlights={highlights}
                      selected={selection?.paragraph.id === paragraph.id}
                      onSelect={onSelect}
                      onExplain={onExplain}
                      onNote={onNote}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <FileNotice />
                    <p>
                      {t(
                        "This PDF has no extractable text. Open Original PDF to read its scanned pages. Text recognition is not included.",
                      )}
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => setView("pdf")}
                    >
                      {t("View original PDF")}
                    </button>
                  </div>
                )}
              </section>
            ))}
            <div className="paper-end">
              <span>✧</span>
              <p>{t("A little more understanding. One paper at a time.")}</p>
              <button onClick={onLesson}>
                {t("Put your understanding into practice")}
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        )}
      </div>
      {banner && (
        <div className="learning-banner">
          <Bunny />
          <div>
            <strong>{t("Meet your paper, one section at a time")}</strong>
            <p>
              {t(
                "A little context. A few good questions. A clearer understanding.",
              )}
            </p>
          </div>
          <button className="primary-button" onClick={onLesson}>
            {t("Let’s learn")}
            <ArrowRight size={15} />
          </button>
          <IconButton
            label={t("Dismiss lesson banner")}
            onClick={() => setBanner(false)}
          >
            <X size={16} />
          </IconButton>
        </div>
      )}
      <div className="reader-status">
        <span>
          <span className="local-dot" />
          {paper.sample ? t("Sample paper") : t("Saved on this device")}
        </span>
        <span>
          <MessageCircle size={11} />
          {t("Select a passage to translate or explore")}
        </span>
      </div>
    </main>
  );
}
function FileNotice() {
  const { t, locale } = useI18n();
  return <BookOpen size={30} />;
}
