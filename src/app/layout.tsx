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
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased">
        <div className="min-h-screen flex flex-col">
          <GlobalHeader />
          <main className="flex-1 min-h-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
