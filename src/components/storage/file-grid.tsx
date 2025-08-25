// src\components\storage\file-grid.tsx
'use client';

import * as React from 'react';
import { FileIcon, File, ImageIcon, Video, Music, Star, Calendar, FileText, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface FileGridProps {
  files: StorageFile[];
  onFileClick: (file: StorageFile) => void;
  onFileDelete: (fileId: string, fileName: string) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.startsWith('application/pdf')) return FileText;
  return FileIcon;
};

export function FileGrid({ files, onFileClick, onFileDelete }: FileGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map((file) => {
        const Icon = getFileIcon(file.type);
        return (
          <Card
            key={file.id}
            className={cn(
              "p-4 cursor-pointer hover:shadow-md transition-shadow group relative",
              file.isImportant && "ring-2 ring-yellow-500"
            )}
            onClick={() => onFileClick(file)}
          >
            {file.isImportant && (
              <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); // Prevent onFileClick from firing
                onFileDelete(file.id, file.name);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            {file.type.startsWith('image/') && file.thumbnail ? (
              <div className="aspect-square mb-2 bg-muted rounded-md overflow-hidden">
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square mb-2 bg-muted rounded-md flex items-center justify-center">
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="truncate text-sm font-medium">{file.name}</div>
            <div className="text-xs text-muted-foreground truncate">{file.subject}</div>
          </Card>
        );
      })}
    </div>
  );
}
