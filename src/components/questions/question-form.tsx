
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import { useRouter, usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Question, Subject } from "@/types";
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader2 } from "lucide-react";
import { i18n } from "@/i18n-config";


const formSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  newSubject: z.string().optional(),
  language: z.enum(["en", "ar"], { required_error: "Language is required." }),
  difficulty: z.enum(["easy", "medium", "hard"], { required_error: "Difficulty is required." }),
  question: z.string().min(10, "Question must be at least 10 characters."),
  choices: z.tuple([
    z.string().min(1, "Choice A is required."),
    z.string().min(1, "Choice B is required."),
    z.string().min(1, "Choice C is required."),
    z.string().min(1, "Choice D is required."),
  ]),
  correctIndex: z.coerce.number().min(0).max(3),
  explanation: z.string().optional(),
  tags: z.string().optional(),
}).refine(data => {
    if (data.subject === 'new' && (!data.newSubject || data.newSubject.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "New subject name is required.",
    path: ['newSubject']
});

interface QuestionFormProps {
    questionId?: string;
    dictionary: any;
}

export default function QuestionForm({ questionId, dictionary }: QuestionFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [user, authLoading] = useAuthState(auth);
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const segments = pathname.split('/').filter(Boolean);
    const lang = i18n.locales.includes(segments[0] as any) ? segments[0] : i18n.defaultLocale;
    
     React.useEffect(() => {
        if (!user) {
            if (!authLoading) setLoading(false);
            return;
        };

        const subjectsQuery = query(collection(db, 'users', user.uid, 'subjects'));
        const unsubscribe = onSnapshot(subjectsQuery, (querySnapshot) => {
            const subjectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
            setSubjects(subjectsData);
        }, (error) => {
            console.error("Error fetching subjects:", error);
            if (error.code !== 'permission-denied') {
              toast({ title: "Error", description: "Could not fetch subjects in real-time.", variant: "destructive" });
            }
        });

        return () => unsubscribe();
    }, [user, authLoading, toast]);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            newSubject: "",
            language: "en",
            difficulty: "easy",
            question: "",
            choices: ["", "", "", ""],
            correctIndex: 0,
            explanation: "",
            tags: "",
        },
    });

     React.useEffect(() => {
        const fetchQuestion = async () => {
            if (authLoading) return; // Wait until auth state is confirmed

            if (user && questionId) {
                 setLoading(true);
                 try {
                    const questionDocRef = doc(db, 'users', user.uid, 'questions', questionId);
                    const docSnap = await getDoc(questionDocRef);
                    if (docSnap.exists()) {
                        const fetchedQuestion = { id: docSnap.id, ...docSnap.data() } as Question;
                        fetchedQuestion.createdAt = (fetchedQuestion.createdAt as any).toDate();
                        // Once question is fetched, reset the form with its data
                        form.reset({
                            subject: fetchedQuestion.subject || "",
                            newSubject: "",
                            language: fetchedQuestion.language || "en",
                            difficulty: fetchedQuestion.difficulty || "easy",
                            question: fetchedQuestion.question || "",
                            choices: fetchedQuestion.choices || ["", "", "", ""],
                            correctIndex: fetchedQuestion.correctIndex ?? 0,
                            explanation: fetchedQuestion.explanation || "",
                            tags: fetchedQuestion.tags?.join(", ") || "",
                        });
                    } else {
                         toast({ title: "Error", description: "Question not found.", variant: "destructive" });
                         router.push(`/${lang}/questions`);
                    }
                } catch (e) {
                     toast({ title: "Error", description: "Failed to fetch question data.", variant: "destructive" });
                     console.error(e)
                } finally {
                    setLoading(false);
                }
            } else if (!questionId) {
                // If it's a new question form, no need to fetch, just stop loading.
                setLoading(false);
            } else if (!user && !authLoading) {
                 // If not logged in and auth is checked, stop loading and maybe redirect or show message.
                setLoading(false);
                toast({ title: "Unauthorized", description: "Please log in to edit a question.", variant: "destructive" });
                router.push(`/${lang}/login`);
            }
        };

        if (!authLoading) {
            fetchQuestion();
        }
    }, [user, authLoading, questionId, router, toast, form, lang]);

    const selectedSubject = form.watch("subject");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        let finalSubjectName = values.subject;
        
        try {
            // Handle new subject creation
            if (values.subject === 'new') {
                if (!values.newSubject || values.newSubject.trim() === '') {
                     form.setError('newSubject', { type: 'manual', message: 'New subject name is required.'});
                     setIsSubmitting(false);
                     return;
                }
                finalSubjectName = values.newSubject.trim();
                const subjectsRef = collection(db, 'users', user.uid, 'subjects');
                const q = query(subjectsRef, where("name", "==", finalSubjectName));
                const existingSubject = await getDocs(q);

                if (existingSubject.empty) {
                    await addDoc(subjectsRef, { name: finalSubjectName });
                }
            }

            const questionData = {
                uid: user.uid,
                question: values.question,
                choices: values.choices,
                correctIndex: values.correctIndex,
                explanation: values.explanation || "",
                subject: finalSubjectName,
                difficulty: values.difficulty,
                language: values.language,
                tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            };

            if (questionId) {
                // Update existing question
                const questionRef = doc(db, 'users', user.uid, 'questions', questionId);
                await updateDoc(questionRef, {
                    ...questionData,
                    updatedAt: serverTimestamp()
                });
                toast({ title: "Question Updated!", description: "Your question has been updated successfully." });
            } else {
                 // Add new question
                const questionsRef = collection(db, 'users', user.uid, 'questions');
                await addDoc(questionsRef, {
                    ...questionData,
                    createdAt: serverTimestamp(),
                });
                toast({ title: "Question Created!", description: "Your question has been saved successfully." });
            }
            form.reset({ ...form.getValues(), newSubject: '' });
            router.push(`/${lang}/questions`);
            router.refresh(); 
        } catch (error) {
            console.error("Error saving question: ", error);
            toast({ title: "Error", description: "There was a problem saving your question.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading || authLoading || !dictionary) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const t = dictionary.form;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.details.title}</CardTitle>
                        <CardDescription>{t.details.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.details.subjectLabel}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder={t.details.subjectPlaceholder} /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                        <SelectItem value="new">{t.details.newSubjectOption}</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             {selectedSubject === 'new' && (
                                <FormField
                                    control={form.control}
                                    name="newSubject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.details.newSubjectLabel}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t.details.newSubjectPlaceholder} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.details.languageLabel}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder={t.details.languagePlaceholder} /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="ar">Arabic</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.details.difficultyLabel}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder={t.details.difficultyPlaceholder} /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="easy">{t.difficulties.easy}</SelectItem>
                                        <SelectItem value="medium">{t.difficulties.medium}</SelectItem>
                                        <SelectItem value="hard">{t.difficulties.hard}</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>{t.content.title}</CardTitle>
                        <CardDescription>{t.content.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t.content.questionLabel}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t.content.questionPlaceholder} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="correctIndex"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>{t.content.choicesLabel}</FormLabel>
                                <FormDescription>{t.content.choicesDescription}</FormDescription>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={(value) => field.onChange(parseInt(value, 10))}
                                    value={String(field.value)}
                                    className="space-y-2"
                                    >
                                    {[0, 1, 2, 3].map((index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={`choices.${index}` as any}
                                            render={({ field: choiceField }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={String(index)} />
                                                    </FormControl>
                                                    <FormControl>
                                                        <Input placeholder={`${t.content.choicePlaceholder} ${String.fromCharCode(65 + index)}`} {...choiceField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>{t.optional.title}</CardTitle>
                        <CardDescription>{t.optional.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="explanation"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t.optional.explanationLabel}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t.optional.explanationPlaceholder} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t.optional.tagsLabel}</FormLabel>
                                 <FormControl>
                                    <Input placeholder={t.optional.tagsPlaceholder} {...field} />
                                </FormControl>
                                <FormDescription>{t.optional.tagsDescription}</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>{t.cancelButton}</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {questionId ? t.updateButton : t.saveButton}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
