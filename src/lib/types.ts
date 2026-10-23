export type HighlightKind = "claim" | "method" | "result";
export type Paragraph = {
  id: string;
  text: string;
  ko?: string;
  kind?: HighlightKind;
  explanation?: string;
  explanationKo?: string;
};
export type Section = {
  id: string;
  title: string;
  page: number;
  paragraphs: Paragraph[];
};
export type Paper = {
  id: string;
  title: string;
  authors: string;
  publication: string;
  sections: Section[];
  pageCount: number;
  fileName?: string;
  bytes?: Uint8Array;
  sample?: boolean;
};
export type Note = {
  id: string;
  text: string;
  quote?: string;
  sectionId: string;
  createdAt: number;
};
export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sectionId?: string;
};
