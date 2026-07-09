"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Ingresá tu nombre"),
});
type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPanel() {
  const { signIn, signUp, signInWithGoogle, configured } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="container-ixxo flex min-h-[70vh] items-center justify-center pt-28 pb-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3">Mi cuenta</p>
          <h1 className="font-display text-3xl font-light tracking-tight">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
        </div>

        {!configured && (
          <div className="mb-6 flex items-start gap-3 border border-line bg-smoke p-4 text-[13px] text-ink-soft">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>
              Modo demo: conectá Supabase (ver <code className="text-ink">.env.example</code>) para
              habilitar el registro y el login reales.
            </p>
          </div>
        )}

        {/* Google */}
        <button
          onClick={async () => {
            const r = await signInWithGoogle();
            if (!r.ok) setNotice(r.error ?? null);
          }}
          className="flex w-full items-center justify-center gap-3 border border-line py-3.5 text-[13px] font-medium transition-colors hover:border-ink"
        >
          <GoogleIcon /> Continuar con Google
        </button>

        <div className="my-6 flex items-center gap-4 text-[12px] text-stone">
          <span className="h-px flex-1 bg-line" /> o <span className="h-px flex-1 bg-line" />
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <LoginForm
              key="login"
              onSubmit={async (d) => {
                setServerError(null);
                const r = await signIn(d.email, d.password);
                if (!r.ok) setServerError(r.error ?? "No se pudo iniciar sesión");
              }}
            />
          ) : (
            <RegisterForm
              key="register"
              onSubmit={async (d) => {
                setServerError(null);
                setNotice(null);
                const r = await signUp(d.email, d.password, d.fullName);
                if (!r.ok) setServerError(r.error ?? "No se pudo crear la cuenta");
                else setNotice("¡Listo! Revisá tu email para confirmar la cuenta.");
              }}
            />
          )}
        </AnimatePresence>

        {(serverError || notice) && (
          <p className={cn("mt-4 text-center text-[13px]", serverError ? "text-accent" : "text-ink")}>
            {serverError ?? notice}
          </p>
        )}

        <p className="mt-8 text-center text-[13px] text-ash">
          {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setServerError(null);
              setNotice(null);
            }}
            className="text-ink underline underline-offset-2"
          >
            {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit }: { onSubmit: (d: LoginData) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  return (
    <motion.form
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input label="Contraseña" type="password" error={errors.password?.message} {...register("password")} />
      <SubmitBtn loading={isSubmitting}>Ingresar</SubmitBtn>
    </motion.form>
  );
}

function RegisterForm({ onSubmit }: { onSubmit: (d: RegisterData) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  return (
    <motion.form
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input label="Nombre completo" error={errors.fullName?.message} {...register("fullName")} />
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input label="Contraseña" type="password" error={errors.password?.message} {...register("password")} />
      <SubmitBtn loading={isSubmitting}>Crear cuenta</SubmitBtn>
    </motion.form>
  );
}

const Input = ({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) => (
  <label className="block">
    <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-ink-soft">{label}</span>
    <input
      {...props}
      className={cn(
        "w-full border px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink",
        error ? "border-accent" : "border-line",
      )}
    />
    {error && <span className="mt-1 block text-[12px] text-accent">{error}</span>}
  </label>
);

function SubmitBtn({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
