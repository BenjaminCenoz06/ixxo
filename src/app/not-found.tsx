import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-ixxo flex min-h-[80vh] flex-col items-center justify-center pt-28 text-center">
      <p className="font-display text-[clamp(4rem,18vw,11rem)] font-extralight leading-none tracking-tight">
        404
      </p>
      <p className="eyebrow mt-4">Página no encontrada</p>
      <h1 className="mt-4 max-w-md font-display text-2xl font-light md:text-3xl">
        Parece que esta prenda ya no está en percha.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ash">
        La página que buscás no existe o fue movida. Volvé al inicio o seguí explorando la colección.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
        >
          Volver al inicio
        </Link>
        <Link
          href="/prendas"
          className="border border-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
