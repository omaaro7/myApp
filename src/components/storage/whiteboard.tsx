// src\components\storage\whiteboard.tsx
'use client';

import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import { useCallback, useState, useRef } from 'react';

export interface WhiteboardProps {
  onSave: (blob: Blob, fileName: string) => Promise<void>;
  disabled?: boolean;
}

export interface WhiteboardProps {
  onSave: (blob: Blob, fileName: string) => Promise<void>;
  disabled?: boolean;
  initialData?: any;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Whiteboard({ onSave, disabled, initialData, isOpen, onOpenChange }: WhiteboardProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const handleSave = async () => {
    if (!editor) return;

    const snapshot = editor.store.getSnapshot();
    const blob = new Blob([JSON.stringify(snapshot)], { type: 'application/json' });
    const fileName = `whiteboard_${Date.now()}.tldr`;
    await onSave(blob, fileName);
    setOpen(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const snapshot = JSON.parse(event.target?.result as string);
            editor.store.loadSnapshot(snapshot);
          } catch (error) {
            console.error("Error loading snapshot:", error);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <Pen className="h-4 w-4" />
          Whiteboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Whiteboard</DialogTitle>
        </DialogHeader>
        <div className="w-full flex-grow">
          <Tldraw onMount={(editor) => {
            setEditor(editor);
            if (initialData) {
              editor.store.loadSnapshot(initialData);
            }
          }} />
        </div>
        <div className="flex justify-end p-4 gap-2">
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".tldr"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={!editor}>
                Load
            </Button>
            <Button onClick={handleSave} disabled={!editor}>
                Save Drawing
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
