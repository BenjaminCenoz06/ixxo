"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageUploader({
  value,
  onChange,
  folder = "media",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      {/* Preview / dropzone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className="relative flex h-24 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-line bg-smoke transition-colors hover:border-ink"
      >
        {value ? (
          <Image src={value} alt="" fill sizes="80px" className="object-cover" unoptimized />
        ) : (
          <Upload size={18} className="text-stone" />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/70">
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 border border-ink px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
          >
            <Upload size={13} /> {uploading ? "Subiendo…" : "Subir foto"}
          </button>
          <button
            type="button"
            onClick={() => setShowUrl((s) => !s)}
            className="inline-flex items-center gap-1.5 text-[12px] text-ash hover:text-ink"
          >
            <Link2 size={13} /> URL
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-[12px] text-ash hover:text-accent"
            >
              <X size={13} /> Quitar
            </button>
          )}
        </div>
        {showUrl && (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            className="mt-2 w-full border border-line px-3 py-2 text-[13px] outline-none focus:border-ink"
          />
        )}
        {error && <p className="mt-1.5 text-[12px] text-accent">{error}</p>}
        <p className="mt-1.5 text-[11px] text-stone">JPG, PNG o WEBP · hasta 8MB · o arrastrá la foto</p>
      </div>
    </div>
  );
}
