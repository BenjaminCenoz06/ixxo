import Link from "next/link";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

const columns = [
  {
    title: "Ayuda",
    links: ["Contacto", "Cambios y devoluciones", "Envíos", "Guía de talles", "Preguntas frecuentes"],
  },
  {
    title: "Compañía",
    links: ["Sobre IXXO", "Sucursales", "Trabajá con nosotros", "Sustentabilidad", "Prensa"],
  },
  {
    title: "Legales",
    links: ["Términos y condiciones", "Política de privacidad", "Botón de arrepentimiento", "Defensa al consumidor"],
  },
];

const payments = ["Visa", "Mastercard", "Amex", "Mercado Pago", "Transferencia"];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-ixxo py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-display text-2xl font-medium tracking-[0.3em]">IXXO</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash">
              Ropa masculina de diseño. Prendas atemporales, materiales nobles y una experiencia
              pensada al detalle.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {[InstagramIcon, TiktokIcon, YoutubeIcon].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  aria-label="Red social"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <Icon size={17} />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs tracking-wide text-ash">
            © {new Date().getFullYear()} IXXO — Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded border border-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ash"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
