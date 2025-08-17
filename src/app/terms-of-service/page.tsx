
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <header className="text-center my-12">
          <h1 className="text-5xl font-bold font-headline tracking-tight">Terms of Service</h1>
          <p className="text-xl text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>
        <main className="space-y-8 text-muted-foreground">
          <Card>
            <CardHeader>
              <CardTitle>1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>By using AccentAce (the "Application"), you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the Application. We may modify these Terms at any time, and such modification shall be effective immediately upon posting of the modified Terms. You agree to review the Terms periodically to be aware of such modifications and your continued access or use of the Application shall be deemed your conclusive acceptance of the modified Terms.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use of the Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You agree to use the Application only for lawful purposes. You are solely responsible for the knowledge of and adherence to any and all laws, statutes, rules and regulations pertaining to your use of the Application. You agree that you will not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Application to commit a criminal offense or to encourage others to engage in any conduct that would constitute a criminal offense or give rise to civil liability.</li>
                <li>Post or transmit any discriminatory, libelous, harassing, defamatory, obscene, pornographic, or otherwise unlawful content.</li>
                <li>Use the Application to impersonate other parties or entities.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>3. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The content, organization, graphics, design, compilation, and other matters related to the Application are protected under applicable copyrights, trademarks, and other proprietary (including but not limited to intellectual property) rights. The copying, redistribution, use or publication by you of any such matters or any part of the Application is strictly prohibited.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Disclaimer of Warranty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The Application is provided "as is," without a warranty of any kind. We disclaim all warranties, whether express, implied, statutory or otherwise, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the functions contained in the Application will be uninterrupted or error-free, that defects will be corrected, or that the Application or the server that makes it available are free of viruses or other harmful components.</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>5. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have questions or comments about these Terms of Service, please contact us at: <a href="mailto:support@certifyo.tech" className="text-primary hover:underline">support@certifyo.tech</a></p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
