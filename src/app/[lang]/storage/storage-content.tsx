// src\app\[lang]\storage\storage-content.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { FileGrid } from '@/components/storage/file-grid';
import { FileFilters } from '@/components/storage/file-filters';
import { AudioRecorder } from '@/components/storage/audio-recorder';
import { FileNotes } from '@/components/storage/file-notes';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import AppLayout from '@/components/app-layout';
import type { Locale } from '@/i18n-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextPreview } from '../../../components/storage/text-preview';

const ALLOWED_FILE_TYPES = {
  'image/*': 'Images',
  'video/*': 'Videos',
  'audio/*': 'Audio',
  'application/pdf': 'PDF Documents',
};

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

export default function StorageContent({ lang, t }: { lang: Locale; t: any }) {
  const [user] = useAuthState(auth);
  const [files, setFiles] = React.useState<StorageFile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<StorageFile | null>(null);
  const [showFileDialog, setShowFileDialog] = React.useState(false);
  const [fileNotes, setFileNotes] = React.useState<Array<{ id: string; content: string; type: string; url?: string; createdAt: Date }>>([]);
  const [showNewSubjectDialog, setShowNewSubjectDialog] = React.useState(false);
  const [newSubjectName, setNewSubjectName] = React.useState('');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveNote = async ({ content, type, url }: { content: string; type: string; url?: string }) => {
    if (!user || !selectedFile) return;
    try {
      const noteRef = await addDoc(collection(db, 'users', user.uid, 'files', selectedFile.id, 'notes'), {
        content,
        type,
        url,
        createdAt: serverTimestamp(),
      });
      setFileNotes(prev => [...prev, { id: noteRef.id, content, type, url, createdAt: new Date() }]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  React.useEffect(() => {
    if (!user || !selectedFile) return;
    const notesQuery = query(
      collection(db, 'users', user.uid, 'files', selectedFile.id, 'notes'),
      orderBy('createdAt', 'desc')
    );
    const unsubNotes = onSnapshot(notesQuery, (snap) => {
      const notesList = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
      }));
      setFileNotes(notesList as any);
    });
    return () => {
      unsubNotes();
    };
  }, [user, selectedFile]);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const subjectsQuery = query(collection(db, 'users', user.uid, 'subjects'));
    const unsubSubjects = onSnapshot(subjectsQuery, (snap) => {
      const subjectsList = snap.docs.map(d => d.data().name as string);
      setSubjects(subjectsList);
    }, (error) => console.error('Error loading subjects:', error));

    const filesQuery = query(
      collection(db, 'users', user.uid, 'files'),
      orderBy('createdAt', 'desc')
    );
    const unsubFiles = onSnapshot(filesQuery, (snap) => {
      const filesList = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
      })) as StorageFile[];
      setFiles(filesList);
      setLoading(false);
    }, (error) => console.error('Error loading files:', error));

    return () => {
      unsubSubjects();
      unsubFiles();
    };
  }, [user]);

  const createSubject = async () => {
    if (!user) return;
    const name = newSubjectName.trim();
    if (!name) {
      toast({ title: 'Subject name is required', variant: 'destructive' });
      return;
    }
    if (subjects.includes(name)) {
      toast({ title: 'Subject already exists', description: 'Choose a different name.', variant: 'destructive' });
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'subjects'), {
        name,
        createdAt: serverTimestamp(),
      });
      setSelectedSubject(name);
      setShowNewSubjectDialog(false);
      setNewSubjectName('');
      toast({ title: 'Subject created' });
    } catch (error: any) {
      toast({ title: 'Error creating subject', description: error.message, variant: 'destructive' });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    if (!selectedSubject) {
      if (subjects.length === 0) {
        setShowNewSubjectDialog(true);
      }
      toast({ title: 'Select a subject', description: 'Please select or create a subject before uploading.', variant: 'destructive' });
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    // Block PHP files client-side
    const lowerName = file.name.toLowerCase();
    const extBlocked = ['.php', '.phtml', '.php3', '.php4', '.php5', '.phps'].some(ext => lowerName.endsWith(ext));
    const mimeLower = (file.type || '').toLowerCase();
    const mimeBlocked = ['application/x-httpd-php', 'text/x-php', 'application/php'].includes(mimeLower);
    if (extBlocked || mimeBlocked) {
      toast({ title: 'Invalid file type', description: 'PHP files are not allowed.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/files/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      let thumbnail: string | undefined;
      if (file.type.startsWith('image/')) {
        thumbnail = url;
      }
      await addDoc(collection(db, 'users', user.uid, 'files'), {
        name: file.name,
        type: file.type,
        url,
        subject: selectedSubject,
        createdAt: serverTimestamp(),
        isImportant: false,
        ...(thumbnail ? { thumbnail } : {}),
      });
      toast({ title: 'Success', description: 'File uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAudioRecordingComplete = async (blob: Blob) => {
    if (!user) return;
    let subjectToUse = selectedSubject;
    if (!subjectToUse) {
      if (subjects.length === 0) {
        setShowNewSubjectDialog(true);
        toast({ title: 'Select a subject', description: 'Please create a subject before recording.', variant: 'destructive' });
        return;
      }
      subjectToUse = subjects[0];
      setSelectedSubject(subjectToUse);
      toast({ title: 'No subject selected', description: `Using default subject "${subjectToUse}".` });
    }
    setUploading(true);
    try {
      const fileName = `recording_${Date.now()}.webm`;
      const storageRef = ref(storage, `users/${user.uid}/recordings/${fileName}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'users', user.uid, 'files'), {
        name: fileName,
        type: 'audio/webm',
        url,
        subject: subjectToUse,
        createdAt: serverTimestamp(),
        isImportant: false,
      });
      toast({ title: 'Success', description: 'Recording saved successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileClick = (file: StorageFile) => {
    setSelectedFile(file);
    setShowFileDialog(true);
  };

  const toggleFileImportance = async (file: StorageFile) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'files', file.id), { isImportant: !file.isImportant });
      toast({ title: 'Success', description: `File marked as ${!file.isImportant ? 'important' : 'not important'}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleFilterChange = (filters: {
    search: string;
    subject: string;
    type: string;
    date: Date | undefined;
    isImportant: boolean;
  }) => {
    if (!user) return;

    const baseQuery = query(
      collection(db, 'users', user.uid, 'files'),
      orderBy('createdAt', 'desc')
    );

    const unsubFiles = onSnapshot(baseQuery, (snap) => {
      let filesList = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
      })) as StorageFile[];

      if (filters.subject && filters.subject !== 'all') {
        filesList = filesList.filter(file => file.subject === filters.subject);
      }

      if (filters.type && filters.type !== 'all') {
        if (filters.type === 'other') {
          const isCommon = (mime: string) =>
            mime.startsWith('image/') ||
            mime.startsWith('video/') ||
            mime.startsWith('audio/') ||
            mime === 'application/pdf';
          filesList = filesList.filter(file => !isCommon(file.type));
        } else if (filters.type.endsWith('/*')) {
          const prefix = filters.type.split('/')[0] + '/';
          filesList = filesList.filter(file => file.type.startsWith(prefix));
        } else {
          filesList = filesList.filter(file => file.type === filters.type);
        }
      }

      if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);
        filesList = filesList.filter(file => {
          const ts = new Date(file.createdAt).getTime();
          return ts >= startOfDay.getTime() && ts <= endOfDay.getTime();
        });
      }

      if (filters.isImportant) {
        filesList = filesList.filter(file => file.isImportant === true);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filesList = filesList.filter(
          file => file.name.toLowerCase().includes(searchLower) || file.subject.toLowerCase().includes(searchLower)
        );
      }

      setFiles(filesList);
    }, (error) => {
      console.error('Error loading files:', error);
    });

    return unsubFiles;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If unauthenticated, render the layout with empty content instead of blocking
  if (!user) {
    return (
      <AppLayout lang={lang} dictionary={t.appLayout}>
        <div className="h-full px-8 py-6 space-y-6" />
      </AppLayout>
    );
  }

  return (
    <AppLayout lang={lang} dictionary={t.appLayout}>
      <div className="h-full px-8 py-6 space-y-6">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="min-w-[220px]">
            <label className="block text-sm font-medium mb-1">{t.storage.selectSubject}</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder={t.storage.selectSubjectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => setShowNewSubjectDialog(true)}>+ New subject</Button>
          <div className="flex-1" />
          <div className="flex gap-4">
            <Button onClick={() => fileInputRef.current?.click()} disabled={!selectedSubject || uploading} className="gap-2">
              <Upload className="h-4 w-4" />
              {t.storage.uploadFile}
            </Button>
            <AudioRecorder onRecordingComplete={handleAudioRecordingComplete} />
          </div>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          disabled={uploading || (subjects.length === 0 && !selectedSubject)}
          className="hidden"
        />

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t.storage.files}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <FileFilters subjects={subjects} onFilterChange={handleFilterChange} />
            </div>

            {files.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t.storage.noFiles}</p>
            ) : (
              <FileGrid files={files} onFileClick={handleFileClick} />
            )}
          </CardContent>
        </Card>

        <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedFile?.name}</DialogTitle>
              <DialogDescription>{selectedFile?.subject}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {selectedFile?.type.startsWith('image/') ? (
                  <div className="rounded-lg overflow-hidden">
                    <img src={selectedFile.url} alt={selectedFile.name} className="w-full" />
                  </div>
                ) : selectedFile?.type.startsWith('video/') ? (
                  <video src={selectedFile.url} controls className="w-full rounded-lg" />
                ) : selectedFile?.type.startsWith('audio/') ? (
                  <audio src={selectedFile.url} controls className="w-full" />
                ) : selectedFile?.type === 'application/pdf' ? (
                  <div className="h-[60vh] w-full">
                    <iframe src={selectedFile.url} className="h-full w-full rounded-lg border" />
                  </div>
                ) : selectedFile?.type.startsWith('text/') ? (
                  <TextPreview url={selectedFile.url} />
                ) : (
                  <div className="flex justify-center">
                    <Button asChild>
                      <a href={selectedFile?.url} target="_blank" rel="noopener noreferrer">
                        <Upload className="mr-2 h-4 w-4" />
                        {t.storage.openFile}
                      </a>
                    </Button>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => selectedFile && toggleFileImportance(selectedFile)}>
                    {selectedFile?.isImportant ? t.storage.removeImportant : t.storage.markImportant}
                  </Button>
                  <Button asChild variant="secondary">
                    <a href={selectedFile?.url} download>
                      {t.storage.download}
                    </a>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Notes & Recordings</h3>
                {selectedFile && (
                  <FileNotes
                    fileId={selectedFile.id}
                    notes={fileNotes.map(note => ({ ...note, type: note.type as 'text' | 'audio' }))}
                    onSaveNote={handleSaveNote}
                    dictionary={t}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showNewSubjectDialog} onOpenChange={setShowNewSubjectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New subject</DialogTitle>
              <DialogDescription>Create a subject to organize your files.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewSubjectDialog(false)}>Cancel</Button>
                <Button onClick={createSubject}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
