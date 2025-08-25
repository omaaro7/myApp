
"use client"

import * as React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import type { Question, Subject } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useToast } from '@/hooks/use-toast';
import type { Locale } from '@/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { usePathname } from 'next/navigation';
import { i18n } from '@/i18n-config';


export default function QuestionsPage() {
    const [user] = useAuthState(auth);
    const { toast } = useToast();
    const [questions, setQuestions] = React.useState<Question[]>([]);
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
    const [difficultyFilter, setDifficultyFilter] = React.useState<string>("all");
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [dictionary, setDictionary] = React.useState<any>(null);
    const [questionToDelete, setQuestionToDelete] = React.useState<string | null>(null);

    const pathname = usePathname();
    const lang = pathname.split('/')[1] as Locale || i18n.defaultLocale;

    React.useEffect(() => {
        getDictionary(lang).then(setDictionary);
    }, [lang]);

    React.useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const questionsQuery = query(collection(db, 'users', user.uid, 'questions'));
        const unsubscribeQuestions = onSnapshot(questionsQuery, (querySnapshot) => {
            const questionsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: (data.createdAt as any)?.toDate() ?? new Date()
                } as Question;
            });
            setQuestions(questionsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching questions:", error);
            if (dictionary) {
                toast({ title: dictionary.questionsPage.error, description: dictionary.questionsPage.errorFetch, variant: "destructive" });
            }
            setLoading(false);
        });

        const subjectsQuery = query(collection(db, 'users', user.uid, 'subjects'));
        const unsubscribeSubjects = onSnapshot(subjectsQuery, (querySnapshot) => {
            const subjectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
            setSubjects(subjectsData);
        }, (error) => {
            console.error("Error fetching subjects:", error);
             if (dictionary) {
                toast({ title: dictionary.questionsPage.error, description: dictionary.questionsPage.errorSubjects, variant: "destructive" });
            }
        });
        
        return () => {
            unsubscribeQuestions();
            unsubscribeSubjects();
        };

    }, [user, toast, dictionary]);

    const deleteQuestion = async () => {
        if (!user || !questionToDelete) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'questions', questionToDelete));
            if (dictionary) {
                toast({ title: dictionary.questionsPage.deleteSuccess, description: dictionary.questionsPage.deleteSuccessDesc });
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            if (dictionary) {
                toast({ title: dictionary.questionsPage.error, description: dictionary.questionsPage.deleteError, variant: "destructive" });
            }
        } finally {
            setQuestionToDelete(null);
        }
    };

    const filteredQuestions = React.useMemo(() => {
        return questions
            .filter(q => subjectFilter === 'all' || q.subject === subjectFilter)
            .filter(q => difficultyFilter === 'all' || q.difficulty === difficultyFilter)
            .filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [questions, subjectFilter, difficultyFilter, searchTerm]);

    if (!dictionary) {
        return <AppLayout lang={lang} dictionary={null}><div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div></AppLayout>;
    }
    
    const t = dictionary.questionsPage;
    const difficulties = dictionary.question.form.difficulties;

    return (
        <AppLayout lang={lang} dictionary={dictionary.appLayout}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{t.title}</h1>
                        <p className="text-muted-foreground">{t.description}</p>
                    </div>
                    <Button asChild>
                        <Link href={`/${lang}/questions/new`}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t.addNew}
                        </Link>
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>{t.allQuestions}</CardTitle>
                        <CardDescription>{t.browse}</CardDescription>
                         <div className="mt-4 flex flex-col md:flex-row gap-4">
                            <Input 
                                placeholder={t.searchPlaceholder}
                                className="max-w-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder={t.filterSubject} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t.allSubjects}</SelectItem>
                                    {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder={t.filterDifficulty} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t.allDifficulties}</SelectItem>
                                    <SelectItem value="easy">{difficulties.easy}</SelectItem>
                                    <SelectItem value="medium">{difficulties.medium}</SelectItem>
                                    <SelectItem value="hard">{difficulties.hard}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                        <AlertDialog>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t.table.question}</TableHead>
                                        <TableHead>{t.table.subject}</TableHead>
                                        <TableHead>{t.table.difficulty}</TableHead>
                                        <TableHead>{t.table.language}</TableHead>
                                        <TableHead><span className="sr-only">{t.table.actions}</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredQuestions.length > 0 ? (
                                        filteredQuestions.map((q) => (
                                            <TableRow key={q.id}>
                                                <TableCell className="font-medium max-w-md truncate">{q.question}</TableCell>
                                                <TableCell>{q.subject}</TableCell>
                                                <TableCell><Badge variant="outline" className="capitalize">{difficulties[q.difficulty]}</Badge></TableCell>
                                                <TableCell><Badge variant="secondary">{(q.language || 'en').toUpperCase()}</Badge></TableCell>
                                                <TableCell>
                                                    
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild><Link href={`/${lang}/questions/${q.id}/edit`}>{t.actions.edit}</Link></DropdownMenuItem>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem onSelect={() => setQuestionToDelete(q.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">{t.actions.delete}</DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">{t.noQuestions}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t.deleteDialog.title}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t.deleteDialog.description}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setQuestionToDelete(null)}>{t.deleteDialog.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteQuestion}>{t.deleteDialog.delete}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
