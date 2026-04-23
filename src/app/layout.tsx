import type { Metadata } from 'next';
import './globals.css';
import { GlobalHeader } from '@/components/layout/GlobalHeader'

export const metadata: Metadata = {
  title: 'ArchStudio - Semantic Architecture Editor',
  description: 'Visual semantic editor for enterprise architecture modeling',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <GlobalHeader />
        <main className="flex-1 min-h-0 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
