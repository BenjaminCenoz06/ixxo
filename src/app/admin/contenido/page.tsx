"use client";

import { Check, Loader2, Plus, Trash2, Megaphone, Image as ImageIcon, Type } from "lucide-react";
import { useAdminContent } from "@/lib/admin-content";
import { PageHeader, Card, Btn } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminContenido() {
  const { content, patch, loading, saving, saved, save } = useAdminContent();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-ash" />
      </div>
    );
  }

  const hero = content.hero;

  return (
    <>
      <PageHeader
        title="Contenido del sitio"
        subtitle="Editá los banners, imágenes y textos de la página. Los cambios se ven al instante en la tienda."
        action={
          <Btn onClick={save}>
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Guardando…
              </>
            ) : saved ? (
              <>
                <Check size={15} /> Guardado
              </>
            ) : (
              "Guardar cambios"
            )}
          </Btn>
        }
      />

      <div className="space-y-6">
        {/* Barra de anuncios */}
        <Card title="Barra de anuncios">
          <p className="mb-3 flex items-center gap-2 text-[12px] text-ash">
            <Megaphone size={14} /> Un mensaje por línea. Se muestran en el marquee superior.
          </p>
          <TextArea
            rows={4}
            value={content.announcement.join("\n")}
            onChange={(v) => patch("announcement", v.split("\n").filter((l) => l.trim() !== ""))}
          />
        </Card>

        {/* Hero */}
        <Card title="Hero (banner principal)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título — línea 1">
              <Input value={hero.titleTop} onChange={(v) => patch("hero", { ...hero, titleTop: v })} />
            </Field>
            <Field label="Título — línea 2 (cursiva)">
              <Input value={hero.titleBottom} onChange={(v) => patch("hero", { ...hero, titleBottom: v })} />
            </Field>
            <Field label="Botón principal — texto">
              <Input value={hero.ctaPrimaryLabel} onChange={(v) => patch("hero", { ...hero, ctaPrimaryLabel: v })} />
            </Field>
            <Field label="Botón principal — link">
              <Input value={hero.ctaPrimaryHref} onChange={(v) => patch("hero", { ...hero, ctaPrimaryHref: v })} />
            </Field>
            <Field label="Botón secundario — texto">
              <Input value={hero.ctaSecondaryLabel} onChange={(v) => patch("hero", { ...hero, ctaSecondaryLabel: v })} />
            </Field>
            <Field label="Botón secundario — link">
              <Input value={hero.ctaSecondaryHref} onChange={(v) => patch("hero", { ...hero, ctaSecondaryHref: v })} />
            </Field>
          </div>

          <div className="mt-6">
            <p className="mb-3 flex items-center gap-2 text-[12px] font-medium text-ink-soft">
              <ImageIcon size={14} /> Slides (imagen + texto). Se rotan automáticamente.
            </p>
            <div className="space-y-3">
              {hero.slides.map((slide, i) => (
                <div key={i} className="space-y-2 border border-line p-3">
                  <div className="flex items-start justify-between gap-3">
                    <ImageUploader
                      folder="hero"
                      value={slide.image}
                      onChange={(v) => {
                        const slides = [...hero.slides];
                        slides[i] = { ...slides[i], image: v };
                        patch("hero", { ...hero, slides });
                      }}
                    />
                    <button
                      onClick={() => patch("hero", { ...hero, slides: hero.slides.filter((_, j) => j !== i) })}
                      className="p-1.5 text-stone hover:text-accent"
                      aria-label="Eliminar slide"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <Input
                    placeholder="Texto pequeño (eyebrow)"
                    value={slide.eyebrow}
                    onChange={(v) => {
                      const slides = [...hero.slides];
                      slides[i] = { ...slides[i], eyebrow: v };
                      patch("hero", { ...hero, slides });
                    }}
                  />
                </div>
              ))}
              <Btn
                variant="outline"
                onClick={() =>
                  patch("hero", { ...hero, slides: [...hero.slides, { image: "", eyebrow: "" }] })
                }
              >
                <Plus size={14} /> Agregar slide
              </Btn>
            </div>
          </div>
        </Card>

        {/* Nueva colección */}
        <Card title="Banner “Nueva colección”">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <Input value={content.newCollection.eyebrow} onChange={(v) => patch("newCollection", { ...content.newCollection, eyebrow: v })} />
            </Field>
            <Field label="Título">
              <Input value={content.newCollection.title} onChange={(v) => patch("newCollection", { ...content.newCollection, title: v })} />
            </Field>
          </div>
          <Field label="Descripción" className="mt-4">
            <TextArea rows={3} value={content.newCollection.description} onChange={(v) => patch("newCollection", { ...content.newCollection, description: v })} />
          </Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Botón — texto">
              <Input value={content.newCollection.ctaLabel} onChange={(v) => patch("newCollection", { ...content.newCollection, ctaLabel: v })} />
            </Field>
            <Field label="Botón — link">
              <Input value={content.newCollection.ctaHref} onChange={(v) => patch("newCollection", { ...content.newCollection, ctaHref: v })} />
            </Field>
          </div>
          <ImageFieldRow
            label="Imagen"
            folder="colecciones"
            value={content.newCollection.image}
            onChange={(v) => patch("newCollection", { ...content.newCollection, image: v })}
          />
        </Card>

        {/* Editorial */}
        <Card title="Sección editorial (frase de marca)">
          <Field label="Eyebrow">
            <Input value={content.editorial.eyebrow} onChange={(v) => patch("editorial", { ...content.editorial, eyebrow: v })} />
          </Field>
          <Field label="Frase principal" className="mt-4">
            <TextArea rows={2} value={content.editorial.quote} onChange={(v) => patch("editorial", { ...content.editorial, quote: v })} />
          </Field>
          <Field label="Texto secundario" className="mt-4">
            <TextArea rows={2} value={content.editorial.subtext} onChange={(v) => patch("editorial", { ...content.editorial, subtext: v })} />
          </Field>
          <ImageFieldRow
            label="Imagen de fondo"
            folder="editorial"
            value={content.editorial.image}
            onChange={(v) => patch("editorial", { ...content.editorial, image: v })}
          />
        </Card>

        {/* Newsletter */}
        <Card title="Newsletter">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <Input value={content.newsletter.eyebrow} onChange={(v) => patch("newsletter", { ...content.newsletter, eyebrow: v })} />
            </Field>
            <Field label="Título">
              <Input value={content.newsletter.title} onChange={(v) => patch("newsletter", { ...content.newsletter, title: v })} />
            </Field>
          </div>
          <Field label="Subtítulo" className="mt-4">
            <TextArea rows={2} value={content.newsletter.subtitle} onChange={(v) => patch("newsletter", { ...content.newsletter, subtitle: v })} />
          </Field>
        </Card>

        {/* Footer / redes */}
        <Card title="Footer y redes sociales">
          <Field label="Descripción de la marca">
            <TextArea rows={2} value={content.footer.description} onChange={(v) => patch("footer", { ...content.footer, description: v })} />
          </Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Instagram (URL)">
              <Input value={content.footer.instagram} onChange={(v) => patch("footer", { ...content.footer, instagram: v })} />
            </Field>
            <Field label="TikTok (URL)">
              <Input value={content.footer.tiktok} onChange={(v) => patch("footer", { ...content.footer, tiktok: v })} />
            </Field>
            <Field label="YouTube (URL)">
              <Input value={content.footer.youtube} onChange={(v) => patch("footer", { ...content.footer, youtube: v })} />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end pb-8">
          <Btn onClick={save}>
            {saving ? "Guardando…" : saved ? "Guardado ✓" : "Guardar todos los cambios"}
          </Btn>
        </div>
      </div>
    </>
  );
}

/* ── helpers ─────────────────────────────────────────────── */
const inputCls =
  "w-full border border-line px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink";

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} resize-none`}
    />
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
        <Type size={11} /> {label}
      </span>
      {children}
    </label>
  );
}

function ImageFieldRow({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder?: string;
}) {
  return (
    <div className="mt-4">
      <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
        <ImageIcon size={12} /> {label}
      </span>
      <ImageUploader value={value} onChange={onChange} folder={folder} />
    </div>
  );
}
