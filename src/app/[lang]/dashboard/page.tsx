// src\app\[lang]\dashboard\page.tsx

"use client";

import Loader from '@/components/loader';

import * as React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Shapes, FileCheck, ArrowRight } from 'lucide-react';
import { collection, query, where, getCountFromServer, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import type { Question } from '@/types';
import type { Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { i18n } from '@/i18n-config';


export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [user] = useAuthState(auth);
  const [stats, setStats] = React.useState<any[]>([]);
  const [recentQuestions, setRecentQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dictionary, setDictionary] = React.useState<any>(null);
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as Locale || i18n.defaultLocale;


  React.useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };
    if (!dictionary) return;

    const fetchStats = async () => {
        try {
            const questionsRef = collection(db, 'users', user.uid, 'questions');
            const subjectsRef = collection(db, 'users', user.uid, 'subjects');
            const examsRef = collection(db, 'users', user.uid, 'exams');

            const questionsSnap = await getCountFromServer(questionsRef);
            const subjectsSnap = await getCountFromServer(subjectsRef);
            const examsSnap = await getCountFromServer(query(examsRef, where('submitted', '==', true)));

            const t = dictionary.dashboard;
            setStats([
                { title: t.totalQuestions, value: String(questionsSnap.data().count), icon: BookOpen },
                { title: t.subjects, value: String(subjectsSnap.data().count), icon: Shapes },
                { title: t.examsCompleted, value: String(examsSnap.data().count), icon: FileCheck },
            ]);
        } catch (error) {
            console.error("Error fetching stats: ", error);
        } finally {
            setLoading(false);
        }
    }

    const q = query(collection(db, 'users', user.uid, 'questions'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const questionsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as any)?.toDate() ?? new Date()
            } as Question;
        });
        setRecentQuestions(questionsData);
    });

    fetchStats();
    return () => unsubscribe();
  }, [user, dictionary]);

  if (!dictionary) {
    return <Loader />
  }

  const t = dictionary.dashboard;

  return (
    <AppLayout lang={lang} dictionary={dictionary.appLayout}>
      <div className="space-y-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('overview')}
          >
            {t.overviewTab}
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'results' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => router.push(`/${lang}/dashboard/results`)}
          >
            {t.resultsTab}
          </button>
          
        </div>

        {activeTab === 'overview' && (
          <>
            <div>
              <h1 className="text-3xl font-bold font-headline">{t.welcome}</h1>
              <p className="text-muted-foreground">{t.snapshot}</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? <Loader /> : <div className="text-2xl font-bold">{stat.value}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>{t.recentQuestionsTitle}</CardTitle>
                  <CardDescription>{t.recentQuestionsDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.tableQuestion}</TableHead>
                        <TableHead>{t.tableSubject}</TableHead>
                        <TableHead className="text-right">{t.tableDifficulty}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24"><Loader /></TableCell>
                        </TableRow>
                      ) : recentQuestions.length > 0 ? (
                        recentQuestions.map((q) => (
                          <TableRow key={q.id}>
                            <TableCell className="font-medium truncate max-w-xs">{q.question}</TableCell>
                            <TableCell>{q.subject}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={q.difficulty === 'easy' ? 'secondary' : q.difficulty === 'medium' ? 'outline' : 'default'} className="capitalize">{dictionary.question.form.difficulties[q.difficulty]}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                         <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">{t.noRecentQuestions}</TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                    <Link href={`/${lang}/questions`}>{t.viewAllButton} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>{t.quickActionsTitle}</CardTitle>
                  <CardDescription>{t.quickActionsDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                  <Button size="lg" asChild>
                    <Link href={`/${lang}/questions/new`}>{t.addQuestionButton}</Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href={`/${lang}/exams/new`}>{t.generateExamButton}</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        

      </div>
    </AppLayout>
  );
}