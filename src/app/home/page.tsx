
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';
import { Speech, Shuffle, Presentation, Mic, Image as ImageIcon, MessageCircleQuestion, Lock, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { isPremium, features } = useAuth();
  const router = useRouter();
  
  const handleCardClick = (e: React.MouseEvent, feature: (typeof features)[0]) => {
    if (feature.isPremium && !isPremium) {
      e.preventDefault();
      router.push('/premium');
    }
  }

  return (
    <div className="bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="text-center my-12">
        <h1 className="text-5xl font-bold font-headline tracking-tight text-primary">Your Personal AI Speech Coach</h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">Welcome back! Select a tool below to start practicing.</p>
      </div>

       <Card className="max-w-6xl w-full mb-12 bg-primary/10 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Coming Soon: The Ultimate Tech Interview Platform!
            </CardTitle>
            <CardDescription>
              We're building a new platform to help you ace technical interviews. As a thank you, all AccentAce Premium members will get access at a special discounted price for a limited time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/premium')} disabled={isPremium}>
                {isPremium ? "You've Unlocked the Offer!" : "Upgrade Now to Lock In Your Offer"}
                {!isPremium && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="block group" onClick={(e) => handleCardClick(e, feature)}>
              <Card className="h-full border-2 border-border/50 bg-card hover:border-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/20 relative">
                {(feature.isPremium && !isPremium) && (
                  <div className="absolute top-2 right-2 bg-primary/20 text-primary p-1 rounded-full">
                      <Lock className="w-5 h-5"/>
                  </div>
                )}
                 {feature.isPremium && (
                    <div className="absolute top-2 left-2 text-yellow-400">
                        <Star className="w-5 h-5 fill-current"/>
                    </div>
                )}
                 <CardContent className="p-6 flex flex-col items-start gap-4">
                   <div className="bg-primary/10 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-1 text-base">{feature.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
