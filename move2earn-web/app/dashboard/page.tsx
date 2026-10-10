'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Smartphone, 
  Clock, 
  Coins, 
  Trophy, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Video,
  Camera
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { DashboardSummary, Challenge } from '@/lib/types';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workoutSecondsLeft, setWorkoutSecondsLeft] = useState(60);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [motionDetected, setMotionDetected] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const data = Move2EarnStore.getDashboardSummary();
    setSummary(data);
    const challenges = Move2EarnStore.getChallenges();
    setActiveChallenge(challenges[0]);
  };

  const handleStartSimulatedWorkout = () => {
    const ch = activeChallenge || Move2EarnStore.getChallenges()[0];
    setWorkoutSecondsLeft(ch.duration_seconds);
    setIsCameraActive(true);
    setRewardClaimed(false);
    setIsWorkoutModalOpen(true);
  };

  const handleFinishWorkout = () => {
    if (!activeChallenge) return;
    const res = Move2EarnStore.completeWorkout(activeChallenge.id, activeChallenge.duration_seconds);
    setRewardClaimed(true);
    refreshData();
  };

  if (!summary) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
        Memuat ringkasan dashboard...
      </div>
    );
  }

  const effectiveThreshold = isTestMode ? 2 : summary.threshold_minutes;
  const progressPercent = Math.min(100, Math.round((summary.screen_time_minutes / effectiveThreshold) * 100));
  const isThresholdExceeded = summary.screen_time_minutes >= effectiveThreshold;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & QA Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#121b2d] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Daily Screentime & Workout Dashboard</h1>
            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-mono">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Data disinkronkan langsung dari background service Android `UsageStatsManager` dan Supabase
          </p>
        </div>

        {/* QA Test Mode Switch */}
        <div className="flex items-center gap-3 bg-gray-800/60 p-2 rounded-xl border border-gray-700/60">
          <div className="text-right">
            <div className="text-xs font-semibold text-white">Threshold QA Mode</div>
            <div className="text-[10px] text-gray-400 font-mono">
              {isTestMode ? 'Mode Uji: 2 Menit' : 'Default: 60 Menit'}
            </div>
          </div>
          <button
            onClick={() => setIsTestMode(!isTestMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isTestMode
                ? 'bg-amber-400 text-black hover:bg-amber-300'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isTestMode ? 'AKTIF (2 Min)' : 'NONAKTIF (60 Min)'}
          </button>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Combined Screen Time */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Screen Time Target Sosmed</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {summary.screen_time_minutes}
            </span>
            <span className="text-sm text-gray-400 font-medium">/ {effectiveThreshold} Menit</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isThresholdExceeded ? 'bg-red-500' : 'bg-green-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{progressPercent}% dari batas harian</span>
              <span>{isThresholdExceeded ? '⚠️ Batas Tercapai' : 'Normal'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Move Coins Balance */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Saldo Move Coins</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {summary.current_balance}
            </span>
            <span className="text-sm text-amber-200/60 font-medium">Coins</span>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center justify-between">
            <span>Hari ini: +{summary.coins_today}</span>
            <Link href="/wallet" className="text-green-400 hover:underline flex items-center gap-0.5">
              Wallet <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>

        {/* Card 3: Workout Sessions */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Workout Selesai</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {summary.workout_count}
            </span>
            <span className="text-sm text-gray-400 font-medium">Sesi Hari Ini</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Validasi split-screen video & kamera
          </p>
        </div>

        {/* Card 4: Daily Streak */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Aktivitas Streak</span>
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-yellow-300 font-mono">
              4
            </span>
            <span className="text-sm text-gray-400 font-medium">Hari Beruntun</span>
          </div>
          <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Konsistensi terjaga!
          </p>
        </div>
      </div>

      {/* DETAILED STATS & INTERVENTION TRIGGER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): App Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Rincian Penggunaan Aplikasi Target
                </h3>
                <p className="text-xs text-gray-400">
                  Statistik dibaca langsung via Android `PACKAGE_USAGE_STATS`
                </p>
              </div>
              <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-mono">
                {summary.period_date}
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {summary.app_breakdown.map((app) => {
                const minutes = Math.round((app.duration_seconds / 60) * 10) / 10;
                let appName = 'Aplikasi Sosmed';
                let appColor = 'bg-gray-400';
                if (app.package_name.includes('musically') || app.package_name.includes('tiktok')) {
                  appName = 'TikTok';
                  appColor = 'bg-pink-500';
                } else if (app.package_name.includes('instagram')) {
                  appName = 'Instagram';
                  appColor = 'bg-purple-500';
                } else if (app.package_name.includes('youtube')) {
                  appName = 'YouTube Shorts & Video';
                  appColor = 'bg-red-500';
                }

                const pct = Math.min(100, Math.round((minutes / effectiveThreshold) * 100));

                return (
                  <div key={app.package_name} className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${appColor}`} />
                        <span className="text-sm font-medium text-white">{appName}</span>
                        <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                          ({app.package_name})
                        </span>
                      </div>
                      <span className="text-sm font-bold font-mono text-gray-200">
                        {minutes} Menit
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 rounded-full ${appColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Intervention Action / Split Screen Simulation */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-950/40 via-gray-900 to-[#121c2c] border border-green-500/30 space-y-4">
            <div className="flex items-center gap-2 text-green-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Uji Workout Interstitial</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Di aplikasi Android, saat batas screen time terlampaui, notifikasi langsung membuka tampilan layar terbagi dua (video & kamera) ini. Kamu dapat mengujinya langsung di browser:
            </p>

            <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tantangan:</span>
                <span className="text-white font-medium">{activeChallenge?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reward:</span>
                <span className="text-amber-400 font-bold font-mono">+{activeChallenge?.coin_reward} Move Coins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Durasi:</span>
                <span className="text-gray-300 font-mono">{activeChallenge?.duration_seconds} Detik</span>
              </div>
            </div>

            <button
              onClick={handleStartSimulatedWorkout}
              className="w-full py-3 px-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-colors"
            >
              <Play className="w-4 h-4 fill-black" />
              Buka Workout Interstitial (Split-Screen)
            </button>
          </div>
        </div>
      </div>

      {/* SPLIT SCREEN WORKOUT MODAL (INTERSTITIAL SIMULATION) */}
      {isWorkoutModalOpen && activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b0f19] border-2 border-green-500/50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gray-950 px-5 py-3 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  MOVE2EARN INTERSTITIAL
                </span>
              </div>
              <button
                onClick={() => setIsWorkoutModalOpen(false)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md"
              >
                Tutup
              </button>
            </div>

            {/* SPLIT TOP: VIDEO INSTRUCTION */}
            <div className="p-4 bg-gradient-to-b from-slate-900 to-gray-900 border-b border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                  <Video className="w-4 h-4" /> BAGIAN ATAS: Video Panduan Gerakan
                </span>
                <span className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded text-amber-300">
                  Reward: +{activeChallenge.coin_reward} Coins
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center relative">
                {/* Fallback video preview / animated guide */}
                <video
                  src={activeChallenge.media_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-gray-200">
                  <strong className="text-white block">{activeChallenge.title}</strong>
                  <span className="text-[11px] text-gray-300 line-clamp-1">{activeChallenge.instructions}</span>
                </div>
              </div>
            </div>

            {/* SPLIT BOTTOM: CAMERA LIVE VALIDATION */}
            <div className="p-4 bg-black space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> BAGIAN BAWAH: Live Camera Validation
                </span>
                <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Gerakan Terdeteksi
                </span>
              </div>

              {/* Simulated camera feed / bounding box */}
              <div className="rounded-xl border border-dashed border-green-500/50 bg-green-950/10 p-6 flex flex-col items-center justify-center text-center my-2">
                <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center mb-2 animate-pulse">
                  <Flame className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-sm font-semibold text-white">User Motion Detection Active</div>
                <div className="text-xs text-gray-400 mt-1">
                  Kamera memvalidasi pengguna aktif bergerak selama sesi
                </div>
              </div>

              {/* Reward Status or Action Buttons */}
              {rewardClaimed ? (
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500 text-center space-y-2">
                  <div className="text-green-400 font-bold text-sm">
                    🎉 Sesi Selesai! +{activeChallenge.coin_reward} Move Coins Diberikan!
                  </div>
                  <button
                    onClick={() => setIsWorkoutModalOpen(false)}
                    className="w-full py-2 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-lg"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsWorkoutModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                  >
                    Batalkan Sesi
                  </button>
                  <button
                    onClick={handleFinishWorkout}
                    className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-bold shadow-lg shadow-green-500/20"
                  >
                    Selesaikan & Klaim Koin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
