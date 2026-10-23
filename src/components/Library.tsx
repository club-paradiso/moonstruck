import { useI18n } from "../lib/LocaleContext";
import { Upload, FileText, ArrowRight, Trash2, BookOpen } from "lucide-react";
import { Modal, IconButton } from "./UI";
import { samplePaper } from "../lib/sample";
import type { Paper } from "../lib/types";
export function Library({
  papers,
  currentId,
  onOpen,
  onDelete,
  onUpload,
  onClose,
}: {
  papers: Paper[];
  currentId: string;
  onOpen: (paper: Paper) => void;
  onDelete: (id: string) => void;
  onUpload: () => void;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const [sample, ...uploaded] = [samplePaper, ...papers];
  return (
    <Modal title={t("Your reading corner")} onClose={onClose} wide>
      <div className="library-body">
        <p className="muted">
          {t("A home for your papers, saved privately in this browser.")}
        </p>
        <button className="upload-dropzone" onClick={onUpload}>
          <span>
            <Upload size={24} />
          </span>
          <strong>{t("Bring a paper to light")}</strong>
          <p>{t("Choose a PDF or drop one anywhere in the reader")}</p>
          <small>
            {t("Up to 40 MB · 150 pages · text-based PDFs work best")}
          </small>
        </button>
        <h3>
          {t("YOUR PAPERS")}
          <span>{uploaded.length + 1}</span>
        </h3>
        {[sample, ...uploaded].map((paper) => (
          <div className="library-row" key={paper.id}>
            <BookOpen size={21} />
            <button className="library-paper" onClick={() => onOpen(paper)}>
              <strong>{paper.sample ? t(paper.title) : paper.title}</strong>
              <span>
                {paper.sample
                  ? t("Sample paper · bilingual learning guide")
                  : t(`${paper.pageCount} pages · ${paper.fileName}`)}
              </span>
            </button>
            {paper.id === currentId ? (
              <span className="reading-badge">{t("Reading")}</span>
            ) : (
              <IconButton
                label={`Open ${paper.sample ? t(paper.title) : paper.title}`}
                onClick={() => onOpen(paper)}
              >
                <ArrowRight size={18} />
              </IconButton>
            )}
            {!paper.sample && (
              <IconButton
                label={`Remove ${paper.sample ? t(paper.title) : paper.title} from library`}
                onClick={() => onDelete(paper.id)}
              >
                <Trash2 size={15} />
              </IconButton>
            )}
          </div>
        ))}
        <p className="library-privacy">
          <FileText size={14} />
          {t(
            "PDFs stay on this device. No account or external service is required.",
          )}
        </p>
      </div>
    </Modal>
  );
}
