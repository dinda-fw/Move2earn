'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Coins, 
  Smartphone, 
  Camera, 
  Video, 
  ShieldCheck, 
  BellRing, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Gift
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-green-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon 48H • Android + Supabase + Next.js</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Ubah Scrolling Sosmed Jadi{' '}
          <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
            Workout & Move Coins!
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          MOVE2EARN membaca statistik penggunaan aplikasi sosmed (TikTok, Instagram, YouTube). Saat batas screentime tercapai, notifikasi memicu <strong className="text-white font-semibold">Workout Interstitial split-screen</strong> dengan validasi kamera dan reward koin!
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/demo"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-extrabold text-base shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5 animate-pulse"
          >
            <Smartphone className="w-5 h-5 fill-black" />
            <span>📱 Buka Sesi Demo HP (Simulator)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gray-800/90 hover:bg-gray-700 border border-gray-700 text-white font-semibold text-base transition-colors"
          >
            <Activity className="w-5 h-5 text-green-400" />
            <span>Web Dashboard</span>
          </Link>

          <Link
            href="/rewards"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white font-semibold text-base transition-colors"
          >
            <Gift className="w-5 h-5 text-amber-400" />
            <span>Reward Katalog</span>
          </Link>
        </div>

        {/* METRICS BAR */}
        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#111827]/60 border border-gray-800/80 backdrop-blur">
          <div className="p-3 text-center">
            <div className="text-2xl font-bold text-green-400 font-mono">60 Menit</div>
            <div className="text-xs text-gray-400">Default Daily Threshold</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">1–2 Menit</div>
            <div className="text-xs text-gray-400">QA Demo Threshold</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl font-bold text-teal-400 font-mono">2-in-1 Split</div>
            <div className="text-xs text-gray-400">Video + CameraX</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl font-bold text-purple-400 font-mono">1x Sesi</div>
            <div className="text-xs text-gray-400">Idempotent Reward</div>
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT: SPLIT-SCREEN WORKOUT INTERSTITIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Fitur Utama: Layar Terbagi 2 (Split-Screen Interstitial)
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Sesuai PRD, saat ambang scrolling tercapai, notifikasi membuka interstitial yang membagi layar smartphone menjadi dua:
          </p>
        </div>

        {/* MOCKUP INTERSTITIAL SPLIT SCREEN */}
        <div className="max-w-md mx-auto rounded-3xl p-3 bg-gradient-to-b from-gray-700 via-gray-900 to-black shadow-2xl border-2 border-gray-700">
          <div className="rounded-[22px] overflow-hidden bg-black flex flex-col border border-gray-800 text-white">
            {/* Top Bar / Status */}
            <div className="bg-gray-950 px-4 py-2 flex items-center justify-between text-xs border-b border-gray-800">
              <span className="font-semibold text-green-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                MOVE2EARN INTERSTITIAL
              </span>
              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                REC • 00:45
              </span>
            </div>

            {/* TOP HALF: VIDEO / INSTRUCTION */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-950 via-slate-900 to-gray-950 p-4 flex flex-col justify-between border-b-2 border-green-500/50">
              <div className="flex items-center justify-between">
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Bagian Atas: Video Panduan
                </span>
                <span className="text-xs bg-black/60 px-2 py-1 rounded text-gray-300 font-mono">
                  Target: 60s
                </span>
              </div>

              <div className="text-center py-2">
                <h4 className="text-lg font-bold text-white">Plank & Core Stability</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Jaga siku sejajar bahu, tahan posisi tubuh tetap lurus dan kokoh!
                </p>
              </div>

              <div className="flex justify-center items-center gap-2">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
                <span className="text-xs font-mono font-bold text-green-400">75%</span>
              </div>
            </div>

            {/* BOTTOM HALF: CAMERA VALIDATION */}
            <div className="relative h-48 bg-gradient-to-br from-zinc-900 via-stone-900 to-black p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" /> Bagian Bawah: Camera Preview
                </span>
                <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Gerakan Terdeteksi
                </span>
              </div>

              <div className="flex items-center justify-center py-3">
                <div className="w-24 h-24 border-2 border-dashed border-green-400/80 rounded-2xl flex items-center justify-center bg-green-500/5">
                  <span className="text-[10px] text-green-300 text-center px-1">
                    Area Deteksi Tubuh Aktif
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <Link 
                  href="/demo"
                  className="flex-1 py-2 text-center text-xs font-bold text-black bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg hover:from-green-300 hover:to-emerald-300 shadow flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Coba di Simulator HP Interaktif</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / ALUR APLIKASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Alur Kerja Sistem MOVE2EARN</h2>
          <p className="mt-3 text-gray-400">5 langkah sederhana mengubah screentime pasif menjadi tubuh sehat dan koin nyata</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Onboarding Izin',
              desc: 'Pengguna mengaktifkan Usage Access di Settings Android agar app dapat membaca statistik sosmed.',
              icon: ShieldCheck,
              color: 'text-blue-400'
            },
            {
              step: '02',
              title: 'Monitor Screentime',
              desc: 'Menghitung screen time gabungan TikTok, Instagram, YouTube harian secara hemat baterai.',
              icon: TrendingUp,
              color: 'text-amber-400'
            },
            {
              step: '03',
              title: 'Notifikasi Cerdas',
              desc: 'Saat batas 60 menit tercapai (atau 1-2 menit uji coba), notifikasi dikirim ke perangkat.',
              icon: BellRing,
              color: 'text-red-400'
            },
            {
              step: '04',
              title: 'Workout Split-Screen',
              desc: 'Layar terbagi 2: Atas video panduan gerakan, bawah kamera mendeteksi gerakan aktif.',
              icon: Video,
              color: 'text-green-400'
            },
            {
              step: '05',
              title: 'Reward Move Coins',
              desc: 'Backend Supabase memvalidasi sesi secara idempotent dan memberikan Move Coins untuk ditukar.',
              icon: Coins,
              color: 'text-yellow-400'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-gray-500">{item.step}</span>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
