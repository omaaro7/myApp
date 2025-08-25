// src\components\storage\audio-recorder.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Mic, Square, Loader2, Pause, Play, Volume2, VolumeX, Download } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, onCancel, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setIsPreparing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        stopTimer();
        setRecordingTime(0);
        setIsRecording(false);
        setIsPaused(false);
        setShowPreview(true);
      };

      mediaRecorder.onpause = () => {
        setIsPaused(true);
        stopTimer();
      };

      mediaRecorder.onresume = () => {
        setIsPaused(false);
        startTimer();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      startTimer();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsPreparing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
    }
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      setRecordingTime(0);
      if (onCancel) onCancel();
    }
  };

  const playPreview = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSaveRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      setShowPreview(false);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };

  const handleDiscardRecording = () => {
    setShowPreview(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  React.useEffect(() => {
    return () => {
      stopTimer();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (showPreview && audioBlob) {
    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Recording</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <audio
                ref={audioRef}
                src={audioUrl || undefined}
                onEnded={handleAudioEnded}
                className="w-full"
                controls
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Duration: {formatTime(recordingTime)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? pausePreview : playPreview}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleDiscardRecording}>
                Discard
              </Button>
              <Button onClick={handleSaveRecording} className="gap-2">
                <Download className="h-4 w-4" />
                Save Recording
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      onClick={startRecording}
      disabled={isPreparing || disabled}
      variant="outline"
      className="gap-2"
    >
      {isPreparing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isRecording ? 'Stop Recording' : 'Record Audio'}
      {isRecording && (
        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
          {formatTime(recordingTime)}
        </span>
      )}
    </Button>
  );
}
