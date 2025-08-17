
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lightbulb, Heart } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <header className="text-center my-12">
          <h1 className="text-5xl font-bold font-headline tracking-tight">About AccentAce</h1>
          <p className="text-xl text-muted-foreground mt-2">Empowering students to communicate with confidence.</p>
        </header>
        <main className="space-y-12">
          <section>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Lightbulb className="w-8 h-8 text-primary"/> Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Our mission is to bridge the communication gap for talented students aiming for top-tier tech jobs. We believe that strong technical skills deserve to be paired with clear, confident communication. AccentAce provides an accessible, AI-powered platform for students to practice their speaking skills and ace their interviews, turning their career aspirations into reality.</p>
                </CardContent>
            </Card>
          </section>

           <section>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Heart className="w-8 h-8 text-primary"/> Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">We envision a world where every student, regardless of their background, has the confidence and ability to articulate their ideas effectively. We aim to be the leading communication coach for the next generation of tech leaders, helping them not just to land a job, but to thrive in their careers.</p>
                </CardContent>
            </Card>
          </section>

           <section>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Users className="w-8 h-8 text-primary"/> Our Team</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">AccentAce was built by a passionate team of engineers, educators, and language experts who have witnessed the challenges students face in high-stakes interviews. We combine cutting-edge AI with proven pedagogical techniques to create a practice experience that is both effective and engaging. We are dedicated to your success.</p>
                </CardContent>
            </Card>
          </section>
          
        </main>
      </div>
    </div>
  );
}
