
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, User, Star, Shield, Calendar, Mail, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser, updateUserProfile } from '@/services/userService';
import type { UserProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    if (user) {
      try {
        setIsLoadingProfile(true);
        const userProfile = await getUser(user.uid);
        setProfile(userProfile as UserProfile);
        setDisplayName(userProfile?.displayName || '');
        setAvatar(userProfile?.avatar || '');
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load profile.' });
      } finally {
        setIsLoadingProfile(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchProfile();
    }
  }, [user, isAuthLoading]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, { displayName, avatar });
      await fetchProfile(); // Refresh profile data
      toast({ title: 'Success', description: 'Your profile has been updated.' });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update your profile.' });
    } finally {
      setIsSaving(false);
    }
  }


  const getReadableDate = (timestamp: any) => {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  if (isAuthLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-128px)]">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-128px)]">
            <p>Could not load user profile.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="pb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">View and edit your account details.</p>
      </header>

      <main className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="text-5xl">{profile.avatar || '😀'}</div>
             <div>
                <CardTitle>{profile.displayName || profile.email}</CardTitle>
                <CardDescription>Your personal account information.</CardDescription>
             </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                <Mail className="w-5 h-5 text-muted-foreground"/>
                <span className="font-medium">Email:</span>
                <span>{profile.email}</span>
            </div>
             <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                <Calendar className="w-5 h-5 text-muted-foreground"/>
                <span className="font-medium">Member Since:</span>
                <span>{getReadableDate(profile.createdAt)}</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                <Star className="w-5 h-5 text-muted-foreground"/>
                <span className="font-medium">Subscription:</span>
                <Badge variant={profile.isPremium ? "default" : "secondary"}>
                    {profile.isPremium ? "Premium" : "Standard"}
                </Badge>
            </div>
             <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                <Shield className="w-5 h-5 text-muted-foreground"/>
                <span className="font-medium">Role:</span>
                 <Badge variant={profile.role === 'admin' ? "destructive" : "outline"}>
                    {profile.role || 'user'}
                </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5"/>
                Edit Profile
            </CardTitle>
            <CardDescription>Update your display name and avatar.</CardDescription>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
                  <Input 
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                 <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-muted-foreground mb-1">Avatar (Emoji)</label>
                  <Input 
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="😀"
                    maxLength={2}
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Save Changes
                </Button>
             </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
