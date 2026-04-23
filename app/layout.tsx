import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/navigation';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'GTR Monitor - Sistema de Monitoreo',
  description:
    'Monitor en tiempo real para agentes de call center',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable} dark bg-black`}>
      <body className="min-h-screen bg-black font-sans text-gray-100 antialiased">
        <Navbar />
        <main>{children}</main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <footer className="mt-auto w-full bg-[#111111] border-t border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-4 text-center">
            <p className="text-sm text-gray-400">
              Desarrollado por <span className="text-gray-200">Joseph Omar Meza Torres</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
