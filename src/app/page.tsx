
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, MessageCircleQuestion, Presentation, Shuffle, Speech } from 'lucide-react';


const companyLogos = [
  { name: 'TCS' },
  { name: 'Capgemini' },
  { name: 'Cognizant' },
  { name: 'Deloitte' },
  { name: 'Wipro' },
  { name: 'Infosys' },
];

const exampleAnalysis = {
    overallAccuracy: 92,
    detailedFeedback: [
      { word: 'The', pronunciationAccuracy: 98, errorDetails: 'Perfect pronunciation.' },
      { word: 'quick', pronunciationAccuracy: 95, errorDetails: 'Excellent work.' },
      { word: 'brown', pronunciationAccuracy: 85, errorDetails: 'Slightly unclear vowel sound.' },
      { word: 'fox', pronunciationAccuracy: 99, errorDetails: 'Perfect.' },
      { word: 'jumps', pronunciationAccuracy: 75, errorDetails: 'The "s" sound at the end was a bit soft.' },
      { word: 'over', pronunciationAccuracy: 91, errorDetails: 'Good job.' },
      { word: 'the', pronunciationAccuracy: 96, errorDetails: 'Excellent.' },
      { word: 'lazy', pronunciationAccuracy: 93, errorDetails: 'Very clear.' },
      { word: 'dog.', pronunciationAccuracy: 90, errorDetails: 'Good, could be slightly stronger.' },
    ],
};

const getWordColorClass = (accuracy: number) => {
    if (accuracy > 80) return 'bg-accent/20 text-accent-foreground/90 rounded-md p-1';
    if (accuracy > 50) return 'bg-primary/10 text-primary-foreground/90 rounded-md p-1';
    return 'bg-destructive/20 text-destructive/90 rounded-md p-1';
};

const practiceFeatures = [
    {
        icon: <MessageCircleQuestion className="w-8 h-8 text-primary"/>,
        title: "Pronunciation Practice",
        description: "Ace the HR round by ensuring your speech is clear, confident, and easy to understand. Get instant feedback on every word."
    },
    {
        icon: <Shuffle className="w-8 h-8 text-primary"/>,
        title: "Sentence Scramble",
        description: "Improve your grammatical accuracy and sentence formation under pressure, a key skill for technical and behavioral rounds."
    },
     {
        icon: <Presentation className="w-8 h-8 text-primary"/>,
        title: "Impromptu Stage",
        description: "Master the Just-A-Minute (JAM) round. Practice thinking on your feet and structuring your thoughts coherently."
    },
     {
        icon: <Speech className="w-8 h-8 text-primary"/>,
        title: "Pitch Perfect",
        description: "Nail behavioral questions by learning to convey the right emotion. Show confidence, enthusiasm, and sincerity in your answers."
    }
]

export default function LandingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [progressValue, setProgressValue] = useState(13);

    useEffect(() => {
        const timer = setTimeout(() => setProgressValue(exampleAnalysis.overallAccuracy), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleGetStarted = () => {
        if(user) {
            router.push('/home');
        } else {
            router.push('/signup');
        }
    }

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                Don't Just Pass the Interview.
            </h1>
             <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-primary mt-2">
                Ace It.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                The AI-powered coach that perfects your communication skills for top tech companies. Deploy your skills across interviews, presentations, and team meetings.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" onClick={handleGetStarted} className="bg-gray-900 text-white hover:bg-gray-800">Get Started <ArrowRight className="ml-2 w-5 h-5"/></Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/pricing')}>View Pricing</Button>
            </div>
        </div>
      </section>

      {/* Featured Card Section */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto">
            <Card className="max-w-4xl mx-auto shadow-2xl overflow-hidden border-2 border-primary/20">
                <CardHeader className="bg-muted/30 p-4 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                     <p className="text-sm font-mono text-muted-foreground">/accent-ace/pronunciation-analysis</p>
                     <div></div>
                </CardHeader>
                <CardContent className="p-8">
                   <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <Badge variant="secondary" className="mb-4">INSTANT FEEDBACK</Badge>
                            <h3 className="text-2xl font-bold">Word-by-Word Pronunciation Analysis</h3>
                            <p className="mt-2 text-muted-foreground">Receive detailed scores on your pronunciation, rhythm, and intonation for every word you say. Identify exact problem areas and fix them before your next interview.</p>
                             <ul className="mt-4 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/>Overall Accuracy Score</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/>Individual Word Scores</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent"/>Actionable Suggestions</li>
                             </ul>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                           <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">Overall Accuracy</h4>
                                <span className="text-2xl font-bold text-primary">{progressValue}%</span>
                           </div>
                           <Progress value={progressValue} className="w-full h-4 transition-all duration-1000 ease-in-out" />
                           <div className="mt-4 text-lg p-2 space-x-1">
                                {exampleAnalysis.detailedFeedback.map((word, index) => (
                                     <TooltipProvider key={index} delayDuration={100}>
                                       <Tooltip>
                                         <TooltipTrigger asChild>
                                           <span className={`inline-block cursor-default ${getWordColorClass(word.pronunciationAccuracy)}`}>
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
                   </div>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* Practice for Every Challenge Section */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Practice for Every Interview Challenge</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            From the initial HR screening to the final technical round, AccentAce prepares you for every stage of the interview process.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {practiceFeatures.map((feature, index) => (
              <Card key={index} className="bg-card/50 hover:bg-muted/50 transition-colors">
                <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                        {feature.icon}
                    </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Company Logos Section */}
      <section className="py-12">
         <div className="container mx-auto">
            <p className="text-center text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                Trusted by students who got placed in
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {companyLogos.map(logo => (
                    <div key={logo.name} className="flex justify-center">
                         <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 opacity-80 hover:opacity-100 transition-opacity">
                            {logo.name}
                          </div>
                    </div>
                ))}
            </div>
         </div>
      </section>


      {/* Final CTA Section */}
      <section className="py-24 bg-muted/50 mt-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Secure Your Dream Job?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop worrying about the interview. Start preparing for your career. From the creators of Certifyo, get the AccentAce advantage today.
          </p>
          <div className="mt-8">
            <Button size="lg" className="h-12 text-lg px-8 bg-gray-900 text-white hover:bg-gray-800" onClick={handleGetStarted}>
              Start Practicing Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

