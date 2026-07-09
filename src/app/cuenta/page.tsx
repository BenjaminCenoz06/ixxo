import type { Metadata } from "next";
import AccountView from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false },
};

export default function CuentaPage() {
  return <AccountView />;
}
