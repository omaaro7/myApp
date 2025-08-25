
"use client"

import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as React from "react"
import { useTheme } from "next-themes"
import { Palette, Check, Settings, Loader2 } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import ThemeSwitcher from "./theme-switcher"
import { i18n } from "@/i18n-config"

const themes = [
    { name: 'Default', primary: '210 75% 60%', accent: '180 60% 40%' },
    { name: 'Rose', primary: '346.8 77.2% 49.8%', accent: '346.8 77.2% 39.8%' },
    { name: 'Green', primary: '142.1 76.2% 36.3%', accent: '142.1 76.2% 26.3%' },
    { name: 'Orange', primary: '24.6 95% 53.1%', accent: '24.6 95% 43.1%' },
]

const PALETTE_STORAGE_KEY = 'quizwise-color-palette';

export default function SettingsDrawer({ children, dictionary }: { children?: React.ReactNode, dictionary: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (i18n.locales.includes(segments[0] as any)) {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }
    
    const newPath = `/${segments.join('/')}`;
    // Use window.location to force a full reload and fetch the new dictionary
    window.location.href = newPath;
  }

  const [activeTheme, setActiveTheme] = React.useState('Default');

  const applyTheme = React.useCallback((themeName: string) => {
      const theme = themes.find(t => t.name === themeName);
      if (theme) {
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--ring', theme.primary);
        document.documentElement.style.setProperty('--accent', theme.accent);
        localStorage.setItem(PALETTE_STORAGE_KEY, themeName);
        setActiveTheme(themeName);
      }
  }, []);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme('Default');
    }
  }, [applyTheme]);
  
  const segments = pathname.split('/').filter(Boolean);
  const currentLang = i18n.locales.includes(segments[0] as any) ? segments[0] : i18n.defaultLocale;

  if (!dictionary) {
    return (
        <Button variant="ghost" size="icon" disabled>
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">{dictionary.title}</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{dictionary.title}</SheetTitle>
          <VisuallyHidden>
            <DialogTitle>Settings</DialogTitle>
          </VisuallyHidden>
        </SheetHeader>
        <div className="py-6 space-y-8">
            <div className="space-y-4">
                <Label className="text-base font-semibold">{dictionary.language}</Label>
                <div className="flex gap-2">
                    <Button variant={currentLang === 'en' ? "default" : "outline"} onClick={() => handleLanguageChange('en')}>English</Button>
                    <Button variant={currentLang === 'ar' ? "default" : "outline"} onClick={() => handleLanguageChange('ar')}>العربية</Button>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-base font-semibold">{dictionary.appearance}</Label>
                 <ThemeSwitcher dictionary={dictionary}/>
            </div>
            
            <div className="space-y-4">
                 <Label className="text-base font-semibold flex items-center gap-2"><Palette /> {dictionary.colorPalette}</Label>
                 <div className="grid grid-cols-2 gap-4">
                    {themes.map(t => (
                        <Button 
                            key={t.name}
                            variant="outline"
                            className="h-16 flex flex-col justify-center items-center gap-2"
                            onClick={() => applyTheme(t.name)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: `hsl(${t.primary})`}} />
                                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: `hsl(${t.accent})`}} />
                            </div>
                            <div className="flex items-center text-sm">
                                {activeTheme === t.name && <Check className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />}
                                <span>{t.name}</span>
                            </div>
                        </Button>
                    ))}
                 </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
