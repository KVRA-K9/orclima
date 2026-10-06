import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["pt", "en"] as const;
const LOCALE_PADRAO = "pt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const temLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (temLocale) return;

  request.nextUrl.pathname = `/${LOCALE_PADRAO}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
