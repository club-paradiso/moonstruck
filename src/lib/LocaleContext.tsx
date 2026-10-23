import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialLocale, translate, type Locale } from "./i18n";
const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
}>({ locale: "en", setLocale: () => {}, t: (text) => text });
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title =
      locale === "ko"
        ? "moonstruck · 차근차근 읽는 논문"
        : "moonstruck · A little clarity for every paper";
    try {
      localStorage.setItem("moonstruck:locale", locale);
    } catch {
      /* The interface still works without persistent storage. */
    }
  }, [locale]);
  const t = useCallback((text: string) => translate(text, locale), [locale]);
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
export function useI18n() {
  return useContext(LocaleContext);
}
