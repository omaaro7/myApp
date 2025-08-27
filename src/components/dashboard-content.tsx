"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import { BarChart, BookOpen, CheckCircle, PlusCircle, Star, TrendingUp, Zap } from 'lucide-react';
import { StudyTimetable } from '@/components/study-timetable';

export const DashboardContent = ({ dictionary }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(65); // Example progress
  const lang = useParams().lang;

  const handleNavigation = (path) => {
    router.push(`/${lang}${path}`);
  };

  // Example of how you might use searchParams
  useEffect(() => {
    const newProgress = searchParams.get('progress');
    if (newProgress) {
      setProgress(parseInt(newProgress, 10));
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{dictionary.dashboard.title}</h1>
        <Button onClick={() => handleNavigation('/exams/new')}>
          <PlusCircle className="mr-2 h-4 w-4" /> {dictionary.dashboard.newExam}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.dashboard.overallProgress}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <p className="text-xs text-muted-foreground">{dictionary.dashboard.progressDescription}</p>
            <Progress value={progress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.dashboard.activeCourses}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{dictionary.dashboard.coursesInProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{dictionary.dashboard.completedExams}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">{dictionary.dashboard.examsFinished}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.dashboard.studyActivity}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart */}
            <div className="h-64 bg-muted flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.dashboard.quickActions}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleNavigation('/questions/new')}>
              <PlusCircle className="mr-2 h-4 w-4" /> {dictionary.dashboard.addQuestion}
            </Button>
            <Button variant="outline" onClick={() => handleNavigation('/exams')}>
              <BookOpen className="mr-2 h-4 w-4" /> {dictionary.dashboard.viewExams}
            </Button>
            <Button variant="outline" onClick={() => handleNavigation('/profile')}>
              <Star className="mr-2 h-4 w-4" /> {dictionary.dashboard.updateProfile}
            </Button>
            <Button variant="outline" onClick={() => handleNavigation('/practice')}>
              <Zap className="mr-2 h-4 w-4" /> {dictionary.dashboard.startPractice}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <StudyTimetable dictionary={dictionary.dashboard} />
    </div>
  );
};
