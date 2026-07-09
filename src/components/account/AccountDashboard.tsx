"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

type Tab = "perfil" | "pedidos" | "direcciones" | "favoritos";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "pedidos", label: "Pedidos", icon: Package },
  { id: "direcciones", label: "Direcciones", icon: MapPin },
  { id: "favoritos", label: "Favoritos", icon: Heart },
];

export default function AccountDashboard() {
  const { user, signOut } = useAuth();
  const { ids } = useFavorites();
  const [tab, setTab] = useState<Tab>("perfil");

  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Cliente";
  const favProducts = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-ixxo pb-24 pt-28 md:pt-36">
      <header className="border-b border-line pb-8">
        <p className="eyebrow mb-3">Mi cuenta</p>
        <h1 className="font-display text-4xl font-light tracking-tight">Hola, {name}</h1>
        <p className="mt-2 text-sm text-ash">{user?.email}</p>
      </header>

      <div className="flex flex-col gap-10 pt-8 lg:flex-row lg:gap-16">
        {/* Nav */}
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap px-4 py-3 text-[14px] transition-colors",
                  tab === t.id ? "bg-ink text-paper" : "text-ink-soft hover:bg-smoke",
                )}
              >
                <t.icon size={17} strokeWidth={1.5} />
                {t.label}
                {t.id === "favoritos" && ids.length > 0 && (
                  <span className="ml-auto text-[12px]">{ids.length}</span>
                )}
              </button>
            ))}
            <button
              onClick={signOut}
              className="mt-2 flex items-center gap-3 px-4 py-3 text-[14px] text-ash transition-colors hover:text-accent"
            >
              <LogOut size={17} strokeWidth={1.5} /> Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {tab === "perfil" && (
            <Panel title="Datos personales">
              <dl className="grid gap-5 sm:grid-cols-2">
                <Field label="Nombre" value={name} />
                <Field label="Email" value={user?.email ?? "—"} />
                <Field label="Teléfono" value={(user?.phone as string) || "Sin cargar"} />
                <Field label="Miembro desde" value={new Date(user?.created_at ?? Date.now()).toLocaleDateString("es-AR")} />
              </dl>
            </Panel>
          )}

          {tab === "pedidos" && (
            <Panel title="Historial de pedidos">
              <Empty
                icon={Package}
                text="Todavía no tenés pedidos."
                cta={{ label: "Explorar catálogo", href: "/prendas" }}
              />
            </Panel>
          )}

          {tab === "direcciones" && (
            <Panel title="Mis direcciones">
              <Empty icon={MapPin} text="No tenés direcciones guardadas." />
            </Panel>
          )}

          {tab === "favoritos" && (
            <Panel title={`Favoritos (${favProducts.length})`}>
              {favProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
                  {favProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <Empty
                  icon={Heart}
                  text="No agregaste favoritos todavía."
                  cta={{ label: "Ver productos", href: "/prendas" }}
                />
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 font-display text-xl font-light">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-4">
      <dt className="text-[12px] uppercase tracking-wide text-ash">{label}</dt>
      <dd className="mt-1 text-[15px]">{value}</dd>
    </div>
  );
}

function Empty({
  icon: Icon,
  text,
  cta,
}: {
  icon: typeof Package;
  text: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-line py-20 text-center">
      <Icon size={34} strokeWidth={1} className="text-stone" />
      <p className="mt-4 text-sm text-ash">{text}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-6 border border-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
