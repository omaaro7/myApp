// src\app\[lang]\dashboard\storage\storage-page-client.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import { Loader2, Upload } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import { FileGrid } from '@/components/storage/file-grid';
import { FileFilters } from '@/components/storage/file-filters';
import { AudioRecorder } from '@/components/storage/audio-recorder';
import { Whiteboard } from '@/components/storage/whiteboard';
import { TextInput } from '@/components/storage/text-input';
import { CustomAudioPlayer } from '@/components/storage/custom-audio-player';
import { useToast } from '@/hooks/use-toast';
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
  deleteDoc,
} from 'firebase/firestore';

import AppLayout from '@/components/app-layout';
import { getDictionary } from '@/lib/get-dictionary';
import { TextPreview } from '../../../../components/storage/text-preview';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

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

interface StoragePageClientProps {
  lang: Locale;
  dictionary: any;
}

export default function StoragePageClient({ lang, dictionary }: StoragePageClientProps) {
  const [user] = useAuthState(auth);
  const [files, setFiles] = React.useState<StorageFile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<StorageFile | null>(null);
  const [showFileDialog, setShowFileDialog] = React.useState(false);
  const [showNewSubjectDialog, setShowNewSubjectDialog] = React.useState(false);
  const [newSubjectName, setNewSubjectName] = React.useState('');
  const [showSubjectAdvice, setShowSubjectAdvice] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = React.useState(false);
  const [whiteboardData, setWhiteboardData] = React.useState<any>(null);
  const [openedFile, setOpenedFile] = React.useState<StorageFile | null>(null);
  const [fileToDelete, setFileToDelete] = React.useState<StorageFile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const t = dictionary?.storage || {
    title: 'مكتبة الملفات',
    selectSubject: 'اختر المادة',
    selectSubjectPlaceholder: 'اختر مادة',
    uploadFile: 'رفع ملف',
    files: 'الملفات',
    noFiles: 'لا توجد ملفات',
    openFile: 'فتح الملف',
    markImportant: 'تمييز كمهم',
    removeImportant: 'إزالة التمييز',
    download: 'تحميل'
  };

  // Load files and subjects
  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const subjectsQuery = query(collection(db, 'users', user.uid, 'subjects'));
    const unsubSubjects = onSnapshot(subjectsQuery, (snap) => {
      const subjectsList = snap.docs.map(d => d.data().name as string);
      setSubjects(subjectsList);
      // If there are subjects but nothing selected, keep empty to force explicit choice
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

  const uploadToServer = async (file: File | Blob, fileName: string, subject: string) => {
    const formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('subject', subject);
    formData.append('userId', user?.uid || '');
    formData.append('userName', user?.displayName || user?.email?.split('@')[0] || '');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url as string;
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    let subjectToUse = selectedSubject;
    if (!subjectToUse) {
      if (subjects.length === 0) {
        setShowNewSubjectDialog(true);
        toast({ title: 'Select a subject', description: 'Please create a subject before uploading.', variant: 'destructive' });
        return;
      }
      subjectToUse = subjects[0];
      setSelectedSubject(subjectToUse);
      toast({ title: 'No subject selected', description: `Using default subject "${subjectToUse}".` });
    }

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
      const fileName = `${Date.now()}_${file.name}`;
      const url = await uploadToServer(file, fileName, subjectToUse);

      let thumbnail: string | undefined;
      if (file.type.startsWith('image/')) {
        thumbnail = url;
      }

      await addDoc(collection(db, 'users', user.uid, 'files'), {
        name: file.name,
        type: file.type,
        url,
        subject: subjectToUse,
        createdAt: serverTimestamp(),
        isImportant: false,
        ...(thumbnail ? { thumbnail } : {}),
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
      const url = await uploadToServer(blob, fileName, subjectToUse);

      await addDoc(collection(db, 'users', user.uid, 'files'), {
        name: fileName,
        type: 'audio/webm',
        url,
        subject: subjectToUse,
        createdAt: serverTimestamp(),
        isImportant: false,
      });

      toast({
        title: 'Success',
        description: 'Recording saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleWhiteboardSave = async (blob: Blob, fileName: string) => {
    if (!user) return;
    let subjectToUse = selectedSubject;
    if (!subjectToUse) {
      if (subjects.length === 0) {
        setShowNewSubjectDialog(true);
        toast({ title: 'Select a subject', description: 'Please create a subject before saving.', variant: 'destructive' });
        return;
      }
      subjectToUse = subjects[0];
      setSelectedSubject(subjectToUse);
      toast({ title: 'No subject selected', description: `Using default subject "${subjectToUse}".` });
    }

    setUploading(true);
    try {
      const url = await uploadToServer(blob, fileName, subjectToUse);

      if (openedFile) {
        // Update existing document
        await updateDoc(doc(db, 'users', user.uid, 'files', openedFile.id), {
          name: openedFile.name, // Keep original name
          type: 'application/vnd.tldraw+json',
          url,
          subject: subjectToUse,
          updatedAt: serverTimestamp(), // Add an updatedAt field
        });
      } else {
        // Add new document
        await addDoc(collection(db, 'users', user.uid, 'files'), {
          name: fileName,
          type: 'application/vnd.tldraw+json',
          url,
          subject: subjectToUse,
          createdAt: serverTimestamp(),
          isImportant: false,
        });
      }

      toast({
        title: 'Success',
        description: 'Drawing saved successfully',
      });
      setIsWhiteboardOpen(false); // Close whiteboard after saving
      setOpenedFile(null); // Clear opened file state
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTextInputSave = async (blob: Blob, fileName: string) => {
    if (!user) return;
    let subjectToUse = selectedSubject;
    if (!subjectToUse) {
      if (subjects.length === 0) {
        setShowNewSubjectDialog(true);
        toast({ title: 'Select a subject', description: 'Please create a subject before saving.', variant: 'destructive' });
        return;
      }
      subjectToUse = subjects[0];
      setSelectedSubject(subjectToUse);
      toast({ title: 'No subject selected', description: `Using default subject "${subjectToUse}".` });
    }

    setUploading(true);
    try {
      const url = await uploadToServer(blob, fileName, subjectToUse);

      await addDoc(collection(db, 'users', user.uid, 'files'), {
        name: fileName,
        type: 'text/plain',
        url,
        subject: subjectToUse,
        createdAt: serverTimestamp(),
        isImportant: false,
      });

      toast({
        title: 'Success',
        description: 'Text file saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileClick = async (file: StorageFile) => {
    if (file.name.endsWith('.tldr')) {
      try {
        const response = await fetch(file.url);
        const data = await response.json();
        setWhiteboardData(data);
        setOpenedFile(file);
        setIsWhiteboardOpen(true);
      } catch (error) {
        console.error("Error loading whiteboard file:", error);
      }
    } else {
      setSelectedFile(file);
      setShowFileDialog(true);
    }
  };

  const toggleFileImportance = async (file: StorageFile) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'files', file.id), {
        isImportant: !file.isImportant,
      });
      toast({
        title: 'Success',
        description: `File marked as ${!file.isImportant ? 'important' : 'not important'}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const onFileDelete = (fileId: string, fileName: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      setFileToDelete(file);
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!user || !fileToDelete) return;

    const fileDocRef = doc(db, 'users', user.uid, 'files', fileToDelete.id);
    const apiUrl = `/api/file${fileToDelete.url.replace('/uploads', '')}`;

    try {
      // Delete from local server storage
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file from storage');
      }

      // Delete from Firestore
      await deleteDoc(fileDocRef);

      toast({
        title: 'File deleted',
        description: `"${fileToDelete.name}" has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error deleting file',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setShowDeleteConfirm(false);
      setFileToDelete(null);
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
          file => file.name.toLowerCase().includes(searchLower) ||
                 file.subject.toLowerCase().includes(searchLower)
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

  return (
    <AppLayout lang={lang} dictionary={dictionary?.appLayout}>
      <div className="h-full px-8 py-6 space-y-6">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="min-w-[220px]">
            <label className="block text-sm font-medium mb-1">{t.selectSubject}</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectSubjectPlaceholder} />
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
            <Button
              onClick={() => {
                if (!selectedSubject) {
                  if (subjects.length === 0) {
                    setShowNewSubjectDialog(true);
                  } else {
                    setShowSubjectAdvice(true);
                  }
                  return;
                }
                fileInputRef.current?.click();
              }}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {t.uploadFile}
            </Button>
            <AudioRecorder 
              onRecordingComplete={handleAudioRecordingComplete} 
              disabled={uploading || !selectedSubject}
            />
            <Whiteboard 
              onSave={handleWhiteboardSave} 
              disabled={uploading || !selectedSubject}
              initialData={whiteboardData}
              isOpen={isWhiteboardOpen}
              onOpenChange={setIsWhiteboardOpen}
            />
            <TextInput 
              onSave={handleTextInputSave} 
              disabled={uploading || !selectedSubject}
            />
          </div>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void handleFileUpload(file);
            }
          }}
          disabled={uploading || !selectedSubject}
          className="hidden"
        />

        <FileFilters
          subjects={subjects}
          onFilterChange={handleFilterChange}
        />

        <Card className="mt-2">
          <CardHeader>
            <CardTitle className="font-headline">{t.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Upload className="h-12 w-12 mb-2" />
                <p>{t.noFiles}</p>
              </div>
            ) : (
              <FileGrid files={files} onFileClick={handleFileClick} onFileDelete={onFileDelete} />
            )}
          </CardContent>
        </Card>

        {showFileDialog && selectedFile && (
          <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedFile.name}</DialogTitle>
                <DialogDescription>{selectedFile.subject}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedFile.type.startsWith('image/') ? (
                  <div className="rounded-lg overflow-hidden">
                    <img src={selectedFile.url} alt={selectedFile.name} className="w-full" />
                  </div>
                ) : selectedFile.type.startsWith('video/') ? (
                  <video src={selectedFile.url} controls className="w-full rounded-lg" />
                ) : selectedFile.type.startsWith('audio/') ? (
                  <audio src={selectedFile.url} controls className="w-full" />
                ) : selectedFile.type === 'application/pdf' ? (
                  <div className="h-[70vh] w-full">
                    <iframe src={selectedFile.url} className="h-full w-full rounded-lg border" />
                  </div>
                ) : selectedFile.type.startsWith('text/') ? (
                  <TextPreview url={selectedFile.url} />
                ) : (
                  <div className="flex justify-center">
                    <Button asChild>
                      <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">
                        <Upload className="mr-2 h-4 w-4" />
                        {t.openFile}
                      </a>
                    </Button>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => toggleFileImportance(selectedFile)}
                  >
                    {selectedFile.isImportant ? t.removeImportant : t.markImportant}
                  </Button>
                  <Button asChild variant="secondary">
                    <a href={selectedFile.url} download>
                      {t.download}
                    </a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the file "{fileToDelete?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFileToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showSubjectAdvice} onOpenChange={setShowSubjectAdvice}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Select a subject</AlertDialogTitle>
              <AlertDialogDescription>
                Please select a subject before uploading a file. This helps organize your files.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>OK</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowSubjectAdvice(false);
                  setShowNewSubjectDialog(true);
                }}
              >
                Create subject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
