
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


export default function ThemeSwitcher({ dictionary }: { dictionary: any }) {
  const { theme, setTheme } = useTheme()

  return (
    <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
        <Label className={cn("flex w-full items-center gap-2 cursor-pointer rounded-md p-2 border-2", theme === "light" && "border-primary")}>
            <RadioGroupItem value="light" id="light" className="sr-only"/>
            <Sun className="h-5 w-5" />
            <span>{dictionary.light}</span>
        </Label>
        <Label className={cn("flex w-full items-center gap-2 cursor-pointer rounded-md p-2 border-2", theme === "dark" && "border-primary")}>
                <RadioGroupItem value="dark" id="dark" className="sr-only"/>
            <Moon className="h-5 w-5" />
            <span>{dictionary.dark}</span>
        </Label>
         <Label className={cn("flex w-full items-center gap-2 cursor-pointer rounded-md p-2 border-2", theme === "system" && "border-primary")}>
                <RadioGroupItem value="system" id="system" className="sr-only"/>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 2a7 7 0 1 0 10 10"/><path d="M12 22V12"/></svg>
            <span>{dictionary.system}</span>
        </Label>
    </RadioGroup>
  )
}
