
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/questions/question-form";
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from "@/i18n-config";

// This is a server component to fetch data
export default async function EditQuestionPage({ params }: { params: Promise<{ id: string, lang: Locale }> }) {
  const { id, lang } = await params;
  const dictionary = await getDictionary(lang);
  // Data fetching is now handled on the client in QuestionForm
  // to ensure user is authenticated and authorized to see this question.

  return (
    <AppLayout lang={lang} dictionary={dictionary.appLayout}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">{dictionary.editQuestion.title}</h1>
            <p className="text-muted-foreground">
                {dictionary.editQuestion.description}
            </p>
        </div>
        {/* Pass the questionId and dictionary to the client component form */}
        <QuestionForm questionId={id} dictionary={dictionary.question} />
      </div>
    </AppLayout>
  );
}
