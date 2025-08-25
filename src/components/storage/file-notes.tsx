// src\components\storage\file-notes.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { AudioRecorder } from './audio-recorder';
import { Mic, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileNote {
  id: string;
  content: string;
  type: 'text' | 'audio';
  url?: string;
  createdAt: Date;
}

interface FileNotesProps {
  fileId: string;
  onSaveNote: (note: { content: string; type: string; url?: string }) => Promise<void>;
  notes: FileNote[];
  dictionary: any;
}

export function FileNotes({ fileId, onSaveNote, notes, dictionary }: FileNotesProps) {
  const [noteContent, setNoteContent] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const { toast } = useToast();

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    try {
      await onSaveNote({
        content: noteContent,
        type: 'text'
      });
      setNoteContent('');
      toast({
        title: 'Success',
        description: 'Note saved successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleRecordingComplete = async (blob: Blob) => {
    try {
      await onSaveNote({
        content: 'Audio Note',
        type: 'audio',
        url: URL.createObjectURL(blob)
      });
      setIsRecording(false);
      toast({
        title: 'Success',
        description: 'Audio note saved successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Add a note..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsRecording(true)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setNoteContent('')}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={handleSaveNote}>
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {notes.map((note) => (
            <Card key={note.id} className="p-3">
              {note.type === 'text' ? (
                <p className="text-sm">{note.content}</p>
              ) : (
                <audio src={note.url} controls className="w-full" />
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {note.createdAt.toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {isRecording && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6">
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              onCancel={() => setIsRecording(false)}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
