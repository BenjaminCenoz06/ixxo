"use client";

import { Check } from "lucide-react";
import type { Facets, Filters } from "@/lib/catalog";
import { colorHex } from "@/data/colors";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  facets: Facets;
  filters: Filters;
  onChange: (next: Filters) => void;
}

export default function FilterControls({ facets, filters, onChange }: Props) {
  const toggle = (key: "colors" | "sizes" | "collections", value: string) => {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="flex flex-col divide-y divide-line">
      {/* Color */}
      <Group title="Color">
        <div className="flex flex-wrap gap-2.5">
          {facets.colors.map((c) => {
            const on = filters.colors.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggle("colors", c)}
                aria-pressed={on}
                title={c}
                className={cn(
                  "relative h-7 w-7 rounded-full border transition-all",
                  on ? "border-ink ring-1 ring-ink ring-offset-2" : "border-line hover:border-ash",
                )}
                style={{ backgroundColor: colorHex(c) }}
              >
                {on && (
                  <Check
                    size={13}
                    strokeWidth={3}
                    className={cn(
                      "absolute inset-0 m-auto",
                      c === "Blanco" || c === "Arena" || c === "Camel" ? "text-ink" : "text-paper",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Group>

      {/* Talle */}
      <Group title="Talle">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => {
            const on = filters.sizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle("sizes", s)}
                aria-pressed={on}
                className={cn(
                  "min-w-10 border px-3 py-2 text-[13px] transition-colors",
                  on ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Group>

      {/* Precio */}
      <Group title="Precio">
        <input
          type="range"
          min={facets.priceMin}
          max={facets.priceMax}
          step={1000}
          value={filters.priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-ink"
        />
        <div className="mt-2 flex justify-between text-[12px] text-ash">
          <span>{formatPrice(facets.priceMin)}</span>
          <span className="text-ink">Hasta {formatPrice(filters.priceMax)}</span>
        </div>
      </Group>

      {/* Colección */}
      {facets.collections.length > 0 && (
        <Group title="Colección">
          <ul className="space-y-2.5">
            {facets.collections.map((col) => (
              <li key={col}>
                <Checkbox
                  label={col}
                  checked={filters.collections.includes(col)}
                  onChange={() => toggle("collections", col)}
                />
              </li>
            ))}
          </ul>
        </Group>
      )}

      {/* Disponibilidad */}
      <Group title="Disponibilidad">
        <div className="space-y-2.5">
          <Checkbox
            label="En oferta"
            checked={filters.onSale}
            onChange={() => onChange({ ...filters, onSale: !filters.onSale })}
          />
          <Checkbox
            label="Solo con stock"
            checked={filters.inStock}
            onChange={() => onChange({ ...filters, inStock: !filters.inStock })}
          />
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 first:pt-0">
      <h3 className="eyebrow mb-4">{title}</h3>
      {children}
    </section>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[14px] text-ink-soft">
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center border transition-colors",
          checked ? "border-ink bg-ink" : "border-stone",
        )}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-paper" />}
      </span>
      {label}
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}
