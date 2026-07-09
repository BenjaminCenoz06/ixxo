"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthPanel from "./AuthPanel";
import AccountDashboard from "./AccountDashboard";

export default function AccountView() {
  const { user, loading, configured } = useAuth();

  if (configured && loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-ash" />
      </div>
    );
  }

  return user ? <AccountDashboard /> : <AuthPanel />;
}
