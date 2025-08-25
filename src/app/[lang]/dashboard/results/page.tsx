"use client";

import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Loader from '@/components/loader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/i18n-config';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AppLayout from '@/components/app-layout';

interface ExamResult {
    id: string;
    examId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    date: Date;
    subjects: string[];
    difficulty: string;
    language: string;
}

interface Subject {
    id: string;
    name: string;
}

export default function ResultsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = React.use(params);
    const [user] = useAuthState(auth);
    const [results, setResults] = React.useState<ExamResult[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [dictionary, setDictionary] = React.useState<any>(null);
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = React.useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = React.useState('all');

    const router = useRouter();

    React.useEffect(() => {
        getDictionary(lang).then(setDictionary);
    }, [lang]);

    React.useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        if (!dictionary) return;

        const fetchSubjects = async () => {
            try {
                const subjectsCol = collection(db, 'users', user.uid, 'subjects');
                const subjectSnapshot = await getDocs(subjectsCol);
                const subjectsList = subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
                setSubjects(subjectsList);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchSubjects();

        const resultsColRef = collection(db, 'users', user.uid, 'results');
        const constraints: any[] = [];

        if (selectedSubject !== 'all') {
            constraints.push(where('subjects', 'array-contains', selectedSubject));
        }
        if (selectedDifficulty !== 'all') {
            constraints.push(where('difficulty', '==', selectedDifficulty));
        }

        // Only order on the server when no filters are applied to avoid composite index requirements
        if (constraints.length === 0) {
            constraints.push(orderBy('date', 'desc'));
        }

        const q = query(resultsColRef, ...constraints);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const resultsData: ExamResult[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    examId: data.examId,
                    score: data.score,
                    correctAnswers: data.correctAnswers,
                    totalQuestions: data.totalQuestions,
                    date: data.date.toDate(),
                    subjects: data.subjects,
                    difficulty: data.difficulty,
                    language: data.language,
                };
            });

            // If we applied filters, sort client-side by date desc to keep UX consistent
            if (constraints.length > 0 && !(constraints.length === 1 && constraints[0]?.type === 'orderBy')) {
                resultsData.sort((a, b) => b.date.getTime() - a.date.getTime());
            }

            setResults(resultsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching results:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, dictionary, selectedSubject, selectedDifficulty]);

    const handleViewDetails = (examId: string) => {
        router.push(`/${lang}/exams/${examId}?from=results`);
    };

    if (loading || !dictionary) {
        return <Loader />;
    }

    const t = dictionary.resultsPage;

    const totalExams = results.length;
    const avgScore = totalExams > 0 ? results.reduce((sum, r) => sum + r.score, 0) / totalExams : 0;
    const lastDate = results[0]?.date;

    return (
        <AppLayout lang={lang} dictionary={dictionary.appLayout}>
            <div className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">{t.title}</h1>
                    <p className="text-muted-foreground">
                        {t.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">{t.allResults}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-3xl font-bold">{totalExams}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">{t.tableScore}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-3xl font-bold">{avgScore.toFixed(0)}%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">{t.tableDate}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-xl font-semibold">{lastDate ? lastDate.toLocaleDateString(lang) : '—'}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t.allResults}</CardTitle>
                        <CardDescription>{t.allResultsDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-4 rtl:space-x-reverse mb-4">
                            <div className="w-[180px]">
                                <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.filterSubject} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t.allSubjects}</SelectItem>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.name}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-[180px]">
                                <Select onValueChange={setSelectedDifficulty} value={selectedDifficulty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.filterDifficulty} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t.allDifficulties}</SelectItem>
                                        <SelectItem value="easy">{dictionary.question.form.difficulties.easy}</SelectItem>
                                        <SelectItem value="medium">{dictionary.question.form.difficulties.medium}</SelectItem>
                                        <SelectItem value="hard">{dictionary.question.form.difficulties.hard}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {results.length === 0 ? (
                            <p className="text-center text-muted-foreground">{t.noResults}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t.tableDate}</TableHead>
                                        <TableHead>{t.tableSubjects}</TableHead>
                                        <TableHead>{t.tableDifficulty}</TableHead>
                                        <TableHead>{t.tableScore}</TableHead>
                                        <TableHead>{t.tableCorrectAnswers}</TableHead>
                                        <TableHead>{t.tableActions}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.map((result) => (
                                        <TableRow key={result.id}>
                                            <TableCell>{result.date.toLocaleDateString(lang)}</TableCell>
                                            <TableCell>
                                                {result.subjects.map((subject, index) => (
                                                    <Badge key={index} variant="secondary" className="mr-1 rtl:mr-0 rtl:ml-1 mb-1">{subject}</Badge>
                                                ))}
                                            </TableCell>
                                            <TableCell className="capitalize">{dictionary.question.form.difficulties[result.difficulty as 'easy' | 'medium' | 'hard'] ?? result.difficulty}</TableCell>
                                            <TableCell>{result.score.toFixed(0)}%</TableCell>
                                            <TableCell>{result.correctAnswers}/{result.totalQuestions}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(result.examId)}>
                                                    {t.viewDetails}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}