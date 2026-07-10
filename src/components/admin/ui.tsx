import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-light tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ash">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-line bg-paper p-5">
      <p className="text-[11px] uppercase tracking-[0.14em] text-ash">{label}</p>
      <p className="mt-2 font-display text-2xl font-light md:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-stone">{hint}</p>}
    </div>
  );
}

export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-line bg-paper", className)}>
      {title && (
        <h2 className="border-b border-line px-5 py-4 text-[13px] font-medium uppercase tracking-[0.1em]">
          {title}
        </h2>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Btn({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const styles = {
    primary: "bg-ink text-paper hover:bg-ink-soft",
    outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: "text-ash hover:text-ink",
    danger: "border border-accent text-accent hover:bg-accent hover:text-paper",
  }[variant];
  const cls = cn(
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors",
    styles,
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-mist text-ash",
    refunded: "bg-blue-100 text-blue-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };
  const labels: Record<string, string> = {
    paid: "Pagado",
    pending: "Pendiente",
    failed: "Rechazado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
    shipped: "Enviado",
    delivered: "Entregado",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        map[status] ?? "bg-mist text-ash",
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
