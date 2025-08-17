
'use client';

import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose md:text-left">
                        © {new Date().getFullYear()} AccentAce, a product by Certifyo. All rights reserved.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
                    <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                    <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
