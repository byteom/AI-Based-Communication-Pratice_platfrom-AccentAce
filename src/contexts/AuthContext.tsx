
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { type User } from 'firebase/auth';
import { onAuthUserStateChanged, auth } from '@/services/authService';
import { getUser, onUserSnapshot } from '@/services/userService';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, Speech, Shuffle, Presentation, Mic, Image as ImageIcon, MessageCircleQuestion } from 'lucide-react';
import type { UserProfile, FeatureFlag } from '@/lib/types';
import { getFeatureFlags } from '@/services/featureConfigService';

// Define the shape of a feature
export interface Feature {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: JSX.Element;
  isPremium: boolean;
}

// Statically define all features, premium status will be updated from DB
const ALL_FEATURES_CONFIG: Omit<Feature, 'isPremium'>[] = [
    {
      id: 'accent-ace',
      title: 'Accent Ace',
      description: 'Practice your pronunciation with AI feedback.',
      href: '/accent-ace',
      icon: <Speech className="w-8 h-8 text-primary" />,
    },
    {
      id: 'pronunciation-practice',
      title: 'Pronunciation Practice',
      description: 'Read a sentence and get feedback on your speech.',
      href: '/pronunciation-practice',
      icon: <MessageCircleQuestion className="w-8 h-8 text-primary" />,
    },
    {
      id: 'sentence-scramble',
      title: 'Sentence Scramble',
      description: 'Unscramble the sentence and speak it out loud.',
      href: '/sentence-scramble',
      icon: <Shuffle className="w-8 h-8 text-primary" />,
    },
    {
      id: 'impromptu-stage',
      title: 'Impromptu Stage',
      description: 'Speak on a random topic for one minute.',
      href: '/impromptu-stage',
      icon: <Presentation className="w-8 h-8 text-primary" />,
    },
    {
      id: 'pitch-perfect',
      title: 'Pitch Perfect',
      description: 'Analyze your pitch and tone for emotional delivery.',
      href: '/pitch-perfect',
      icon: <Mic className="w-8 h-8 text-primary" />,
    },
    {
      id: 'storyteller',
      title: 'Storyteller',
      description: 'Create a story from three random images.',
      href: '/storyteller',
      icon: <ImageIcon className="w-8 h-8 text-primary" />,
    },
];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isPremium: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  features: Feature[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/login', '/signup', '/pricing', '/about', '/privacy-policy', '/terms-of-service'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPremium = profile?.isPremium || false;
  const isAdmin = profile?.role === 'admin';

  const refreshAuth = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userProfile = await getUser(currentUser.uid);
      setProfile(userProfile);
    }
  }, []);
  
  useEffect(() => {
    async function loadFeatureFlags() {
        try {
            const flags = await getFeatureFlags();
            const featureFlagsMap = new Map(flags.map(f => [f.id, f.isPremium]));
            
            const updatedFeatures = ALL_FEATURES_CONFIG.map(feature => ({
                ...feature,
                isPremium: featureFlagsMap.get(feature.id) ?? false // Default to false if not in DB
            }));

            setFeatures(updatedFeatures);

        } catch (error) {
            console.error("Failed to load feature flags, using defaults:", error);
            // On error, default all features to not premium except the base one
             const updatedFeatures = ALL_FEATURES_CONFIG.map(feature => ({
                ...feature,
                isPremium: feature.id !== 'accent-ace'
            }));
            setFeatures(updatedFeatures);
        }
    }
    loadFeatureFlags();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthUserStateChanged((user) => {
      setUser(user);
      if (!user) {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onUserSnapshot(user.uid, (userProfile) => {
        setProfile(userProfile as UserProfile);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);


  useEffect(() => {
    if (isLoading || features.length === 0) return;

    const currentFeature = features.find(f => f.href === pathname);
    const isPublic = publicRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith('/admin');
    
    if (user) { // User is logged in
      if (isAdminRoute && !isAdmin) {
          router.push('/home'); // Non-admin tries to access admin page
      } else if (isPublic && pathname !== '/' && !pathname.startsWith('/pricing') && !pathname.startsWith('/about') && !pathname.startsWith('/privacy-policy') && !pathname.startsWith('/terms-of-service')) { // Allow logged in users to see these pages
          router.push('/home');
      } else if (currentFeature?.isPremium && !isPremium && !isAdmin) { // Admins can access all pages
          router.push('/premium');
      }
    } else { // User is not logged in
        if (!isPublic) {
            router.push('/');
        }
    }
  }, [user, profile, isLoading, pathname, router, features, isAdmin, isPremium]);

  if (isLoading || features.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  // Final check to prevent flicker
   const currentFeature = features.find(f => f.href === pathname);
   const isPublic = publicRoutes.includes(pathname);
   const isAdminRoute = pathname.startsWith('/admin');

   if (!isLoading && !user && !isPublic) {
      return (
         <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
         </div>
       );
   }

  return (
    <AuthContext.Provider value={{ user, profile, isPremium, isAdmin, isLoading, refreshAuth, features }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
