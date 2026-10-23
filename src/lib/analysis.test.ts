import test from "node:test";
import assert from "node:assert/strict";
import { classify, structurePages, askCompanion } from "./analysis";
import { samplePaper } from "./sample";
test("detects numbered scientific sections and retains correct source pages", () => {
  const sections = structurePages([
    [
      "1. Abstract",
      "We propose a new approach.",
      "2 Introduction",
      "An unresolved problem.",
    ],
    [
      "3 Methods",
      "Participants were randomly assigned.",
      "4 Results",
      "Results show improved retention.",
    ],
  ]);
  assert.deepEqual(
    sections.map((s) => s.title),
    ["Abstract", "Introduction", "Methods", "Results"],
  );
  assert.equal(sections[2].page, 2);
  assert.equal(
    new Set(sections.flatMap((s) => s.paragraphs.map((p) => p.id))).size,
    4,
  );
});
test("provides page navigation for text without recognized headings", () => {
  const sections = structurePages([
    ["First page text."],
    ["Second page text."],
  ]);
  assert.deepEqual(
    sections.map((s) => s.title),
    ["Page 1", "Page 2"],
  );
});
test("does not invent text for a scanned PDF", () =>
  assert.deepEqual(structurePages([[], []]), []));
test("distinguishes methods, results, and unclassified prose", () => {
  assert.equal(
    classify("Participants were randomly assigned to groups."),
    "method",
  );
  assert.equal(classify("Results show improved performance."), "result");
  assert.equal(classify("We propose a simple approach."), "claim");
  assert.equal(classify("The sky is blue."), undefined);
});
test("companion retrieves the actual uploaded paper rather than sample results", async () => {
  const paper = {
    ...samplePaper,
    sample: false,
    sections: [
      {
        id: "m",
        title: "Methods",
        page: 2,
        paragraphs: [{ id: "unique", text: "We sampled 17 oak trees." }],
      },
    ],
  };
  const answer = await askCompanion(
    "Explain the methods",
    paper,
    paper.sections[0],
    false,
  );
  assert.match(answer.text, /17 oak trees/);
  assert.doesNotMatch(answer.text, /120|72%/);
  assert.equal(answer.sectionId, "m");
});
test("arbitrary questions disclose the deterministic local placeholder", async () => {
  const answer = await askCompanion(
    "Can you prove a new theorem?",
    samplePaper,
    samplePaper.sections[0],
    false,
  );
  assert.match(answer.text, /local demo mode/);
});
