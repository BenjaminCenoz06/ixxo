"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";

const EASE = [0.22, 1, 0.36, 1] as const;

const inputCls =
  "w-full border border-line bg-transparent px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-stone focus:border-ink";

/**
 * Formulario del botón de arrepentimiento (Res. 424/2020). Arma el pedido de
 * cancelación y lo envía por WhatsApp, que es el canal que el local atiende.
 */
export default function ArrepentimientoForm() {
  const { general } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    pedido: "",
    email: "",
    telefono: "",
    motivo: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valido = form.nombre.trim() && form.pedido.trim() && form.email.trim();

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valido) return;
    const texto = [
      "BOTÓN DE ARREPENTIMIENTO",
      "",
      `Nombre: ${form.nombre}`,
      `N° de pedido: ${form.pedido}`,
      `Correo: ${form.email}`,
      form.telefono && `Teléfono: ${form.telefono}`,
      form.motivo && `Comentario: ${form.motivo}`,
      "",
      "Solicito la cancelación de la compra dentro del plazo de 10 días corridos previsto en el art. 34 de la Ley 24.240.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${general.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="border border-accent/40 bg-accent/5 p-8 text-center"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
          <Check size={26} strokeWidth={1.6} className="text-accent" />
        </span>
        <p className="mt-5 font-display text-xl font-normal">Solicitud enviada</p>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ash">
          Se abrió WhatsApp con tu pedido de cancelación. Si no se abrió, escribinos al{" "}
          <a
            href={`https://wa.me/${general.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline underline-offset-4"
          >
            +54 9 3786 41-1223
          </a>{" "}
          con tu número de pedido.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-[12px] uppercase tracking-[0.16em] text-ash underline underline-offset-4 transition-colors hover:text-ink"
        >
          Volver al formulario
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={enviar} className="border border-line p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-ash">
            Nombre y apellido *
          </span>
          <input required value={form.nombre} onChange={set("nombre")} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-ash">
            N° de pedido *
          </span>
          <input
            required
            value={form.pedido}
            onChange={set("pedido")}
            placeholder="GS-123456"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-ash">
            Correo *
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={set("email")}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-ash">
            Teléfono
          </span>
          <input value={form.telefono} onChange={set("telefono")} className={inputCls} />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-ash">
          Comentario (opcional)
        </span>
        <textarea rows={3} value={form.motivo} onChange={set("motivo")} className={inputCls} />
      </label>

      <p className="mt-4 text-[12px] leading-relaxed text-stone">
        No hace falta que expliques el motivo: la ley no lo exige. Los campos con * son los que
        necesitamos para identificar tu compra.
      </p>

      <button
        type="submit"
        disabled={!valido}
        className="group btn-sheen mt-6 inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-all duration-300 hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        <Send size={15} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        Enviar solicitud
      </button>
    </form>
  );
}
