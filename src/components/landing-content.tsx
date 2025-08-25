import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Edit, FileText } from 'lucide-react';
import Logo from '@/components/logo';
import LandingAuthControls from '@/components/landing-auth-controls';
import type { Locale } from '@/i18n-config';

export default function LandingContent({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const t = dictionary.landing;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <LandingAuthControls lang={lang} loginText={t.signIn} signupText={t.getStarted} settingsDictionary={dictionary.settings} />
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground">
              {t.headline}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subheadline}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={`/${lang}/signup`}>{t.cta}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{t.whyTitle}</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                {t.whySubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4 font-headline">{t.feature1Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t.feature1Text}</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Edit className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4 font-headline">{t.feature2Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t.feature2Text}</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <FileText className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4 font-headline">{t.feature3Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t.feature3Text}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>{t.footer.replace('{year}', new Date().getFullYear().toString())}</p>
      </footer>
    </div>
  );
} 