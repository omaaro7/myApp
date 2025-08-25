import AppLayout from "@/components/app-layout";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import ProfileView from "./profile-view";

export default async function ProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <AppLayout lang={lang} dictionary={dictionary.appLayout}>
            <ProfileView />
        </AppLayout>
    );
}