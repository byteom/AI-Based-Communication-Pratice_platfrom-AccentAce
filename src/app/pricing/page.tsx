
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { isPremium } = useAuth();
    const router = useRouter();

    const freeFeatures = [
        "Accent Ace: Basic Pronunciation",
        "Limited Practice History",
    ];

    const premiumFeatures = [
        "All Free Features",
        "Pronunciation Practice",
        "Sentence Scramble",
        "Impromptu Stage",
        "Pitch Perfect Analysis",
        "Storyteller Mode",
        "Detailed Performance History",
        "Priority Support",
    ];

  return (
    <div className="bg-background text-foreground">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="text-center my-12">
                <h1 className="text-5xl font-bold font-headline tracking-tight">Find the Plan That's Right for You</h1>
                <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">Start for free, or unlock your full potential with Premium.</p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Get started with the basics of pronunciation practice.</CardDescription>
                        <p className="text-4xl font-bold pt-4">INR 0 <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <ul className="space-y-2 text-muted-foreground">
                            {freeFeatures.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                         <Button variant="outline" className="w-full" disabled>
                           Your Current Plan
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="border-primary border-2 flex flex-col relative">
                    <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                        <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                            Most Popular
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Star className="text-yellow-400 fill-current" />
                            Premium
                        </CardTitle>
                        <CardDescription>Unlock all features to accelerate your learning.</CardDescription>
                         <p className="text-4xl font-bold pt-4">INR 99 <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                         <ul className="space-y-2 text-muted-foreground">
                            {premiumFeatures.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                         {isPremium ? (
                            <Button className="w-full" disabled>
                                You are a Premium Member
                            </Button>
                         ) : (
                             <Button onClick={() => router.push('/premium')} className="w-full">
                                Upgrade to Premium
                            </Button>
                         )}
                    </CardContent>
                </Card>
            </main>
        </div>
    </div>
  );
}
