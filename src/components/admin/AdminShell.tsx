"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  Package,
  ShoppingBag,
  BarChart3,
  Layers,
  Tag,
  Ticket,
  Users,
  Mail,
  Settings,
  Store,
  Menu,
  X,
  Loader2,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail, adminDemoMode } from "@/lib/admin";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/contenido", label: "Contenido", icon: LayoutTemplate },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/categorias", label: "Categorías", icon: Layers },
  { href: "/admin/colecciones", label: "Colecciones", icon: Tag },
  { href: "/admin/cupones", label: "Cupones", icon: Ticket },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, configured, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // Guard (solo con Supabase activo).
  if (configured) {
    if (loading) return <Centered><Loader2 size={26} className="animate-spin text-ash" /></Centered>;
    if (!user) return <AdminLogin />;
    if (!isAdminEmail(user.email))
      return (
        <Centered>
          <div className="max-w-md px-6 text-center">
            <ShieldAlert size={40} strokeWidth={1} className="mx-auto text-stone" />
            <h1 className="mt-6 font-display text-2xl font-light">No tenés permisos</h1>
            <p className="mt-2 text-sm text-ash">
              Esta cuenta no está autorizada para el panel de administración.
            </p>
            <button
              onClick={() => signOut()}
              className="mt-8 inline-block bg-ink px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink-soft"
            >
              Usar otra cuenta
            </button>
          </div>
        </Centered>
      );
  }

  return (
    <div className="min-h-screen bg-smoke">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-paper transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/admin" className="font-display text-xl tracking-[0.3em]">
            CUSTOM WEAR.
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-paper/50">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <NavLink key={item.href} {...item} onClick={() => setOpen(false)} />
          ))}
        </nav>
        <Link
          href="/"
          className="flex items-center gap-3 border-t border-paper/10 px-6 py-5 text-[13px] text-paper/70 transition-colors hover:text-paper"
        >
          <Store size={17} strokeWidth={1.5} /> Ver la tienda
        </Link>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Contenido */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/90 px-5 py-4 backdrop-blur md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menú">
            <Menu size={22} />
          </button>
          <div className="ml-auto flex items-center gap-3 text-[13px] text-ash">
            {adminDemoMode ? (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
                Modo demo
              </span>
            ) : (
              <>
                <span className="hidden text-ink sm:inline">{user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 rounded border border-line px-3 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  <LogOut size={14} strokeWidth={1.5} /> Salir
                </button>
              </>
            )}
          </div>
        </header>

        {adminDemoMode && (
          <div className="border-b border-line bg-smoke px-5 py-3 text-[12px] text-ink-soft md:px-8">
            <strong className="text-ink">Modo demo:</strong> estás viendo datos de ejemplo. Los
            cambios no se guardan hasta conectar Supabase y definir{" "}
            <code className="text-ink">NEXT_PUBLIC_ADMIN_EMAILS</code>.
          </div>
        )}

        <main className="px-5 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof Package;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded px-3 py-2.5 text-[14px] transition-colors",
        active ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper",
      )}
    >
      <Icon size={17} strokeWidth={1.5} />
      {label}
    </Link>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-smoke">{children}</div>;
}

/**
 * Login propio del panel: independiente del login de cliente (/cuenta).
 * Al ingresar con una cuenta de administrador, la sesión se actualiza y
 * AdminShell renderiza el dashboard directamente (misma ruta /admin).
 */
function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(email.trim(), password);
    setBusy(false);
    if (!res.ok) setError(res.error || "No se pudo iniciar sesión.");
  };

  const inputCls =
    "w-full border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

  return (
    <Centered>
      <form onSubmit={submit} className="w-full max-w-sm px-6">
        <div className="text-center">
          <span className="font-display text-2xl font-medium tracking-[0.3em]">CUSTOM WEAR.</span>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-ash">
            Panel de administración
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <input
            type="email"
            autoComplete="username"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            autoComplete="current-password"
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>

        {error && <p className="mt-3 text-[13px] text-accent">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          {busy ? "Ingresando…" : "Ingresar al panel"}
        </button>

        <p className="mt-4 text-center text-[12px] text-ash">
          Acceso exclusivo para administradores.
        </p>
      </form>
    </Centered>
  );
}
