"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_KEYS, type ThemeMode } from "@/lib/storage";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.localStorage.setItem(STORAGE_KEYS.THEME, "dark");
      setThemeState("dark");
      applyTheme("dark");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    const lockedTheme = nextTheme === "light" ? "dark" : nextTheme;
    setThemeState(lockedTheme);
    window.localStorage.setItem(STORAGE_KEYS.THEME, lockedTheme);
    applyTheme(lockedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
