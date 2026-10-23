import ko from "./ko.json";
export type Locale = "en" | "ko";
const dictionary: Record<string, string> = ko;
export function translate(text: string, locale: Locale): string {
  if (locale === "en") return text;
  if (dictionary[text]) return dictionary[text];
  const progress = text.match(/^Reading page (\d+) of (\d+)…$/);
  if (progress) return `${progress[2]}쪽 중 ${progress[1]}쪽을 읽는 중…`;
  const page = text.match(/^Page (\d+)$/);
  if (page) return `${page[1]}쪽`;
  const pages = text.match(/^(\d+) pages(.*)$/);
  if (pages) return `${pages[1]}쪽${pages[2]}`;
  return text;
}
export function initialLocale(): Locale {
  try {
    return localStorage.getItem("moonstruck:locale") === "ko" ? "ko" : "en";
  } catch {
    return "en";
  }
}
