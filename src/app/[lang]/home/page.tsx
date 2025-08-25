import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/i18n-config';
import LandingContent from '@/components/landing-content';

export default async function HomeAliasPage({ params }: { params: Promise<{ lang: Locale }> }) {
	const { lang } = await params;
	const dictionary = await getDictionary(lang);
	return <LandingContent lang={lang} dictionary={dictionary} />;
} 