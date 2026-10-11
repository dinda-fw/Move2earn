'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Dumbbell, 
  Coins, 
  Gift, 
  Sparkles, 
  Bell, 
  BellRing, 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  TicketCheck, 
  ArrowRight, 
  QrCode, 
  Copy, 
  ChevronRight, 
  ChevronLeft, 
  Wifi, 
  BatteryCharging, 
  User, 
  Settings, 
  Clock, 
  Footprints, 
  Zap, 
  Smartphone, 
  Camera, 
  Maximize2, 
  LogOut, 
  Check, 
  HelpCircle, 
  Crown, 
  MessageSquare, 
  Send, 
  Bot, 
  Lock, 
  Mail, 
  UserCheck,
  Plus,
  Trash2,
  ChevronDown,
  X,
  Wallet,
  Search,
  Filter,
  Sliders,
  Shuffle,
  Layers,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { 
  Challenge, 
  Reward, 
  ActivitySummary,
  DashboardSummary,
  Exercise,
  WorkoutPlan,
  WorkoutPlanExercise,
  EquipmentType,
  MuscleGroup,
  WorkoutCategory,
  ExerciseDifficulty,
  Redemption,
  WalletTransaction
} from '@/lib/types';
import { WorkoutStore } from '@/lib/workoutStore';
import { INITIAL_EXERCISES, PRESET_WORKOUT_PLANS } from '@/lib/exerciseData';
import ExerciseDetailModal from '@/components/workout/ExerciseDetailModal';
import GuidedWorkoutPlayer from '@/components/workout/GuidedWorkoutPlayer';
import { 
  fetchMoveItMedia, 
  getMediaForSession, 
  DEFAULT_MOVEIT_VIDEO, 
  DEFAULT_MOVEIT_IMAGES, 
  MoveItMediaItem, 
  MoveItMediaRegistry 
} from '@/lib/moveitMedia';

// ==============================================================
// OFFICIAL & AESTHETIC SOCIAL MEDIA APP LOGOS
// ==============================================================
function TikTokLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-black flex items-center justify-center p-1.5 border border-gray-800 shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06A6.33 6.33 0 0 0 3 15.59a6.33 6.33 0 0 0 6.33 6.33c3.49 0 6.33-2.84 6.33-6.33V9.22a8.16 8.16 0 0 0 4.93 1.63v-3.45a4.85 4.85 0 0 1-1-.71z" fill="#ffffff" />
      </svg>
    </div>
  );
}

function InstagramLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1.5 flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full stroke-white fill-none stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    </div>
  );
}

function YouTubeLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1.5 bg-[#FF0000] flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    </div>
  );
}

function ThreadsLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1 bg-black border border-gray-700 flex items-center justify-center text-white font-bold text-xs shrink-0 ${className}`}>
      <span className="font-sans leading-none text-[13px]">@</span>
    </div>
  );
}

function TelegramLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1.5 bg-[#24A1DE] flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.37.74-.56 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.19-.03.33z"/>
      </svg>
    </div>
  );
}

function TwitterLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1.5 bg-black border border-gray-700 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </div>
  );
}

function FacebookLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1.5 bg-[#1877F2] flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </div>
  );
}

function RedditLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-xl p-1.5 bg-[#FF4500] flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.612a1.24 1.24 0 0 1 1.108-.702zM8.51 11.8a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm6.98 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm-5.076 4.316a.375.375 0 0 0-.265.64 4.542 4.542 0 0 0 3.69 0 .375.375 0 0 0-.265-.64 3.792 3.792 0 0 1-3.16 0z"/>
      </svg>
    </div>
  );
}

function renderAppIcon(iconType: string, name: string, className = "w-6 h-6") {
  switch (iconType) {
    case 'tiktok': return <TikTokLogo className={className} />;
    case 'instagram': return <InstagramLogo className={className} />;
    case 'youtube': return <YouTubeLogo className={className} />;
    case 'threads': return <ThreadsLogo className={className} />;
    case 'telegram': return <TelegramLogo className={className} />;
    case 'twitter': return <TwitterLogo className={className} />;
    case 'facebook': return <FacebookLogo className={className} />;
    case 'reddit': return <RedditLogo className={className} />;
    default:
      return (
        <div className={`rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0 ${className}`}>
          {name.charAt(0).toUpperCase()}
        </div>
      );
  }
}

export interface MonitoredApp {
  id: string;
  name: string;
  category: string;
  thresholdMinutes: number;
  iconType: string;
}

const DEFAULT_MONITORED_APPS: MonitoredApp[] = [
  { id: 'tiktok', name: 'TikTok', category: 'Short Video & FYP', thresholdMinutes: 45, iconType: 'tiktok' },
  { id: 'instagram', name: 'Instagram', category: 'Feed & Reels', thresholdMinutes: 30, iconType: 'instagram' },
  { id: 'youtube', name: 'YouTube', category: 'Video Streaming & Shorts', thresholdMinutes: 60, iconType: 'youtube' },
];

const PRESET_ADDABLE_APPS: Omit<MonitoredApp, 'thresholdMinutes'>[] = [
  { id: 'threads', name: 'Threads', category: 'Text & Community', iconType: 'threads' },
  { id: 'telegram', name: 'Telegram', category: 'Chat & Channels', iconType: 'telegram' },
  { id: 'twitter', name: 'X / Twitter', category: 'News & Microblog', iconType: 'twitter' },
  { id: 'facebook', name: 'Facebook', category: 'Social Network', iconType: 'facebook' },
  { id: 'reddit', name: 'Reddit', category: 'Forums & Discussions', iconType: 'reddit' },
];

const THRESHOLD_OPTIONS = [
  { value: 15, label: '15 min (Cepat)' },
  { value: 30, label: '30 min (Disarankan)' },
  { value: 45, label: '45 min (Standar)' },
  { value: 60, label: '60 min (1 Jam)' },
  { value: 90, label: '90 min (1.5 Jam)' },
  { value: 120, label: '120 min (2 Jam)' },
];

// Web Audio API Sound Synthesizer
const playSound = (type: 'alert' | 'coin' | 'click') => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    if (type === 'alert') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
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
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
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
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // ignore
  }
};

type PhoneTab = 'tracking' | 'workout' | 'moveit' | 'rewards' | 'profile';
type TrackingPeriod = 'daily' | 'weekly';
type RewardsSubTab = 'marketplace' | 'wallet' | 'vouchers';
type WorkoutSubTab = 'builder' | 'library' | 'presets';
type ProfileSubView = 'main' | 'focus_notifications' | 'pro_coach' | 'help_support' | 'auth';

interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
}

export default function MobileDemoPage() {
  // Authentication & Personalization State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('Alex');
  const [userEmail, setUserEmail] = useState('alex@email.com');
  const [dailyGoalTarget, setDailyGoalTarget] = useState(35);
  const [fitnessLevel, setFitnessLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [selectedFocusApps, setSelectedFocusApps] = useState<string[]>(['TikTok', 'Instagram', 'YouTube']);

  // Navigation & Phone Tab State
  const [activeTab, setActiveTab] = useState<PhoneTab>('tracking');
  const [trackingPeriod, setTrackingPeriod] = useState<TrackingPeriod>('daily');
  const [profileSubView, setProfileSubView] = useState<ProfileSubView>('main');
  const [currentTime, setCurrentTime] = useState('09:41');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPresenterPanel, setShowPresenterPanel] = useState(false);

  // Sub-tab Navigation
  const [rewardsSubTab, setRewardsSubTab] = useState<RewardsSubTab>('marketplace');
  const [workoutSubTab, setWorkoutSubTab] = useState<WorkoutSubTab>('builder');

  // Incoming Notification Simulation (from external TikTok/Instagram)
  const [showExternalNotification, setShowExternalNotification] = useState(false);

  // Challenge / Interstitial Workout State & MoveIt Media (components/media)
  const [repCount, setRepCount] = useState(23);
  const [repTarget] = useState(25);
  const [workoutSecondsLeft, setWorkoutSecondsLeft] = useState(30);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [moveItSessionNumber, setMoveItSessionNumber] = useState(1); // 1 = first session (video), 2+ = +1 hr later (random image)
  const [moveItRegistry, setMoveItRegistry] = useState<MoveItMediaRegistry>({
    video: DEFAULT_MOVEIT_VIDEO,
    images: DEFAULT_MOVEIT_IMAGES
  });
  const [currentMoveItMedia, setCurrentMoveItMedia] = useState<MoveItMediaItem>(DEFAULT_MOVEIT_VIDEO);

  // Focus & Notification Settings state
  const [screenTimeReminders, setScreenTimeReminders] = useState(true);
  const [workoutPrompts, setWorkoutPrompts] = useState(true);
  const [dailyGoalReminders, setDailyGoalReminders] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  // Monitored Apps & Dynamic Threshold State
  const [monitoredApps, setMonitoredApps] = useState<MonitoredApp[]>(DEFAULT_MONITORED_APPS);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [customAppName, setCustomAppName] = useState('');
  const [customAppThreshold, setCustomAppThreshold] = useState(30);
  const [customAppCategory, setCustomAppCategory] = useState('Sosial & Chat');

  const handleAddPresetApp = (preset: Omit<MonitoredApp, 'thresholdMinutes'>) => {
    if (monitoredApps.some(a => a.id === preset.id)) return;
    const newApp: MonitoredApp = {
      ...preset,
      thresholdMinutes: 30
    };
    setMonitoredApps(prev => [...prev, newApp]);
    if (soundEnabled) playSound('click');
  };

  const handleAddCustomApp = () => {
    if (!customAppName.trim()) return;
    const newId = customAppName.toLowerCase().replace(/\s+/g, '-');
    if (monitoredApps.some(a => a.id === newId)) return;
    const newApp: MonitoredApp = {
      id: newId,
      name: customAppName.trim(),
      category: customAppCategory,
      thresholdMinutes: customAppThreshold,
      iconType: 'custom'
    };
    setMonitoredApps(prev => [...prev, newApp]);
    setCustomAppName('');
    setShowAddAppModal(false);
    if (soundEnabled) playSound('coin');
  };

  // Rewards & Wallet State (Synced with Web Store)
  const [rewardsList, setRewardsList] = useState<Reward[]>([]);
  const [walletBalance, setWalletBalance] = useState(75);
  const [walletSummary, setWalletSummary] = useState<any>(null);
  const [transactionsList, setTransactionsList] = useState<WalletTransaction[]>([]);
  const [redemptionsList, setRedemptionsList] = useState<Redemption[]>([]);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ title: string; code: string; price: number } | null>(null);
  const [qrModalVoucher, setQrModalVoucher] = useState<Redemption | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Workout Plan State (Synced with WorkoutStore & INITIAL_EXERCISES)
  const [builderStep, setBuilderStep] = useState<1 | 2 | 3 | 4>(1);
  const [builderEquipment, setBuilderEquipment] = useState<EquipmentType[]>(['bodyweight']);
  const [builderMuscles, setBuilderMuscles] = useState<MuscleGroup[]>(['full_body']);
  const [builderDuration, setBuilderDuration] = useState<15 | 30 | 45 | 60>(30);
  const [builderDifficulty, setBuilderDifficulty] = useState<ExerciseDifficulty>('beginner');
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDetailExercise, setSelectedDetailExercise] = useState<Exercise | null>(null);
  const [activeGuidedPlan, setActiveGuidedPlan] = useState<WorkoutPlan | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState<string>('all');
  const [savedPlans, setSavedPlans] = useState<WorkoutPlan[]>([]);

  // Synchronized Web Data & Dashboard Summary
  const [activity, setActivity] = useState<ActivitySummary | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);

  // Derived values from synchronized web data
  const dailyPercent = activity?.daily_goal_percent ?? 68;
  const activeMin = activity?.active_minutes ?? 24;
  const targetMin = dailyGoalTarget || activity?.daily_goal_minutes || 35;
  const savedMinutes = activity?.screen_time_saved_minutes ?? 80;
  const savedHours = Math.floor(savedMinutes / 60);
  const savedRemain = savedMinutes % 60;
  const savedDisplay = savedHours > 0 ? `${savedHours}h ${savedRemain}m` : `${savedRemain}m`;

  const screenTimeMinutes = dashboardSummary?.screen_time_minutes ?? 78;
  const screenTimeH = Math.floor(screenTimeMinutes / 60);
  const screenTimeM = Math.round(screenTimeMinutes % 60);
  const totalScreenTimeDisplay = screenTimeH > 0 ? `${screenTimeH}h ${screenTimeM}m` : `${screenTimeM}m`;

  const getAppUsageMinutes = (appId: string) => {
    if (!dashboardSummary?.app_breakdown) {
      return appId === 'tiktok' ? 39 : appId === 'instagram' ? 26 : 13;
    }
    const match = dashboardSummary.app_breakdown.find((b: any) => 
      (appId === 'tiktok' && b.package_name.includes('musically')) ||
      (appId === 'instagram' && b.package_name.includes('instagram')) ||
      (appId === 'youtube' && b.package_name.includes('youtube')) ||
      b.package_name.toLowerCase().includes(appId.toLowerCase())
    );
    if (match) return Math.round(match.duration_seconds / 60);
    return appId === 'tiktok' ? 39 : appId === 'instagram' ? 26 : 13;
  };

  const hourlyData = activity?.today_hourly_screentime || [
    { hour: '6', minutes: 10 },
    { hour: '9', minutes: 18 },
    { hour: '12', minutes: 28, active: true },
    { hour: '15', minutes: 12 },
    { hour: '18', minutes: 8 },
    { hour: '21', minutes: 4 },
  ];

  const weeklyData = activity?.this_week || [
    { day: 'Mon', minutes: 20 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 25 },
    { day: 'Thu', minutes: 35, active: true },
    { day: 'Fri', minutes: 20 },
    { day: 'Sat', minutes: 28 },
    { day: 'Sun', minutes: 15 },
  ];

  const recentSessionsList = (activity?.recent_sessions && activity.recent_sessions.length > 0)
    ? activity.recent_sessions
    : [
        { id: 'ws-1', title: 'Full Body Move', duration_minutes: 10, calories: 120, coins: 50, time: 'Today, 10:24', status: 'verified' },
        { id: 'ws-2', title: 'Jumping Jacks', duration_minutes: 3, calories: 40, coins: 15, time: 'Today, 14:20', status: 'verified' },
        { id: 'ws-3', title: 'Squat Challenge', duration_minutes: 5, calories: 60, coins: 20, time: 'Today, 10:05', status: 'verified' },
      ];

  // AI Coach Chatbot State (MoveIt Pro Feature)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'coach',
      text: `Halo ${userName}! Saya Coach Max AI pribadimu di MoveIt Pro 👑. Hari ini kamu sudah bergerak ${activeMin} menit (${dailyPercent}% target) dan berhasil menghemat screen time ${savedDisplay}. Ada yang ingin kamu konsultasikan tentang pola olahragamu?`,
      time: '09:42'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const moveItGuideVideoRef = useRef<HTMLVideoElement | null>(null);

  // Synchronize store data between Web and Mobile Demo
  const refreshStoreData = () => {
    const act = Move2EarnStore.getActivitySummary();
    setActivity(act);
    const dash = Move2EarnStore.getDashboardSummary();
    setDashboardSummary(dash);
    const rws = Move2EarnStore.getRewards();
    setRewardsList(rws);
    const summary = Move2EarnStore.getWalletSummary();
    setWalletBalance(summary.balance !== undefined ? summary.balance : 75);
    setWalletSummary(summary);
    setTransactionsList(Move2EarnStore.getTransactions());
    setRedemptionsList(Move2EarnStore.getRedemptions());
    setSavedPlans(WorkoutStore.getPresetPlans());
  };

  useEffect(() => {
    refreshStoreData();
    window.addEventListener('storage', refreshStoreData);
    const syncInterval = setInterval(refreshStoreData, 2000);

    // Default generate a clean starter routine for step 4 preview
    const initialPlan = WorkoutStore.generateWorkoutPlan({
      equipment: ['bodyweight'],
      targetMuscles: ['full_body'],
      durationMinutes: 30,
      difficulty: 'beginner',
    });
    setGeneratedPlan(initialPlan);

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 10000);
    return () => {
      window.removeEventListener('storage', refreshStoreData);
      clearInterval(syncInterval);
      clearInterval(clockInterval);
    };
  }, []);

  // Countdown timer for MoveIt Challenge (Hanya berjalan saat kamera aktif agar user tidak ketinggalan gerakan)
  useEffect(() => {
    if (activeTab !== 'moveit' || workoutCompleted || !isWebcamActive) return;

    const timer = setInterval(() => {
      setWorkoutSecondsLeft((prev) => {
        if (prev <= 1) {
          handleFinishWorkout();
          return 0;
        }
        return prev - 1;
      });

      // Incremental reps - langsung Challenge Complete begitu mencapai repTarget (25 reps)
      setRepCount((prev) => {
        const next = prev + 1;
        if (next >= repTarget) {
          handleFinishWorkout();
          return repTarget;
        }
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [activeTab, workoutCompleted, isWebcamActive, repTarget]);

  // Synchronize MoveIt guide video with camera active state (tidak autoPlay sebelum kamera aktif)
  useEffect(() => {
    const videoEl = moveItGuideVideoRef.current;
    if (!videoEl) return;

    if (activeTab === 'moveit' && isWebcamActive && !workoutCompleted) {
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('MoveIt guide video play error:', err);
        });
      }
    } else {
      videoEl.pause();
    }
  }, [activeTab, isWebcamActive, workoutCompleted, currentMoveItMedia.url]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isCoachTyping]);

  // Fetch dynamic MoveIt Media from components/media on mount
  useEffect(() => {
    fetchMoveItMedia().then((reg) => {
      setMoveItRegistry(reg);
      const media = getMediaForSession(moveItSessionNumber, reg);
      setCurrentMoveItMedia(media);
    });
  }, []);

  const handleSelectMoveItSession = (sessionNum: number) => {
    setMoveItSessionNumber(sessionNum);
    const media = getMediaForSession(sessionNum, moveItRegistry);
    setCurrentMoveItMedia(media);
    setWorkoutCompleted(false);
    setWorkoutSecondsLeft(30);
    setRepCount(0);
    if (moveItGuideVideoRef.current) {
      moveItGuideVideoRef.current.currentTime = 0;
      if (!isWebcamActive) {
        moveItGuideVideoRef.current.pause();
      }
    }
  };

  // Direct Live Webcam Feed Management (Tanpa AI Skeleton, fokus kamera fisik)
  const requestWebcamAccess = () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        webcamStreamRef.current = stream;
        setIsWebcamActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((err) => {
        console.warn('Camera access denied or unavailable:', err);
        setIsWebcamActive(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'moveit') {
      requestWebcamAccess();
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
  }, [activeTab]);

  // Finish Workout
  const handleFinishWorkout = () => {
    if (workoutCompleted) return;
    if (soundEnabled) playSound('coin');
    const ch = Move2EarnStore.getChallenges()[0];
    Move2EarnStore.completeWorkout(ch.id, 30);
    refreshStoreData();
    setWorkoutCompleted(true);
    setRepCount(repTarget);
    setWorkoutSecondsLeft(0);
    if (moveItGuideVideoRef.current) {
      moveItGuideVideoRef.current.pause();
    }
  };

  // Simulate External Push Notification
  const triggerExternalSocialNotification = () => {
    if (soundEnabled) playSound('alert');
    setShowExternalNotification(true);
  };

  // Click External Push Notification -> Opens MoveIt Challenge
  const handleOpenPromptFromNotification = () => {
    setShowExternalNotification(false);
    setActiveTab('moveit');
    setWorkoutSecondsLeft(30);
    setRepCount(23);
    setWorkoutCompleted(false);
  };

  // Redeem Reward (Synchronized with Store)
  const handleRedeem = (reward: Reward) => {
    if (walletBalance < reward.coin_price) {
      alert('Move Coins tidak mencukupi untuk menukar voucher ini!');
      return;
    }
    if (soundEnabled) playSound('coin');
    const res = Move2EarnStore.redeemReward(reward.id);
    if (res.success && res.redemption) {
      refreshStoreData();
      setRedeemedVoucher({
        title: reward.title,
        code: res.redemption.voucher_code || reward.voucher_code || 'M2E-CLAIM-2026',
        price: reward.coin_price
      });
      setRewardsSubTab('vouchers');
    } else {
      alert(res.error || 'Gagal menukarkan voucher.');
    }
  };

  const handleCopyVoucherCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (soundEnabled) playSound('click');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Workout Builder & Player Handlers
  const handleGenerateWorkout = () => {
    if (soundEnabled) playSound('coin');
    const plan = WorkoutStore.generateWorkoutPlan({
      equipment: builderEquipment,
      targetMuscles: builderMuscles,
      durationMinutes: builderDuration,
      difficulty: builderDifficulty,
    });
    setGeneratedPlan(plan);
    setBuilderStep(4);
  };

  const handleSwapExercise = (exerciseId: string) => {
    if (!generatedPlan) return;
    const replacement = WorkoutStore.getAlternativeExercise(
      exerciseId,
      builderEquipment,
      builderMuscles
    );
    if (!replacement) {
      alert('Tidak ada variasi gerakan pengganti yang cocok untuk kriteria saat ini.');
      return;
    }
    const updatedExercises: WorkoutPlanExercise[] = generatedPlan.exercises.map((item) => {
      if (item.exercise.id === exerciseId) {
        return {
          ...item,
          exercise: replacement,
        };
      }
      return item;
    });
    setGeneratedPlan({
      ...generatedPlan,
      exercises: updatedExercises,
    });
    if (soundEnabled) playSound('click');
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (!generatedPlan || generatedPlan.exercises.length <= 1) {
      alert('Rencana latihan minimal harus memiliki 1 gerakan.');
      return;
    }
    const updated = generatedPlan.exercises.filter((ex) => ex.exercise.id !== exerciseId);
    setGeneratedPlan({
      ...generatedPlan,
      exercises: updated,
    });
    if (soundEnabled) playSound('click');
  };

  const handleStartGuidedWorkout = (plan: WorkoutPlan) => {
    setActiveGuidedPlan(plan);
    if (soundEnabled) playSound('coin');
  };

  const handleFinishGuidedWorkout = (session: any) => {
    const coins = session.coins_earned || Math.round((session.total_duration_seconds || 1800) / 60 * 2);
    Move2EarnStore.addMoveCoins(coins, `Workout: ${activeGuidedPlan?.title || 'Guided Session'}`);
    refreshStoreData();
    setActiveGuidedPlan(null);
    if (soundEnabled) playSound('coin');
  };

  const handleStartSingleExercise = (exercise: Exercise) => {
    const singlePlan: WorkoutPlan = {
      id: `quick-${exercise.id}-${Date.now()}`,
      title: exercise.name,
      description: `Sesi latihan terpandu: ${exercise.name}`,
      target_muscles: [exercise.primary_muscle],
      equipment: exercise.equipment,
      estimated_duration_minutes: 5,
      estimated_calories: 40,
      coin_reward: 15,
      category: exercise.category,
      difficulty: exercise.difficulty,
      exercises: [
        {
          id: `single-ex-${Date.now()}`,
          exercise: exercise,
          sets: 3,
          reps_or_duration: exercise.recommended_reps || '12 reps',
          duration_seconds: exercise.default_duration_seconds || 45,
          rest_seconds: exercise.default_rest_seconds || 45,
        }
      ],
      created_at: new Date().toISOString(),
    };
    setSelectedDetailExercise(null);
    setActiveGuidedPlan(singlePlan);
  };

  // Handle AI Coach Chatbot Query
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    if (soundEnabled) playSound('click');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      time: currentTime
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsCoachTyping(true);

    // AI Coach Intelligent Response Simulation grounded on user data
    setTimeout(() => {
      let coachReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('korelasi') || lower.includes('analisis') || lower.includes('performa')) {
        coachReply = `Berdasarkan data minggu ini: Hari Kamis kemarin kamu hanya scroll sosmed 45 menit dan workout 35 menit penuh (+35% efisiensi kalori!). Namun pada jam 12:00–15:00 hari ini, screen time kamu naik ke 28 menit. Saran saya: luangkan 3 menit Jumping Jacks sebelum makan siang agar metabolisme tetap tinggi!`;
      } else if (lower.includes('leher') || lower.includes('pegal') || lower.includes('postur')) {
        coachReply = `Posisi menunduk saat menatap layar HP memberi beban hingga 27 kg pada leher! Saya sarankan lakukan gerakan 'Chin Tucks' dan 'Upper Chest Stretch' selama 3 menit. Sesi ini otomatis memberimu +15 Move Coins di MoveIt!`;
      } else if (lower.includes('malam') || lower.includes('tidur') || lower.includes('stop scroll')) {
        coachReply = `Doomscrolling malam hari menurunkan hormon melatonin. Di menu Focus & Notifications, aktifkan 'Quiet Hours' mulai pukul 22:00. Jika kamu tetap tergoda membuka TikTok, MoveIt akan mengunci layar dengan 5 menit deep breathing & core plank!`;
      } else {
        coachReply = `Luar biasa, ${userName}! Konsistensi streak 7 harimu sudah menghasilkan 320 Move Coins. Kamu hanya butuh 11 menit latihan lagi untuk menuntaskan 100% Daily Goal hari ini. Ayo selesaikan tantangan squat berikutnya!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          sender: 'coach',
          text: coachReply,
          time: currentTime
        }
      ]);
      setIsCoachTyping(false);
      if (soundEnabled) playSound('coin');
    }, 900);
  };

  const handleReset = () => {
    if (soundEnabled) playSound('click');
    setIsLoggedIn(true);
    setActiveTab('tracking');
    setProfileSubView('main');
    setShowExternalNotification(false);
    setWorkoutCompleted(false);
    setRepCount(23);
    setWorkoutSecondsLeft(30);
    setRedeemedVoucher(null);
  };

  const handleSignOut = () => {
    if (soundEnabled) playSound('click');
    setIsLoggedIn(false);
    setProfileSubView('auth');
  };

  const handleSaveOnboarding = () => {
    if (soundEnabled) playSound('coin');
    setIsLoggedIn(true);
    setProfileSubView('main');
    setActiveTab('tracking');
  };

  return (
    <div className={`min-h-screen bg-[#06080e] text-gray-100 transition-colors ${showPresenterPanel ? 'py-8 px-4 sm:px-6 lg:px-8' : 'py-3 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center'}`}>
      
      {/* Sleek Minimal Floating Header when in Focused Mobile Mode */}
      {!showPresenterPanel && (
        <div className="w-full max-w-lg mb-4 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#0e131f]/90 backdrop-blur-md border border-gray-800 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-xs font-black tracking-wider text-white">
              MOVE<span className="text-[#ccff00]">2EARN</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 font-bold">
              Mobile Demo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-xl border text-xs transition-colors ${
                soundEnabled ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
              title="Toggle Sound FX"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-white"
              title="Reset Demo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-[11px] font-semibold text-gray-300 hover:text-white flex items-center gap-1"
            >
              <span>Web</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            {/* Tombol Utama untuk Menampilkan Semua Seperti Sebelumnya */}
            <button
              onClick={() => setShowPresenterPanel(true)}
              className="px-3 py-1.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-[#ccff00]/25 transition-all group"
              title="Tampilkan panel presenter, skenario 1-click switcher dan teks header"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Tampilkan Panel Presenter</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header (Visible in Presenter Mode) */}
      {showPresenterPanel && (
        <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                Sesi Demo Mobile App
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-400 font-mono">Move2earn App Complete Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Simulator Handphone Move2earn — Fitur Lengkap &amp; Pro AI Coach
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              Simulasi lengkap: Alur login/personalisasi, Dashboard metrik, Activity Tracking harian, Split-Screen Challenge, Hadiah, Pengaturan batas sosmed, <strong>Help &amp; Support</strong>, serta fitur <strong>Upgrade MoveIt Pro (Deep Analytics &amp; AI Coach Chatbot)</strong>!
            </p>
          </div>

          {/* Global Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPresenterPanel(false)}
              className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#ccff00]/20 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Fokus Tampilan HP Saja</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                soundEnabled ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
              title="Toggle Sound FX"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Sound FX</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-white flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Demo</span>
            </button>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
            >
              <span>Buka Web Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* LAYOUT CONTAINER */}
      <div className={`mx-auto ${showPresenterPanel ? 'max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full' : 'w-full flex justify-center items-center'}`}>
        
        {/* ==================================================================== */}
        {/* COLUMN 1: SMARTPHONE DEVICE FRAME */}
        {/* ==================================================================== */}
        <div className={`${showPresenterPanel ? 'lg:col-span-6 xl:col-span-5 flex justify-center' : 'w-full flex justify-center'}`}>
          
          <div className={`relative bg-black rounded-[52px] sm:rounded-[58px] p-2.5 sm:p-3.5 shadow-[0_0_80px_-15px_rgba(204,255,0,0.3)] border-[8px] sm:border-[10px] border-[#1a1f29] transition-all duration-300 ${
            showPresenterPanel
              ? 'w-[345px] sm:w-[380px] h-[750px]'
              : 'w-[365px] sm:w-[415px] md:w-[430px] h-[820px] sm:h-[860px] max-h-[92vh]'
          }`}>
            
            {/* Outer Titanium Trim Accent */}
            <div className="absolute inset-0 rounded-[44px] sm:rounded-[48px] pointer-events-none border border-white/10" />

            {/* Hardware Side Buttons */}
            <div className="absolute -left-[11px] sm:-left-[13px] top-28 w-[3px] h-10 bg-gray-700 rounded-l" />
            <div className="absolute -left-[11px] sm:-left-[13px] top-42 w-[3px] h-12 bg-gray-700 rounded-l" />
            <div className="absolute -right-[11px] sm:-right-[13px] top-36 w-[3px] h-16 bg-gray-700 rounded-r" />

            {/* SCREEN VIEWPORT */}
            <div className="relative w-full h-full bg-[#0e1117] rounded-[42px] sm:rounded-[46px] overflow-hidden flex flex-col border border-gray-900 select-none text-white">
              
              {/* STATUS BAR */}
              <div className="absolute top-0 inset-x-0 h-10 z-30 px-6 flex items-center justify-between text-white text-xs font-semibold">
                <span>{currentTime}</span>
                
                {/* Dynamic Island */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 border border-gray-900 px-2 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-[#1a2333]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ccff00]/90 animate-pulse" />
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#ccff00]" />
                  </div>
                </div>
              </div>

              {/* FLOATING EXTERNAL PUSH NOTIFICATION (SIMULATES SOCIAL APP INTERRUPTION) */}
              {showExternalNotification && (
                <div 
                  onClick={handleOpenPromptFromNotification}
                  className="absolute top-11 inset-x-3 z-40 p-3 rounded-2xl bg-black/95 backdrop-blur-md border border-[#ccff00]/70 shadow-2xl text-xs cursor-pointer animate-in fade-in slide-in-from-top-4 duration-300"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-600 flex items-center justify-center flex-shrink-0 font-bold text-white text-[10px]">
                      TikTok
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span className="font-bold text-white">Batas Screen Time Tercapai!</span>
                        <span>Sekarang</span>
                      </div>
                      <p className="text-[11px] text-gray-200 mt-0.5 leading-snug">
                        Kamu sudah scroll 60 menit. Ketuk untuk membuka <strong className="text-[#ccff00]">MOVEIT Challenge</strong> (3 menit Jumping Jacks).
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-white/10 flex justify-end">
                    <span className="text-[10px] font-bold text-[#ccff00] flex items-center gap-1">
                      Mulai Workout Sekarang <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* SMARTPHONE APP CONTENT (ROUTED BY TAB & SUBVIEW) */}
              {/* ============================================================== */}
              <div className="flex-1 pt-11 pb-16 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#0b0e14]">
                
                {/* ------------------------------------------------------------ */}
                {/* ONBOARDING & LOGIN SCREEN (WHEN NOT LOGGED IN) */}
                {/* ------------------------------------------------------------ */}
                {(!isLoggedIn || profileSubView === 'auth') ? (
                  <div className="p-4 space-y-4 my-auto">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#ccff00]/30">
                        <Zap className="w-7 h-7 fill-black" />
                      </div>
                      <h2 className="text-xl font-black text-white tracking-wider">
                        MOVE<span className="text-[#ccff00]">2EARN</span>
                      </h2>
                      <p className="text-xs text-gray-400 font-medium">Turn screen time into movement.</p>
                      <span className="text-[10px] text-gray-500 block">Personalisasi Akun & Target Kebugaran</span>
                    </div>

                    {/* Personalization Inputs */}
                    <div className="p-4 rounded-3xl bg-[#121620] border border-gray-800 space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Nama Kamu</label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-[#181e2b] border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ccff00]"
                          placeholder="Masukkan nama..."
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Target Workout Harian</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[15, 30, 45].map((target) => (
                            <button
                              key={target}
                              type="button"
                              onClick={() => setDailyGoalTarget(target)}
                              className={`py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                                dailyGoalTarget === target
                                  ? 'bg-[#ccff00] text-black'
                                  : 'bg-[#181e2b] text-gray-300 border border-gray-700'
                              }`}
                            >
                              {target} min
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tingkat Kesulitan</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setFitnessLevel(lvl)}
                              className={`py-1.5 rounded-lg font-bold text-[10px] transition-colors ${
                                fitnessLevel === lvl
                                  ? 'bg-[#ccff00] text-black'
                                  : 'bg-[#181e2b] text-gray-300 border border-gray-700'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Aplikasi Sosmed Dipantau</label>
                        <div className="flex gap-2">
                          {['TikTok', 'Instagram', 'YouTube'].map((app) => {
                            const isSel = selectedFocusApps.includes(app);
                            return (
                              <button
                                key={app}
                                type="button"
                                onClick={() => {
                                  if (isSel) setSelectedFocusApps(selectedFocusApps.filter((a) => a !== app));
                                  else setSelectedFocusApps([...selectedFocusApps, app]);
                                }}
                                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  isSel
                                    ? 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/50'
                                    : 'bg-[#181e2b] text-gray-400 border-gray-700'
                                }`}
                              >
                                {isSel ? `✓ ${app}` : app}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Social Logins & CTA */}
                    <div className="space-y-2">
                      <button
                        onClick={handleSaveOnboarding}
                        className="w-full py-3 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#ccff00]/25 transition-all"
                      >
                        Simpan & Masuk ke Dashboard
                      </button>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <button
                          onClick={handleSaveOnboarding}
                          className="py-2 px-2 bg-[#121620] hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-300 font-semibold"
                        >
                          Google Login
                        </button>
                        <button
                          onClick={handleSaveOnboarding}
                          className="py-2 px-2 bg-[#121620] hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-300 font-semibold"
                        >
                          Apple ID
                        </button>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'tracking' ? (
                  /* ------------------------------------------------------------ */
                  /* SCREEN 1: ALL-IN-ONE TRACKING (DASHBOARD & ACTIVITY TRACKING) */
                  /* ------------------------------------------------------------ */
                  <div className="p-4 space-y-4">
                    {/* Top App Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base tracking-wider text-white">
                          MOVE<span className="text-[#ccff00]">2EARN</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] font-bold border border-[#ccff00]/25">
                          Tracking
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveTab('profile');
                          setProfileSubView('focus_notifications');
                        }}
                        className="p-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-white"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Greeting & Day Streak */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-extrabold text-white">Hi, {userName}!</h2>
                        <p className="text-xs text-gray-400">Keep moving, stronger you!</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-black/60 border border-gray-800 flex items-center gap-1.5 text-xs font-bold text-[#ccff00]">
                        <Flame className="w-3.5 h-3.5 fill-[#ccff00]" />
                        <span>{activity?.day_streak ?? 7} Day Streak</span>
                      </div>
                    </div>

                    {/* Daily / Weekly Pill Switch */}
                    <div className="p-1 rounded-2xl bg-[#121620] border border-gray-800 grid grid-cols-2 text-xs">
                      <button
                        onClick={() => setTrackingPeriod('daily')}
                        className={`py-1.5 rounded-xl font-bold transition-all ${
                          trackingPeriod === 'daily'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Daily Tracking
                      </button>
                      <button
                        onClick={() => setTrackingPeriod('weekly')}
                        className={`py-1.5 rounded-xl font-bold transition-all ${
                          trackingPeriod === 'weekly'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Weekly Overview
                      </button>
                    </div>

                    {/* Hero Circular Progress & Side Stats Grid */}
                    <div className="p-4 rounded-3xl bg-[#121620] border border-gray-800/80 grid grid-cols-12 gap-3 items-center">
                      
                      {/* Left Circular Ring (Daily Goal) */}
                      <div className="col-span-6 flex flex-col items-center justify-center relative">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-28 h-28 transform -rotate-90">
                            <circle
                              cx="56"
                              cy="56"
                              r="46"
                              className="stroke-gray-800"
                              strokeWidth="8"
                              fill="transparent"
                            />
                            <circle
                              cx="56"
                              cy="56"
                              r="46"
                              className="stroke-[#ccff00] transition-all duration-1000 ease-out"
                              strokeWidth="8"
                              strokeDasharray={289}
                              strokeDashoffset={289 * (1 - Math.min(1, dailyPercent / 100))}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-lg font-black text-white block leading-tight">{dailyPercent}%</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Daily Goal</span>
                            <span className="text-[10px] text-[#ccff00] font-mono font-bold block mt-0.5">{activeMin} / {targetMin} min</span>
                          </div>
                        </div>
                      </div>

                      {/* Right 2 Stacked Cards */}
                      <div className="col-span-6 space-y-2.5">
                        <div className="p-2.5 rounded-2xl bg-[#181e2b] border border-gray-800 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                            <Clock className="w-3 h-3 text-[#ccff00]" />
                            <span>Screen Time Saved</span>
                          </div>
                          <div className="text-sm font-bold text-white font-mono mt-0.5">{savedDisplay}</div>
                        </div>

                        <div 
                          onClick={() => {
                            setActiveTab('rewards');
                            setRewardsSubTab('wallet');
                          }}
                          className="p-2.5 rounded-2xl bg-[#181e2b] border border-gray-800 text-xs cursor-pointer hover:border-[#ccff00]/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <Coins className="w-3 h-3 text-amber-400" />
                              <span>Move Coins</span>
                            </div>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                          <div className="text-sm font-bold text-[#ccff00] font-mono mt-0.5">{walletBalance} &gt;</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row of 3 Stat Pills */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-3 rounded-2xl bg-[#121620] border border-gray-800">
                        <div className="flex items-center justify-center gap-1 text-orange-400 mb-0.5">
                          <Flame className="w-3.5 h-3.5 fill-orange-400" />
                        </div>
                        <div className="font-bold text-white text-sm font-mono">{activity?.calories_burned?.toLocaleString() ?? 245}</div>
                        <div className="text-[9px] text-gray-400 uppercase">Calories</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#121620] border border-gray-800">
                        <div className="flex items-center justify-center gap-1 text-[#ccff00] mb-0.5">
                          <Footprints className="w-3.5 h-3.5" />
                        </div>
                        <div className="font-bold text-white text-sm font-mono">{activity?.steps_count?.toLocaleString() ?? '3,200'}</div>
                        <div className="text-[9px] text-gray-400 uppercase">Steps</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#121620] border border-gray-800">
                        <div className="flex items-center justify-center gap-1 text-teal-400 mb-0.5">
                          <Dumbbell className="w-3.5 h-3.5" />
                        </div>
                        <div className="font-bold text-white text-sm font-mono">{activity?.workout_sessions_count ?? 4}</div>
                        <div className="text-[9px] text-gray-400 uppercase">Workouts</div>
                      </div>
                    </div>

                    {/* Screen Time (Social Apps) Bar Chart Section */}
                    <div className="p-4 rounded-3xl bg-[#121620] border border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-white">
                            {trackingPeriod === 'daily' ? 'Hourly Social Screentime' : 'Weekly Activity Progress'}
                          </h3>
                          <span className="text-[10px] text-gray-400">Total hari ini: {totalScreenTimeDisplay} (↓ 42% vs kemarin)</span>
                        </div>
                        <span className="text-[10px] text-[#ccff00] font-mono font-bold bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/25">
                          Terkontrol
                        </span>
                      </div>

                      {/* Bar chart */}
                      {trackingPeriod === 'daily' ? (
                        <div className="flex items-end justify-between h-24 pt-3 px-1 border-b border-gray-800/80 pb-2">
                          {hourlyData.map((item) => {
                            const val = Math.min(100, Math.round((item.minutes / 30) * 100));
                            return (
                              <div key={item.hour} className="flex flex-col items-center gap-1.5 flex-1 relative">
                                {item.active && (
                                  <div className="absolute -top-6 bg-black text-[#ccff00] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#ccff00]/40 whitespace-nowrap">
                                    {item.minutes} min
                                  </div>
                                )}
                                <div 
                                  className={`w-3.5 rounded-full ${item.active ? 'bg-[#ccff00]' : 'bg-[#1e2536]'}`}
                                  style={{ height: `${Math.max(12, val)}%` }}
                                />
                                <span className="text-[10px] text-gray-400 font-mono">{item.hour}:00</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-end justify-between h-24 pt-3 px-1 border-b border-gray-800/80 pb-2">
                          {weeklyData.map((b) => {
                            const h = Math.min(100, Math.round((b.minutes / 40) * 100));
                            return (
                              <div key={b.day} className="flex flex-col items-center gap-1.5 flex-1 relative">
                                {b.active && (
                                  <div className="absolute -top-6 bg-black text-[#ccff00] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#ccff00]/40 whitespace-nowrap">
                                    {b.minutes} min
                                  </div>
                                )}
                                <div 
                                  className={`w-3.5 rounded-full transition-all ${
                                    b.active ? 'bg-[#ccff00]' : 'bg-[#1e2536]'
                                  }`}
                                  style={{ height: `${Math.max(15, h)}%` }}
                                />
                                <span className={`text-[10px] font-mono ${b.active ? 'text-[#ccff00] font-bold' : 'text-gray-400'}`}>
                                  {b.day}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Social Apps Screentime Breakdown */}
                    <div className="p-3.5 rounded-3xl bg-[#121620] border border-gray-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Aplikasi yang Dipantau</span>
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setProfileSubView('focus_notifications');
                          }}
                          className="text-[10px] text-[#ccff00] hover:underline flex items-center gap-0.5"
                        >
                          Atur Threshold <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {monitoredApps.map((app) => {
                          const usedMin = getAppUsageMinutes(app.id);
                          const isExceeded = usedMin >= app.thresholdMinutes;
                          return (
                            <div key={app.id} className="p-2 rounded-2xl bg-[#181e2b] border border-gray-800 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                {renderAppIcon(app.iconType, app.name, "w-7 h-7")}
                                <div>
                                  <span className="font-bold text-white block text-[11px]">{app.name}</span>
                                  <span className="text-[9px] text-gray-400">Batas: {app.thresholdMinutes}m</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-white text-[11px]">
                                  {usedMin}m
                                </span>
                                <span className={`text-[9px] block ${isExceeded ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>
                                  {isExceeded ? '⚠️ Penuh' : 'Aman'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Workout Sessions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white">Sesi Latihan Terkini</h3>
                        <button 
                          onClick={() => setActiveTab('workout')}
                          className="text-[10px] text-[#ccff00] hover:underline flex items-center gap-0.5"
                        >
                          + Buka Workout Plan <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {recentSessionsList.map((sess, idx) => (
                          <div key={sess.id || idx} className="p-3 rounded-2xl bg-[#121620] border border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center">
                                <Dumbbell className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{sess.title}</h4>
                                <p className="text-[10px] text-gray-400">{sess.duration_minutes} min • {sess.calories} kcal</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-right">
                              <div>
                                <span className="text-xs font-bold text-[#ccff00] font-mono">+{sess.coins} 🪙</span>
                                <span className="text-[10px] text-gray-500 block">{sess.time}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveTab('workout')}
                        className="w-full py-2.5 rounded-2xl bg-[#ccff00]/15 hover:bg-[#ccff00]/25 text-[#ccff00] border border-[#ccff00]/30 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                      >
                        <Dumbbell className="w-4 h-4" />
                        <span>Mulai Rencana Latihan di Workout Plan</span>
                      </button>
                    </div>

                  </div>
                ) : activeTab === 'workout' ? (
                  /* ------------------------------------------------------------ */
                  /* SCREEN 2: WORKOUT PLANNER (AI BUILDER, 40 EXERCISE LIBRARY, PRESETS) */
                  /* ------------------------------------------------------------ */
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActiveTab('tracking')} className="text-gray-400 hover:text-white">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="text-sm font-bold text-white">Workout Plan</h2>
                          <p className="text-[10px] text-gray-400">Workout.cool Library & AI Routine</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] text-[10px] font-mono font-bold border border-[#ccff00]/30">
                        40+ Gerakan
                      </span>
                    </div>

                    {/* Sub-tab Switcher: [ ⚡ AI Builder | 📖 Library Gerakan | 📋 Preset Routine ] */}
                    <div className="p-1 rounded-2xl bg-[#121620] border border-gray-800 grid grid-cols-3 text-center text-xs">
                      <button
                        onClick={() => setWorkoutSubTab('builder')}
                        className={`py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                          workoutSubTab === 'builder'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        ⚡ AI Builder
                      </button>
                      <button
                        onClick={() => setWorkoutSubTab('library')}
                        className={`py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                          workoutSubTab === 'library'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        📖 Library (40)
                      </button>
                      <button
                        onClick={() => setWorkoutSubTab('presets')}
                        className={`py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                          workoutSubTab === 'presets'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        📋 Preset
                      </button>
                    </div>

                    {/* 1. AI BUILDER SUB-TAB */}
                    {workoutSubTab === 'builder' && (
                      <div className="space-y-4">
                        {/* 4-Step Stepper Header */}
                        <div className="grid grid-cols-4 gap-1 text-center">
                          {[
                            { num: 1, label: 'Alat' },
                            { num: 2, label: 'Otot' },
                            { num: 3, label: 'Waktu' },
                            { num: 4, label: 'Routine' },
                          ].map((st) => (
                            <button
                              key={st.num}
                              onClick={() => {
                                if (st.num <= 3 || generatedPlan) setBuilderStep(st.num as any);
                              }}
                              className={`py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                                builderStep === st.num
                                  ? 'bg-[#ccff00] text-black border-[#ccff00] shadow'
                                  : builderStep > st.num
                                  ? 'bg-[#152010] text-[#ccff00] border-[#ccff00]/40'
                                  : 'bg-[#121620] text-gray-500 border-gray-800'
                              }`}
                            >
                              <span>{st.num}. {st.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* STEP 1: PILIH ALAT */}
                        {builderStep === 1 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">Langkah 1: Pilih Alat yang Tersedia</span>
                              <button
                                onClick={() => {
                                  if (builderEquipment.length >= 6) setBuilderEquipment(['bodyweight']);
                                  else setBuilderEquipment(['bodyweight', 'dumbbell', 'barbell', 'pull_up_bar', 'gym_machine', 'resistance_band']);
                                }}
                                className="text-[10px] text-[#ccff00] hover:underline"
                              >
                                {builderEquipment.length >= 6 ? 'Reset ke Bodyweight' : 'Pilih Semua'}
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {[
                                { id: 'bodyweight' as EquipmentType, label: 'Tanpa Alat (Bodyweight)', icon: '🧘' },
                                { id: 'dumbbell' as EquipmentType, label: 'Dumbbell', icon: '🏋️' },
                                { id: 'barbell' as EquipmentType, label: 'Barbell/botol', icon: '🔩' },
                                { id: 'pull_up_bar' as EquipmentType, label: 'Pull-Up Bar', icon: '⛓️' },
                                { id: 'resistance_band' as EquipmentType, label: 'Resistance Bands', icon: '➰' },
                                { id: 'gym_machine' as EquipmentType, label: 'Gym Machine', icon: '⚙️' },
                              ].map((item) => {
                                const isSel = builderEquipment.includes(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      if (isSel) {
                                        if (builderEquipment.length > 1) {
                                          setBuilderEquipment(builderEquipment.filter((x) => x !== item.id));
                                        }
                                      } else {
                                        setBuilderEquipment([...builderEquipment, item.id]);
                                      }
                                    }}
                                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                                      isSel
                                        ? 'bg-[#182315] border-[#ccff00] text-white shadow'
                                        : 'bg-[#121620] border-gray-800 text-gray-400 hover:border-gray-700'
                                    }`}
                                  >
                                    <div className="text-base mb-1">{item.icon}</div>
                                    <span className="font-bold block text-[11px]">{item.label}</span>
                                    <span className={`text-[9px] block mt-0.5 ${isSel ? 'text-[#ccff00]' : 'text-gray-500'}`}>
                                      {isSel ? '✓ Dipilih' : '+ Pilih'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => setBuilderStep(2)}
                              className="w-full py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
                            >
                              Lanjut ke Target Otot →
                            </button>
                          </div>
                        )}

                        {/* STEP 2: TARGET OTOT */}
                        {builderStep === 2 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">Langkah 2: Pilih Target Otot</span>
                              <span className="text-[10px] text-gray-400">Bisa lebih dari satu</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {[
                                { id: 'full_body' as MuscleGroup, label: 'Full Body', icon: '⚡' },
                                { id: 'chest' as MuscleGroup, label: 'Dada (Chest)', icon: '🛡️' },
                                { id: 'back' as MuscleGroup, label: 'Punggung (Back)', icon: '🧗' },
                                { id: 'quadriceps' as MuscleGroup, label: 'Kaki (Legs/Quads)', icon: '🦵' },
                                { id: 'shoulders' as MuscleGroup, label: 'Bahu (Shoulders)', icon: '🦅' },
                                { id: 'biceps' as MuscleGroup, label: 'Lengan (Arms/Biceps)', icon: '💪' },
                                { id: 'abs' as MuscleGroup, label: 'Perut (Core/Abs)', icon: '🎯' },
                              ].map((item) => {
                                const isSel = builderMuscles.includes(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      if (item.id === 'full_body') {
                                        setBuilderMuscles(['full_body']);
                                        return;
                                      }
                                      let updated: MuscleGroup[] = builderMuscles.filter((x) => x !== 'full_body');
                                      if (isSel) {
                                        updated = updated.filter((x) => x !== item.id);
                                        if (updated.length === 0) updated = ['full_body'];
                                      } else {
                                        updated.push(item.id);
                                      }
                                      setBuilderMuscles(updated);
                                    }}
                                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                                      isSel
                                        ? 'bg-[#182315] border-[#ccff00] text-white shadow'
                                        : 'bg-[#121620] border-gray-800 text-gray-400 hover:border-gray-700'
                                    }`}
                                  >
                                    <div className="text-base mb-1">{item.icon}</div>
                                    <span className="font-bold block text-[11px]">{item.label}</span>
                                    <span className={`text-[9px] block mt-0.5 ${isSel ? 'text-[#ccff00]' : 'text-gray-500'}`}>
                                      {isSel ? '✓ Aktif' : '+ Pilih'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => setBuilderStep(1)}
                                className="py-2.5 px-4 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-700"
                              >
                                ← Kembali
                              </button>
                              <button
                                onClick={() => setBuilderStep(3)}
                                className="flex-1 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
                              >
                                Lanjut ke Durasi & Level →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* STEP 3: DURASI & TINGKAT KESULITAN */}
                        {builderStep === 3 && (
                          <div className="space-y-4">
                            <div>
                              <span className="text-xs font-bold text-white block mb-2">Durasi Latihan:</span>
                              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                {[15, 30, 45, 60].map((dur) => (
                                  <button
                                    key={dur}
                                    type="button"
                                    onClick={() => setBuilderDuration(dur as any)}
                                    className={`py-2 rounded-xl border font-mono font-bold transition-all ${
                                      builderDuration === dur
                                        ? 'bg-[#ccff00] text-black border-[#ccff00] shadow'
                                        : 'bg-[#121620] text-gray-400 border-gray-800'
                                    }`}
                                  >
                                    {dur} min
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-xs font-bold text-white block mb-2">Tingkat Kesulitan:</span>
                              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                {[
                                  { id: 'beginner' as ExerciseDifficulty, label: 'Pemula' },
                                  { id: 'intermediate' as ExerciseDifficulty, label: 'Menengah' },
                                  { id: 'advanced' as ExerciseDifficulty, label: 'Mahir' },
                                ].map((lvl) => (
                                  <button
                                    key={lvl.id}
                                    type="button"
                                    onClick={() => setBuilderDifficulty(lvl.id)}
                                    className={`py-2 rounded-xl border font-bold transition-all ${
                                      builderDifficulty === lvl.id
                                        ? 'bg-[#ccff00] text-black border-[#ccff00] shadow'
                                        : 'bg-[#121620] text-gray-400 border-gray-800'
                                    }`}
                                  >
                                    {lvl.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => setBuilderStep(2)}
                                className="py-2.5 px-4 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-700"
                              >
                                ← Kembali
                              </button>
                              <button
                                onClick={handleGenerateWorkout}
                                className="flex-1 py-3 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#ccff00]/25 transition-all flex items-center justify-center gap-2"
                              >
                                <Zap className="w-4 h-4 fill-black" />
                                <span>Generate My Workout Routine</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* STEP 4: HASIL ROUTINE GENERATED DENGAN VIDEO & SWAP */}
                        {builderStep === 4 && generatedPlan && (
                          <div className="space-y-3">
                            {/* Plan Header Card */}
                            <div className="p-3.5 rounded-3xl bg-gradient-to-br from-[#182618] to-[#121620] border border-[#ccff00]/40 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40 font-mono">
                                  {generatedPlan.difficulty.toUpperCase()}
                                </span>
                                <span className="text-xs font-bold text-[#ccff00] font-mono">
                                  ~{generatedPlan.estimated_calories} kcal
                                </span>
                              </div>
                              <h3 className="text-sm font-black text-white">{generatedPlan.title}</h3>
                              <div className="flex items-center gap-3 text-[10px] text-gray-300 font-mono">
                                <span>⏱️ {generatedPlan.estimated_duration_minutes} Menit</span>
                                <span>•</span>
                                <span>🎯 {generatedPlan.exercises.length} Gerakan</span>
                              </div>
                            </div>

                            {/* Exercises List */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-bold text-white">Daftar Latihan Berurutan:</span>
                                <span className="text-[10px] text-gray-400">Klik gerakan untuk tutorial</span>
                              </div>

                              {generatedPlan.exercises.map((item, idx) => (
                                <div
                                  key={`${item.exercise.id}-${idx}`}
                                  className="p-2.5 rounded-2xl bg-[#121620] border border-gray-800 flex gap-2.5 items-center hover:border-gray-700 transition-colors"
                                >
                                  {/* Thumbnail Preview Video / Image */}
                                  <div 
                                    onClick={() => setSelectedDetailExercise(item.exercise)}
                                    className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/60 shrink-0 cursor-pointer border border-gray-700/80 group"
                                  >
                                    <img
                                      src={item.exercise.full_video_image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'}
                                      alt={item.exercise.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <Play className="w-3.5 h-3.5 text-white fill-white/80" />
                                    </div>
                                    <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-black/80 text-[#ccff00] px-1 rounded font-mono">
                                      #{idx + 1}
                                    </span>
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 
                                      onClick={() => setSelectedDetailExercise(item.exercise)}
                                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-[#ccff00]"
                                    >
                                      {item.exercise.name}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 capitalize">
                                      {item.exercise.primary_muscle} • {item.sets} set × {item.reps_or_duration}
                                    </p>
                                    <span className="text-[9px] text-teal-400 font-mono">
                                      Istirahat: {item.rest_seconds}s
                                    </span>
                                  </div>

                                  {/* Actions: Swap & Delete */}
                                  <div className="flex flex-col gap-1 items-end shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleSwapExercise(item.exercise.id)}
                                      title="Tukar dengan variasi gerakan lain"
                                      className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-[#ccff00] hover:bg-gray-700 transition-colors"
                                    >
                                      <Shuffle className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteExercise(item.exercise.id)}
                                      title="Hapus gerakan ini"
                                      className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="space-y-2 pt-2">
                              <button
                                onClick={() => handleStartGuidedWorkout(generatedPlan)}
                                className="w-full py-3 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-black text-xs shadow-lg shadow-[#ccff00]/25 flex items-center justify-center gap-2 transition-all"
                              >
                                <Play className="w-4 h-4 fill-black" />
                                <span>Mulai Latihan Terpandu (Guided Player)</span>
                              </button>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                  onClick={handleGenerateWorkout}
                                  className="py-2 px-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-200 font-bold text-[11px] flex items-center justify-center gap-1.5"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Variasi Lain</span>
                                </button>
                                <button
                                  onClick={() => setBuilderStep(1)}
                                  className="py-2 px-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-200 font-bold text-[11px] flex items-center justify-center gap-1.5"
                                >
                                  <Sliders className="w-3 h-3" />
                                  <span>Ubah Kriteria</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. EXERCISE LIBRARY (40 GERAKAN DARI WORKOUT.COOL) */}
                    {workoutSubTab === 'library' && (
                      <div className="space-y-3">
                        {/* Search & Filters */}
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={librarySearch}
                              onChange={(e) => setLibrarySearch(e.target.value)}
                              placeholder="Cari dari 40 gerakan (squat, push up, plank)..."
                              className="w-full pl-8 pr-3 py-2 bg-[#121620] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00]"
                            />
                            {librarySearch && (
                              <button
                                onClick={() => setLibrarySearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Category Pills */}
                          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                            {['all', 'Strength', 'Cardio', 'HIIT', 'Yoga', 'Stretching', 'Bodyweight'].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setLibraryCategory(cat)}
                                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                                  libraryCategory === cat
                                    ? 'bg-[#ccff00] text-black'
                                    : 'bg-[#121620] text-gray-400 border border-gray-800 hover:text-white'
                                }`}
                              >
                                {cat === 'all' ? 'Semua' : cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* List of 40 Exercises */}
                        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                          {INITIAL_EXERCISES
                            .filter((ex) => {
                              const matchSearch = !librarySearch || 
                                ex.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
                                ex.primary_muscle.toLowerCase().includes(librarySearch.toLowerCase());
                              const matchCat = libraryCategory === 'all' || ex.category.toLowerCase() === libraryCategory.toLowerCase();
                              return matchSearch && matchCat;
                            })
                            .map((ex) => (
                              <div
                                key={ex.id}
                                onClick={() => setSelectedDetailExercise(ex)}
                                className="p-2.5 rounded-2xl bg-[#121620] border border-gray-800 hover:border-[#ccff00]/50 transition-all cursor-pointer flex gap-2.5 items-center group"
                              >
                                {/* Thumbnail */}
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-gray-700/80">
                                  <img
                                    src={ex.full_video_image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'}
                                    alt={ex.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Play className="w-3.5 h-3.5 text-white fill-white/80" />
                                  </div>
                                </div>

                                {/* Exercise Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-black/60 text-[#ccff00] font-mono border border-gray-800">
                                      {ex.primary_muscle}
                                    </span>
                                    <span className="text-[9px] text-gray-500 capitalize">
                                      {ex.difficulty}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#ccff00] transition-colors">
                                    {ex.name}
                                  </h4>
                                  <p className="text-[10px] text-gray-400 capitalize truncate">
                                    {ex.category} • {ex.equipment.includes('bodyweight') ? 'Tanpa Alat' : ex.equipment.join(', ')}
                                  </p>
                                </div>

                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white shrink-0" />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* 3. PRESET WORKOUT PLANS */}
                    {workoutSubTab === 'presets' && (
                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-white block">Preset Rutinitas Populer:</span>

                        {savedPlans.map((preset) => (
                          <div
                            key={preset.id}
                            className="p-3.5 rounded-2xl bg-[#121620] border border-gray-800 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-mono">
                                {preset.difficulty.toUpperCase()}
                              </span>
                              <span className="text-xs font-bold text-white font-mono">
                                ⏱️ {preset.estimated_duration_minutes}m • ~{preset.estimated_calories} kcal
                              </span>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-white">{preset.title}</h4>
                              <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
                                {preset.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-gray-800/80">
                              <span className="text-[10px] text-gray-500 font-mono">
                                {preset.exercises.length} Gerakan Terpandu
                              </span>
                              <button
                                onClick={() => handleStartGuidedWorkout(preset)}
                                className="px-3 py-1.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-[10px] rounded-xl flex items-center gap-1 shadow"
                              >
                                <Play className="w-3 h-3 fill-black" />
                                <span>Mulai Latihan</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ) : activeTab === 'moveit' ? (
                  /* ------------------------------------------------------------ */
                  /* SCREEN 3: MOVEIT CHALLENGE / SPLIT INTERSTITIAL (SCREENSHOT 3) */
                  /* ------------------------------------------------------------ */
                  <div className="flex-1 flex flex-col justify-between bg-black">
                    
                    {/* Header */}
                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-800/80 bg-[#0e1117]">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActiveTab('tracking')} className="text-gray-400 hover:text-white">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">MOVEIT Challenge</span>
                      </div>
                      <Volume2 className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* TOP HALF: FOLLOW THE MOVE (MEDIA ARAHAN DARI components/media) */}
                    <div className="relative h-[220px] bg-[#121620] border-b-2 border-[#ccff00] p-3 flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-black/60 px-2 py-0.5 rounded">
                            FOLLOW THE MOVE
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40">
                            {moveItSessionNumber === 1 
                              ? 'Sesi 1 • Video' 
                              : `Sesi ${moveItSessionNumber} (+1 Jam) • Random Foto`}
                          </span>
                        </div>
                        <div className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                          isWebcamActive 
                            ? 'bg-black/70 text-[#ccff00] border-[#ccff00]/30' 
                            : 'bg-black/80 text-amber-400 border-amber-400/40 animate-pulse'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>00:{workoutSecondsLeft < 10 ? `0${workoutSecondsLeft}` : workoutSecondsLeft}</span>
                          {!isWebcamActive && !workoutCompleted && (
                            <span className="text-[8px] font-normal tracking-tight ml-0.5">(Menunggu Kamera)</span>
                          )}
                        </div>
                      </div>

                      {/* Display Video or Image from components/media */}
                      <div className="relative flex-1 flex items-center justify-center my-1 rounded-xl overflow-hidden bg-black/50">
                        {currentMoveItMedia.type === 'video' ? (
                          <video
                            ref={moveItGuideVideoRef}
                            src={currentMoveItMedia.url}
                            onError={(e) => {
                              if (e.currentTarget.src !== currentMoveItMedia.fallbackUrl) {
                                e.currentTarget.src = currentMoveItMedia.fallbackUrl;
                              }
                            }}
                            onEnded={() => {
                              handleFinishWorkout();
                            }}
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
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
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        {/* Overlay when Camera is NOT active yet */}
                        {!isWebcamActive && !workoutCompleted && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-3 text-center transition-all animate-fadeIn">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-400 flex items-center justify-center mb-1 shadow-lg shadow-amber-500/20">
                              <Pause className="w-4 h-4 fill-amber-400" />
                            </div>
                            <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                              Video Menunggu Kamera Aktif
                            </span>
                            <p className="text-[9px] text-gray-300 max-w-[230px] mt-0.5 leading-tight">
                              Video panduan dijeda agar Anda tidak ketinggalan gerakan. Aktifkan kamera di bawah untuk mulai memutar video & menghitung repetisi.
                            </p>
                            <button
                              onClick={requestWebcamAccess}
                              className="mt-2 px-2.5 py-1 rounded-lg bg-[#ccff00] text-black font-extrabold text-[10px] flex items-center gap-1 shadow-md shadow-[#ccff00]/30 hover:bg-[#b8e600] active:scale-95 transition-all"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Izinkan Akses Kamera</span>
                            </button>
                          </div>
                        )}

                        {/* Live active indicator badge when camera is running */}
                        {isWebcamActive && !workoutCompleted && currentMoveItMedia.type === 'video' && (
                          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-[#ccff00]/50 text-[#ccff00] text-[8px] font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
                            <span>TUTORIAL BERJALAN</span>
                          </div>
                        )}
                      </div>

                      {/* Movement Name & Reps Target */}
                      <div className="flex items-center justify-between z-10">
                        <div className="pr-2">
                          <span className="text-xs font-bold text-white block truncate">{currentMoveItMedia.title}</span>
                          <span className="text-[10px] text-gray-300 line-clamp-1">{currentMoveItMedia.instructions}</span>
                        </div>
                        <span className="text-[10px] font-bold bg-[#ccff00] text-black px-2 py-0.5 rounded-full font-mono shrink-0">
                          {repTarget} reps
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM HALF: LIVE CAMERA (FOKUS KAMERA, TANPA AI SKELETON) */}
                    <div className="relative flex-1 bg-[#090c10] p-3 flex flex-col justify-between overflow-hidden">
                      
                      {/* Reps Badge & Verified Check */}
                      <div className="flex items-center justify-between z-10">
                        <div className="px-2.5 py-1 rounded-xl bg-black/80 border border-gray-700 text-white font-mono text-base font-extrabold flex items-center gap-1.5">
                          <div>
                            <span className="text-[#ccff00]">{repCount}</span>/{repTarget} <span className="text-xs font-normal text-gray-400">Reps</span>
                          </div>
                          {!isWebcamActive && !workoutCompleted && (
                            <span className="text-[8px] font-sans font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                              Menunggu Kamera
                            </span>
                          )}
                        </div>

                        <div className="w-8 h-8 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold shadow-lg shadow-[#ccff00]/40">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>

                      {/* Live Camera Feed (Tanpa AI Virtual Skeleton) */}
                      <div className="relative flex-1 rounded-2xl border border-dashed border-[#ccff00]/60 bg-black/60 my-2 overflow-hidden flex items-center justify-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover -scale-x-100 ${isWebcamActive ? 'block' : 'hidden'}`}
                        />

                        {isWebcamActive && (
                          <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 border border-[#ccff00]/40 text-[#ccff00] text-[9px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
                            <span>LIVE CAMERA AKTIF</span>
                          </div>
                        )}

                        {!isWebcamActive && (
                          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-12 h-12 rounded-full border-2 border-[#ccff00] bg-[#ccff00]/15 flex items-center justify-center mb-2 animate-pulse">
                              <Camera className="w-6 h-6 text-[#ccff00]" />
                            </div>
                            <span className="text-xs font-bold text-white">Live Camera Validation</span>
                            <span className="text-[10px] text-gray-400 max-w-[200px] mt-0.5">
                              Fokus kamera fisik memvalidasi gerakan fisik Anda secara langsung.
                            </span>
                            <button
                              onClick={requestWebcamAccess}
                              className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#ccff00] text-black font-extrabold text-[11px] hover:bg-[#b8e600] flex items-center gap-1.5 shadow-md shadow-[#ccff00]/20"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Izinkan Akses Kamera</span>
                            </button>
                          </div>
                        )}

                        {/* Completed celebration */}
                        {workoutCompleted && (
                          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-[#ccff00] text-black flex items-center justify-center mb-2 animate-bounce">
                              <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h4 className="font-extrabold text-white text-base">CHALLENGE COMPLETE!</h4>
                            <p className="text-xs text-[#ccff00] font-bold font-mono mt-0.5">+25 MOVE COINS EARNED</p>
                            <span className="text-[10px] text-gray-300 mt-1">Scroll pass terbuka untuk sesi berikutnya!</span>
                            
                            <div className="flex flex-col gap-2 w-full max-w-[220px] mt-3">
                              <button
                                onClick={() => handleSelectMoveItSession(moveItSessionNumber + 1)}
                                className="w-full py-2 bg-[#ccff00] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#ccff00]/30 hover:bg-[#b8e600]"
                              >
                                Sesi 1 Jam Berikutnya (+1 Jam)
                              </button>
                              <button
                                onClick={() => setActiveTab('tracking')}
                                className="w-full py-2 bg-gray-800 text-white font-semibold text-xs rounded-xl hover:bg-gray-700"
                              >
                                Lihat Tracking Aktivitas
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Camera Pill & Fullscreen Toggle */}
                      <div className="flex items-center justify-between text-[10px] text-gray-300 z-10 mb-2">
                        <div className="px-2.5 py-1 rounded-full bg-black/80 border border-gray-800 flex items-center gap-1.5 text-[#ccff00]">
                          <Camera className="w-3 h-3" />
                          <span>{isWebcamActive ? 'Kamera fisik aktif' : 'Kamera siap'}</span>
                        </div>
                        <Maximize2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>

                      {/* Finish Workout CTA Button */}
                      <button
                        onClick={handleFinishWorkout}
                        disabled={workoutCompleted}
                        className="w-full py-3 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#ccff00]/25 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                      >
                        <span>Finish Workout</span>
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                      </button>

                    </div>
                  </div>
                ) : activeTab === 'profile' ? (
                  /* ------------------------------------------------------------ */
                  /* SCREEN 4: SETTINGS & PROFILE / FOCUS / PRO AI COACH / HELP */
                  /* ------------------------------------------------------------ */
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            if (profileSubView !== 'main') setProfileSubView('main');
                            else setActiveTab('tracking');
                          }} 
                          className="text-gray-400 hover:text-white"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-sm font-bold text-white">
                          {profileSubView === 'focus_notifications' 
                            ? 'Focus & Notifications' 
                            : profileSubView === 'pro_coach'
                            ? 'MoveIt Pro AI Coach'
                            : profileSubView === 'help_support'
                            ? 'Help & Support'
                            : 'Settings'}
                        </h2>
                      </div>
                    </div>

                    {profileSubView === 'main' ? (
                      /* MAIN PROFILE (SCREENSHOT 4 + UPGRADE PRO + HELP & SIGNOUT) */
                      <div className="space-y-4">
                        {/* Alex Profile Card */}
                        <div className="p-4 rounded-3xl bg-[#121620] border border-gray-800 flex flex-col items-center text-center relative">
                          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 overflow-hidden mb-2 border-2 border-[#ccff00]">
                            <img 
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                              alt={userName} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#ccff00] text-black flex items-center justify-center text-[10px]">
                              <Camera className="w-3 h-3" />
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-white">{userName}</h3>
                          <span className="text-[10px] text-gray-400">{userEmail}</span>
                          
                          <button 
                            onClick={() => setProfileSubView('auth')}
                            className="mt-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-semibold text-[#ccff00] flex items-center gap-1 hover:border-[#ccff00]/40"
                          >
                            Edit Profile & Target <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* UPGRADE PRO BANNER (FEATURE REQUEST: AI COACH & DATA ANALYSIS) */}
                        <div 
                          onClick={() => setProfileSubView('pro_coach')}
                          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#ccff00]/15 to-emerald-500/20 border border-[#ccff00]/50 cursor-pointer hover:border-[#ccff00] transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#ccff00] text-black flex items-center justify-center font-bold">
                                <Crown className="w-4 h-4 fill-black" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white flex items-center gap-1">
                                  MoveIt Pro — AI Coach
                                  <span className="text-[9px] bg-[#ccff00] text-black font-extrabold px-1.5 py-0.2 rounded font-mono">PRO</span>
                                </span>
                                <span className="text-[10px] text-gray-300 block">Deep Correlation Analysis & Chatbot Coach</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#ccff00] group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* Account Group */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-1">Account</span>
                          <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                            <div 
                              onClick={() => setProfileSubView('auth')}
                              className="p-3 flex justify-between items-center text-gray-300 cursor-pointer hover:text-white"
                            >
                              <span>Personal Information</span>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div 
                              onClick={() => setProfileSubView('pro_coach')}
                              className="p-3 flex justify-between items-center text-gray-300 cursor-pointer hover:text-white"
                            >
                              <span className="flex items-center gap-2 text-[#ccff00]">
                                <Crown className="w-3.5 h-3.5" />
                                <strong>Upgrade Premium (AI Coach)</strong>
                              </span>
                              <span className="text-[10px] text-[#ccff00] font-mono">Aktif &gt;</span>
                            </div>
                            <div 
                              onClick={() => setProfileSubView('focus_notifications')}
                              className="p-3 flex justify-between items-center text-gray-300 cursor-pointer hover:text-white"
                            >
                              <span className="flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-[#ccff00]" />
                                <strong className="text-white">Focus & Notifications</strong>
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                          </div>
                        </div>

                        {/* Connected Accounts */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-1">Connected Accounts</span>
                          <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                            <div className="p-3 flex justify-between items-center">
                              <span className="text-gray-300">Google</span>
                              <span className="text-[10px] text-[#ccff00] font-bold">Connected &gt;</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <span className="text-gray-300">Apple</span>
                              <span className="text-[10px] text-gray-500">Not Connected &gt;</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <span className="text-gray-300">Strava</span>
                              <span className="text-[10px] text-gray-500">Not Connected &gt;</span>
                            </div>
                          </div>
                        </div>

                        {/* Goals & Preferences */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-1">Goals & Preferences</span>
                          <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                            <div className="p-3 flex justify-between items-center">
                              <span className="text-gray-300">Daily Activity Goal</span>
                              <span className="text-[10px] text-gray-400 font-mono">{dailyGoalTarget} minutes &gt;</span>
                            </div>
                            <div 
                              onClick={() => setProfileSubView('focus_notifications')}
                              className="p-3 flex justify-between items-center cursor-pointer"
                            >
                              <span className="text-gray-300">Target Focus Apps</span>
                              <span className="text-[10px] text-[#ccff00] font-mono">{selectedFocusApps.length} apps &gt;</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <span className="text-gray-300">Workout Difficulty</span>
                              <span className="text-[10px] text-gray-400">{fitnessLevel} &gt;</span>
                            </div>
                          </div>
                        </div>

                        {/* ABOUT & SIGNOUT GROUP (SCREENSHOT 4 REQUIREMENTS) */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-1">About</span>
                          <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                            <div 
                              onClick={() => setProfileSubView('help_support')}
                              className="p-3 flex justify-between items-center text-gray-300 cursor-pointer hover:text-white"
                            >
                              <span className="flex items-center gap-2">
                                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                <span>Help & Support</span>
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                            </div>

                            <div 
                              onClick={handleSignOut}
                              className="p-3 flex justify-between items-center text-red-400 font-semibold cursor-pointer hover:bg-red-500/10 transition-colors"
                            >
                              <span className="flex items-center gap-2">
                                <LogOut className="w-3.5 h-3.5 text-red-500" />
                                <span>Sign Out</span>
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-red-500/60" />
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : profileSubView === 'pro_coach' ? (
                      /* -------------------------------------------------------- */
                      /* SUBVIEW: MOVEIT PRO AI COACH & DEEP ANALYTICS */
                      /* -------------------------------------------------------- */
                      <div className="space-y-3 flex-1 flex flex-col justify-between">
                        
                        {/* Deep Correlation Analytics Card */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#131b26] to-[#0d131d] border border-[#ccff00]/40 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-[#ccff00]" />
                              AI Correlation Insight
                            </span>
                            <span className="text-[9px] bg-[#ccff00]/20 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">
                              Live Sync
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[11px] text-gray-300 leading-snug">
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <strong className="text-[#ccff00] block text-[10px]">📊 Screen Time vs Kalori:</strong>
                              Hari ini screen time turun 42%, pembakaran kalori naik +28%! Waktu terlama scroll adalah jam 12:00–15:00 (28m).
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <strong className="text-teal-300 block text-[10px]">💡 Rekomendasi Coach Max:</strong>
                              Lakukan 1 sesi stretching 3 menit sebelum tidur untuk redakan beban leher 27kg akibat menunduk.
                            </div>
                          </div>
                        </div>

                        {/* Interactive Coach Chatbot */}
                        <div className="p-3 rounded-2xl bg-[#121620] border border-gray-800 flex-1 flex flex-col justify-between min-h-[260px]">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold">
                                <Bot className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-bold text-white">Coach Max AI</span>
                            </div>
                            <span className="text-[9px] text-[#ccff00] font-mono">Konsultasi Aktif</span>
                          </div>

                          {/* Message bubble stream */}
                          <div ref={chatScrollRef} className="space-y-2 overflow-y-auto max-h-[170px] pr-1 text-xs">
                            {chatMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                              >
                                <div
                                  className={`p-2.5 rounded-2xl max-w-[85%] text-[11px] leading-relaxed ${
                                    msg.sender === 'user'
                                      ? 'bg-[#ccff00] text-black font-medium'
                                      : 'bg-[#18202d] text-gray-200 border border-gray-800'
                                  }`}
                                >
                                  {msg.text}
                                </div>
                                <span className="text-[8px] text-gray-500 mt-0.5 px-1 font-mono">{msg.time}</span>
                              </div>
                            ))}

                            {isCoachTyping && (
                              <div className="p-2 rounded-xl bg-[#18202d] text-[10px] text-gray-400 italic inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-bounce" />
                                Coach Max sedang mengetik rekomendasi...
                              </div>
                            )}
                          </div>

                          {/* Quick Inquiry Chips */}
                          <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none text-[9px]">
                            <button
                              onClick={() => handleSendMessage('Analisis korelasi screentime dan kalori saya!')}
                              className="px-2 py-1 rounded-full bg-black/60 border border-gray-700 text-gray-300 hover:border-[#ccff00] whitespace-nowrap"
                            >
                              📊 Analisis Korelasi
                            </button>
                            <button
                              onClick={() => handleSendMessage('Latihan untuk leher pegal karena HP?')}
                              className="px-2 py-1 rounded-full bg-black/60 border border-gray-700 text-gray-300 hover:border-[#ccff00] whitespace-nowrap"
                            >
                              💆 Leher Pegal HP
                            </button>
                            <button
                              onClick={() => handleSendMessage('Bantu saya kurangi scroll sosmed malam hari')}
                              className="px-2 py-1 rounded-full bg-black/60 border border-gray-700 text-gray-300 hover:border-[#ccff00] whitespace-nowrap"
                            >
                              🌙 Stop Scroll Malam
                            </button>
                          </div>

                          {/* Input Bar */}
                          <div className="flex items-center gap-1.5 pt-1 border-t border-gray-800">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Tanya coach tentang olahraga & sosmed..."
                              className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#ccff00]"
                            />
                            <button
                              onClick={() => handleSendMessage()}
                              className="w-7 h-7 rounded-xl bg-[#ccff00] text-black flex items-center justify-center hover:bg-[#b8e600] flex-shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : profileSubView === 'help_support' ? (
                      /* -------------------------------------------------------- */
                      /* SUBVIEW: HELP & SUPPORT */
                      /* -------------------------------------------------------- */
                      <div className="space-y-3 text-xs">
                        <div className="p-4 rounded-3xl bg-[#121620] border border-gray-800 space-y-2">
                          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-[#ccff00]" />
                            Bantuan & FAQ MOVEIT
                          </h4>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            Panduan cepat penggunaan aplikasi dan privasi pelacakan:
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800 text-xs">
                          <div className="p-3 space-y-1">
                            <strong className="text-white block text-[11px]">1. Bagaimana cara validasi kamera AI?</strong>
                            <p className="text-[10px] text-gray-400">
                              Kamera mendeteksi landmark pose tubuh pengguna secara lokal (edge AI). Tidak ada video yang direkam atau dikirim ke server.
                            </p>
                          </div>

                          <div className="p-3 space-y-1">
                            <strong className="text-white block text-[11px]">2. Apakah screen time saya terbaca otomatis?</strong>
                            <p className="text-[10px] text-gray-400">
                              Ya, sistem membaca statistik waktu penggunaan dari Android UsageStatsManager untuk TikTok, Instagram, dan YouTube.
                            </p>
                          </div>

                          <div className="p-3 space-y-1">
                            <strong className="text-white block text-[11px]">3. Cara klaim voucher hadiah?</strong>
                            <p className="text-[10px] text-gray-400">
                              Kumpulkan Move Coins dari micro-workout lalu tukarkan di tab Hadiah. Voucher instan dilengkapi kode QR dan barcode.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => alert('Pesan bantuan terkirim ke support@moveit.app')}
                          className="w-full py-2.5 bg-gray-900 border border-gray-700 hover:border-[#ccff00] text-gray-200 text-xs font-semibold rounded-xl"
                        >
                          Hubungi Customer Service
                        </button>
                      </div>
                    ) : (
                      /* -------------------------------------------------------- */
                      /* SUBVIEW: FOCUS & NOTIFICATIONS (SCREENSHOT 5) */
                      /* -------------------------------------------------------- */
                      <div className="space-y-4">
                        {/* Shield Card Banner */}
                        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#121824] to-[#0d121c] border border-gray-800 space-y-2">
                          <div className="w-9 h-9 rounded-2xl bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                          </div>
                          <h3 className="text-xs font-extrabold text-white">Turn screen time into movement.</h3>
                          <p className="text-[10px] text-gray-400 leading-relaxed">
                            Set limits for social apps and get MoveIt workout prompts to keep yourself active and focused.
                          </p>
                        </div>

                        {/* Notification Toggles */}
                        <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                          <div className="p-3 flex justify-between items-center">
                            <div>
                              <span className="text-white block font-medium">Screen-time reminders</span>
                              <span className="text-[9px] text-gray-400">Notify when approaching limit</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={screenTimeReminders} 
                              onChange={(e) => setScreenTimeReminders(e.target.checked)}
                              className="accent-[#ccff00] w-4 h-4 cursor-pointer"
                            />
                          </div>

                          <div className="p-3 flex justify-between items-center">
                            <div>
                              <span className="text-white block font-medium">MoveIt workout prompts</span>
                              <span className="text-[9px] text-gray-400">Prompt a workout when limit is reached</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={workoutPrompts} 
                              onChange={(e) => setWorkoutPrompts(e.target.checked)}
                              className="accent-[#ccff00] w-4 h-4 cursor-pointer"
                            />
                          </div>

                          <div className="p-3 flex justify-between items-center">
                            <div>
                              <span className="text-white block font-medium">Daily goal reminders</span>
                              <span className="text-[9px] text-gray-400">Stay consistent with your goals</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={dailyGoalReminders} 
                              onChange={(e) => setDailyGoalReminders(e.target.checked)}
                              className="accent-[#ccff00] w-4 h-4 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Social App Threshold */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                              Social App Threshold ({monitoredApps.length} Apps)
                            </span>
                            <span className="text-[9px] text-[#ccff00] font-mono font-semibold">
                              Alarm Otomatis
                            </span>
                          </div>

                          <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                            {monitoredApps.map((app) => (
                              <div key={app.id} className="p-2.5 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {renderAppIcon(app.iconType, app.name, "w-7 h-7")}
                                  <div className="min-w-0">
                                    <span className="text-white font-bold block text-xs truncate leading-tight">
                                      {app.name}
                                    </span>
                                    <span className="text-[9px] text-gray-400 block truncate">
                                      {app.category}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Dropdown Dropbox Pilihan Menit */}
                                  <div className="relative">
                                    <select
                                      value={app.thresholdMinutes}
                                      onChange={(e) => {
                                        const newMin = Number(e.target.value);
                                        setMonitoredApps(prev => prev.map(a => a.id === app.id ? { ...a, thresholdMinutes: newMin } : a));
                                        if (soundEnabled) playSound('click');
                                      }}
                                      className="appearance-none bg-[#192231] hover:bg-[#222e42] text-white text-[11px] font-mono font-bold py-1.5 pl-2.5 pr-6 rounded-xl border border-gray-700 hover:border-[#ccff00] focus:border-[#ccff00] focus:outline-none cursor-pointer transition-all"
                                    >
                                      {THRESHOLD_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#121620] text-white">
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="w-3 h-3 text-[#ccff00] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>

                                  {/* Tombol Hapus Aplikasi */}
                                  {monitoredApps.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMonitoredApps(prev => prev.filter(a => a.id !== app.id));
                                        if (soundEnabled) playSound('click');
                                      }}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                      title={`Hapus ${app.name}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tombol Tambah Aplikasi */}
                          {!showAddAppModal ? (
                            <button
                              type="button"
                              onClick={() => setShowAddAppModal(true)}
                              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#16202e] to-[#121924] border border-gray-800 hover:border-[#ccff00] text-[#ccff00] text-[11px] font-bold flex items-center justify-center gap-2 transition-all group"
                            >
                              <Plus className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                              <span>+ Tambah Aplikasi (Threads, Telegram, dll)</span>
                            </button>
                          ) : (
                            /* Panel Tambah Aplikasi Inline */
                            <div className="p-3.5 rounded-2xl bg-[#141b27] border border-[#ccff00]/40 space-y-3 animate-fadeIn">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <Plus className="w-3.5 h-3.5 text-[#ccff00]" />
                                  Tambah Aplikasi yang Ingin Dipantau
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowAddAppModal(false)}
                                  className="text-gray-400 hover:text-white p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Quick Add Presets */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] text-gray-400 font-semibold block">Pilih Cepat Rekomendasi:</span>
                                <div className="grid grid-cols-1 gap-1.5">
                                  {PRESET_ADDABLE_APPS.map((preset) => {
                                    const isAlreadyAdded = monitoredApps.some(a => a.id === preset.id);
                                    return (
                                      <div
                                        key={preset.id}
                                        className="p-2 rounded-xl bg-[#0f1420] border border-gray-800 flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-2">
                                          {renderAppIcon(preset.iconType, preset.name, "w-6 h-6")}
                                          <div>
                                            <span className="text-white text-xs font-bold block leading-tight">{preset.name}</span>
                                            <span className="text-[9px] text-gray-400 block">{preset.category}</span>
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          disabled={isAlreadyAdded}
                                          onClick={() => handleAddPresetApp(preset)}
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                            isAlreadyAdded
                                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                              : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow'
                                          }`}
                                        >
                                          {isAlreadyAdded ? '✓ Dipantau' : '+ Tambah'}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Custom App Input */}
                              <div className="pt-2 border-t border-gray-800/80 space-y-2">
                                <span className="text-[10px] text-gray-400 font-semibold block">Atau Tambah Aplikasi Lain:</span>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={customAppName}
                                    onChange={(e) => setCustomAppName(e.target.value)}
                                    placeholder="Nama aplikasi (misal: WhatsApp, Discord)..."
                                    className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                                  />
                                  <select
                                    value={customAppThreshold}
                                    onChange={(e) => setCustomAppThreshold(Number(e.target.value))}
                                    className="bg-black/60 border border-gray-700 rounded-xl px-2 py-1.5 text-[10px] text-white font-mono"
                                  >
                                    <option value={15}>15m</option>
                                    <option value={30}>30m</option>
                                    <option value={45}>45m</option>
                                    <option value={60}>60m</option>
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddCustomApp}
                                  disabled={!customAppName.trim()}
                                  className="w-full py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-[11px] rounded-xl disabled:opacity-40 transition-all"
                                >
                                  + Tambahkan ke Pelacakan
                                </button>
                              </div>
                            </div>
                          )}

                          <span className="text-[9px] text-gray-500 block px-1 leading-relaxed">
                            Pilih batas menit harian di setiap dropbox. Alarm micro-workout MoveIt akan otomatis aktif saat total screentime melewati ambang batas tersebut.
                          </span>
                        </div>

                        {/* Schedule */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Schedule</span>
                          <div className="rounded-2xl bg-[#121620] border border-gray-800 divide-y divide-gray-800/80 text-xs">
                            <div className="p-3 flex justify-between items-center">
                              <span className="text-white">Active hours</span>
                              <span className="text-[10px] font-mono text-gray-400">08:00 - 22:00 &gt;</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <span className="text-white block">Quiet hours</span>
                                <span className="text-[9px] text-gray-500">Disable notifications during this time</span>
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

                      </div>
                    )}

                  </div>
                ) : (
                  /* ------------------------------------------------------------ */
                  /* SCREEN 4: REWARDS, WALLET & MY VOUCHERS SUITE */
                  /* ------------------------------------------------------------ */
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <div>
                        <h2 className="text-sm font-bold text-white">Rewards & Wallet</h2>
                        <p className="text-[10px] text-gray-400">Marketplace, Saldo Dompet & Voucher</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-mono text-xs font-bold">
                        {walletBalance} Coins
                      </div>
                    </div>

                    {/* Sub-tab Switcher: [ 🎁 Marketplace | 💳 Dompet | 🎟️ Voucher Saya ] */}
                    <div className="p-1 rounded-2xl bg-[#121620] border border-gray-800 grid grid-cols-3 text-center text-xs">
                      <button
                        onClick={() => setRewardsSubTab('marketplace')}
                        className={`py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                          rewardsSubTab === 'marketplace'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🎁 Hadiah
                      </button>
                      <button
                        onClick={() => setRewardsSubTab('wallet')}
                        className={`py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                          rewardsSubTab === 'wallet'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        💳 Dompet
                      </button>
                      <button
                        onClick={() => setRewardsSubTab('vouchers')}
                        className={`py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                          rewardsSubTab === 'vouchers'
                            ? 'bg-[#ccff00] text-black shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🎟️ Voucher ({redemptionsList.length})
                      </button>
                    </div>

                    {/* SUB-TAB 1: REWARDS MARKETPLACE */}
                    {rewardsSubTab === 'marketplace' && (
                      <div className="space-y-3">
                        {redeemedVoucher && (
                          <div className="p-3 rounded-2xl bg-[#152010] border border-[#ccff00]/50 text-center space-y-1.5">
                            <span className="text-[10px] text-[#ccff00] font-bold uppercase tracking-wider block">
                              ✓ Voucher Berhasil Diklaim!
                            </span>
                            <h4 className="text-xs font-bold text-white">{redeemedVoucher.title}</h4>
                            <p className="text-[10px] text-gray-300">
                              Voucher telah ditambahkan ke tab <strong className="text-[#ccff00]">Voucher Saya</strong>.
                            </p>
                            <button
                              onClick={() => setRewardsSubTab('vouchers')}
                              className="px-3 py-1 bg-[#ccff00] text-black text-[10px] font-bold rounded-lg mt-1"
                            >
                              Buka Voucher Saya →
                            </button>
                          </div>
                        )}

                        <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                          {rewardsList.map((rw) => (
                            <div key={rw.id} className="p-2.5 rounded-2xl bg-[#121620] border border-gray-800 flex gap-2.5 items-center hover:border-gray-700 transition-colors">
                              <img src={rw.image_url} alt={rw.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-800" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 rounded bg-black/60 text-amber-300 font-mono border border-gray-800">
                                    {rw.category}
                                  </span>
                                  <span className="text-[9px] text-gray-400">
                                    {rw.category === 'digital_wallet' ? 'E-Wallet' : rw.category === 'voucher' ? 'Marketplace' : 'Reward Partner'}
                                  </span>
                                </div>
                                <h5 className="text-xs font-bold text-white truncate">{rw.title}</h5>
                                <span className="text-[10px] text-[#ccff00] font-mono font-bold block mt-0.5">
                                  {rw.coin_price} Coins
                                </span>
                                <button
                                  onClick={() => handleRedeem(rw)}
                                  disabled={walletBalance < rw.coin_price}
                                  className="mt-1 px-3 py-1 bg-[#ccff00] hover:bg-[#b8e600] text-black text-[9px] font-bold rounded-lg disabled:opacity-30 transition-all"
                                >
                                  Klaim Voucher
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2: WALLET / DOMPET */}
                    {rewardsSubTab === 'wallet' && (
                      <div className="space-y-3">
                        {/* Hero Wallet Card */}
                        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1b2512] via-[#121620] to-[#0c0f16] border border-[#ccff00]/40 shadow-xl space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-medium">Saldo Move Coins</span>
                            <div className="w-7 h-7 rounded-full bg-[#ccff00]/20 flex items-center justify-center">
                              <Coins className="w-4 h-4 text-[#ccff00]" />
                            </div>
                          </div>

                          <div>
                            <span className="text-2xl font-black text-[#ccff00] font-mono tracking-tight block">
                              {walletBalance} 🪙
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              Tersedia untuk ditukarkan ke voucher merchant
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-[10px] font-mono">
                            <div className="p-2 rounded-xl bg-black/40 border border-gray-800">
                              <span className="text-gray-400 block">Total Didapat</span>
                              <span className="text-[#ccff00] font-bold text-xs mt-0.5 block">
                                +{walletSummary?.totalEarned ?? 75}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-gray-800">
                              <span className="text-gray-400 block">Total Ditukar</span>
                              <span className="text-orange-400 font-bold text-xs mt-0.5 block">
                                -{walletSummary?.totalSpent ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mutation Ledger */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-white block">Riwayat Mutasi Koin:</span>
                          
                          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                            {transactionsList.length > 0 ? (
                              transactionsList.map((tx) => (
                                <div key={tx.id} className="p-2.5 rounded-2xl bg-[#121620] border border-gray-800 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                                      tx.transaction_type === 'earn' ? 'bg-[#ccff00]/15 text-[#ccff00]' : 'bg-orange-500/15 text-orange-400'
                                    }`}>
                                      {tx.transaction_type === 'earn' ? <TrendingUp className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="min-w-0">
                                      <h6 className="text-[11px] font-bold text-white truncate max-w-[170px]">{tx.description}</h6>
                                      <span className="text-[9px] text-gray-500 block">
                                        {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>

                                  <div className={`font-mono font-bold text-xs ${tx.transaction_type === 'earn' ? 'text-[#ccff00]' : 'text-orange-400'}`}>
                                    {tx.transaction_type === 'earn' ? `+${tx.amount}` : `${tx.amount}`}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-xs text-gray-500">
                                Belum ada mutasi transaksi.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 3: MY VOUCHERS / VOUCHER SAYA */}
                    {rewardsSubTab === 'vouchers' && (
                      <div className="space-y-3">
                        {redemptionsList.length === 0 ? (
                          <div className="p-6 rounded-3xl bg-[#121620] border border-gray-800 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-gray-800 mx-auto flex items-center justify-center text-gray-400">
                              <TicketCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">Belum Ada Voucher</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                Kumpulkan Move Coins dan tukarkan di tab Hadiah.
                              </p>
                            </div>
                            <button
                              onClick={() => setRewardsSubTab('marketplace')}
                              className="px-4 py-2 bg-[#ccff00] text-black font-extrabold text-xs rounded-xl"
                            >
                              Tukar Voucher Sekarang
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                            {redemptionsList.map((rc) => {
                              const rwInfo = rewardsList.find((r) => r.id === rc.reward_id);
                              return (
                                <div key={rc.id} className="p-3 rounded-2xl bg-[#121620] border border-gray-800 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-mono">
                                        Aktif
                                      </span>
                                      <span className="text-[10px] text-gray-400">
                                        {rwInfo?.category === 'digital_wallet' ? 'E-Wallet' : rwInfo?.category === 'voucher' ? 'Marketplace' : 'Merchant Partner'}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-mono">
                                      Klaim: {new Date(rc.created_at).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <h4 className="text-xs font-bold text-white">{rwInfo?.title || 'Voucher Diskon Move2Earn'}</h4>

                                  {/* Code & Actions */}
                                  <div className="p-2 rounded-xl bg-black/60 border border-gray-700/80 flex items-center justify-between">
                                    <div>
                                      <span className="text-[8px] text-gray-400 uppercase tracking-wider block">Kode Voucher:</span>
                                      <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                                        {rc.voucher_code}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleCopyVoucherCode(rc.voucher_code || '')}
                                        title="Salin kode voucher"
                                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setQrModalVoucher(rc)}
                                        title="Buka QR Code"
                                        className="p-1.5 rounded-lg bg-[#ccff00] text-black hover:bg-[#b8e600] transition-colors"
                                      >
                                        <QrCode className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* ============================================================== */}
              {/* THE 5 BOTTOM NAVIGATION TABS */}
              {/* ============================================================== */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-[#090c12]/95 backdrop-blur-md border-t border-gray-800/80 px-2 flex items-center justify-around z-30 select-none">
                
                {/* 1. Tracking Tab */}
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setActiveTab('tracking');
                    setProfileSubView('main');
                  }}
                  className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
                    activeTab === 'tracking' && profileSubView !== 'auth' ? 'text-[#ccff00]' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${activeTab === 'tracking' && profileSubView !== 'auth' ? 'bg-[#ccff00]/15' : ''}`}>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-semibold">Tracking</span>
                </button>

                {/* 2. Workout Plan Tab */}
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setActiveTab('workout');
                    setProfileSubView('main');
                  }}
                  className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
                    activeTab === 'workout' ? 'text-[#ccff00]' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${activeTab === 'workout' ? 'bg-[#ccff00]/15' : ''}`}>
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-semibold">Workout</span>
                </button>

                {/* 3. Center MoveIt Tab (Prominent glowing pill button) */}
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setActiveTab('moveit');
                    setWorkoutSecondsLeft(30);
                    setRepCount(0);
                    setWorkoutCompleted(false);
                    if (moveItGuideVideoRef.current) {
                      moveItGuideVideoRef.current.currentTime = 0;
                      moveItGuideVideoRef.current.pause();
                    }
                  }}
                  className="flex flex-col items-center -mt-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-lg shadow-[#ccff00]/40 group-hover:scale-105 transition-transform">
                    <Zap className="w-6 h-6 fill-black" />
                  </div>
                  <span className="text-[9px] font-extrabold text-[#ccff00] mt-0.5">MoveIt</span>
                </button>

                {/* 4. Rewards Tab */}
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setActiveTab('rewards');
                    setProfileSubView('main');
                  }}
                  className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
                    activeTab === 'rewards' ? 'text-[#ccff00]' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${activeTab === 'rewards' ? 'bg-[#ccff00]/15' : ''}`}>
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-semibold">Rewards</span>
                </button>

                {/* 5. Profile Tab */}
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setActiveTab('profile');
                    setProfileSubView('main');
                  }}
                  className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
                    activeTab === 'profile' ? 'text-[#ccff00]' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${activeTab === 'profile' ? 'bg-[#ccff00]/15' : ''}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-semibold">Profile</span>
                </button>

              </div>

              {/* Home Gesture Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40 pointer-events-none" />

            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* COLUMN 2: PRESENTER COCKPIT (FOR PITCHING TO JUDGES) */}
        {/* ==================================================================== */}
        {showPresenterPanel && (
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          
          {/* Quick Screen Switcher (Direct Pitch Buttons) */}
          <div className="p-6 rounded-3xl bg-[#0f1420] border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ccff00]">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Skenario Presentasi Cepat (1-Click Switcher)</h2>
              </div>
              <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-mono">
                Judge Demo
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Klik salah satu tombol di bawah untuk langsung mengganti layar handphone sesuai alur presentasi:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Button 0: Auth & Personalisasi */}
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setProfileSubView('auth');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  !isLoggedIn || profileSubView === 'auth'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-teal-400 mb-1">
                  <span>🔐 1. Login & Personalisasi Akun</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Layar onboarding pendaftaran & penentuan target screentime awal.
                </p>
              </button>

              {/* Button 1: Tracking */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('tracking');
                  setProfileSubView('main');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'tracking' && isLoggedIn && profileSubView !== 'auth'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#ccff00] mb-1">
                  <span>2. Tracking Metrik & Screentime</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Ringkasan 68% Daily Goal, calories, steps, streak, dan grafik bar sosmed.
                </p>
              </button>

              {/* Button 2: Workout Plan */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('workout');
                  setProfileSubView('main');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'workout'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#ccff00] mb-1">
                  <span>3. Workout Plan (AI & 40 Gerakan)</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  AI Routine Builder 4 langkah, 40 exercise video Workout.cool & Guided Player.
                </p>
              </button>

              {/* Button 3: Rewards & Wallet Suite */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('rewards');
                  setProfileSubView('main');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'rewards'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    Rewards, Dompet & Voucher
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Klaim voucher merchant, pantau mutasi koin, dan scan QR voucher aktif.
                </p>
              </button>

              {/* Button 4: Simulasi Notifikasi Masuk */}
              <button
                onClick={triggerExternalSocialNotification}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-950/40 to-[#131926] border border-pink-500/40 hover:border-pink-400 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-pink-400 mb-1">
                  <span>4. Simulasi Alarm Notifikasi Sosmed</span>
                  <BellRing className="w-4 h-4 group-hover:scale-110 transition-transform animate-pulse" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Munculkan notifikasi pop-up dari luar (TikTok) pemicu micro-workout!
                </p>
              </button>

              {/* Button 5: MoveIt Challenge */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('moveit');
                  setWorkoutSecondsLeft(30);
                  setRepCount(23);
                  setWorkoutCompleted(false);
                  if (moveItGuideVideoRef.current) {
                    moveItGuideVideoRef.current.currentTime = 0;
                    moveItGuideVideoRef.current.pause();
                  }
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeTab === 'moveit'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#ccff00] mb-1">
                  <span>5. Split-Screen Workout Challenge</span>
                  <Zap className="w-4 h-4 fill-[#ccff00]" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Layar terbelah: Panduan gerakan (video/gambar) di atas, Kamera fisik validasi di bawah!
                </p>
              </button>

              {/* Button 6: MoveIt Pro AI Coach (Fitur Premium) */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('profile');
                  setProfileSubView('pro_coach');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  profileSubView === 'pro_coach'
                    ? 'bg-amber-950/30 border-amber-400 text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-amber-400/50 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    6. MoveIt Pro (AI Coach & Analytics)
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Fitur Premium: Deep correlation analytics + Live AI Coach Chatbot!
                </p>
              </button>

              {/* Button 7: Help & Support */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('profile');
                  setProfileSubView('help_support');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  profileSubView === 'help_support'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1">
                  <span>❓ 7. Help & Support</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-400">
                  Bantuan, FAQ seputar kamera AI, dan kontak tim dukungan.
                </p>
              </button>

              {/* Button 8: Focus & Notifications (Threshold Dropbox & Add Apps) */}
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab('profile');
                  setProfileSubView('focus_notifications');
                  if (soundEnabled) playSound('click');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  profileSubView === 'focus_notifications'
                    ? 'bg-[#152010] border-[#ccff00] text-white shadow-md'
                    : 'bg-[#131926] border-gray-800 hover:border-[#ccff00]/40 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#ccff00] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    8. Focus & Notifications (Threshold & Apps)
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Uji dropbox durasi threshold (15-120m) & tambah aplikasi baru (Threads, Telegram, dll).
                </p>
              </button>

              {/* Button 9: Sign Out */}
              <button
                onClick={handleSignOut}
                className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/40 hover:border-red-400 text-left transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-1">
                  <span>🚪 9. Sign Out (Keluar)</span>
                  <LogOut className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Keluar dari akun dan uji kembali alur onboarding pendaftaran.
                </p>
              </button>

            </div>
          </div>

          {/* MoveIt Media & Live Camera Settings */}
          <div className="p-5 rounded-3xl bg-[#0f1420] border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#ccff00]" />
                Validasi Kamera & Simulasi Sesi MoveIt (1 Jam)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-bold">
                {isWebcamActive ? '● Kamera Aktif' : '○ Kamera Siap'}
              </span>
            </div>

            {/* Session Simulation Switcher */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-gray-300">
                Pilih Sesi Blocking Time (Folder: <code className="text-[#ccff00] font-mono">components/media</code>):
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    handleSelectMoveItSession(1);
                    setActiveTab('moveit');
                    if (soundEnabled) playSound('click');
                  }}
                  className={`p-2.5 rounded-xl font-bold border text-left transition-all ${
                    moveItSessionNumber === 1
                      ? 'bg-[#152010] border-[#ccff00] text-white shadow'
                      : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[#ccff00] font-bold text-[11px]">
                    <span>🎬 Sesi 1 (Awal)</span>
                    <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded">Video</span>
                  </div>
                  <div className="text-[10px] text-gray-300 mt-1 font-mono truncate">
                    videomoveit.mp4
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleSelectMoveItSession(moveItSessionNumber === 1 ? 2 : moveItSessionNumber + 1);
                    setActiveTab('moveit');
                    if (soundEnabled) playSound('click');
                  }}
                  className={`p-2.5 rounded-xl font-bold border text-left transition-all ${
                    moveItSessionNumber > 1
                      ? 'bg-[#152010] border-[#ccff00] text-white shadow'
                      : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-blue-400 font-bold text-[11px]">
                    <span>🖼️ Sesi +1 Jam</span>
                    <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-blue-300">Random Foto</span>
                  </div>
                  <div className="text-[10px] text-gray-300 mt-1 font-mono truncate">
                    {currentMoveItMedia.type === 'image' ? currentMoveItMedia.filename : 'plank.jpeg / acak'}
                  </div>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-gray-800/80 text-[10px] text-gray-400 space-y-1">
                <p>
                  <strong className="text-white">Alur Sesi:</strong> Sesi 1 memprioritaskan video (<code className="text-[#ccff00]">videomoveit.mp4</code>). Sesi 1 jam kemudian memilih foto secara acak.
                </p>
                <p className="text-gray-400">
                  Foto baru yang Anda tambahkan ke folder <code className="text-gray-300 font-mono">components/media/</code> otomatis diundi secara dinamis!
                </p>
              </div>
            </div>

            {/* Camera Control button */}
            <div className="pt-1 border-t border-gray-800/60 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Fokus Kamera Fisik (No AI Skeleton):</span>
              <button
                onClick={requestWebcamAccess}
                className="px-3 py-1.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-[11px] rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isWebcamActive ? 'Hubungkan Ulang Kamera' : 'Buka Akses Kamera'}</span>
              </button>
            </div>
          </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODALS: EXERCISE DETAIL, GUIDED PLAYER, & QR CODE VOUCHER */}
      {/* ============================================================== */}
      <ExerciseDetailModal
        exercise={selectedDetailExercise}
        onClose={() => setSelectedDetailExercise(null)}
        onStartSingle={handleStartSingleExercise}
      />

      {activeGuidedPlan && (
        <GuidedWorkoutPlayer
          plan={activeGuidedPlan}
          onClose={() => setActiveGuidedPlan(null)}
          onFinish={handleFinishGuidedWorkout}
        />
      )}

      {/* QR Code Voucher Modal */}
      {qrModalVoucher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-gray-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">QR Voucher Merchant</h3>
              <button 
                onClick={() => setQrModalVoucher(null)} 
                className="p-1.5 rounded-full text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
              <QrCode className="w-40 h-40 text-black" />
            </div>

            <div>
              <p className="text-xs text-gray-400">Tunjukkan kode QR ini ke kasir merchant saat checkout</p>
              <span className="font-mono text-sm font-extrabold text-[#ccff00] block mt-1 tracking-wider">
                {qrModalVoucher.voucher_code}
              </span>
            </div>

            <button
              onClick={() => handleCopyVoucherCode(qrModalVoucher.voucher_code || '')}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode === qrModalVoucher.voucher_code ? '✓ Tersalin ke Clipboard!' : 'Salin Kode Voucher'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
