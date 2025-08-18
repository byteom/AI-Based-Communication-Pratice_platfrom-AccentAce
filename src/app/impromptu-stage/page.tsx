
'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mic, Presentation, StopCircle, Waves, BrainCircuit, Timer, History } from 'lucide-react';
import { generateImpromptuTopic } from '@/ai/flows/generate-impromptu-topic';
import type { ImpromptuHistoryItem } from '@/lib/types';
import { addHistoryItem, getHistoryItems, updateHistoryItem } from '@/services/impromptuHistoryService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';


type Stage = 'idle' | 'thinking' | 'speaking' | 'finished';

export default function ImpromptuStagePage() {
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isPremium) {
      router.push('/premium');
    }
  }, [user, isPremium, router]);
  
  const [stage, setStage] = useState<Stage>('idle');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  
  const [timer, setTimer] = useState(60);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  const [history, setHistory] = useState<ImpromptuHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if(user) loadHistory();
  }, [user]);

  const loadHistory = async () => {
    try {
      const items = await getHistoryItems();
      setHistory(items);
    } catch(e) {
      console.error("Failed to load history", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load practice history.",
      });
    }
  }

  const startTimer = (duration: number, onEnd: () => void) => {
    setTimer(duration);
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handleGetTopic = async () => {
    setIsLoading(true);
    setTopic('');
    setRecordedAudioUrl(null);
    setCurrentHistoryId(null);
    try {
      const pastTopics = history.map(h => h.topic);
      const { topic: newTopic } = await generateImpromptuTopic({ history: pastTopics });
      setTopic(newTopic);
      const historyId = await addHistoryItem({ topic: newTopic });
      setCurrentHistoryId(historyId);
      await loadHistory();
      setStage('thinking');
      startTimer(60, () => {
        setStage('speaking');
        startRecording();
        startTimer(60, stopRecording);
      });
    } catch (error) {
      console.error('Error generating topic:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate a topic. Please try again.',
      });
      setStage('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setRecordedAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        if(currentHistoryId) {
            await updateHistoryItem(currentHistoryId, { recordedAudioUrl: url });
            await loadHistory();
        }
        
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setStage('finished');
         toast({
            title: "Time's up!",
            description: "Great job! You can now listen to your speech.",
        });
      };
      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please check your browser permissions.",
      })
      setIsRecording(false);
      setStage('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };
  
  const playAudio = (url: string | undefined) => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };


  const renderContent = () => {
    switch(stage) {
      case 'thinking':
        return (
            <div className="text-center space-y-4">
                <BrainCircuit className="w-16 h-16 mx-auto text-primary animate-pulse" />
                <h2 className="text-2xl font-semibold">Thinking Time</h2>
                <p className="text-muted-foreground">You have one minute to prepare your thoughts.</p>
                <div className="text-6xl font-bold font-mono text-primary">{timer}</div>
            </div>
        );
      case 'speaking':
        return (
            <div className="text-center space-y-4">
                <Mic className="w-16 h-16 mx-auto text-destructive animate-pulse" />
                <h2 className="text-2xl font-semibold">You're On! Speak Now.</h2>
                <p className="text-muted-foreground">You have one minute to speak on the topic.</p>
                <div className="text-6xl font-bold font-mono text-destructive">{timer}</div>
                {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-destructive pt-2">
                        <Waves className="animate-pulse" />
                        <span>Recording...</span>
                    </div>
                )}
                <Button onClick={stopRecording} variant="destructive">
                    <StopCircle className="mr-2" />
                    End Speech
                </Button>
            </div>
        );
      case 'finished':
        return (
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">Well Done!</h2>
                <p className="text-muted-foreground">You can listen to your speech below.</p>
                {recordedAudioUrl && <audio controls src={recordedAudioUrl} className="w-full max-w-md mx-auto" />}
                <Button onClick={handleGetTopic} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Try a New Topic'}
                </Button>
            </div>
        );
      case 'idle':
      default:
        return (
            <div className="text-center space-y-4">
                <p className="text-muted-foreground">Ready for a challenge? Get a random topic and speak for one minute. You'll have 60 seconds to think before you start.</p>
                <Button onClick={handleGetTopic} disabled={isLoading} size="lg">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Get My Topic!'}
                </Button>
            </div>
        )
    }
  }
  
  if (!user || !isPremium) {
     return (
       <div className="flex items-center justify-center h-screen bg-background">
         <Loader2 className="w-16 h-16 animate-spin text-primary" />
       </div>
     );
  }


  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-3">
            <Presentation className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">Impromptu Stage</h1>
          </div>
          <Button variant="outline" onClick={() => setIsHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Practice History
          </Button>
        </header>

        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Impromptu History</DialogTitle>
              <DialogDescription>
                Review your past impromptu speeches.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
               <Accordion type="single" collapsible className="w-full">
                {history.map(item => (
                  <AccordionItem value={item.id} key={item.id}>
                    <AccordionTrigger>
                      <span className="truncate text-left" style={{maxWidth: '250px'}}>
                        {item.topic}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 px-1">
                        <p className="text-muted-foreground">{item.topic}</p>
                        {item.recordedAudioUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playAudio(item.recordedAudioUrl)}
                          >
                            <Mic className="mr-2 h-4 w-4" />
                            Listen to Speech
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </DialogContent>
        </Dialog>


        <main className="max-w-4xl mx-auto mt-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>The Topic is...</CardTitle>
                    {topic ? (
                        <CardDescription className="text-2xl font-semibold text-primary pt-2">{topic}</CardDescription>
                    ) : (
                         <CardDescription>Click the button below to get your topic.</CardDescription>
                    )}
                </CardHeader>
                <CardContent className="flex justify-center items-center min-h-[250px]">
                    {renderContent()}
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
