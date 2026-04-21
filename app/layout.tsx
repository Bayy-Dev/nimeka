import type { Metadata } from 'next';
import { Syne, Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { SessionProvider } from 'next-auth/react';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Nimeka — Watch Anime Free',
  description: 'Stream anime online free in HD. No ads.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${mono.variable}`}>
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="footer">
            <p>© 2025 Nimeka · Built with 🖤 for anime lovers</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
