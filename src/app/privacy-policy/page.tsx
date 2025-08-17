
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <header className="text-center my-12">
          <h1 className="text-5xl font-bold font-headline tracking-tight">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>
        <main className="space-y-8 text-muted-foreground">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Welcome to AccentAce ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Collection of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the Application.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.</li>
                <li><strong>Data from Speech Analysis:</strong> We collect and process audio recordings you submit for the purpose of providing you with our speech analysis services. These recordings are processed by our AI models to provide feedback and are stored temporarily to maintain your practice history.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>3. Use of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
               <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your account.</li>
                <li>Provide you with our core services, including speech and accent analysis.</li>
                <li>Email you regarding your account or order.</li>
                <li>Improve our Application and services.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Security of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>5. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:support@certifyo.tech" className="text-primary hover:underline">support@certifyo.tech</a></p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
