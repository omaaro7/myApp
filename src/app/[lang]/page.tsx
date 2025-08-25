
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/i18n-config';
import RedirectIfAuthed from '@/components/redirect-if-authed';
import LandingContent from '@/components/landing-content';

export default async function LandingPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <RedirectIfAuthed lang={lang} />
      <LandingContent lang={lang} dictionary={dictionary} />
    </div>
  );
}
