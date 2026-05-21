"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  predicate: (event: KeyboardEvent) => boolean,
  handler: (event: KeyboardEvent) => void,
) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (predicate(event)) {
        handler(event);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handler, predicate]);
}
