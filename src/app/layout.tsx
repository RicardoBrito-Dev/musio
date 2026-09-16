import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { PlayerProvider } from '@/contexts/player-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlobalPlayer } from '@/components/player/global-player';

export const metadata: Metadata = {
  title: 'Musio — Música independente. Direto de quem faz.',
  description:
    'Plataforma digital para artistas independentes publicarem suas músicas, construírem comunidade e monetizarem diretamente com seus fãs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950">
        <AuthProvider>
          <PlayerProvider>
            <Navbar />
            <main className="flex-1 pb-20">{children}</main>
            <Footer />
            <GlobalPlayer />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
