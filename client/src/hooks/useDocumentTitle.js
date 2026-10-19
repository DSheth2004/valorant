import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Valorant Hub` : "Valorant Hub — Agents, Maps, Arsenal & Store";
  }, [title]);
}
