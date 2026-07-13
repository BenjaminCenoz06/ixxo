import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalizá tu compra en Custom Wear de forma rápida y segura.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
