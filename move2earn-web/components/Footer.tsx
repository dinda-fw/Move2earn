import React from 'react';
import { Flame, ShieldCheck, Heart, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-[#080c14] text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                MOVE<span className="text-green-400">2EARN</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Platform revolusioner yang mendeteksi batas waktu scrolling media sosial (TikTok, Instagram, YouTube) melalui Android Usage Access dan mengubahnya menjadi dorongan workout harian dengan imbalan Move Coins.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-md w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Privasi Terjamin: Tidak ada pembacaan chat/password/konten pribadi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Fitur Utama</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="hover:text-green-400 transition-colors">Screen Time Tracker</a></li>
              <li><a href="/wallet" className="hover:text-green-400 transition-colors">Move Coins Wallet</a></li>
              <li><a href="/rewards" className="hover:text-green-400 transition-colors">Marketplace Reward</a></li>
              <li><a href="/redemptions" className="hover:text-green-400 transition-colors">Voucher Penukaran</a></li>
              <li><a href="/admin" className="hover:text-green-400 transition-colors">Admin Portal</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-1.5 text-xs text-gray-400 font-mono">
              <li>• Android Kotlin + Compose</li>
              <li>• CameraX (Live Validation)</li>
              <li>• Android UsageStatsManager</li>
              <li>• Next.js App Router (TS)</li>
              <li>• Supabase PostgreSQL & RLS</li>
              <li>• Atomic RPC & Idempotency</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 MOVE2EARN Platform. Built for 48-Hour Hackathon Demo.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-gray-300 font-medium">Supabase</span>
            <span>&</span>
            <span className="text-green-400 font-medium">Next.js + Android</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
