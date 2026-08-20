/**
 * i18n provider. Exposes the active dictionary as `t`, the current language, a
 * setter, and text direction. Language persists to localStorage and drives
 * `<html lang dir>` so RTL (Urdu) works app-wide. No string is hardcoded in
 * components — they read everything from `t` (Sections 30, 32).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en, { type Dict } from "./en";
import ur from "./ur";

export type Lang = "en" | "ur";

const DICTS: Record<Lang, Dict> = { en, ur };
const STORAGE_KEY = "guardian-lang";

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ur") return stored;
  } catch {
    /* localStorage unavailable */
  }
  return "en";
}

interface I18nContextValue {
  t: Dict;
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const t = DICTS[lang];
  const dir = t.dir;

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<I18nContextValue>(
    () => ({ t, lang, dir, setLang }),
    [t, lang, dir, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
