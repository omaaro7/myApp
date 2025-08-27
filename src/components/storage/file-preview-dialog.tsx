// src\components\storage\file-preview-dialog.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { CustomAudioPlayer } from './custom-audio-player';
import { TextPreview } from './text-preview';

interface StorageFile {
  id: string;
  name: string;
  type: string;
  url: string;
  subject: string;
  createdAt: Date;
  isImportant: boolean;
  thumbnail?: string;
}

interface FilePreviewDialogProps {
  file: StorageFile;
  onOpenChange: (open: boolean) => void;
  onToggleImportance: (file: StorageFile) => void;
}

export function FilePreviewDialog({ file, onOpenChange, onToggleImportance }: FilePreviewDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
          <DialogDescription>{file.subject}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {file.type.startsWith('image/') ? (
            <div className="rounded-lg overflow-hidden">
              <img src={file.url} alt={file.name} className="w-full" />
            </div>
          ) : file.type.startsWith('video/') ? (
            <video src={file.url} controls className="w-full rounded-lg" />
          ) : file.type.startsWith('audio/') ? (
            <CustomAudioPlayer audioUrl={file.url} />
          ) : file.type === 'application/pdf' ? (
            <div className="h-[70vh] w-full">
              <iframe src={file.url} className="h-full w-full rounded-lg border" />
            </div>
          ) : file.type.startsWith('text/') ? (
            <TextPreview url={file.url} />
          ) : (
            <div className="flex justify-center">
              <Button asChild>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <Upload className="mr-2 h-4 w-4" />
                  Open File
                </a>
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => onToggleImportance(file)}
            >
              {file.isImportant ? 'Remove Important' : 'Mark Important'}
            </Button>
            <Button asChild variant="secondary">
              <a href={file.url} download>
                Download
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
