
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/questions/question-form";
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from "@/i18n-config";

export default async function NewQuestionPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <AppLayout lang={lang} dictionary={dictionary.appLayout}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">{dictionary.newQuestion.title}</h1>
            <p className="text-muted-foreground">
                {dictionary.newQuestion.description}
            </p>
        </div>
        <QuestionForm dictionary={dictionary.question}/>
      </div>
    </AppLayout>
  );
}
