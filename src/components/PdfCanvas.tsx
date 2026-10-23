import { useI18n } from "../lib/LocaleContext";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { IconButton } from "./UI";
export function PdfCanvas({
  bytes,
  initialPage,
  zoom,
}: {
  bytes: Uint8Array;
  initialPage: number;
  zoom: number;
}) {
  const { t, locale } = useI18n();
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);
  useEffect(() => {
    let canceled = false;
    let document: PDFDocumentProxy | undefined;
    import("../lib/pdf")
      .then(({ getDocument }) => getDocument({ data: bytes.slice() }).promise)
      .then((result) => {
        document = result;
        if (canceled) void result.destroy();
        else setPdf(result);
      })
      .catch((e) => {
        if (!canceled) setError(String(e));
      });
    return () => {
      canceled = true;
      void document?.destroy();
    };
  }, [bytes]);
  useEffect(() => {
    if (!pdf) return;
    let canceled = false;
    let renderTask: { cancel: () => void } | undefined;
    setLoading(true);
    setError("");
    pdf
      .getPage(page)
      .then((p) => {
        if (canceled || !canvas.current) return;
        const viewport = p.getViewport({ scale: 1.6 });
        canvas.current.width = viewport.width;
        canvas.current.height = viewport.height;
        const task = p.render({ canvas: canvas.current, viewport });
        renderTask = task;
        return task.promise;
      })
      .then(() => {
        if (!canceled) setLoading(false);
      })
      .catch((e) => {
        if (!canceled && e.name !== "RenderingCancelledException") {
          setError("This page could not be rendered. Try the reading view.");
          setLoading(false);
        }
      });
    return () => {
      canceled = true;
      renderTask?.cancel();
    };
  }, [pdf, page]);
  return (
    <div className="pdf-view">
      <div className="pdf-pagination">
        <IconButton
          label={t("Previous PDF page")}
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <span>
          {locale === "ko"
            ? `${pdf?.numPages || "…"}쪽 중 ${page}쪽`
            : `Page ${page} of ${pdf?.numPages || "…"}`}
        </span>
        <IconButton
          label={t("Next PDF page")}
          disabled={!pdf || page >= pdf.numPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight size={18} />
        </IconButton>
      </div>
      {loading && (
        <p className="loading-row">
          <LoaderCircle className="spin" size={18} />
          {t("Rendering page…")}
        </p>
      )}
      {error && <p role="alert">{t(error)}</p>}
      <canvas
        ref={canvas}
        aria-label={
          locale === "ko"
            ? `원본 PDF ${page}쪽. 텍스트를 읽으려면 읽기 화면을 이용하세요.`
            : `Original PDF, page ${page}. Use reading view for accessible text.`
        }
        style={{ width: `${zoom}%` }}
      />
    </div>
  );
}
