// src\app\[lang]\dashboard\storage\page.tsx
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/i18n-config';
import StoragePageClient from './storage-page-client';

interface StoragePageProps {
  params: { lang: Locale };
}

export default async function StoragePage({ params }: StoragePageProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return <StoragePageClient lang={lang} dictionary={dictionary} />;
}