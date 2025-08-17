
"use client";

import { useState, useRef, useEffect } from 'react';
import { languages, type Language, type Accent } from '@/lib/accent-ace-config';
import { generatePhrase } from '@/ai/flows/generate-phrase';
import { generateAudio } from '@/ai/flows/generate-audio';
import { analyzeAccent, type AnalyzeAccentOutput } from '@/ai/flows/analyze-accent';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, Mic, Pause, Play, Speech, StopCircle, Volume2, Waves, History } from 'lucide-react';
import { addHistoryItem, updateHistoryItem, getHistoryItems } from '@/services/historyService';
import type { HistoryItem } from '@/lib/types';
import { HistoryList } from '@/components/accent-ace/history-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


export default function AccentAcePage() {
  const { toast } = useToast();
  
  const [language, setLanguage] = useState<Language>('English');
  const [accent, setAccent] = useState<Accent>('American');
  const [phrase, setPhrase] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeAccentOutput | null>(null);
  const [referenceAudioUrl, setReferenceAudioUrl] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const referenceAudioRef = useRef<HTMLAudioElement>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const items = getHistoryItems();
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

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setLanguage(newLang);
    setAccent(languages[newLang][0]);
    resetPracticeState();
  };

  const handleAccentChange = (value: string) => {
    setAccent(value as Accent);
    resetPracticeState();
  };

  const resetPracticeState = () => {
    setPhrase('');
    setAnalysis(null);
    setRecordedAudio(null);
    setRecordedAudioUrl(null);
    setReferenceAudioUrl(null);
    if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
        referenceAudioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setCurrentHistoryId(null);
  }

  const handleGeneratePhrase = async () => {
    resetPracticeState();
    setIsGenerating(true);
    try {
      const phraseResult = await generatePhrase({ language, accent });
      setPhrase(phraseResult.phrase);
      const audioResult = await generateAudio({ language, accent, text: phraseResult.phrase });
      setReferenceAudioUrl(audioResult.audioDataUri);
      
      const historyId = addHistoryItem(phraseResult.phrase, audioResult.audioDataUri);
      setCurrentHistoryId(historyId);
      loadHistory();
      
    } catch (error) {
      console.error('Error generating phrase:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a new phrase. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayReference = () => {
    if (isSpeaking) {
      referenceAudioRef.current?.pause();
      setIsSpeaking(false);
    } else {
      referenceAudioRef.current?.play();
      setIsSpeaking(true);
    }
  };
  
  const startRecording = async () => {
    setRecordedAudio(null);
    setRecordedAudioUrl(null);
    setAnalysis(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        setRecordedAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
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
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!recordedAudio || !phrase || !currentHistoryId) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    
    const reader = new FileReader();
    reader.readAsDataURL(recordedAudio);
    reader.onloadend = async () => {
      try {
        const base64Audio = reader.result as string;
        const result = await analyzeAccent({
          recordedAudioDataUri: base64Audio,
          referenceText: phrase,
        });
        setAnalysis(result);

        updateHistoryItem(currentHistoryId, {
          analysis: result,
          recordedAudioUrl: recordedAudioUrl!,
        });
        loadHistory();

      } catch (error) {
        console.error('Error analyzing accent:', error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "There was an error analyzing your recording. Please try again.",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
  };
  
  const getWordColorClass = (accuracy: number) => {
    if (accuracy > 80) return 'bg-accent/20 text-accent-foreground/90 rounded-md p-1 transition-all duration-300 animate-pulse-once';
    if (accuracy > 50) return 'bg-primary/10 text-primary-foreground/90 rounded-md p-1';
    return 'bg-destructive/20 text-destructive/90 rounded-md p-1';
  };
  
  const handleSelectHistoryItem = (item: HistoryItem) => {
    resetPracticeState();
    setPhrase(item.phrase);
    setReferenceAudioUrl(item.referenceAudioUrl);
    setRecordedAudioUrl(item.recordedAudioUrl || null);
    setAnalysis(item.analysis || null);
    setCurrentHistoryId(item.id);
    setIsHistoryOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-3">
            <Speech className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">AccentAce</h1>
          </div>
          <Button variant="outline" onClick={() => setIsHistoryOpen(true)}>
            <History className="mr-2" />
            Practice History
          </Button>
        </header>
        
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Practice History</DialogTitle>
              <DialogDescription>
                Review your past practice sessions and track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <HistoryList history={history} onSelect={handleSelectHistoryItem} />
            </div>
          </DialogContent>
        </Dialog>

        <main className="max-w-4xl mx-auto mt-8">
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Step 1: Choose Your Practice</CardTitle>
                <CardDescription>Select a language and accent, then generate a phrase to start.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="language-select" className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language-select" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(languages).map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label htmlFor="accent-select" className="text-sm font-medium">Accent</label>
                  <Select value={accent} onValueChange={handleAccentChange}>
                    <SelectTrigger id="accent-select" className="w-full">
                      <SelectValue placeholder="Select accent" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages[language].map(acc => (
                        <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGeneratePhrase} disabled={isGenerating} className="self-end sm:w-auto w-full">
                  {isGenerating ? <Loader2 className="animate-spin" /> : 'New Phrase'}
                </Button>
              </CardContent>
            </Card>

            {phrase && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Step 2: Record & Submit</CardTitle>
                  <CardDescription>Listen to the phrase, then record yourself saying it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                    <Button onClick={handlePlayReference} size="lg" variant="outline" aria-label="Play reference audio" disabled={!referenceAudioUrl}>
                      {isSpeaking ? <><Pause className="mr-2" /> Stop</> : <><Volume2 className="mr-2" /> Play Phrase</>}
                    </Button>
                     {referenceAudioUrl && (
                        <audio 
                            ref={referenceAudioRef} 
                            src={referenceAudioUrl} 
                            className="hidden" 
                            onEnded={() => setIsSpeaking(false)}
                            onPause={() => setIsSpeaking(false)}
                        />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button onClick={isRecording ? stopRecording : startRecording} size="lg" className={`w-full sm:w-auto ${isRecording ? 'bg-destructive hover:bg-destructive/90' : ''}`}>
                      {isRecording ? <><StopCircle className="mr-2" /> Stop Recording</> : <><Mic className="mr-2" /> Start Recording</>}
                    </Button>
                    
                    {recordedAudioUrl && (
                        <audio controls src={recordedAudioUrl} className="max-w-full" />
                    )}

                    <Button onClick={handleAnalyze} disabled={!recordedAudio || isAnalyzing || isRecording || !currentHistoryId} size="lg" className="w-full sm:w-auto">
                      {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : 'Analyze My Accent'}
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-destructive pt-2">
                        <Waves className="animate-pulse" />
                        <span>Recording...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(isAnalyzing || analysis) && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Step 3: Your Results</CardTitle>
                  <CardDescription>Here is the detailed feedback on your pronunciation.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center h-48">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                  ) : analysis && (
                    <div className="space-y-6">
                       <div>
                        <h3 className="text-lg font-semibold mb-2">Original Phrase</h3>
                        <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg">{phrase}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">Overall Accuracy</h3>
                          <span className="text-2xl font-bold text-primary">{analysis.overallAccuracy}%</span>
                        </div>
                        <Progress value={analysis.overallAccuracy} className="w-full" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Detailed Feedback</h3>
                        <div className="text-lg p-4 bg-muted/50 rounded-lg space-x-2">
                          {analysis.detailedFeedback.map((word, index) => (
                             <TooltipProvider key={index} delayDuration={100}>
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   <span className={`inline-block ${getWordColorClass(word.pronunciationAccuracy)}`}>
                                     {word.word}
                                   </span>
                                 </TooltipTrigger>
                                 <TooltipContent className="max-w-xs">
                                   <p className="font-bold">Accuracy: {word.pronunciationAccuracy}%</p>
                                   <p>{word.errorDetails}</p>
                                 </TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Suggestions for Improvement</h3>
                        <p className="text-muted-foreground">{analysis.suggestions}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
