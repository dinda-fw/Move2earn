'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Phone,
  Dumbbell,
  Target,
  Flame,
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Edit3,
  Save,
  Smartphone,
  Sparkles,
  Crown,
  Camera,
  Eye,
  EyeOff,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { UserProfile, ActivitySummary } from '@/lib/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(() => Move2EarnStore.getUserProfile());
  const [activity, setActivity] = useState<ActivitySummary | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(75);

  // Auth Tab (if logged out or switching accounts)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('fajar@gmail.com');
  const [authName, setAuthName] = useState('fajar');
  const [authPassword, setAuthPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Edit Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone_number || '+62 812-3456-7890');
  const [editDailyGoal, setEditDailyGoal] = useState(profile.daily_goal_minutes);
  const [editFitnessLevel, setEditFitnessLevel] = useState(profile.fitness_level);
  const [editHeight, setEditHeight] = useState(profile.height_cm || 172);
  const [editWeight, setEditWeight] = useState(profile.weight_kg || 68);

  // Preferences
  const [screenTimeAlerts, setScreenTimeAlerts] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [cameraValidation, setCameraValidation] = useState(true);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const syncData = () => {
    const prof = Move2EarnStore.getUserProfile();
    setProfile(prof);
    setEditName(prof.name);
    setEditEmail(prof.email);
    setEditDailyGoal(prof.daily_goal_minutes);
    setEditFitnessLevel(prof.fitness_level);
    setEditHeight(prof.height_cm);
    setEditWeight(prof.weight_kg);
    setEditPhone(prof.phone_number || '+62 812-3456-7890');

    const act = Move2EarnStore.getActivitySummary();
    setActivity(act);
    const wal = Move2EarnStore.getWalletSummary();
    setWalletBalance(wal.balance);
  };

  useEffect(() => {
    syncData();
    window.addEventListener('storage', syncData);
    const interval = setInterval(syncData, 2000);
    return () => {
      window.removeEventListener('storage', syncData);
      clearInterval(interval);
    };
  }, []);

  // BMI Calculation
  const heightM = (editHeight || 170) / 100;
  const bmi = heightM > 0 ? (editWeight / (heightM * heightM)).toFixed(1) : '22.0';
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Berat Kurang', color: 'text-amber-400' };
    if (val < 25) return { label: 'Normal & Ideal', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Kelebihan Berat', color: 'text-amber-400' };
    return { label: 'Obesitas', color: 'text-red-400' };
  };
  const bmiInfo = getBmiCategory(parseFloat(bmi));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = Move2EarnStore.updateUserProfile({
      name: editName,
      email: editEmail,
      phone_number: editPhone,
      daily_goal_minutes: editDailyGoal,
      fitness_level: editFitnessLevel,
      height_cm: editHeight,
      weight_kg: editWeight,
    });
    setProfile(updated);
    setIsEditing(false);
    showNotification('Profil & target kebugaran berhasil diperbarui!');
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const loggedIn = Move2EarnStore.loginUser(authEmail, authName);
    setProfile(loggedIn);
    showNotification(`Selamat datang kembali, ${loggedIn.name}!`);
  };

  const handleQuickDemoLogin = () => {
    setAuthEmail('fajar@gmail.com');
    setAuthName('Fajar');
    const loggedIn = Move2EarnStore.loginUser('fajar@gmail.com', 'Fajar');
    setProfile(loggedIn);
    showNotification('Berhasil login cepat sebagai Fajar!');
  };

  const handleLogout = () => {
    const loggedOut = Move2EarnStore.logoutUser();
    setProfile(loggedOut);
    showNotification('Anda telah keluar dari akun.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#162232] border border-[#ccff00] text-white px-4 py-3 rounded-2xl shadow-xl shadow-[#ccff00]/15 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#ccff00]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-[#111827] to-[#121c2d] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <User className="w-6 h-6 text-[#ccff00]" />
              Profil & Akun Pengguna
            </h1>
            <span className="text-xs bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
              {profile.is_logged_in ? 'Akun Terhubung' : 'Belum Masuk'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Kelola data diri, target aktivitas fisik, preferensi sensor kamera live, serta sinkronisasi dengan aplikasi Android Move2Earn.
          </p>
        </div>

        {/* Link to Mobile Simulator */}
        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-semibold transition-all"
          >
            <Smartphone className="w-4 h-4 text-[#ccff00]" />
            <span>Buka Simulator HP</span>
          </Link>
          {profile.is_logged_in && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CASE A: USER IS NOT LOGGED IN (SHOW LOGIN / REGISTER BOX) */}
      {/* ==================================================================== */}
      {!profile.is_logged_in ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Benefits & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121927] to-[#0c121e] border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold font-mono mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                MOVE2EARN ECOSYSTEM
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Ubah Kebiasaan Doom-Scrolling Jadi <span className="text-[#ccff00]">Kebugaran & Koin Hadiah</span>.
              </h2>

              <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                Masuk ke akun Anda untuk menyinkronkan aktivitas screen time Android (TikTok, Instagram, YouTube) dengan micro-workout fisik berhadiah Move Coins.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-2xl bg-black/40 border border-gray-800 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#ccff00]/15 flex items-center justify-center text-[#ccff00]">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Live Camera Validation</h4>
                  <p className="text-xs text-gray-400">
                    Kamera fisik memvalidasi gerakan senam tanpa looping. Sesi selesai langsung klaim koin.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-gray-800 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                    <Coins className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Tukar Koin Merchant</h4>
                  <p className="text-xs text-gray-400">
                    Tukarkan Move Coins untuk voucher Tokopedia, Spotify, diskon gym, & nutrisi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login / Register Form */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121622] border border-gray-800 shadow-2xl relative">

              {/* Tab Selector */}
              <div className="p-1 rounded-2xl bg-black/60 border border-gray-800 grid grid-cols-2 text-center text-xs font-bold mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-xl transition-all ${authMode === 'login'
                      ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-xl transition-all ${authMode === 'register'
                      ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Daftar Baru
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Contoh: fajar"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#ccff00]"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="fajar@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#ccff00]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#ccff00]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#ccff00]/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>{authMode === 'login' ? 'Masuk ke Dashboard' : 'Buat Akun & Mulai'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>

              {/* 1-Click Quick Demo Login */}
              <div className="mt-5 pt-5 border-t border-gray-800 text-center">
                <span className="text-[11px] text-gray-400 block mb-2.5">
                  Atau uji coba presentasi tanpa registrasi:
                </span>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-950 to-gray-900 border border-emerald-500/50 hover:border-[#ccff00] text-[#ccff00] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Zap className="w-4 h-4 fill-[#ccff00]" />
                  <span>⚡ 1-Click Login Cepat ( Pratama)</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* ==================================================================== */
        /* CASE B: USER IS LOGGED IN (DISPLAY & EDIT COMPLETE PROFILE) */
        /* ==================================================================== */
        <div className="space-y-8">

          {/* PROFILE SUMMARY HERO BANNER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#131a29] via-[#101622] to-[#0c111a] border border-gray-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              {/* Avatar + Main Info */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-gray-700 to-gray-500 overflow-hidden border-2 border-[#ccff00] shadow-xl shadow-[#ccff00]/20">
                    <img
                      src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow">
                    <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 text-[10px] font-extrabold flex items-center gap-1 font-mono">
                      <Crown className="w-3 h-3 fill-[#ccff00]" />
                      {profile.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{profile.email}</p>
                  <p className="text-[11px] text-gray-500">
                    Anggota sejak {profile.member_since} • Tingkat: <strong className="text-gray-300">{profile.fitness_level}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${isEditing
                      ? 'bg-gray-800 text-gray-200 border border-gray-700'
                      : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-lg shadow-[#ccff00]/25'
                    }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Batal Edit' : 'Edit Profil & Target'}</span>
                </button>
              </div>

            </div>

            {/* QUICK STATS STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-gray-800/80">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-gray-800/80">
                <div className="text-[10px] text-gray-400 font-medium">Saldo Move Coins</div>
                <div className="text-lg font-extrabold text-[#ccff00] font-mono mt-0.5 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{walletBalance}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-gray-800/80">
                <div className="text-[10px] text-gray-400 font-medium">Target Harian</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>{profile.daily_goal_minutes} Min</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-gray-800/80">
                <div className="text-[10px] text-gray-400 font-medium">Aktif Hari Ini</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>{activity?.active_minutes || 24} Min</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-gray-800/80">
                <div className="text-[10px] text-gray-400 font-medium">Screen Time Dihemat</div>
                <div className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>80 Min</span>
                </div>
              </div>
            </div>

          </div>

          {/* MAIN EDIT FORM / DETAILS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left 8 Cols: Edit Profile Form */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121622] border border-gray-800 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#ccff00]" />
                      Data Akun & Parameter Kebugaran
                    </h3>
                    <p className="text-xs text-gray-400">
                      Pengaturan ini langsung disinkronkan ke seluruh modul dashboard dan simulator handphone.
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-[#ccff00] hover:underline font-semibold"
                    >
                      Ubah Data
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Akun</label>
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone & Fitness Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nomor WhatsApp / HP</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tingkat Kebugaran</label>
                      <select
                        disabled={!isEditing}
                        value={editFitnessLevel}
                        onChange={(e) => setEditFitnessLevel(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      >
                        <option value="Beginner">Beginner (Pemula)</option>
                        <option value="Intermediate">Intermediate (Menengah)</option>
                        <option value="Advanced">Advanced (Lanjutan)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Daily Target & Physical Data (BMI Preview) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Target Harian (Menit)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="120"
                        disabled={!isEditing}
                        value={editDailyGoal}
                        onChange={(e) => setEditDailyGoal(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tinggi Badan (cm)</label>
                      <input
                        type="number"
                        min="100"
                        max="220"
                        disabled={!isEditing}
                        value={editHeight}
                        onChange={(e) => setEditHeight(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Berat Badan (kg)</label>
                      <input
                        type="number"
                        min="30"
                        max="200"
                        disabled={!isEditing}
                        value={editWeight}
                        onChange={(e) => setEditWeight(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-gray-700 text-white text-xs disabled:opacity-60 disabled:bg-black/30 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>
                  </div>

                  {/* Body Mass Index (BMI) Card */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Kalkulasi Body Mass Index (BMI):</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-bold text-white font-mono">{bmi}</span>
                        <span className={`text-xs font-bold ${bmiInfo.color}`}>• {bmiInfo.label}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 max-w-[200px] text-right hidden sm:block">
                      Dihitung otomatis dari tinggi {editHeight}cm dan berat {editWeight}kg.
                    </span>
                  </div>

                  {/* Save Button when Editing */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-extrabold shadow-lg shadow-[#ccff00]/25 flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4 stroke-[2.5]" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  )}

                </form>

              </div>
            </div>

            {/* Right 4 Cols: Privacy, Camera Settings & Quick Navigation */}
            <div className="lg:col-span-4 space-y-6">

              {/* Privacy & Hardware Permissions */}
              <div className="p-6 rounded-3xl bg-[#121622] border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                  Privasi & Sensor Edge
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/40 border border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold block">Validasi Kamera Fisik</span>
                      <span className="text-[10px] text-gray-400">Verifikasi gerakan lokal tanpa cloud</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={cameraValidation}
                      onChange={(e) => setCameraValidation(e.target.checked)}
                      className="accent-[#ccff00] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold block">Alarm Limit Screen Time</span>
                      <span className="text-[10px] text-gray-400">Popup otomatis saat batas sosmed habis</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={screenTimeAlerts}
                      onChange={(e) => setScreenTimeAlerts(e.target.checked)}
                      className="accent-[#ccff00] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold block">Jam Tenang (Quiet Hours)</span>
                      <span className="text-[10px] text-gray-400">Heningkan notifikasi 22:00 - 07:00</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={quietHours}
                      onChange={(e) => setQuietHours(e.target.checked)}
                      className="accent-[#ccff00] w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Hub Navigation */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121927] to-[#0c121e] border border-gray-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Navigasi Terkait
                </h4>

                <div className="space-y-2">
                  <Link
                    href="/wallet"
                    className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-gray-800 text-xs text-gray-200 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Dompet & Riwayat Koin
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </Link>

                  <Link
                    href="/rewards"
                    className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-gray-800 text-xs text-gray-200 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#ccff00]" />
                      Marketplace Hadiah & Voucher
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </Link>

                  <Link
                    href="/demo"
                    className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-gray-800 text-xs text-gray-200 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-pink-400" />
                      Simulator Handphone MoveIt
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </Link>
                </div>

                {/* Subtle link to Admin Portal for maintenance */}
                <div className="pt-3 border-t border-gray-800/80 text-center">
                  <Link
                    href="/admin"
                    className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <ShieldAlert className="w-3 h-3 text-gray-500" />
                    <span>Akses Portal Admin / Staff</span>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
