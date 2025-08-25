// src\components\app-layout.tsx
"use client"

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  LayoutDashboard,
  BookOpen,
  FilePlus2,
  LogOut,
  User,
  Menu,
  BarChart2,
  Calendar,
  Files,
} from 'lucide-react';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from '@/hooks/use-toast';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import SettingsDrawer from './settings-drawer';
import { Loader2 } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import { NavigationLoader } from './navigation-loader';


interface AppLayoutProps {
  children: React.ReactNode;
  dictionary: any;
  lang: Locale;
}

export default function AppLayout({ children, dictionary, lang }: AppLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = React.useState('');

  React.useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Initial path
    updatePath();
    
    // Listen for route changes
    window.addEventListener('popstate', updatePath);

    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);
  
  const navItems = dictionary ? [
    { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: dictionary.dashboard },
    { href: `/${lang}/questions`, icon: BookOpen, label: dictionary.questions },
    { href: `/${lang}/exams/new`, icon: FilePlus2, label: dictionary.newExam },
    { href: `/${lang}/dashboard/results`, icon: BarChart2, label: dictionary.resultsTab },
    { href: `/${lang}/dashboard/studyTimeTable`, icon: Calendar, label: dictionary.timetable },
    { href: `/${lang}/dashboard/storage`, icon: Files, label: dictionary?.storage?.title ?? 'Storage' },
  ] : [];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully.' });
      router.push(`/${lang}/login`);
    } catch (error: any) {
      toast({ title: 'Error logging out', description: error.message, variant: 'destructive' });
    }
  };

  const NavContent = () => (
     <nav className="grid items-start px-4 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              currentPath === item.href || (item.href !== `/${lang}/dashboard` && currentPath.startsWith(item.href))
                ? 'bg-muted text-primary'
                : ''
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
    </nav>
  )

  if (!dictionary) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-secondary/50">
      <NavigationLoader />
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex rtl:right-0 rtl:left-auto rtl:border-r-0 rtl:border-l">
        <div className="flex h-16 items-center border-b px-6">
          <Logo lang={lang} />
        </div>
        <NavContent />
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72 rtl:sm:pr-72 rtl:sm:pl-0 w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs rtl:left-auto rtl:right-0">
              <div className="flex h-16 items-center border-b px-6 mb-4">
                <Logo lang={lang} />
              </div>
              <NavContent />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />
          
          <SettingsDrawer dictionary={dictionary?.settings || {}} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={auth.currentUser?.photoURL ?? 'https://placehold.co/100x100'} alt="User" />
                        <AvatarFallback>{auth.currentUser?.displayName?.charAt(0) ?? 'QW'}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{dictionary.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href={`/${lang}/profile`} className="flex items-center"><User className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /><span>{dictionary.profile}</span></Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center">
                <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                <span>{dictionary.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6 sm:pt-0">{children}</main>
      </div>
    </div>
  );
}
