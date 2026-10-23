import type { HighlightKind, Paper, Section } from "./types";
export function classify(text: string): HighlightKind | undefined {
  if (
    /\b(results? (show|suggest|indicate|reveal)|found that|significant(ly)?|outperformed|retained more|recalled \d|findings)\b/i.test(
      text,
    )
  )
    return "result";
  if (
    /\b(participants?|random(ly|ized)?|assigned|method|experiment|measured|assessed|sample|dataset|procedure)\b/i.test(
      text,
    )
  )
    return "method";
  if (
    /\b(we (propose|argue|hypothesize)|suggests? that|hypothesis|important|central|claim|contribute|demonstrate|learning)\b/i.test(
      text,
    )
  )
    return "claim";
  return undefined;
}
export function structurePages(pages: string[][]): Section[] {
  const sections: Section[] = [];
  let current: Section | undefined;
  const heading =
    /^(?:\d+(?:\.\d+)*\.?\s*)?(abstract|introduction|background|literature review|related work|the present study|present study|materials and methods|methods?|methodology|results?(?: and discussion)?|discussion|conclusions?|references)\s*$/i;
  pages.forEach((lines, pageIndex) => {
    let buffer = "";
    const flush = () => {
      if (!buffer.trim()) return;
      if (!current) {
        current = {
          id: `section-${sections.length}`,
          title: `Page ${pageIndex + 1}`,
          page: pageIndex + 1,
          paragraphs: [],
        };
        sections.push(current);
      }
      const text = buffer.trim();
      current.paragraphs.push({
        id: `p-${current.id}-${pageIndex}-${current.paragraphs.length}`,
        text,
        kind: classify(text),
      });
      buffer = "";
    };
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) {
        flush();
        continue;
      }
      const match = line.match(heading);
      if (match) {
        flush();
        current = {
          id: `section-${sections.length}`,
          title: match[1].replace(/^./, (c) => c.toUpperCase()),
          page: pageIndex + 1,
          paragraphs: [],
        };
        sections.push(current);
      } else {
        buffer += (buffer && !buffer.endsWith("-") ? " " : "") + line;
        if (buffer.length > 430 && /[.!?]$/.test(line)) flush();
      }
    }
    flush();
    // Keep long, unstructured documents navigable page by page.
    if (current?.title.startsWith("Page ")) current = undefined;
  });
  return sections;
}
export function explainSection(section: Section, korean: boolean): string {
  const title = section.title.toLowerCase();
  if (korean) {
    if (/abstract/.test(title))
      return "초록은 연구 질문, 방법, 핵심 결과를 짧게 정리한 부분입니다. 무엇을 알아보려 했는지, 어떻게 조사했는지, 무엇을 발견했는지 찾아보세요.";
    if (/introduction/.test(title))
      return "서론에서는 연구의 배경과 질문을 찾아보세요. 이미 알려진 사실, 아직 밝혀지지 않은 부분, 이 연구가 알아보려는 것을 구분해 보세요.";
    if (/literature|related|background/.test(title))
      return "선행 연구는 이 연구가 기존 지식과 어떻게 연결되는지 보여 줍니다. 연구자들이 동의하는 부분, 의견이 다른 부분, 남아 있는 질문을 찾아보세요.";
    if (/method|study/.test(title))
      return "연구 방법을 읽을 때는 참가자, 비교 조건, 측정 방법을 확인하세요. 이 설계로 연구 질문에 답할 수 있는지도 생각해 보세요.";
    if (/result/.test(title))
      return "결과에서는 측정된 사실을 확인하세요. 수치가 무엇을 뜻하는지, 집단 간 차이가 얼마나 큰지 살펴보세요.";
    if (/discussion|conclusion/.test(title))
      return "논의에서는 결과의 의미와 연구의 한계를 살펴보세요. 데이터가 뒷받침하는 범위를 넘어선 주장은 없는지도 확인하세요.";
    return "이 부분이 연구 전체에서 어떤 역할을 하는지 살펴보세요. 연구 질문과 연결되는 핵심 문장을 자신의 말로 정리해 보세요.";
  }
  if (/abstract/.test(title))
    return "An abstract is the paper in miniature: the question, the approach, and the main finding. Look for one sentence that answers each. You do not need to understand every detail yet.";
  if (/introduction/.test(title))
    return "The introduction moves from a broader problem to a specific gap. Look for what we already know, what is missing, and the question this paper asks.";
  if (/literature|related|background/.test(title))
    return "A literature review puts this study in conversation with earlier work. Identify where researchers agree, where they disagree, and the gap that remains.";
  if (/method|study/.test(title))
    return "Methods tell you how the question was tested. Identify the participants, the comparison, and what was measured. Ask whether another researcher could repeat the procedure.";
  if (/result/.test(title))
    return "Results report what was observed. Separate the measurements from their interpretation, and check the size of each difference as well as any uncertainty.";
  return "The discussion connects the findings to the original question. Look for limitations and alternative explanations before deciding how widely the findings apply.";
}
// Deterministic local placeholder. Replace this boundary with a server-side model adapter if needed.
export async function askCompanion(
  question: string,
  paper: Paper,
  section: Section,
  korean: boolean,
): Promise<{ text: string; sectionId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const q = question.toLowerCase();
  const target = /method|design|방법/.test(q)
    ? paper.sections.find((s) => /method|study/.test(s.title.toLowerCase()))
    : /result|finding|결과/.test(q)
      ? paper.sections.find((s) => /result/.test(s.title.toLowerCase()))
      : /summari|summary|요약/.test(q)
        ? paper.sections.find((s) => /abstract/.test(s.title.toLowerCase()))
        : section;
  const source = target || section;
  if (/summari|summary|method|result|finding|요약|방법|결과/.test(q)) {
    const excerpt = source.paragraphs
      .slice(0, 2)
      .map((p) => (korean && p.ko ? p.ko : p.text))
      .join("\n\n");
    return {
      text:
        (korean
          ? "논문에서 관련 부분을 찾아봤어요. 번역이 있는 문장은 한국어로 보여 드릴게요.\n\n"
          : "Let’s start with the paper itself. Here are the relevant passages:\n\n") +
        excerpt +
        "\n\n" +
        explainSection(source, korean),
      sectionId: source.id,
    };
  }
  return {
    text:
      explainSection(source, korean) +
      (korean
        ? "\n\n현재 동반자는 데모 모드로, 자유로운 질문에 대한 AI 답변 대신 절별 읽기 안내를 제공합니다."
        : "\n\nTry putting the main idea of this section into one sentence. I’m in local demo mode, so I can offer section guides and retrieve passages, but cannot reason about arbitrary questions."),
    sectionId: source.id,
  };
}
