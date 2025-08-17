
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, User, Ticket, PlusCircle, ToggleRight, ToggleLeft, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, updateUserPremiumStatus } from '@/services/userService';
import { createCoupon, getAllCoupons } from '@/services/couponService';
import type { UserProfile, Coupon, FeatureFlag } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getFeatureFlags, updateFeatureFlag } from '@/services/featureConfigService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminPage() {
  const { isAdmin, isLoading: isAuthLoading, features } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // New Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      router.push('/home');
    }
  }, [isAdmin, isAuthLoading, router]);
  
  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [usersData, couponsData, flagsData] = await Promise.all([
        getAllUsers(),
        getAllCoupons(),
        getFeatureFlags()
      ]);
      
      const allFeatureIds = features.map(f => f.id);
      const existingFlagIds = flagsData.map(f => f.id);
      const missingFlags = allFeatureIds.filter(id => !existingFlagIds.includes(id));
      
      // If a feature from the frontend config doesn't exist in the DB, show it as non-premium by default
      const allFlags = [
          ...flagsData,
          ...missingFlags.map(id => ({id, isPremium: false}))
      ];

      setUsers(usersData);
      setCoupons(couponsData);
      setFeatureFlags(allFlags);

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load admin data.' });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleTogglePremium = async (uid: string, currentStatus: boolean) => {
      try {
          await updateUserPremiumStatus(uid, !currentStatus);
          toast({ title: 'Success', description: "User's premium status has been updated."});
          await loadAdminData(); // Refresh data
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: "Failed to update user's premium status."});
      }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !discountPercent || !expiresAt) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all coupon fields.' });
      return;
    }
    setIsCreatingCoupon(true);
    try {
      await createCoupon({
        code: couponCode.toUpperCase(),
        discountPercent: parseInt(discountPercent, 10),
        expiresAt: new Date(expiresAt),
      });
      toast({ title: 'Success', description: `Coupon ${couponCode.toUpperCase()} created!` });
      // Reset form
      setCouponCode('');
      setDiscountPercent('');
      setExpiresAt('');
      await loadAdminData(); // Refresh data
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleFeatureFlagToggle = async (id: string, newStatus: boolean) => {
      try {
        await updateFeatureFlag(id, newStatus);
        toast({ title: 'Success', description: `Feature '${id}' has been updated.`});
        await loadAdminData(); // Refresh data
      } catch (error) {
         toast({ variant: 'destructive', title: 'Error', description: "Failed to update feature flag."});
      }
  }


  if (isAuthLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <header className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Panel</h1>
          </div>
        </header>

        <main className="mt-8">
            <Tabs defaultValue="users">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users"><User className="mr-2 h-4 w-4"/>Users</TabsTrigger>
                <TabsTrigger value="coupons"><Ticket className="mr-2 h-4 w-4"/>Coupons</TabsTrigger>
                <TabsTrigger value="features"><Settings className="mr-2 h-4 w-4"/>Feature Flags</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all registered users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Premium Status</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map(user => (
                          <TableRow key={user.uid}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>
                               <Badge variant={user.isPremium ? 'default' : 'secondary'}>
                                {user.isPremium ? 'Premium' : 'Standard'}
                               </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                                {user.role || 'user'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {user.role !== 'admin' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleTogglePremium(user.uid, user.isPremium)}
                                    >
                                      {user.isPremium ? <ToggleRight className="mr-2"/> : <ToggleLeft className="mr-2"/>}
                                      Toggle Premium
                                    </Button>
                                )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="coupons">
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create New Coupon</CardTitle>
                        <CardDescription>Generate a new discount coupon for users.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                          <Input
                            placeholder="Coupon Code (e.g., SAVE20)"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                          />
                           <Input
                            placeholder="Discount Percentage (e.g., 20)"
                            type="number"
                            value={discountPercent}
                            onChange={e => setDiscountPercent(e.target.value)}
                          />
                          <Input
                            placeholder="Expiration Date"
                            type="date"
                            value={expiresAt}
                            onChange={e => setExpiresAt(e.target.value)}
                          />
                          <Button type="submit" disabled={isCreatingCoupon}>
                            {isCreatingCoupon ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                            Create Coupon
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Coupons</CardTitle>
                        <CardDescription>A list of all currently available coupons.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Code</TableHead>
                              <TableHead>Discount</TableHead>
                              <TableHead>Expires</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {coupons.map(coupon => (
                              <TableRow key={coupon.id}>
                                <TableCell className="font-mono">{coupon.code}</TableCell>
                                <TableCell>{coupon.discountPercent}%</TableCell>
                                <TableCell>{new Date(coupon.expiresAt.seconds * 1000).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                 </div>
              </TabsContent>
               <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>
                      Enable or disable premium status for each feature. Changes will apply to all users instantly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featureFlags.map(flag => (
                        <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                           <div>
                            <Label htmlFor={`feature-${flag.id}`} className="text-lg font-medium capitalize">{flag.id.replace(/-/g, ' ')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {features.find(f => f.id === flag.id)?.description}
                            </p>
                           </div>
                           <div className="flex items-center space-x-2">
                                <Label htmlFor={`feature-${flag.id}`}>{flag.isPremium ? "Premium" : "Free"}</Label>
                                <Switch
                                    id={`feature-${flag.id}`}
                                    checked={flag.isPremium}
                                    onCheckedChange={(checked) => handleFeatureFlagToggle(flag.id, checked)}
                                />
                            </div>
                        </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
