import type { Metadata } from "next";
import CheckoutResult from "@/components/checkout/CheckoutResult";

export const metadata: Metadata = {
  title: "Resultado del pago",
  robots: { index: false },
};

type Search = { searchParams: Promise<{ status?: string; order?: string }> };

const VALID = ["approved", "pending", "failure"] as const;

export default async function ResultadoPage({ searchParams }: Search) {
  const { status, order } = await searchParams;
  const safeStatus = (VALID as readonly string[]).includes(status ?? "")
    ? (status as (typeof VALID)[number])
    : "failure";

  return <CheckoutResult status={safeStatus} order={order} />;
}
