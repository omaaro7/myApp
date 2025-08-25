
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { i18n } from "@/i18n-config";
import type { Locale } from "@/i18n-config";

export default function Logo({ lang }: { lang?: Locale }) {
  const pathname = usePathname();
  
  const getLang = () => {
    if (lang) return lang;
    const segments = pathname.split('/');
    if (segments.length > 1 && i18n.locales.includes(segments[1] as any)) {
      return segments[1] as Locale;
    }
    return i18n.defaultLocale;
  }

  return (
    <Link href={`/${getLang()}`} className="flex items-center gap-2">
      <BrainCircuit className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline text-foreground">
        QuizWise
      </span>
    </Link>
  );
}
