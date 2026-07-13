"use client";

import { Check, Loader2, Plus, Trash2, Megaphone, Image as ImageIcon, Type } from "lucide-react";
import { useAdminContent } from "@/lib/admin-content";
import type { SiteContent } from "@/lib/site-content";
import { PageHeader, Card, Btn } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";
import NavEditor from "@/components/admin/NavEditor";

export default function AdminContenido() {
  const { content, patch, loading, saving, saved, error, save } = useAdminContent();

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

      {error && (
        <div className="mb-6 border border-accent bg-accent/5 px-4 py-3 text-[13px] text-accent">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Colores del sitio */}
        <Card title="Colores del sitio">
          <p className="mb-4 text-[12px] text-ash">
            Cambian toda la tienda al instante. El <strong className="text-ink">acento</strong> es el
            color de promos y ofertas.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <ColorField label="Acento (promos)" value={content.theme.accent} onChange={(v) => patch("theme", { ...content.theme, accent: v })} />
            <ColorField label="Principal (textos/negro)" value={content.theme.ink} onChange={(v) => patch("theme", { ...content.theme, ink: v })} />
            <ColorField label="Fondo (blanco)" value={content.theme.paper} onChange={(v) => patch("theme", { ...content.theme, paper: v })} />
          </div>
        </Card>

        {/* Ajustes generales */}
        <Card title="Ajustes generales">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre de la tienda">
              <Input value={content.general.storeName} onChange={(v) => patch("general", { ...content.general, storeName: v })} />
            </Field>
            <Field label="WhatsApp (con código país)">
              <Input value={content.general.whatsapp} onChange={(v) => patch("general", { ...content.general, whatsapp: v })} />
            </Field>
            <Field label="Envío gratis desde ($)">
              <input type="number" value={content.general.freeShippingThreshold} onChange={(e) => patch("general", { ...content.general, freeShippingThreshold: +e.target.value })} className={inputCls} />
            </Field>
            <Field label="Descuento transferencia (%)">
              <input type="number" value={content.general.transferDiscount} onChange={(e) => patch("general", { ...content.general, transferDiscount: +e.target.value })} className={inputCls} />
            </Field>
          </div>
        </Card>

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
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <p className="text-[11px] uppercase tracking-wide text-ash">Imagen escritorio</p>
                        <ImageUploader
                          folder="hero"
                          value={slide.image}
                          onChange={(v) => {
                            const slides = [...hero.slides];
                            slides[i] = { ...slides[i], image: v };
                            patch("hero", { ...hero, slides });
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[11px] uppercase tracking-wide text-ash">
                          Imagen móvil <span className="normal-case text-stone">(opcional)</span>
                        </p>
                        <ImageUploader
                          folder="hero"
                          value={slide.imageMobile ?? ""}
                          onChange={(v) => {
                            const slides = [...hero.slides];
                            slides[i] = { ...slides[i], imageMobile: v };
                            patch("hero", { ...hero, slides });
                          }}
                        />
                        {slide.imageMobile ? (
                          <button
                            onClick={() => {
                              const slides = [...hero.slides];
                              slides[i] = { ...slides[i], imageMobile: "" };
                              patch("hero", { ...hero, slides });
                            }}
                            className="text-[11px] text-accent hover:underline"
                          >
                            Quitar imagen móvil
                          </button>
                        ) : (
                          <p className="text-[11px] text-stone">Si la dejás vacía, en móvil se usa la de escritorio.</p>
                        )}
                      </div>
                    </div>
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

        {/* Menú del header */}
        <Card title="Menú del header (navegación)">
          <p className="mb-4 text-[12px] text-ash">
            Ítems del menú superior. El que tenga <strong className="text-ink">mega-menú</strong> muestra
            columnas de enlaces + una imagen destacada al pasar el mouse.
          </p>
          <NavEditor nav={content.nav} onChange={(v) => patch("nav", v)} />
        </Card>

        {/* Footer: columnas de enlaces + medios de pago */}
        <Card title="Footer — enlaces y medios de pago">
          <div className="grid gap-5 md:grid-cols-3">
            {content.footerColumns.map((col, ci) => (
              <div key={ci} className="border border-line p-3">
                <Input
                  value={col.title}
                  onChange={(v) => {
                    const cols = [...content.footerColumns];
                    cols[ci] = { ...cols[ci], title: v };
                    patch("footerColumns", cols);
                  }}
                />
                <div className="mt-3 space-y-2">
                  {col.links.map((l, li) => (
                    <div key={li} className="flex items-center gap-1.5">
                      <input
                        value={l.label}
                        placeholder="Texto"
                        onChange={(e) => {
                          const cols = structuredClone(content.footerColumns);
                          cols[ci].links[li].label = e.target.value;
                          patch("footerColumns", cols);
                        }}
                        className={inputCls}
                      />
                      <input
                        value={l.href}
                        placeholder="/link"
                        onChange={(e) => {
                          const cols = structuredClone(content.footerColumns);
                          cols[ci].links[li].href = e.target.value;
                          patch("footerColumns", cols);
                        }}
                        className={`${inputCls} w-20 shrink-0`}
                      />
                      <button
                        onClick={() => {
                          const cols = structuredClone(content.footerColumns);
                          cols[ci].links.splice(li, 1);
                          patch("footerColumns", cols);
                        }}
                        className="shrink-0 p-1 text-stone hover:text-accent"
                        aria-label="Eliminar enlace"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const cols = structuredClone(content.footerColumns);
                      cols[ci].links.push({ label: "Nuevo", href: "#" });
                      patch("footerColumns", cols);
                    }}
                    className="text-[12px] text-ash hover:text-ink"
                  >
                    + enlace
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="mb-1.5 text-[12px] font-medium text-ink-soft">Medios de pago (uno por línea)</p>
            <TextArea
              rows={3}
              value={content.payments.join("\n")}
              onChange={(v) => patch("payments", v.split("\n").map((s) => s.trim()).filter(Boolean))}
            />
          </div>
        </Card>

        {/* Títulos de secciones */}
        <Card title="Títulos de las secciones">
          <div className="space-y-4">
            <SectionHeadingFields
              label="Categorías"
              value={content.sections.categories}
              cta
              onChange={(v) => patch("sections", { ...content.sections, categories: v } as SiteContent["sections"])}
            />
            <SectionHeadingFields
              label="Productos destacados"
              value={content.sections.featured}
              cta
              onChange={(v) => patch("sections", { ...content.sections, featured: v } as SiteContent["sections"])}
            />
            <SectionHeadingFields
              label="Colecciones"
              value={content.sections.collections}
              onChange={(v) => patch("sections", { ...content.sections, collections: { eyebrow: v.eyebrow, title: v.title } } as SiteContent["sections"])}
            />
            <SectionHeadingFields
              label="Lookbook"
              value={content.sections.lookbook}
              cta
              onChange={(v) => patch("sections", { ...content.sections, lookbook: v } as SiteContent["sections"])}
            />
            <SectionHeadingFields
              label="Opiniones"
              value={content.sections.reviews}
              onChange={(v) => patch("sections", { ...content.sections, reviews: { eyebrow: v.eyebrow, title: v.title } } as SiteContent["sections"])}
            />
          </div>
        </Card>

        {/* Lookbook */}
        <Card title="Lookbook (looks del home)">
          <div className="space-y-3">
            {content.lookbook.looks.map((look, i) => (
              <div key={i} className="space-y-2 border border-line p-3">
                <div className="flex items-start justify-between gap-3">
                  <ImageUploader
                    folder="lookbook"
                    value={look.image}
                    onChange={(v) => {
                      const looks = [...content.lookbook.looks];
                      looks[i] = { ...looks[i], image: v };
                      patch("lookbook", { looks });
                    }}
                  />
                  <button
                    onClick={() => patch("lookbook", { looks: content.lookbook.looks.filter((_, j) => j !== i) })}
                    className="p-1.5 text-stone hover:text-accent"
                    aria-label="Eliminar look"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-[2fr_1fr] gap-2">
                  <Input
                    placeholder="Título del look"
                    value={look.title}
                    onChange={(v) => {
                      const looks = [...content.lookbook.looks];
                      looks[i] = { ...looks[i], title: v };
                      patch("lookbook", { looks });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Prendas"
                    value={look.items}
                    onChange={(e) => {
                      const looks = [...content.lookbook.looks];
                      looks[i] = { ...looks[i], items: +e.target.value };
                      patch("lookbook", { looks });
                    }}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
            <Btn variant="outline" onClick={() => patch("lookbook", { looks: [...content.lookbook.looks, { image: "", title: "", items: 0 }] })}>
              <Plus size={14} /> Agregar look
            </Btn>
          </div>
        </Card>

        {/* Colecciones del home */}
        <Card title='Colecciones del home ("Cada colección, un universo propio")'>
          <p className="mb-3 text-[12px] text-ash">
            Cada tarjeta es una imagen grande con título, subtítulo y link. Se muestran una debajo de otra.
          </p>
          <div className="space-y-3">
            {content.homeCollections.map((col, i) => (
              <div key={i} className="space-y-2 border border-line p-3">
                <div className="flex items-start justify-between gap-3">
                  <ImageUploader
                    folder="colecciones"
                    value={col.image}
                    onChange={(v) => {
                      const list = [...content.homeCollections];
                      list[i] = { ...list[i], image: v };
                      patch("homeCollections", list);
                    }}
                  />
                  <button
                    onClick={() => patch("homeCollections", content.homeCollections.filter((_, j) => j !== i))}
                    className="p-1.5 text-stone hover:text-accent"
                    aria-label="Eliminar colección"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <Input
                  placeholder="Título (ej. Urbano)"
                  value={col.title}
                  onChange={(v) => {
                    const list = [...content.homeCollections];
                    list[i] = { ...list[i], title: v };
                    patch("homeCollections", list);
                  }}
                />
                <Input
                  placeholder="Subtítulo"
                  value={col.subtitle}
                  onChange={(v) => {
                    const list = [...content.homeCollections];
                    list[i] = { ...list[i], subtitle: v };
                    patch("homeCollections", list);
                  }}
                />
                <Input
                  placeholder="Link (ej. /novedades o /coleccion/urbano)"
                  value={col.href}
                  onChange={(v) => {
                    const list = [...content.homeCollections];
                    list[i] = { ...list[i], href: v };
                    patch("homeCollections", list);
                  }}
                />
              </div>
            ))}
            <Btn
              variant="outline"
              onClick={() => patch("homeCollections", [...content.homeCollections, { image: "", title: "", subtitle: "", href: "/novedades" }])}
            >
              <Plus size={14} /> Agregar colección
            </Btn>
          </div>
        </Card>

        {/* Instagram */}
        <Card title="Instagram">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Eyebrow">
              <Input value={content.instagram.eyebrow} onChange={(v) => patch("instagram", { ...content.instagram, eyebrow: v })} />
            </Field>
            <Field label="Usuario (@)">
              <Input value={content.instagram.handle} onChange={(v) => patch("instagram", { ...content.instagram, handle: v })} />
            </Field>
            <Field label="Link del perfil">
              <Input value={content.instagram.url} onChange={(v) => patch("instagram", { ...content.instagram, url: v })} />
            </Field>
          </div>
          <p className="mb-2 mt-5 text-[12px] font-medium text-ink-soft">Fotos del feed</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.instagram.images.map((img, i) => (
              <div key={i} className="flex items-start gap-2 border border-line p-2">
                <ImageUploader
                  folder="instagram"
                  value={img}
                  onChange={(v) => {
                    const images = [...content.instagram.images];
                    images[i] = v;
                    patch("instagram", { ...content.instagram, images });
                  }}
                />
                <button
                  onClick={() => patch("instagram", { ...content.instagram, images: content.instagram.images.filter((_, j) => j !== i) })}
                  className="p-1.5 text-stone hover:text-accent"
                  aria-label="Eliminar foto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Btn variant="outline" onClick={() => patch("instagram", { ...content.instagram, images: [...content.instagram.images, ""] })}>
              <Plus size={14} /> Agregar foto
            </Btn>
          </div>
        </Card>

        {/* Opiniones */}
        <Card title="Opiniones (reseñas del home)">
          <div className="grid max-w-xs gap-4 sm:grid-cols-2">
            <Field label="Promedio (0-5)">
              <input type="number" step="0.1" max={5} min={0} value={content.reviews.average} onChange={(e) => patch("reviews", { ...content.reviews, average: +e.target.value })} className={inputCls} />
            </Field>
            <Field label="Cantidad total">
              <input type="number" value={content.reviews.count} onChange={(e) => patch("reviews", { ...content.reviews, count: +e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="mt-5 space-y-3">
            {content.reviews.items.map((r, i) => (
              <div key={i} className="space-y-2 border border-line p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-ash">Reseña {i + 1}</span>
                  <button onClick={() => patch("reviews", { ...content.reviews, items: content.reviews.items.filter((_, j) => j !== i) })} className="p-1 text-stone hover:text-accent" aria-label="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-[2fr_2fr_1fr] gap-2">
                  <Input placeholder="Nombre" value={r.author} onChange={(v) => { const items = [...content.reviews.items]; items[i] = { ...items[i], author: v }; patch("reviews", { ...content.reviews, items }); }} />
                  <Input placeholder="Producto" value={r.product} onChange={(v) => { const items = [...content.reviews.items]; items[i] = { ...items[i], product: v }; patch("reviews", { ...content.reviews, items }); }} />
                  <input type="number" step="1" max={5} min={1} placeholder="★" value={r.rating} onChange={(e) => { const items = [...content.reviews.items]; items[i] = { ...items[i], rating: +e.target.value }; patch("reviews", { ...content.reviews, items }); }} className={inputCls} />
                </div>
                <Input placeholder="Título" value={r.title} onChange={(v) => { const items = [...content.reviews.items]; items[i] = { ...items[i], title: v }; patch("reviews", { ...content.reviews, items }); }} />
                <TextArea rows={2} value={r.body} onChange={(v) => { const items = [...content.reviews.items]; items[i] = { ...items[i], body: v }; patch("reviews", { ...content.reviews, items }); }} />
              </div>
            ))}
            <Btn variant="outline" onClick={() => patch("reviews", { ...content.reviews, items: [...content.reviews.items, { author: "", rating: 5, title: "", body: "", product: "", avatar: "" }] })}>
              <Plus size={14} /> Agregar reseña
            </Btn>
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

function ColorField({
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
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded border border-line bg-paper"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-line px-3 py-2.5 text-[14px] outline-none focus:border-ink"
        />
      </div>
    </label>
  );
}

function SectionHeadingFields({
  label,
  value,
  cta,
  onChange,
}: {
  label: string;
  value: { eyebrow: string; title: string; ctaLabel?: string; ctaHref?: string };
  cta?: boolean;
  onChange: (v: { eyebrow: string; title: string; ctaLabel?: string; ctaHref?: string }) => void;
}) {
  return (
    <div className="border border-line p-4">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-ash">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Eyebrow">
          <Input value={value.eyebrow} onChange={(v) => onChange({ ...value, eyebrow: v })} />
        </Field>
        <Field label="Título">
          <Input value={value.title} onChange={(v) => onChange({ ...value, title: v })} />
        </Field>
        {cta && (
          <>
            <Field label="Botón — texto">
              <Input value={value.ctaLabel ?? ""} onChange={(v) => onChange({ ...value, ctaLabel: v })} />
            </Field>
            <Field label="Botón — link">
              <Input value={value.ctaHref ?? ""} onChange={(v) => onChange({ ...value, ctaHref: v })} />
            </Field>
          </>
        )}
      </div>
    </div>
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
