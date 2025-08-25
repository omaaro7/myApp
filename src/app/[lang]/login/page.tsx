
import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import Logo from "@/components/logo";
import SettingsDrawer from "@/components/settings-drawer";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";

export default async function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const t = dictionary.login;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
       <div className="absolute top-4 right-4">
        <SettingsDrawer dictionary={dictionary.settings} />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Logo />
        </div>
        <LoginForm dictionary={t} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <Link
            href={`/${lang}/signup`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t.signUpLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
