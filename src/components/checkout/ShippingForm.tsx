"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  shippingSchema,
  PROVINCES,
  CP_LOOKUP,
  type ShippingForm as ShippingData,
} from "@/lib/checkout-schema";
import { cn } from "@/lib/utils";

interface Props {
  defaultValues?: Partial<ShippingData>;
  onSubmit: (data: ShippingData) => void;
  onBack: () => void;
}

export default function ShippingForm({ defaultValues, onSubmit, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
    mode: "onTouched",
  });

  // Autocompletado por código postal.
  const onCP = (value: string) => {
    const hit = CP_LOOKUP[value];
    if (hit) {
      setValue("province", hit.province as ShippingData["province"], { shouldValidate: true });
      setValue("city", hit.city, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" error={errors.firstName?.message}>
          <input {...register("firstName")} className={input(errors.firstName)} autoComplete="given-name" />
        </Field>
        <Field label="Apellido" error={errors.lastName?.message}>
          <input {...register("lastName")} className={input(errors.lastName)} autoComplete="family-name" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className={input(errors.email)} autoComplete="email" />
        </Field>
        <Field label="Teléfono" error={errors.phone?.message}>
          <input {...register("phone")} className={input(errors.phone)} autoComplete="tel" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
        <Field label="Dirección" error={errors.address?.message}>
          <input {...register("address")} className={input(errors.address)} autoComplete="street-address" placeholder="Calle y número" />
        </Field>
        <Field label="Depto / Piso (opcional)" error={errors.apartment?.message}>
          <input {...register("apartment")} className={input(errors.apartment)} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Código postal" error={errors.postalCode?.message}>
          <input
            {...register("postalCode", { onChange: (e) => onCP(e.target.value) })}
            className={input(errors.postalCode)}
            inputMode="numeric"
            maxLength={4}
            autoComplete="postal-code"
          />
        </Field>
        <Field label="Provincia" error={errors.province?.message}>
          <select {...register("province")} className={cn(input(errors.province), "bg-paper")} defaultValue="">
            <option value="" disabled>
              Elegir…
            </option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ciudad" error={errors.city?.message}>
          <input {...register("city")} className={input(errors.city)} autoComplete="address-level2" />
        </Field>
      </div>

      <Field label="Notas para la entrega (opcional)" error={errors.notes?.message}>
        <textarea {...register("notes")} rows={2} className={cn(input(), "resize-none")} />
      </Field>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink"
        >
          <ArrowLeft size={15} /> Volver al carrito
        </button>
        <button
          type="submit"
          className="group inline-flex items-center gap-2 bg-ink px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft"
        >
          Continuar al pago
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

function input(error?: unknown) {
  return cn(
    "w-full border px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink",
    error ? "border-accent" : "border-line",
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-accent">{error}</span>}
    </label>
  );
}
