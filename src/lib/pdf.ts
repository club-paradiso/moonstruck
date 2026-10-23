import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { structurePages } from "./analysis";
import type { Paper } from "./types";
GlobalWorkerOptions.workerSrc = workerUrl;
export { getDocument };
export async function readPdf(
  file: File,
  onProgress: (message: string) => void,
): Promise<Paper> {
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf")
    throw new Error("Please choose a PDF file.");
  if (file.size > 40 * 1024 * 1024)
    throw new Error("This local reader supports PDFs up to 40 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await getDocument({ data: bytes.slice() }).promise;
  try {
    if (document.numPages > 150)
      throw new Error("Please choose a PDF with 150 pages or fewer.");
    const pages: string[][] = [];
    for (let number = 1; number <= document.numPages; number++) {
      onProgress(`Reading page ${number} of ${document.numPages}…`);
      const page = await document.getPage(number);
      const content = await page.getTextContent();
      const lines: string[] = [];
      let line = "";
      let lastY: number | undefined;
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const y = item.transform[5];
        if (lastY !== undefined && Math.abs(y - lastY) > 3 && line) {
          lines.push(line);
          line = "";
        }
        line += (line ? " " : "") + item.str;
        lastY = y;
        if (item.hasEOL) {
          lines.push(line);
          line = "";
          lastY = undefined;
        }
      }
      if (line) lines.push(line);
      pages.push(lines);
    }
    const sections = structurePages(pages);
    const meta = await document.getMetadata().catch(() => null);
    const info = meta?.info as { Title?: string; Author?: string } | undefined;
    const title =
      info?.Title && info.Title.length > 4 && !/untitled/i.test(info.Title)
        ? info.Title
        : file.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
    const hash = await crypto.subtle.digest("SHA-256", bytes.slice().buffer);
    return {
      id: Array.from(new Uint8Array(hash))
        .slice(0, 16)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      title,
      authors: info?.Author || "Uploaded paper",
      publication: "YOUR RESEARCH LIBRARY",
      sections: sections.length
        ? sections
        : [{ id: "scanned", title: "Document", page: 1, paragraphs: [] }],
      pageCount: document.numPages,
      fileName: file.name,
      bytes,
    };
  } finally {
    await document.destroy();
  }
}
