import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MOVE2EARN — Ubah Scroll Menjadi Keringat & Koin',
  description: 'Platform tracking olahraga yang membaca statistik penggunaan aplikasi sosmed dan memicu workout interstitial dengan reward Move Coins.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#0b0f19] text-gray-100 flex flex-col min-h-screen antialiased selection:bg-green-500 selection:text-black">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
