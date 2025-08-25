"use client";

import * as React from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Question, Exam } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, ChevronDown, Download, Loader2 } from 'lucide-react';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n-config';


export default function ExamPage() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const lang = pathname.split('/')[1] as Locale || i18n.defaultLocale;
    
    const fromResults = searchParams.get('from') === 'results';

    const [user] = useAuthState(auth);
    const [exam, setExam] = React.useState<Exam | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [userAnswers, setUserAnswers] = React.useState<Record<string, number>>({});
    const [dictionary, setDictionary] = React.useState<any>(null);
    
    React.useEffect(() => {
        getDictionary(lang).then(setDictionary);
    }, [lang]);

    React.useEffect(() => {
        if (!user || !id) return;

        const fetchExam = async () => {
            try {
                const examDocRef = doc(db, 'users', user.uid, 'exams', id);
                const examDocSnap = await getDoc(examDocRef);

                if (examDocSnap.exists()) {
                    const examData = { id: examDocSnap.id, ...examDocSnap.data() } as Exam;
                    // Firestore timestamps need to be converted to JS Date objects
                    examData.createdAt = (examData.createdAt as any).toDate();
                    examData.questions.forEach(q => {
                      q.createdAt = (q.createdAt as any)?.toDate() ?? new Date();
                    })
                    setExam(examData);
                    setUserAnswers(examData.userAnswers || {});
                } else {
                    console.error("No such exam!");
                    router.push(`/${lang}/dashboard`);
                }
            } catch (error) {
                console.error("Error fetching exam:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [user, id, router, lang]);

    const handleAnswerChange = (questionId: string, choiceIndex: number) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: choiceIndex }));
    };

    const handleSubmit = async () => {
        if (!exam || !user) return;

        let correctAnswers = 0;
        exam.questions.forEach(q => {
            if (userAnswers[q.id] === q.correctIndex) {
                correctAnswers++;
            }
        });
        const finalScore = (correctAnswers / exam.questions.length) * 100;

        try {
            const examDocRef = doc(db, 'users', user.uid, 'exams', exam.id);
            await updateDoc(examDocRef, {
                userAnswers,
                score: finalScore,
                submitted: true,
            });
            setExam(prev => prev ? { ...prev, userAnswers, score: finalScore, submitted: true } : null);

            // Store exam results in a separate collection
            const resultsColRef = collection(db, 'users', user.uid, 'results');
            await addDoc(resultsColRef, {
                examId: exam.id,
                score: finalScore,
                correctAnswers: correctAnswers,
                totalQuestions: exam.questions.length,
                date: new Date(), // Use serverTimestamp() if you want Firestore to handle it
                subjects: exam.config.subjects,
                difficulty: exam.config.difficulty || 'any',
                language: exam.config.language || 'any',
            });
        } catch (error) {
            console.error("Error submitting exam:", error);
        }
    };

    const getChoiceStyling = (question: Question, choiceIndex: number) => {
        if (!exam?.submitted) return "";
        if (choiceIndex === question.correctIndex) return "bg-green-100 dark:bg-green-900/50 border-green-500";
        if (choiceIndex === userAnswers[question.id] && choiceIndex !== question.correctIndex) return "bg-red-100 dark:bg-red-900/50 border-red-500";
        return "border-border";
    }

    const resultsRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async (option: 'blank' | 'solved' | 'explained') => {
        const element = resultsRef.current;
        if (!element) return;

        // Temporarily modify the DOM for PDF generation
        const getClonedElement = () => {
            const clonedElement = element.cloneNode(true) as HTMLDivElement;

            // Hide elements not needed for the specific PDF type
            if (option === 'blank') {
                clonedElement.querySelectorAll('.user-answer-indicator').forEach(el => (el as HTMLElement).style.display = 'none');
                clonedElement.querySelectorAll('.explanation').forEach(el => (el as HTMLElement).style.display = 'none');
                clonedElement.querySelectorAll('.correct-answer-indicator').forEach(el => (el as HTMLElement).style.display = 'none');
            }

            if (option === 'solved') {
                clonedElement.querySelectorAll('.explanation').forEach(el => (el as HTMLElement).style.display = 'none');
            }

            // Style for PDF
            clonedElement.style.width = '1024px';
            clonedElement.style.padding = '2rem';
            document.body.appendChild(clonedElement);
            return clonedElement;
        }

        const clonedElement = getClonedElement();

        const canvas = await html2canvas(clonedElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: true,
            onclone: (document) => {
                // Ensure fonts and styles are loaded
            }
        });

        document.body.removeChild(clonedElement);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`exam-results-${option}.pdf`);
    };

    if (loading || !dictionary) {
        return <AppLayout lang={lang} dictionary={null}><div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></AppLayout>;
    }

    if (!exam) {
        return <AppLayout lang={lang} dictionary={dictionary.appLayout}><p>Exam not found.</p></AppLayout>;
    }

    if (exam.submitted) {
        return (
             <AppLayout lang={lang} dictionary={dictionary.appLayout}>
                <div ref={resultsRef} className="max-w-4xl mx-auto space-y-8">
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Exam Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">You scored</p>
                            <p className="text-6xl font-bold text-primary my-4">{exam.score.toFixed(0)}%</p>
                            <Progress value={exam.score} className="w-full" />
                            <div className="mt-6 flex justify-center gap-2">
                                {fromResults ? (
                                    <Button onClick={() => router.push(`/${lang}/dashboard/results`)}>
                                        Back to Results
                                    </Button>
                                ) : (
                                    <Button onClick={() => router.push(`/${lang}/exams/new`)}>
                                        Take Another Exam
                                    </Button>
                                )}
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export to PDF
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleDownload('blank')}>Blank Exam</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownload('solved')}>Solved (with your answers)</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownload('explained')}>Solved (with explanations)</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-2xl font-bold font-headline">Review Your Answers</h2>

                    {exam.questions.map((question, index) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <CardTitle className="flex items-start gap-4">
                                    <span>{index + 1}. {question.question}</span>
                                     {userAnswers[question.id] === question.correctIndex ? (
                                        <CheckCircle className="h-6 w-6 text-green-500 shrink-0 correct-answer-indicator" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-500 shrink-0 correct-answer-indicator" />
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {question.choices.map((choice, choiceIndex) => (
                                        <div key={choiceIndex} className={cn("p-3 rounded-md border-2 user-answer-indicator", getChoiceStyling(question, choiceIndex))}>
                                            <p>{String.fromCharCode(65 + choiceIndex)}. {choice}</p>
                                        </div>
                                    ))}
                                </div>
                                {question.explanation && (
                                    <div className="p-4 bg-secondary rounded-md explanation">
                                        <p><span className="font-bold">Explanation:</span> {question.explanation}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout lang={lang} dictionary={dictionary.appLayout}>
            <div className="max-w-3xl mx-auto space-y-6">
                 <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">Practice Exam</h1>
                    <p className="text-muted-foreground">
                        Test your knowledge. Good luck!
                    </p>
                </div>
                {exam.questions.map((question, index) => (
                    <Card key={question.id}>
                        <CardHeader>
                            <CardTitle>{index + 1}. {question.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}>
                                {question.choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="flex items-center space-x-2">
                                        <RadioGroupItem value={String(choiceIndex)} id={`${question.id}-${choiceIndex}`} />
                                        <Label htmlFor={`${question.id}-${choiceIndex}`} className="flex-1 cursor-pointer py-2">{choice}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
                 <Button size="lg" className="w-full" onClick={handleSubmit}>Submit Exam</Button>
            </div>
        </AppLayout>
    );
}