// src\components\storage\file-filters.tsx
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Star } from 'lucide-react';
import { format } from 'date-fns';

interface FileFiltersProps {
  subjects: string[];
  onFilterChange: (filters: {
    search: string;
    subject: string;
    type: string;
    date: Date | undefined;
    isImportant: boolean;
  }) => void;
}

export function FileFilters({ subjects, onFilterChange }: FileFiltersProps) {
  const [search, setSearch] = React.useState('');
  const [subject, setSubject] = React.useState('all');
  const [type, setType] = React.useState('all');
  const [date, setDate] = React.useState<Date>();
  const [isImportant, setIsImportant] = React.useState(false);

  const handleChange = React.useCallback((updates: Partial<{
    search: string;
    subject: string;
    type: string;
    date: Date | undefined;
    isImportant: boolean;
  }>) => {
    const newFilters = {
      search,
      subject,
      type,
      date,
      isImportant,
      ...updates
    };
    onFilterChange(newFilters);
  }, [search, subject, type, date, isImportant, onFilterChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleChange({ search: e.target.value });
          }}
        />
        
        <Select value={subject} onValueChange={(value) => {
          setSubject(value);
          handleChange({ subject: value });
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={(value) => {
          setType(value);
          handleChange({ type: value });
        }}>
          <SelectTrigger>
            <SelectValue placeholder="File type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image/*">Images</SelectItem>
            <SelectItem value="video/*">Videos</SelectItem>
            <SelectItem value="audio/*">Audio</SelectItem>
            <SelectItem value="application/pdf">PDF Documents</SelectItem>
            <SelectItem value="other">Other Files</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                handleChange({ date });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        variant={isImportant ? "secondary" : "outline"}
        className="gap-2"
        onClick={() => {
          setIsImportant(!isImportant);
          handleChange({ isImportant: !isImportant });
        }}
      >
        <Star className={cn("h-4 w-4", isImportant && "fill-current")} />
        Important Files Only
      </Button>
    </div>
  );
}
