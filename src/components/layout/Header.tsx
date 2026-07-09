"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { navItems, type NavItem } from "@/data/nav";
import AnnouncementBar from "./AnnouncementBar";
import SearchOverlay from "@/components/search/SearchOverlay";
import Portal from "@/components/ui/Portal";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCart();
  const { count: favCount } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const solid = scrolled || active !== null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,box-shadow,color] duration-500",
        solid
          ? "bg-paper/80 text-ink shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_30px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          : "bg-transparent text-paper",
      )}
      onMouseLeave={() => setActive(null)}
    >
      {/* Barra de anuncios — colapsa al hacer scroll */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <AnnouncementBar />
      </div>

      <div className="container-ixxo grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[76px]">
        {/* Izquierda: buscador + nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="group flex items-center gap-2 text-[13px] tracking-wide"
            aria-label="Buscar"
          >
            <Search size={18} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
            <span className="hidden lg:inline text-current/80">Buscar</span>
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} item={item} active={active} setActive={setActive} solid={solid} />
            ))}
          </nav>
        </div>

        {/* Centro: logo */}
        <Link
          href="/"
          className="select-none px-2 font-display text-xl font-medium tracking-[0.32em] md:text-2xl"
          onMouseEnter={() => setActive(null)}
        >
          IXXO
        </Link>

        {/* Derecha: cuenta / favoritos / carrito */}
        <div className="flex items-center justify-end gap-4 md:gap-5">
          <Link
            href="/cuenta"
            aria-label="Cuenta"
            className="hidden items-center justify-center transition-transform hover:scale-110 active:scale-95 sm:inline-flex"
          >
            <User size={19} strokeWidth={1.5} />
          </Link>
          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="relative hidden items-center justify-center transition-transform hover:scale-110 active:scale-95 sm:inline-flex"
          >
            <Heart size={19} strokeWidth={1.5} />
            {favCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-semibold text-paper">
                {favCount}
              </span>
            )}
          </Link>
          <IconBtn label="Carrito" onClick={openCart}>
            <span className="relative">
              <ShoppingBag size={19} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-paper">
                  {count}
                </span>
              )}
            </span>
          </IconBtn>
          <IconBtn
            label="Menú"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} strokeWidth={1.5} />
          </IconBtn>
        </div>
      </div>

      {/* Mega menú */}
      <MegaPanel item={navItems.find((n) => n.label === active && n.mega)} />

      {/* Mobile drawer */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Búsqueda */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function NavLink({
  item,
  active,
  setActive,
  solid,
}: {
  item: NavItem;
  active: string | null;
  setActive: (v: string | null) => void;
  solid: boolean;
}) {
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setActive(item.mega ? item.label : null)}
      className="group relative py-1 text-[13px] tracking-wide"
    >
      {item.label}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
          active === item.label && "scale-x-100",
        )}
      />
    </Link>
  );
}

function IconBtn({
  children,
  label,
  className,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center transition-transform hover:scale-110 active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

function MegaPanel({ item }: { item?: NavItem }) {
  return (
    <AnimatePresence>
      {item?.mega && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full hidden border-t border-line bg-paper/95 text-ink backdrop-blur-xl lg:block"
        >
          <div className="container-ixxo grid grid-cols-[repeat(3,1fr)_1.1fr] gap-10 py-10">
            {item.mega.map((col) => (
              <div key={col.heading}>
                <p className="eyebrow mb-4">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-2 text-[15px] text-ink-soft transition-colors hover:text-ink"
                      >
                        <span className="h-px w-0 bg-ink transition-all duration-300 group-hover:w-4" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {item.featured && (
              <Link href={item.featured.href} className="group relative overflow-hidden">
                <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                  <Image
                    src={item.featured.image}
                    alt={item.featured.title}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-paper">
                    <p className="eyebrow text-paper/70">Destacado</p>
                    <p className="font-display text-lg">{item.featured.title}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Portal>
      <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-paper text-ink lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="font-display text-lg tracking-[0.3em]">IXXO</span>
              <button aria-label="Cerrar" onClick={onClose}>
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-6 py-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block border-b border-line py-4 font-display text-2xl font-light"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-6 border-t border-line px-6 py-6 text-[13px]">
              <Link href="/cuenta" onClick={onClose} className="flex items-center gap-2">
                <User size={18} strokeWidth={1.5} /> Cuenta
              </Link>
              <Link href="/favoritos" onClick={onClose} className="flex items-center gap-2">
                <Heart size={18} strokeWidth={1.5} /> Favoritos
              </Link>
            </div>
          </motion.aside>
        </>
      )}
      </AnimatePresence>
    </Portal>
  );
}
