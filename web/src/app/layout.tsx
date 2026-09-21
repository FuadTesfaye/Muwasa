import type { Metadata, Viewport } from 'next';
import { Inter, Amiri, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
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
  themeColor: '#070b14',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${amiri.variable} ${cormorant.variable} font-sans bg-[#070b14] text-slate-100 antialiased min-h-screen flex flex-col relative`}>
        <div className="absolute inset-0 islamic-lattice pointer-events-none z-0" />
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
