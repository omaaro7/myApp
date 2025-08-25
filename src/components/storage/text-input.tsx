'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Bold, Italic, List, Calendar, BookOpen, Lightbulb } from 'lucide-react';

interface TextInputProps {
  onSave: (blob: Blob, fileName: string) => Promise<void>;
  disabled?: boolean;
}

type TemplateType = 'notes' | 'todo' | 'meeting' | 'ideas' | 'custom';

const templates = {
  notes: `# Notes

## Key Points
- 
- 
- 

## Summary
`,
  todo: `# To-Do List

## High Priority
- [ ] 
- [ ] 
- [ ] 

## Medium Priority
- [ ] 
- [ ] 

## Low Priority
- [ ] 
`,
  meeting: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:** ${new Date().toLocaleTimeString()}
**Attendees:** 

## Agenda
1. 
2. 
3. 

## Discussion Points
- 
- 
- 

## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Meeting
`,
  ideas: `# Ideas & Brainstorming

## New Ideas
- 💡 
- 💡 
- 💡 

## To Research
- 🔍 
- 🔍 

## Implementation Plan
1. 
2. 
3. 
`,
  custom: ''
};

export function TextInput({ onSave, disabled }: TextInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [textContent, setTextContent] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType>('notes');
  const [wordCount, setWordCount] = React.useState(0);
  const [charCount, setCharCount] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    const words = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(textContent.length);
  }, [textContent]);

  const handleSave = async () => {
    if (!textContent.trim()) {
      toast({ title: 'Error', description: 'Please enter some text', variant: 'destructive' });
      return;
    }

    if (!fileName.trim()) {
      toast({ title: 'Error', description: 'Please enter a file name', variant: 'destructive' });
      return;
    }

    try {
      const blob = new Blob([textContent], { type: 'text/plain' });
      const finalFileName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
      await onSave(blob, finalFileName);
      setIsOpen(false);
      setTextContent('');
      setFileName('');
      setSelectedTemplate('notes');
      toast({ title: 'Success', description: 'Text file saved successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const applyTemplate = (templateType: TemplateType) => {
    setSelectedTemplate(templateType);
    if (templateType !== 'custom') {
      setTextContent(templates[templateType]);
    }
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textContent.substring(start, end);

    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `**${selectedText}**`;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        break;
      case 'list':
        replacement = selectedText ? `- ${selectedText}` : '- ';
        break;
      case 'heading':
        replacement = `# ${selectedText}`;
        break;
      case 'subheading':
        replacement = `## ${selectedText}`;
        break;
      case 'code':
        replacement = `\`${selectedText}\``;
        break;
      case 'link':
        replacement = `[${selectedText}](url)`;
        break;
    }

    const newContent = textContent.substring(0, start) + replacement + textContent.substring(end);
    setTextContent(newContent);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const generateFileName = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    switch (selectedTemplate) {
      case 'notes':
        return `notes_${dateStr}_${timeStr}`;
      case 'todo':
        return `todo_${dateStr}_${timeStr}`;
      case 'meeting':
        return `meeting_${dateStr}_${timeStr}`;
      case 'ideas':
        return `ideas_${dateStr}_${timeStr}`;
      default:
        return `text_${dateStr}_${timeStr}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <FileText className="h-4 w-4" />
          Text Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Text Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Template Selection */}
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Template:</Label>
            <Select value={selectedTemplate} onValueChange={(value: TemplateType) => applyTemplate(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notes">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Notes
                  </div>
                </SelectItem>
                <SelectItem value="todo">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    To-Do List
                  </div>
                </SelectItem>
                <SelectItem value="meeting">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Meeting Notes
                  </div>
                </SelectItem>
                <SelectItem value="ideas">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Ideas & Brainstorming
                  </div>
                </SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFileName(generateFileName())}
            >
              Generate Name
            </Button>
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name (e.g., my-notes.txt)"
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 p-2 border rounded-lg">
            <span className="text-sm font-medium mr-2">Format:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('list')}
              title="List Item"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('heading')}
              title="Heading"
            >
              H1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('subheading')}
              title="Subheading"
            >
              H2
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('code')}
              title="Code"
            >
              {'</>'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('link')}
              title="Link"
            >
              🔗
            </Button>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your text here..."
              className="min-h-[400px] resize-none font-mono text-sm"
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div>
                Press Ctrl+S to save quickly
              </div>
              <div>
                {wordCount} words • {charCount} characters
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedTemplate !== 'custom' && (
                <span>Using {selectedTemplate} template</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Download className="h-4 w-4" />
                Save Text
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 