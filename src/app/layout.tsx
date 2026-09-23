import type { Metadata, Viewport } from 'next';
import { Lexend, Amiri, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });
const amiri = Amiri({ 
  weight: ['400', '700'], 
  subsets: ['arabic'], 
  variable: '--font-amiri' 
});
const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Muwāsā — مُوَاسَاة | A Quiet Sanctuary to Speak and Reflect',
  description: 'When your heart is heavy, speak. A private Islamic emotional-support companion that listens first and grounds your heart in the Qur\'an and Sunnah.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0e1015',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${lexend.variable} ${amiri.variable} ${cormorant.variable} font-sans bg-[#f8f7f4] dark:bg-[#0e1015] text-[#1c1e24] dark:text-[#d4d6dd] antialiased min-h-screen flex flex-col transition-colors duration-200`}>
        <ThemeProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
