'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Smartphone, 
  Video, 
  Camera, 
  Coins, 
  Gift, 
  Sparkles, 
  BellRing, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2, 
  TicketCheck, 
  ArrowRight, 
  Layers, 
  QrCode, 
  Copy, 
  ChevronRight,
  ExternalLink,
  Wifi,
  BatteryCharging
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { Challenge, Reward, DashboardSummary } from '@/lib/types';

// Web Audio API Sound Synthesizer (No external assets required)
const playSound = (type: 'alert' | 'coin' | 'click') => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    if (type === 'alert') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'coin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
};

type PhoneAppMode = 'doomscroll' | 'interstitial' | 'dashboard' | 'wallet' | 'rewards' | 'voucher';
type PhoneModel = 'iphone' | 'android';

export default function MobileDemoPage() {
  // Device & Navigation state
  const [phoneModel, setPhoneModel] = useState<PhoneModel>('iphone');
  const [appMode, setAppMode] = useState<PhoneAppMode>('doomscroll');
  const [currentTime, setCurrentTime] = useState('17:28');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Doomscroll Simulation State
  const [scrollSeconds, setScrollSeconds] = useState(58);
  const [scrollLimit, setScrollLimit] = useState(60); // 60s for demo
  const [isScrollingAuto, setIsScrollingAuto] = useState(true);
  const [feedIndex, setFeedIndex] = useState(0);

  // Workout Interstitial State
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [workoutSecondsLeft, setWorkoutSecondsLeft] = useState(30);
  const [repCount, setRepCount] = useState(0);
  const [repTarget] = useState(5);
  const [useRealWebcam, setUseRealWebcam] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [motionDetected, setMotionDetected] = useState(true);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  // Rewards & Wallet State
  const [rewardsList, setRewardsList] = useState<Reward[]>([]);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ title: string; code: string; price: number } | null>(null);
  const [walletBalance, setWalletBalance] = useState(75);
  const [copiedCode, setCopiedCode] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  // Video feed samples for Doomscroll simulation
  const feedVideos = [
    {
      title: 'Trending Dance Challenge 💃',
      creator: '@dance_squad',
      desc: 'Viral choreo #fyp #trending #dance',
      likes: '142.5K',
      comments: '3,812',
      shares: '12.4K',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-front-of-the-camera-40293-large.mp4'
    },
    {
      title: 'Aesthetic Morning Routine ☕',
      creator: '@lifestyle_vibe',
      desc: 'Wake up with me at 6 AM #morningroutine #vibes',
      likes: '89.1K',
      comments: '1,204',
      shares: '4,102',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-steaming-cup-of-coffee-43288-large.mp4'
    },
    {
      title: 'Insane Street Food in Jakarta 🍜',
      creator: '@kuliner_malam',
      desc: 'Bakso lava pedas nampol banget wajib coba! #kuliner #foodie',
      likes: '230.9K',
      comments: '6,450',
      shares: '35.1K',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-frying-diced-vegetables-in-a-skillet-43292-large.mp4'
    }
  ];

  // Load initial store data
  useEffect(() => {
    const chs = Move2EarnStore.getChallenges();
    setSelectedChallenge(chs[0] || null);
    const rws = Move2EarnStore.getRewards();
    setRewardsList(rws);
    const summary = Move2EarnStore.getWalletSummary();
    setWalletBalance(summary.balance);

    // Live Clock
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 10000);
    return () => clearInterval(clockInterval);
  }, []);

  // Timer for Doomscroll simulation
  useEffect(() => {
    if (appMode !== 'doomscroll' || !isScrollingAuto) return;

    const timer = setInterval(() => {
      setScrollSeconds((prev) => {
        const next = prev + 1;
        if (next >= scrollLimit) {
          clearInterval(timer);
          triggerInterstitialIntervention();
          return scrollLimit;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [appMode, isScrollingAuto, scrollLimit]);

  // Interstitial countdown timer
  useEffect(() => {
    if (appMode !== 'interstitial' || workoutCompleted) return;

    const timer = setInterval(() => {
      setWorkoutSecondsLeft((prev) => {
        if (prev <= 1) {
          handleCompleteWorkout();
          return 0;
        }
        return prev - 1;
      });
      // Simulate motion rep increment every 6s
      if (!useRealWebcam) {
        setRepCount((prev) => (prev < repTarget ? prev + 1 : prev));
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [appMode, workoutCompleted, useRealWebcam, repTarget]);

  // Handle Real Webcam Feed
  useEffect(() => {
    if (useRealWebcam && appMode === 'interstitial') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          webcamStreamRef.current = stream;
          setIsWebcamActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setUseRealWebcam(false);
          setIsWebcamActive(false);
        });
    } else {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
        webcamStreamRef.current = null;
      }
      setIsWebcamActive(false);
    }

    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealWebcam, appMode]);

  // Trigger Interstitial Lockdown
  const triggerInterstitialIntervention = () => {
    if (soundEnabled) playSound('alert');
    setAppMode('interstitial');
    setWorkoutSecondsLeft(30);
    setRepCount(0);
    setWorkoutCompleted(false);
  };

  // Complete Workout & Award Coins
  const handleCompleteWorkout = () => {
    if (!selectedChallenge) return;
    if (soundEnabled) playSound('coin');
    Move2EarnStore.completeWorkout(selectedChallenge.id, 30);
    const summary = Move2EarnStore.getWalletSummary();
    setWalletBalance(summary.balance);
    setWorkoutCompleted(true);
  };

  // Redeem Reward in Phone
  const handleRedeemReward = (reward: Reward) => {
    if (walletBalance < reward.coin_price) {
      alert('Move Coins tidak mencukupi!');
      return;
    }
    if (soundEnabled) playSound('coin');
    const res = Move2EarnStore.redeemReward(reward.id);
    if (res.success && res.redemption) {
      setRedeemedVoucher({
        title: reward.title,
        code: res.redemption.voucher_code || reward.voucher_code || 'M2E-CLAIM-2026',
        price: reward.coin_price
      });
      const summary = Move2EarnStore.getWalletSummary();
      setWalletBalance(summary.balance);
      setAppMode('voucher');
    } else {
      alert(res.error || 'Gagal menukarkan voucher');
    }
  };

  // Reset Demo Session
  const handleResetDemo = () => {
    if (soundEnabled) playSound('click');
    setScrollSeconds(50);
    setScrollLimit(60);
    setAppMode('doomscroll');
    setWorkoutCompleted(false);
    setRepCount(0);
    setWorkoutSecondsLeft(30);
    setRedeemedVoucher(null);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Live Indicator */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              Sesi Demo Interaktif
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">Smartphone Device Frame Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Tampilan Handphone untuk Sesi Demo & Presentasi Juri
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Simulator interaktif smartphone untuk mendemokan alur lengkap <strong>MOVE2EARN</strong> secara visual: dari scrolling sosmed, pemicu batas waktu, split-screen micro-workout, hingga klaim koin dan penukaran voucher.
          </p>
        </div>

        {/* Global Demo Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}
            title="Toggle Sound FX"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound FX</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-white flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo</span>
          </button>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-green-500/20 transition-all"
          >
            <span>Buka Web Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: PHONE ON LEFT / PRESENTER COCKPIT ON RIGHT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================================================================== */}
        {/* COLUMN 1: SMARTPHONE DEVICE FRAME (5 COLS ON DESKTOP) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
          
          {/* THE SMARTPHONE CHASSIS */}
          <div className="relative w-[340px] sm:w-[380px] h-[740px] bg-black rounded-[52px] p-3 shadow-[0_0_60px_-15px_rgba(34,197,94,0.3)] border-[8px] border-[#222938] transition-all duration-300">
            
            {/* Outer Titanium Trim Accent */}
            <div className="absolute inset-0 rounded-[44px] pointer-events-none border border-white/10" />

            {/* SIDE BUTTONS */}
            <div className="absolute -left-[11px] top-28 w-[3px] h-10 bg-gray-700 rounded-l" />
            <div className="absolute -left-[11px] top-42 w-[3px] h-12 bg-gray-700 rounded-l" />
            <div className="absolute -right-[11px] top-36 w-[3px] h-16 bg-gray-700 rounded-r" />

            {/* SCREEN VIEWPORT */}
            <div className="relative w-full h-full bg-[#0a0e17] rounded-[42px] overflow-hidden flex flex-col border border-gray-900 select-none">
              
              {/* STATUS BAR */}
              <div className="absolute top-0 inset-x-0 h-10 z-30 px-6 flex items-center justify-between text-white text-xs font-medium">
                <span className="font-semibold tracking-tight">{currentTime}</span>
                
                {/* DYNAMIC ISLAND OR PUNCH HOLE */}
                {phoneModel === 'iphone' ? (
                  <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 border border-gray-900 px-2 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-[#1a2333]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 bg-black rounded-full border border-gray-800" />
                )}

                <div className="flex items-center gap-1.5 text-[11px]">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px]">5G</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-mono">98%</span>
                    <BatteryCharging className="w-3.5 h-3.5 text-green-400" />
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* SMARTPHONE APP CONTENT BASED ON ACTIVE MODE */}
              {/* ============================================================== */}
              <div className="flex-1 pt-10 pb-14 overflow-y-auto overflow-x-hidden relative flex flex-col">
                
                {/* MODE 1: DOOMSCROLL SOCIAL MEDIA FEED */}
                {appMode === 'doomscroll' && (
                  <div className="relative flex-1 bg-black flex flex-col justify-between overflow-hidden">
                    {/* Simulated Fullscreen Video Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 z-10 pointer-events-none" />
                    
                    <video
                      key={feedIndex}
                      src={feedVideos[feedIndex].src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* TOP FLOATING SCREENTIME HUD (MOVE2EARN OVERLAY) */}
                    <div className="relative z-20 mx-3 mt-2 p-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-green-500/40 text-xs shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-green-400 font-bold">
                          <Flame className="w-4 h-4 fill-green-400" />
                          <span>MOVE2EARN ACTIVE</span>
                        </div>
                        <span className="font-mono text-[11px] text-amber-300 font-bold">
                          {scrollSeconds}s / {scrollLimit}s Demo
                        </span>
                      </div>
                      
                      {/* Progress Bar towards limit */}
                      <div className="w-full bg-gray-800/80 rounded-full h-2 mt-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-amber-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (scrollSeconds / scrollLimit) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-300 mt-1">
                        <span>TikTok • UsageStats</span>
                        <span className="text-amber-400 font-semibold">
                          {scrollLimit - scrollSeconds > 0 ? `${scrollLimit - scrollSeconds}s tersisa` : 'Ambang Tercapai!'}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT SIDE ENGAGEMENT ICONS */}
                    <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white text-xs">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-red-500 border border-white/10 active:scale-90 transition-transform">
                          <Heart className="w-5 h-5 fill-red-500" />
                        </div>
                        <span className="text-[10px] font-semibold">{feedVideos[feedIndex].likes}</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold">{feedVideos[feedIndex].comments}</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold">{feedVideos[feedIndex].shares}</span>
                      </div>
                    </div>

                    {/* BOTTOM CREATOR INFO & CAPTION */}
                    <div className="relative z-20 p-4 text-white space-y-1">
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <span>{feedVideos[feedIndex].creator}</span>
                        <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded font-semibold">Follow</span>
                      </div>
                      <p className="text-xs text-gray-200 line-clamp-2">{feedVideos[feedIndex].desc}</p>
                      
                      {/* Video Switcher Dots */}
                      <div className="flex items-center gap-1.5 pt-2">
                        {feedVideos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setFeedIndex(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              feedIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: SPLIT-SCREEN WORKOUT INTERSTITIAL (HERO FEATURE) */}
                {appMode === 'interstitial' && selectedChallenge && (
                  <div className="flex-1 bg-black flex flex-col">
                    
                    {/* Interstitial Header Alert */}
                    <div className="bg-red-950/80 border-b border-red-500/40 px-3 py-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-red-400 font-bold text-[11px]">
                        <BellRing className="w-3.5 h-3.5 animate-bounce" />
                        <span>INTERSTITIAL TERKUNCI</span>
                      </div>
                      <span className="bg-red-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Batas 60 Menit Tercapai
                      </span>
                    </div>

                    {/* ========================================================== */}
                    {/* TOP 50%: VIDEO TUTORIAL GUIDE */}
                    {/* ========================================================== */}
                    <div className="h-[210px] bg-slate-950 border-b-2 border-green-500 relative flex flex-col justify-between p-2.5 overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                      
                      <video
                        src={selectedChallenge.media_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      <div className="relative z-20 flex items-center justify-between">
                        <span className="bg-black/70 backdrop-blur text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-blue-500/30">
                          <Video className="w-3 h-3" /> BAGIAN 1: PANDUAN
                        </span>
                        <span className="bg-black/70 backdrop-blur text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                          +{selectedChallenge.coin_reward} Coins
                        </span>
                      </div>

                      <div className="relative z-20 bg-black/75 backdrop-blur p-2 rounded-xl border border-white/10 text-xs">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white text-xs">{selectedChallenge.title}</h4>
                          <span className="text-green-400 font-mono font-bold">{workoutSecondsLeft}s</span>
                        </div>
                        <p className="text-[10px] text-gray-300 mt-0.5 line-clamp-1">{selectedChallenge.instructions}</p>
                      </div>
                    </div>

                    {/* ========================================================== */}
                    {/* BOTTOM 50%: CAMERA REAL/SIMULATED VALIDATION */}
                    {/* ========================================================== */}
                    <div className="flex-1 bg-gradient-to-b from-zinc-950 to-black p-2.5 flex flex-col justify-between relative overflow-hidden">
                      
                      <div className="flex items-center justify-between z-20">
                        <span className="bg-black/70 backdrop-blur text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-emerald-500/30">
                          <Camera className="w-3 h-3" /> BAGIAN 2: KAMERA VALIDASI
                        </span>
                        <span className="bg-green-500/20 text-green-300 border border-green-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Motion OK
                        </span>
                      </div>

                      {/* CAMERA FEED / SKELETON POSE VIEWER */}
                      <div className="relative flex-1 my-1.5 rounded-xl border border-dashed border-green-500/60 bg-green-950/15 overflow-hidden flex items-center justify-center">
                        {useRealWebcam ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover -scale-x-100"
                          />
                        ) : (
                          // Realistic Simulated Skeleton Wireframe
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            {/* Animated Pose Landmark Skeleton */}
                            <div className="relative w-28 h-36 flex flex-col items-center justify-center">
                              {/* Head Node */}
                              <div className="w-7 h-7 rounded-full border-2 border-green-400 bg-green-400/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-300 animate-ping" />
                              </div>
                              {/* Spine & Arms */}
                              <div className="w-16 h-10 border-t-2 border-b-2 border-green-400/80 my-1 relative">
                                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-green-400" />
                                <div className="absolute right-0 top-0 w-2 h-2 rounded-full bg-green-400" />
                                <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-green-400" />
                              </div>
                              {/* Legs & Knees */}
                              <div className="w-12 h-14 border-t-2 border-l-2 border-r-2 border-green-400 relative">
                                <div className="absolute left-0 bottom-0 w-2 h-2 rounded-full bg-green-400" />
                                <div className="absolute right-0 bottom-0 w-2 h-2 rounded-full bg-green-400" />
                              </div>
                            </div>
                            <span className="text-[10px] text-green-300 font-mono mt-1 bg-black/60 px-2 py-0.5 rounded">
                              AI Skeleton Rep: {repCount}/{repTarget}
                            </span>
                          </div>
                        )}

                        {/* Workout Completed Confetti Overlay */}
                        {workoutCompleted && (
                          <div className="absolute inset-0 bg-green-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center mb-1.5 shadow-lg shadow-green-500/50 animate-bounce">
                              <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h4 className="font-extrabold text-white text-sm">WORKOUT SELESAI!</h4>
                            <p className="text-xs text-amber-300 font-bold font-mono mt-0.5">+25 MOVE COINS DIDAPAT</p>
                            <span className="text-[10px] text-gray-300 mt-1">Scroll Pass 45 Menit Aktif!</span>
                            
                            <button
                              onClick={() => setAppMode('wallet')}
                              className="mt-3 px-3 py-1.5 bg-green-400 text-black rounded-lg font-bold text-xs hover:bg-green-300 shadow"
                            >
                              Lihat Dompet (+25)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* BOTTOM WORKOUT CONTROLS */}
                      <div className="flex items-center gap-2 z-20">
                        <button
                          onClick={() => setAppMode('doomscroll')}
                          className="py-1.5 px-3 bg-gray-800 text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-700"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleCompleteWorkout}
                          disabled={workoutCompleted}
                          className="flex-1 py-1.5 bg-green-500 hover:bg-green-400 text-black rounded-lg text-xs font-bold shadow-md shadow-green-500/25 disabled:opacity-50"
                        >
                          {workoutCompleted ? 'Sudah Selesai' : 'Selesaikan Sekarang'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 3: DASHBOARD IN-PHONE */}
                {appMode === 'dashboard' && (
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">Daily Screen Time</h3>
                        <p className="text-[10px] text-gray-400">Ringkasan Hari Ini</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-mono">
                        65m / 60m
                      </span>
                    </div>

                    {/* Target Apps Breakdown */}
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-pink-400">TikTok</span>
                          <span className="font-mono text-white">35 Menit</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-pink-500 h-1.5 w-[70%]" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-purple-400">Instagram</span>
                          <span className="font-mono text-white">20 Menit</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-1.5 w-[45%]" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-red-400">YouTube Shorts</span>
                          <span className="font-mono text-white">10 Menit</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-1.5 w-[25%]" />
                        </div>
                      </div>
                    </div>

                    {/* Streak & Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
                        <div className="text-base font-bold text-amber-400 font-mono">🔥 4 Hari</div>
                        <div className="text-[10px] text-gray-400">Workout Streak</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
                        <div className="text-base font-bold text-green-400 font-mono">2 Sesi</div>
                        <div className="text-[10px] text-gray-400">Hari Ini</div>
                      </div>
                    </div>

                    <button
                      onClick={triggerInterstitialIntervention}
                      className="w-full py-2.5 bg-green-500 text-black text-xs font-bold rounded-xl shadow hover:bg-green-400"
                    >
                      Picu Workout Interstitial
                    </button>
                  </div>
                )}

                {/* MODE 4: WALLET IN-PHONE */}
                {appMode === 'wallet' && (
                  <div className="p-4 space-y-4">
                    {/* Digital Card */}
                    <div className="rounded-2xl p-4 bg-gradient-to-tr from-green-600 via-emerald-600 to-teal-700 text-black shadow-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">Move Coins Ledger</span>
                        <Coins className="w-5 h-5 text-black" />
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-black/80 font-medium">Saldo Tersedia</span>
                        <div className="text-3xl font-extrabold font-mono text-black">{walletBalance} Coins</div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-black/10 flex justify-between text-[10px] text-black/80">
                        <span>User: demo_judge@m2e</span>
                        <span>Tier: Silver Mover</span>
                      </div>
                    </div>

                    {/* Transactions list */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-300">Riwayat Koin Terbaru</h4>
                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">Reward Workout Plank</div>
                          <div className="text-[10px] text-gray-400">Validasi Kamera Berhasil</div>
                        </div>
                        <span className="font-mono font-bold text-green-400">+25</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">Bonus Streak 3-Hari</div>
                          <div className="text-[10px] text-gray-400">Daily Milestone</div>
                        </div>
                        <span className="font-mono font-bold text-green-400">+50</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setAppMode('rewards')}
                      className="w-full py-2.5 bg-amber-400 text-black text-xs font-bold rounded-xl shadow hover:bg-amber-300 flex items-center justify-center gap-1.5"
                    >
                      <Gift className="w-4 h-4" />
                      Tukar Koin ke Voucher
                    </button>
                  </div>
                )}

                {/* MODE 5: REWARDS MARKETPLACE IN-PHONE */}
                {appMode === 'rewards' && (
                  <div className="p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <span className="text-xs font-bold text-white">Marketplace Voucher</span>
                      <span className="text-xs text-amber-300 font-mono font-bold">{walletBalance} Coins</span>
                    </div>

                    <div className="space-y-2.5">
                      {rewardsList.map((rw) => (
                        <div key={rw.id} className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 flex gap-2.5 items-center">
                          <img src={rw.image_url} alt={rw.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{rw.title}</h5>
                            <span className="text-[10px] text-amber-400 font-mono font-bold block mt-0.5">
                              {rw.coin_price} Coins
                            </span>
                            <button
                              onClick={() => handleRedeemReward(rw)}
                              disabled={walletBalance < rw.coin_price}
                              className="mt-1 px-2.5 py-1 bg-green-500 hover:bg-green-400 text-black text-[10px] font-bold rounded disabled:opacity-40"
                            >
                              Klaim Voucher
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODE 6: VOUCHER DETAILS & DYNAMIC QR */}
                {appMode === 'voucher' && redeemedVoucher && (
                  <div className="p-4 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center mx-auto">
                      <TicketCheck className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{redeemedVoucher.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Tunjukkan QR ini ke kasir mitra</p>
                    </div>

                    {/* DYNAMIC QR CODE CARD */}
                    <div className="p-4 bg-white rounded-2xl mx-auto w-44 shadow-lg text-black space-y-2">
                      <div className="w-36 h-36 border-4 border-black p-2 mx-auto flex flex-col justify-between">
                        {/* Realistic Mock QR Graphic */}
                        <div className="grid grid-cols-4 gap-1.5 h-full">
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black/30 rounded-sm" />
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black/20 rounded-sm" />
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black/60 rounded-sm" />
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black/40 rounded-sm" />
                          <div className="bg-black rounded-sm" />
                          <div className="bg-black/80 rounded-sm" />
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold tracking-widest block">{redeemedVoucher.code}</span>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(redeemedVoucher.code);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded-xl font-mono flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedCode ? 'Tersalin!' : 'Salin Kode Voucher'}
                    </button>

                    <button
                      onClick={() => setAppMode('doomscroll')}
                      className="text-xs text-green-400 hover:underline block mx-auto"
                    >
                      Kembali ke Doomscroll Feed
                    </button>
                  </div>
                )}

              </div>

              {/* ============================================================== */}
              {/* SMARTPHONE BOTTOM APP NAVIGATION BAR */}
              {/* ============================================================== */}
              <div className="absolute bottom-0 inset-x-0 h-14 bg-black/90 backdrop-blur border-t border-gray-900 px-3 flex items-center justify-around z-30 text-[10px]">
                <button
                  onClick={() => setAppMode('doomscroll')}
                  className={`flex flex-col items-center gap-0.5 ${appMode === 'doomscroll' ? 'text-green-400 font-bold' : 'text-gray-400'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Sosmed</span>
                </button>

                <button
                  onClick={() => setAppMode('interstitial')}
                  className={`flex flex-col items-center gap-0.5 ${appMode === 'interstitial' ? 'text-green-400 font-bold' : 'text-gray-400'}`}
                >
                  <Flame className="w-4 h-4" />
                  <span>Workout</span>
                </button>

                <button
                  onClick={() => setAppMode('dashboard')}
                  className={`flex flex-col items-center gap-0.5 ${appMode === 'dashboard' ? 'text-green-400 font-bold' : 'text-gray-400'}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Stats</span>
                </button>

                <button
                  onClick={() => setAppMode('wallet')}
                  className={`flex flex-col items-center gap-0.5 ${appMode === 'wallet' ? 'text-green-400 font-bold' : 'text-gray-400'}`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Wallet</span>
                </button>

                <button
                  onClick={() => setAppMode('rewards')}
                  className={`flex flex-col items-center gap-0.5 ${appMode === 'rewards' || appMode === 'voucher' ? 'text-green-400 font-bold' : 'text-gray-400'}`}
                >
                  <Gift className="w-4 h-4" />
                  <span>Hadiah</span>
                </button>
              </div>

              {/* HOME INDICATOR GESTURE BAR */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40 pointer-events-none" />

            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* COLUMN 2: PRESENTER COCKPIT & LIVE SCENARIOS (7 COLS ON DESKTOP) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          
          {/* QUICK DEMO SCENARIOS BUTTONS */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Skenario Presentasi Cepat (1-Click Demo)</h2>
              </div>
              <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-mono">
                Pitch Mode
              </span>
            </div>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Klik salah satu tombol skenario di bawah ini untuk menggerakkan tampilan HP secara otomatis saat presentasi di hadapan juri:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Skenario 1 */}
              <button
                onClick={() => {
                  setAppMode('doomscroll');
                  setScrollSeconds(55);
                  setIsScrollingAuto(true);
                  if (soundEnabled) playSound('click');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-gray-900 to-[#162238] border border-gray-700/80 hover:border-green-500/60 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-green-400 mb-1">
                  <span>1. Simulasi Doomscrolling</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Putar video TikTok/Shorts dan amati timer screen-time berjalan mendekati batas 60 detik.
                </p>
              </button>

              {/* Skenario 2 */}
              <button
                onClick={() => {
                  triggerInterstitialIntervention();
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/40 to-gray-900 border border-red-500/40 hover:border-red-400 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-1">
                  <span>2. Picu Interstitial Lock</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Kunci layar HP dan buka Split-Screen: Panduan Video (atas) & Kamera Deteksi (bawah).
                </p>
              </button>

              {/* Skenario 3 */}
              <button
                onClick={() => {
                  setAppMode('interstitial');
                  handleCompleteWorkout();
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-green-950/40 to-gray-900 border border-green-500/40 hover:border-green-400 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                  <span>3. Selesaikan & Dapat Koin</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Simulasikan gerakan selesai validasi AI, confetti meledak, koin bertambah +25!
                </p>
              </button>

              {/* Skenario 4 */}
              <button
                onClick={() => {
                  setAppMode('rewards');
                  if (soundEnabled) playSound('click');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-gray-900 border border-amber-500/40 hover:border-amber-400 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                  <span>4. Klaim Voucher QR</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Buka katalog marketplace koin dan cetak voucher digital dengan barcode/QR instan.
                </p>
              </button>
            </div>
          </div>

          {/* SIMULATOR CONFIGURATION & WEBCAM SWITCHER */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-gray-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Pengaturan Kamera & Model Handphone
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Camera Switcher */}
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
                <span className="text-gray-400 block font-medium">Input Kamera Validasi:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseRealWebcam(false)}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                      !useRealWebcam ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    AI Pose Virtual
                  </button>
                  <button
                    onClick={() => setUseRealWebcam(true)}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                      useRealWebcam ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Webcam Fisik
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  {useRealWebcam ? 'Menggunakan kamera laptop langsung via WebRTC' : 'Menggunakan skeleton wireframe tracking interaktif'}
                </span>
              </div>

              {/* Phone Model Switcher */}
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
                <span className="text-gray-400 block font-medium">Gaya Frame Handphone:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhoneModel('iphone')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                      phoneModel === 'iphone' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    iPhone 16 Pro
                  </button>
                  <button
                    onClick={() => setPhoneModel('android')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                      phoneModel === 'android' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Android S24
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  Frame disesuaikan dengan notch/dynamic island
                </span>
              </div>
            </div>
          </div>

          {/* JUDGES / EVALUATOR CHEAT-SHEET */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900 via-[#101827] to-[#0a1220] border border-gray-800 text-xs space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Arsitektur & Keunggulan Produk untuk Presentasi</span>
            </div>

            <div className="space-y-2 text-gray-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white">Bukan Sekadar Pembatas Pasif:</strong> Berbeda dari Digital Wellbeing biasa yang mudah di-bypass atau diabaikan, MOVE2EARN mengalihkan scrolling pasif menjadi micro-workout aktif dan memberikan reward koin nyata.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white">Split-Screen Interstitial:</strong> Menggunakan inovasi tampilan ganda vertikal di mana video tutorial instruktur diputar di atas, sementara validasi gerakan kamera berlangsung di bawah.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white">Ekonomi Koin & Voucher Terintegrasi:</strong> Koin yang didapat disimpan secara aman di Supabase (dengan proteksi idempotensi agar tidak bisa di-cheat) dan dapat langsung ditukar ke voucher digital mitra lokal.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
