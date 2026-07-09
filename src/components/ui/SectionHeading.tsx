import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  cta,
  ctaHref = "#",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  cta?: string;
  ctaHref?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <Reveal>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="max-w-2xl font-display text-3xl font-light leading-[1.05] tracking-tight md:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {cta && (
        <Reveal delay={0.1}>
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.16em] text-ink"
          >
            {cta}
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
