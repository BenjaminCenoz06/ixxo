import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Deploy dedicado al panel (admin-ixxo): la home va directo a /admin.
const ADMIN_ONLY = process.env.NEXT_PUBLIC_ADMIN_ONLY === "true";

export async function proxy(request: NextRequest) {
  if (ADMIN_ONLY && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto assets estáticos e imágenes optimizadas.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
