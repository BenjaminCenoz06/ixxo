import { Reveal } from "./Reveal";

/**
 * Bloque de texto legal/informativo con un título y su contenido.
 * Cada bloque revela al entrar en viewport para que la lectura no sea un muro.
 */
export function Article({
  n,
  title,
  children,
}: {
  n?: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal blur={false} className="border-t border-line py-8 first:border-t-0 md:py-10">
      <div className="grid gap-4 md:grid-cols-[10rem_1fr] md:gap-10">
        <h2 className="font-display text-lg font-normal leading-snug tracking-tight text-ink md:text-xl">
          {n !== undefined && <span className="mr-2 text-ash">{String(n).padStart(2, "0")}</span>}
          {title}
        </h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-ash [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink-soft [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </Reveal>
  );
}

/** Aviso destacado (borrador pendiente de revisión, dato importante, etc.). */
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <Reveal blur={false}>
      <p className="border-l-2 border-accent bg-smoke/60 px-5 py-4 text-[13px] leading-relaxed text-ash">
        {children}
      </p>
    </Reveal>
  );
}
