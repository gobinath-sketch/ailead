"use client";

import { useEffect, useSyncExternalStore } from "react";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("theme-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("theme-change", onStoreChange);
  };
};

const getSnapshot = (): "light" | "dark" =>
  localStorage.getItem("theme") === "dark" ? "dark" : "light";

const getServerSnapshot = (): "light" | "dark" => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <button className="card px-3 py-2 text-sm" onClick={toggle}>
      {theme === "light" ? "Switch to Dark" : "Switch to Light"}
    </button>
  );
}
