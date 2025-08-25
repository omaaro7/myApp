
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import * as React from "react";

import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import type { Subject, Question } from "@/types";
import { Loader2 } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import { i18n } from "@/i18n-config";


const examFormSchema = z.object({
  subjects: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one subject.",
  }),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(50, "Cannot generate more than 50 questions."),
  difficulty: z.string().optional(),
  language: z.string().optional(),
});


export default function NewExamPage() {
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split('/')[1] as Locale || i18n.defaultLocale;

    const { toast } = useToast();
    const [user] = useAuthState(auth);
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [dictionary, setDictionary] = React.useState<any>(null);
    
    React.useEffect(() => {
        getDictionary(lang).then(setDictionary);
    }, [lang]);

    React.useEffect(() => {
        if (!user) return;

        const fetchSubjects = async () => {
            try {
                const subjectsCol = collection(db, 'users', user.uid, 'subjects');
                const subjectSnapshot = await getDocs(subjectsCol);
                const subjectsList = subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
                setSubjects(subjectsList);
            } catch (error) {
                console.error("Error fetching subjects:", error);
                toast({ title: "Error", description: "Could not fetch subjects.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [user, toast]);

    const form = useForm<z.infer<typeof examFormSchema>>({
        resolver: zodResolver(examFormSchema),
        defaultValues: {
            subjects: [],
            numQuestions: 10,
            difficulty: 'any',
            language: 'any',
        },
    });

    async function onSubmit(values: z.infer<typeof examFormSchema>) {
        if (!user) return;

        setIsSubmitting(true);
        toast({
            title: "Generating Exam...",
            description: "Your custom exam is being prepared.",
        });

        try {
            const questionsRef = collection(db, 'users', user.uid, 'questions');
            const queryConstraints = [where('subject', 'in', values.subjects)];
            
            if (values.difficulty && values.difficulty !== 'any') {
                queryConstraints.push(where('difficulty', '==', values.difficulty));
            }
            if (values.language && values.language !== 'any') {
                queryConstraints.push(where('language', '==', values.language));
            }

            const q = query(questionsRef, ...queryConstraints);
            
            const querySnapshot = await getDocs(q);
            let examQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));

            if (examQuestions.length < values.numQuestions) {
                 toast({
                    title: "Not Enough Questions",
                    description: `Only found ${examQuestions.length} questions matching your criteria. Please add more questions or broaden your search.`,
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            // Manually shuffle and limit questions as Firestore doesn't support random ordering
            examQuestions.sort(() => Math.random() - 0.5);
            examQuestions = examQuestions.slice(0, values.numQuestions);

            // Create the exam document
            const examsCol = collection(db, 'users', user.uid, 'exams');
            const newExamDoc = await addDoc(examsCol, {
                uid: user.uid,
                questions: examQuestions.map(({ uid, ...q }) => q), // Remove uid from questions in exam
                createdAt: serverTimestamp(),
                submitted: false,
                score: 0,
                userAnswers: {},
                config: values,
            });

            router.push(`/${lang}/exams/${newExamDoc.id}`);

        } catch (error) {
            console.error("Error generating exam:", error);
            toast({
                title: "Error",
                description: "Failed to generate the exam. Please try again.",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    }

    if (loading || !dictionary) {
        return <AppLayout lang={lang} dictionary={null}><div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></AppLayout>;
    }

    return (
        <AppLayout lang={lang} dictionary={dictionary.appLayout}>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">Generate New Exam</h1>
                    <p className="text-muted-foreground">
                        Create a custom practice exam tailored to your needs.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Configuration</CardTitle>
                        <CardDescription>Select your preferences for the exam.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="subjects"
                                    render={() => (
                                        <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Subjects</FormLabel>
                                            <FormDescription>
                                            Select the subjects to include in the exam.
                                            </FormDescription>
                                        </div>
                                        {subjects.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {subjects.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="subjects"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.name)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), item.name])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value) => value !== item.name
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        {item.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                        </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No subjects found. Add questions to create subjects.</p>
                                        )}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="numQuestions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number of Questions</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="difficulty"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Difficulty (Optional)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Any Difficulty" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="any">Any Difficulty</SelectItem>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Language (Optional)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Any Language" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="any">Any Language</SelectItem>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="ar">Arabic</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Exam
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
