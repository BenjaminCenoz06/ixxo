"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { Btn } from "./ui";

export function FormSheet({
  title,
  onClose,
  onSave,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <motion.div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg">{title}</h2>
          <button aria-label="Cerrar" onClick={onClose}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">{children}</div>
        <div className="flex gap-3 border-t border-line px-6 py-4">
          <Btn variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Btn>
          <Btn onClick={onSave} className="flex-[2]">
            Guardar
          </Btn>
        </div>
      </motion.aside>
    </>
  );
}

export function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

export function LabeledTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none border border-line px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

export function ConfirmDelete<T>({
  item,
  label,
  onClose,
  onConfirm,
}: {
  item: T | null;
  label?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-paper p-6 text-center">
            <Trash2 size={28} strokeWidth={1.3} className="mx-auto text-accent" />
            <p className="mt-4 font-display text-lg">¿Eliminar “{label}”?</p>
            <p className="mt-1 text-[13px] text-ash">Esta acción no se puede deshacer.</p>
            <div className="mt-6 flex gap-3">
              <Btn variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </Btn>
              <Btn variant="danger" onClick={onConfirm} className="flex-1">
                Eliminar
              </Btn>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
