
'use client';

import Link from 'next/link';
import { Speech, LogOut, Star, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


export function Header() {
  const { user, profile, isPremium, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    router.push('/');
  };
  
  const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    // Add more links here, e.g. Blog, Tutorials
  ];

  return (
    <header className="bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href={user ? "/home" : "/"} className="flex items-center space-x-2 mr-8">
          <Speech className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AccentAce</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
             {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                </Link>
             ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              {isAdmin && (
                 <Button onClick={() => router.push('/admin')} size="sm" variant="secondary">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              )}
               <Button onClick={() => router.push('/home')} size="sm" variant="ghost">
                  Dashboard
                </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarFallback className="text-2xl bg-background">{profile?.avatar || '😀'}</AvatarFallback>
                     </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.displayName || 'My Account'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => router.push('/profile')}>
                        Profile
                    </DropdownMenuItem>
                    {!isPremium && <DropdownMenuItem onClick={() => router.push('/premium')} className="text-primary focus:text-primary font-semibold">
                         <Star className="mr-2 h-4 w-4" />
                        Go Premium
                    </DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
                 <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                </Button>
                 <Button asChild className="bg-gray-900 text-white hover:bg-gray-800" size="sm">
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
