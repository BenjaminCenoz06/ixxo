import type { SiteContent } from "@/lib/site-content";
import { DEFAULT_CONTENT } from "@/lib/site-content";

/** Solo permite valores hex (#abc / #aabbcc). Evita inyección de CSS. */
function safeColor(value: string, fallback: string): string {
  return /^#[0-9a-fA-F]{3,8}$/.test(value.trim()) ? value.trim() : fallback;
}

/**
 * Aplica los colores del tema definidos en el admin, sobrescribiendo
 * las variables CSS de Tailwind en runtime.
 */
export function ThemeStyle({ theme }: { theme: SiteContent["theme"] }) {
  const accent = safeColor(theme.accent, DEFAULT_CONTENT.theme.accent);
  const ink = safeColor(theme.ink, DEFAULT_CONTENT.theme.ink);
  const paper = safeColor(theme.paper, DEFAULT_CONTENT.theme.paper);

  const css = `:root{--color-accent:${accent};--color-ink:${ink};--color-paper:${paper};}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
