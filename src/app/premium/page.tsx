
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, Star, Ticket } from 'lucide-react';
import { updateUserPremiumStatus } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { validateCoupon } from '@/services/couponService';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const BASE_PRICE = 9900; // in paisa (99 INR)

export default function PremiumPage() {
    const { toast } = useToast();
    const { user, isPremium, refreshAuth } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(BASE_PRICE);
    const [isCouponLoading, setIsCouponLoading] = useState(false);


    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsCouponLoading(true);
        try {
            const result = await validateCoupon(couponCode);
            if (result.isValid) {
                setDiscount(result.discountPercent);
                const newPrice = Math.round(BASE_PRICE * (1 - result.discountPercent / 100));
                setFinalPrice(newPrice);
                toast({ title: 'Coupon Applied!', description: `${result.discountPercent}% discount has been applied.` });
            } else {
                toast({ variant: 'destructive', title: 'Invalid Coupon', description: result.message });
                setDiscount(0);
                setFinalPrice(BASE_PRICE);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
            setDiscount(0);
            setFinalPrice(BASE_PRICE);
        } finally {
            setIsCouponLoading(false);
        }
    }


    const handleSubscribe = async () => {
        setIsLoading(true);

        if (!user) {
            toast({ variant: 'destructive', title: 'Not Logged In', description: 'You must be logged in to subscribe.' });
            setIsLoading(false);
            return;
        }

        if (finalPrice <= 0) {
            // 100% discount or free
             try {
                await updateUserPremiumStatus(user.uid, true);
                toast({
                    title: 'Subscription Activated!',
                    description: 'Welcome to AccentAce Premium!',
                });
                await refreshAuth();
                router.push('/home');
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Update Failed',
                    description: 'Failed to update your account. Please contact support.',
                });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: finalPrice.toString(), 
            currency: 'INR',
            name: 'AccentAce Premium',
            description: 'Monthly Subscription',
            image: '/logo.png',
            handler: async (response: any) => {
                try {
                    await updateUserPremiumStatus(user.uid, true);
                    toast({
                        title: 'Payment Successful!',
                        description: 'Welcome to AccentAce Premium!',
                    });
                    await refreshAuth();
                    router.push('/home');
                } catch (error) {
                     toast({
                        variant: 'destructive',
                        title: 'Update Failed',
                        description: 'Your payment was successful, but we failed to update your account. Please contact support.',
                    });
                }
            },
            prefill: {
                name: user.displayName || '',
                email: user.email || '',
            },
            notes: {
                address: 'AccentAce Corporate Office',
                coupon_applied: couponCode,
            },
            theme: {
                color: '#1d4ed8',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: response.error.description,
            });
            setIsLoading(false);
        });
        
        rzp.open();
        // Razorpay opening is async, but we don't want to setIsLoading(false) here
        // as the user is now in the payment flow. It will be reset on success/fail.
    };

    const premiumFeatures = [
        "Pronunciation Practice",
        "Sentence Scramble",
        "Impromptu Stage",
        "Pitch Perfect Analysis",
        "Storyteller Mode",
        "Detailed Performance History",
        "Priority Support"
    ];

    if (isPremium) {
         return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-lg text-center shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-primary">You are a Premium Member!</CardTitle>
                        <CardDescription>Thank you for your support. You have access to all features.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto my-4" />
                        <Button onClick={() => router.push('/home')}>Explore Features</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-background p-4">
            <Card className="w-full max-w-lg shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto fill-current" />
                    <CardTitle className="text-3xl font-bold">Go Premium</CardTitle>
                    <CardDescription>Unlock all features and accelerate your learning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        {discount > 0 && (
                            <p className="text-xl text-muted-foreground line-through">INR {(BASE_PRICE / 100).toFixed(2)}</p>
                        )}
                        <p className="text-4xl font-bold">INR {(finalPrice / 100).toFixed(2)} <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                         {discount > 0 && (
                            <p className="text-green-500 font-semibold">{discount}% OFF Coupon Applied!</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={isCouponLoading}
                        />
                        <Button onClick={handleApplyCoupon} disabled={!couponCode || isCouponLoading}>
                            {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Apply"}
                        </Button>
                    </div>

                    <ul className="space-y-2 text-muted-foreground">
                        {premiumFeatures.map(feature => (
                             <li key={feature} className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Button onClick={handleSubscribe} className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
                        Subscribe Now
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
