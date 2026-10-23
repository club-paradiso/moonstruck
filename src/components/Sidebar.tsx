import { useI18n } from "../lib/LocaleContext";
import {
  FileText,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Bunny, IconButton } from "./UI";
import type { HighlightKind, Paper } from "../lib/types";
export const highlightLabels: Record<HighlightKind, string> = {
  claim: "Key claims",
  method: "Methods",
  result: "Results",
};
export function Sidebar({
  paper,
  active,
  onNavigate,
  highlights,
  onToggle,
  onLesson,
  mobileOpen,
  onClose,
  completed,
}: {
  paper: Paper;
  active: string;
  onNavigate: (id: string) => void;
  highlights: Record<HighlightKind, boolean>;
  onToggle: (kind: HighlightKind) => void;
  onLesson: () => void;
  mobileOpen: boolean;
  onClose: () => void;
  completed: string[];
}) {
  const { t, locale } = useI18n();
  return (
    <>
      <div
        className={`drawer-shade ${mobileOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-title">
          <span>{t("PAPER OUTLINE")}</span>
          <span className="mobile-only">
            <IconButton label={t("Close outline")} onClick={onClose}>
              <X size={18} />
            </IconButton>
          </span>
          <span className="outline-count">{paper.sections.length}</span>
        </div>
        <nav aria-label={t("Paper outline")} className="outline-nav">
          {paper.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                onNavigate(section.id);
                onClose();
              }}
              className={`outline-item ${active === section.id ? "active" : ""}`}
              aria-current={active === section.id ? "location" : undefined}
            >
              <FileText size={17} strokeWidth={1.6} />
              <span>{t(section.title)}</span>
              {completed.includes(section.id) ? (
                <Check size={13} />
              ) : (
                <small>{String(index + 1).padStart(2, "0")}</small>
              )}
            </button>
          ))}
        </nav>
        <div className="highlights-panel">
          <div className="sidebar-title">
            <span>{t("HIGHLIGHTS")}</span>
            <Sparkles size={13} />
          </div>
          {(Object.keys(highlightLabels) as HighlightKind[]).map((kind) => (
            <button
              key={kind}
              role="switch"
              aria-checked={highlights[kind]}
              aria-label={`${t(highlightLabels[kind])} highlights`}
              className="highlight-control"
              onClick={() => onToggle(kind)}
            >
              <span className={`highlight-swatch ${kind}`} />
              <span>{t(highlightLabels[kind])}</span>
              <span className={`switch ${highlights[kind] ? "on" : ""}`}>
                <span />
              </span>
            </button>
          ))}
          <p className="microcopy">
            {t("A few important ideas, brought to light.")}
          </p>
        </div>
        <div className="sidebar-lesson">
          <div className="tiny-stars">✧</div>
          <h3>
            {t("A little guidance")}
            <br />
            {t("goes a long way.")}
          </h3>
          <p>
            {t("Build your confidence,")}
            <br />
            {t("one section at a time.")}
          </p>
          <button onClick={onLesson}>
            {t("Start a lesson")}
            <ArrowRight size={15} />
          </button>
          <Bunny />
        </div>
        <div className="sidebar-footer">
          <span className="local-dot" />
          {t("Your papers stay on this device")}
          <ArrowUpRight size={12} />
        </div>
      </aside>
    </>
  );
}
