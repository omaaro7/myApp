
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
  
  // The negotiator library expects a mutable array
  const locales: string[] = [...i18n.locales]
  
  let languages;
  try {
    languages = new Negotiator({ headers: negotiatorHeaders }).languages(
      locales
    )
  } catch (error) {
    languages = [i18n.defaultLocale];
  }

  return matchLocale(languages, locales, i18n.defaultLocale)
}


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have multiple directories in `public`, you can pass them to `startsWith` as an array.
  if (
    [
      '/manifest.json',
      '/favicon.ico',
      // Your other files in `public`
    ].includes(pathname)
  )
    return

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|.*\\..*).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
