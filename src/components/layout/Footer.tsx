"use client";

import Link from "next/link";
import { MapPin, Clock, Mail } from "lucide-react";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { useSiteContent } from "@/lib/site-content-context";

export default function Footer() {
  const { footer, general, footerColumns: columns, payments } = useSiteContent();
  const storeName = general.storeName || "CUSTOM WEAR.";
  const socials = [
    { Icon: InstagramIcon, href: footer.instagram },
    { Icon: TiktokIcon, href: footer.tiktok },
    { Icon: YoutubeIcon, href: footer.youtube },
  ];
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-ixxo py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-display text-2xl font-medium tracking-[0.3em]">{storeName}</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash">{footer.description}</p>

            {(general.address || general.hours || general.email) && (
              <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
                {general.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ash" />
                    {general.mapUrl ? (
                      <Link href={general.mapUrl} target="_blank" className="transition-colors hover:text-ink">
                        {general.address}
                      </Link>
                    ) : (
                      <span>{general.address}</span>
                    )}
                  </li>
                )}
                {general.hours && (
                  <li className="flex items-start gap-2.5">
                    <Clock size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ash" />
                    <span>{general.hours}</span>
                  </li>
                )}
                {general.email && (
                  <li className="flex items-start gap-2.5">
                    <Mail size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ash" />
                    <a href={`mailto:${general.email}`} className="transition-colors hover:text-ink">
                      {general.email}
                    </a>
                  </li>
                )}
              </ul>
            )}

            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ Icon, href }, i) => (
                <Link
                  key={i}
                  href={href || "#"}
                  target="_blank"
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
                  <li key={l.label}>
                    <Link
                      href={l.href || "#"}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs tracking-wide text-ash">
            © {new Date().getFullYear()} {storeName} — Todos los derechos reservados.
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
