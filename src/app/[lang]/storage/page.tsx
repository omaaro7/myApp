// src\app\[lang]\storage\page.tsx
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/i18n-config';
import StorageContent from './storage-content';

interface StoragePageProps {
  params: {
    lang: Locale
  }
}

export default async function StoragePage({ params: { lang } }: StoragePageProps) {
  const t = await getDictionary(lang);
  return <StorageContent lang={lang} t={t} />;
}
