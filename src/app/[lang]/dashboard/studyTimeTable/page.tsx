import StudyTimetable from "@/components/study-timetable";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import AppLayout from '@/components/app-layout'; // Import AppLayout

export default async function StudyTimeTablePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <AppLayout lang={lang} dictionary={dictionary.appLayout}>
      <StudyTimetable lang={lang} dictionary={dictionary.timetable} />
    </AppLayout>
  );
}
