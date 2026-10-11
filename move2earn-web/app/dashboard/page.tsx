'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Camera, 
  Dumbbell, 
  Footprints, 
  Calendar, 
  Zap, 
  Activity, 
  Check 
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { DashboardSummary, Challenge, ActivitySummary } from '@/lib/types';
import { 
  fetchMoveItMedia, 
  getMediaForSession, 
  DEFAULT_MOVEIT_VIDEO, 
  DEFAULT_MOVEIT_IMAGES, 
  MoveItMediaItem, 
  MoveItMediaRegistry 
} from '@/lib/moveitMedia';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(() => Move2EarnStore.getDashboardSummary());
  const [activity, setActivity] = useState<ActivitySummary>(() => Move2EarnStore.getActivitySummary());
  const [isTestMode, setIsTestMode] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(() => Move2EarnStore.getChallenges()[0] || null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workoutSecondsLeft, setWorkoutSecondsLeft] = useState(60);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // MoveIt Dynamic Media from components/media & Webcam state
  const [moveItSessionNumber, setMoveItSessionNumber] = useState(1);
  const [moveItRegistry, setMoveItRegistry] = useState<MoveItMediaRegistry>({
    video: DEFAULT_MOVEIT_VIDEO,
    images: DEFAULT_MOVEIT_IMAGES
  });
  const [currentMoveItMedia, setCurrentMoveItMedia] = useState<MoveItMediaItem>(DEFAULT_MOVEIT_VIDEO);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const dashboardVideoRef = useRef<HTMLVideoElement | null>(null);
  const dashboardStreamRef = useRef<MediaStream | null>(null);

  // Load MoveIt media on mount
  useEffect(() => {
    fetchMoveItMedia().then((reg) => {
      setMoveItRegistry(reg);
      setCurrentMoveItMedia(getMediaForSession(moveItSessionNumber, reg));
    });
  }, []);

  // Manage webcam for MoveIt modal
  useEffect(() => {
    if (isWorkoutModalOpen) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          dashboardStreamRef.current = stream;
          setIsWebcamActive(true);
          if (dashboardVideoRef.current) {
            dashboardVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setIsWebcamActive(false);
        });
    } else {
      if (dashboardStreamRef.current) {
        dashboardStreamRef.current.getTracks().forEach((t) => t.stop());
        dashboardStreamRef.current = null;
      }
      setIsWebcamActive(false);
    }

    return () => {
      if (dashboardStreamRef.current) {
        dashboardStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isWorkoutModalOpen]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const data = Move2EarnStore.getDashboardSummary();
    setSummary(data);
    const act = Move2EarnStore.getActivitySummary();
    setActivity(act);
    const challenges = Move2EarnStore.getChallenges();
    setActiveChallenge(challenges[0]);
  };

  const handleStartSimulatedWorkout = () => {
    const ch = activeChallenge || Move2EarnStore.getChallenges()[0];
    setWorkoutSecondsLeft(ch.duration_seconds);
    setRewardClaimed(false);
    setIsWorkoutModalOpen(true);
  };

  const handleFinishWorkout = () => {
    if (!activeChallenge) return;
    Move2EarnStore.completeWorkout(activeChallenge.id, activeChallenge.duration_seconds);
    setRewardClaimed(true);
    refreshData();
  };

  const effectiveThreshold = isTestMode ? 2 : summary.threshold_minutes;
  const progressPercent = Math.min(100, Math.round((summary.screen_time_minutes / effectiveThreshold) * 100));
  const isThresholdExceeded = summary.screen_time_minutes >= effectiveThreshold;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & QA Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#121b2d] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Dashboard Aktivitas Olahraga & Screen Time</h1>
            <span className="text-xs bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 px-2 py-0.5 rounded-full font-mono font-bold">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Pelacakan ganda terintegrasi: Log micro-workout fisik harian dan ambang batas screen time sosmed (TikTok, Instagram, YouTube)
          </p>
        </div>

        {/* Action Controls & QA Mode */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/workout"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ccff00] to-emerald-400 hover:from-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#ccff00]/20 transition-all shrink-0"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Buka Workout Planner</span>
          </Link>

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
      </div>

      {/* ==================================================================== */}
      {/* SECTION 1: DUAL FITNESS & SCREENTIME KPI METRIC CARDS */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Daily Activity Goal Ring */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Daily Workout Goal</span>
            <Activity className="w-5 h-5 text-[#ccff00]" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {activity.active_minutes} <span className="text-sm font-normal text-gray-400">/ {activity.daily_goal_minutes} min</span>
              </div>
              <span className="text-xs text-[#ccff00] font-semibold block mt-1">
                {activity.daily_goal_percent}% Tercapai Hari Ini
              </span>
            </div>
            {/* Mini Progress Ring */}
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="18" className="stroke-gray-800" strokeWidth="4" fill="transparent" />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  className="stroke-[#ccff00]"
                  strokeWidth="4"
                  strokeDasharray={113}
                  strokeDashoffset={113 * (1 - activity.daily_goal_percent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-white">{activity.daily_goal_percent}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-[#ccff00] h-1.5 rounded-full" style={{ width: `${activity.daily_goal_percent}%` }} />
          </div>
        </div>

        {/* Card 2: Calories & Steps */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Kalori & Langkah Fisik</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <span className="text-2xl font-bold text-white font-mono">{activity.calories_burned}</span>
              <span className="text-[11px] text-gray-400 block">Kcal Terbakar</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white font-mono">{activity.steps_count.toLocaleString()}</span>
              <span className="text-[11px] text-gray-400 block">Langkah Kaki</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-800 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-teal-400" />
            <span>+32% lebih aktif vs rata-rata harian</span>
          </p>
        </div>

        {/* Card 3: Screen Time Sosmed */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Screen Time Target Sosmed</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {summary.screen_time_minutes}
            </span>
            <span className="text-sm text-gray-400 font-medium">/ {effectiveThreshold} Menit</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${isThresholdExceeded ? 'bg-red-500' : 'bg-green-400'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>Saved: 1h 20m</span>
              <span className={isThresholdExceeded ? 'text-red-400 font-bold' : 'text-green-400'}>
                {isThresholdExceeded ? '⚠️ Ambang Tercapai' : 'Aman'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Move Coins & Streak */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Saldo Move Coins</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                {summary.current_balance}
              </span>
              <span className="text-xs text-amber-200/60 font-medium">Coins</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/60 border border-gray-700 text-xs font-bold text-[#ccff00] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-[#ccff00]" />
              7 Streak
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-800 flex items-center justify-between">
            <span>+{summary.coins_today} Koin Hari Ini</span>
            <Link href="/wallet" className="text-green-400 hover:underline flex items-center gap-0.5">
              Tukar Hadiah <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: CHARTS ROW (WORKOUT WEEKLY MINUTES & HOURLY SCREENTIME) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHART 1: WEEKLY WORKOUT MINUTES (7 COLS) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#ccff00]" />
                Grafik Olahraga Mingguan (This Week Workout Activity)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Total durasi latihan harian (menit) yang tervalidasi via kamera
              </p>
            </div>
            <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-mono">
              Target: 35 min/hari
            </span>
          </div>

          {/* Bar Chart Graphic */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between h-44 px-3 border-b border-gray-800 pb-3">
              {activity.this_week.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1 relative group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-[#ccff00] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#ccff00]/40 transition-opacity whitespace-nowrap">
                    {item.minutes} Menit
                  </div>
                  
                  {item.active && (
                    <span className="absolute -top-6 text-[10px] font-mono font-bold text-[#ccff00] bg-black/80 px-1.5 py-0.5 rounded border border-[#ccff00]/30">
                      35m Peak
                    </span>
                  )}

                  {/* The bar */}
                  <div
                    className={`w-6 sm:w-8 rounded-xl transition-all duration-300 ${
                      item.active 
                        ? 'bg-[#ccff00] shadow-lg shadow-[#ccff00]/20' 
                        : 'bg-[#1e293b] hover:bg-gray-700'
                    }`}
                    style={{ height: `${Math.round((item.minutes / 40) * 100)}%` }}
                  />
                  <span className={`text-xs font-mono ${item.active ? 'text-[#ccff00] font-bold' : 'text-gray-400'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mt-3 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ccff00]" />
                Hari Ini / Peak Target
              </span>
              <span>Total Minggu Ini: <strong>173 Menit Olahraga</strong></span>
            </div>
          </div>
        </div>

        {/* CHART 2: HOURLY SOCIAL SCREENTIME (5 COLS) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Screen Time Jam-jaman Hari Ini
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Pola waktu scrolling sosmed harian
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              ↓ 42% vs kemarin
            </span>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between h-44 px-3 border-b border-gray-800 pb-3">
              {activity.today_hourly_screentime.map((item) => (
                <div key={item.hour} className="flex flex-col items-center gap-2 flex-1 relative group">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-blue-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-400/40 transition-opacity">
                    {item.minutes}m
                  </div>

                  {item.active && (
                    <span className="absolute -top-6 text-[10px] font-mono font-bold text-blue-300 bg-black/80 px-1 py-0.5 rounded border border-blue-500/30">
                      28m
                    </span>
                  )}

                  <div
                    className={`w-5 sm:w-6 rounded-lg transition-all ${
                      item.active ? 'bg-blue-500 shadow-md shadow-blue-500/30' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    style={{ height: `${Math.round((item.minutes / 32) * 100)}%` }}
                  />
                  <span className="text-xs font-mono text-gray-400">
                    {item.hour}:00
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mt-3 pt-1">
              <span>Jam puncak scrolling: <strong>12:00 - 15:00</strong></span>
              <span>Total: <strong>1h 20m</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: DAILY WORKOUT SESSIONS TABLE (TABEL TRACKING OLAHRAGA) */}
      {/* ==================================================================== */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ccff00]" />
              Tabel Tracking Sesi Olahraga Harian (Daily Workout Audit Log)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Riwayat mikro-olahraga yang dipicu notifikasi dan divalidasi langsung oleh kamera AI
            </p>
          </div>
          
          <button
            onClick={handleStartSimulatedWorkout}
            className="px-4 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-[#ccff00]/20 transition-all self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Mulai Sesi Workout Baru</span>
          </button>
        </div>

        {/* The Workout Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/80 border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Nama Latihan</th>
                <th className="py-3 px-4">Waktu Sesi</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Kalori Terbakar</th>
                <th className="py-3 px-4">Move Coins</th>
                <th className="py-3 px-4">Validasi Kamera AI</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {activity.recent_sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <span>{sess.title}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {sess.time}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">
                    {sess.duration_minutes} Menit
                  </td>
                  <td className="py-3.5 px-4 text-orange-400 font-mono font-bold">
                    {sess.calories} kcal
                  </td>
                  <td className="py-3.5 px-4 text-[#ccff00] font-mono font-extrabold">
                    +{sess.coins} 🪙
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[3]" /> Terverifikasi AI
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/demo"
                      className="text-xs text-gray-400 hover:text-[#ccff00] transition-colors"
                    >
                      Buka di HP &gt;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 4: APPS BREAKDOWN & SPLIT INTERSTITIAL MODAL */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Target Apps Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Rincian Penggunaan Aplikasi Sosmed Target
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

        {/* Right Column: Interstitial Action Preview */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121f10] via-gray-900 to-[#121c2c] border border-[#ccff00]/30 space-y-4">
            <div className="flex items-center gap-2 text-[#ccff00]">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Uji Workout Interstitial</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Saat batas screen time tercapai, notifikasi di HP otomatis membuka tampilan layar terbagi dua (video & kamera) ini:
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
              className="w-full py-3 px-4 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/20 transition-colors"
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
          <div className="bg-[#0b0f19] border-2 border-[#ccff00]/50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gray-950 px-5 py-3 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#ccff00]" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  MOVEIT INTERSTITIAL
                </span>
              </div>
              <button
                onClick={() => setIsWorkoutModalOpen(false)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md"
              >
                Tutup
              </button>
            </div>

            {/* SPLIT TOP: MEDIA ARAHAN (components/media) */}
            <div className="p-4 bg-gradient-to-b from-slate-900 to-gray-900 border-b border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                  <Video className="w-4 h-4" /> 
                  BAGIAN ATAS: Arahan Gerakan ({moveItSessionNumber === 1 ? 'Sesi 1 • Video' : `Sesi ${moveItSessionNumber} (+1 Jam) • Random Foto`})
                </span>
                <span className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded text-[#ccff00] border border-[#ccff00]/30 font-bold">
                  Reward: +{activeChallenge?.coin_reward || 25} Coins
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center relative border border-gray-800">
                {currentMoveItMedia.type === 'video' ? (
                  <video
                    src={currentMoveItMedia.url}
                    onError={(e) => {
                      if (e.currentTarget.src !== currentMoveItMedia.fallbackUrl) {
                        e.currentTarget.src = currentMoveItMedia.fallbackUrl;
                      }
                    }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentMoveItMedia.url}
                    onError={(e) => {
                      if (e.currentTarget.src !== currentMoveItMedia.fallbackUrl) {
                        e.currentTarget.src = currentMoveItMedia.fallbackUrl;
                      }
                    }}
                    alt={currentMoveItMedia.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-gray-200">
                  <strong className="text-white block">{currentMoveItMedia.title}</strong>
                  <span className="text-[11px] text-gray-300 line-clamp-1">{currentMoveItMedia.instructions}</span>
                </div>
              </div>
            </div>

            {/* SPLIT BOTTOM: CAMERA LIVE VALIDATION (FOKUS KAMERA FISIK) */}
            <div className="p-4 bg-black space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> BAGIAN BAWAH: Live Camera Validation
                </span>
                <span className="text-[10px] bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> {isWebcamActive ? 'Kamera Terhubung' : 'Kamera Siap'}
                </span>
              </div>

              {/* Real Camera Feed */}
              <div className="relative rounded-xl border border-dashed border-[#ccff00]/50 bg-black/60 aspect-video overflow-hidden flex items-center justify-center my-2">
                <video
                  ref={dashboardVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover -scale-x-100 ${isWebcamActive ? 'block' : 'hidden'}`}
                />

                {isWebcamActive && (
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-[#ccff00]/40 text-[#ccff00] text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                    <span>LIVE CAMERA VALIDATION AKTIF</span>
                  </div>
                )}

                {!isWebcamActive && (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#ccff00] bg-[#ccff00]/15 flex items-center justify-center mb-2 animate-pulse">
                      <Camera className="w-6 h-6 text-[#ccff00]" />
                    </div>
                    <div className="text-sm font-semibold text-white">Live Camera Feed</div>
                    <div className="text-xs text-gray-400 mt-1 max-w-[260px]">
                      Kamera fisik memvalidasi gerakan aktif selama sesi tanpa AI skeleton
                    </div>
                  </div>
                )}
              </div>

              {/* Reward Status or Action Buttons */}
              {rewardClaimed ? (
                <div className="p-3 rounded-xl bg-[#ccff00]/15 border border-[#ccff00] text-center space-y-2">
                  <div className="text-[#ccff00] font-bold text-sm">
                    🎉 Sesi Selesai! +{activeChallenge.coin_reward} Move Coins Diberikan!
                  </div>
                  <button
                    onClick={() => setIsWorkoutModalOpen(false)}
                    className="w-full py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs rounded-lg"
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
                    className="flex-1 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-extrabold shadow-lg shadow-[#ccff00]/20"
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
