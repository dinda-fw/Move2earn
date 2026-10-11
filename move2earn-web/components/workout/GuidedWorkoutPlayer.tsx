'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WorkoutPlan, CompletedWorkoutSession } from '@/lib/types';
import { WorkoutStore } from '@/lib/workoutStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  Clock, 
  Dumbbell, 
  Flame, 
  Coins, 
  X, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

interface GuidedWorkoutPlayerProps {
  plan: WorkoutPlan;
  onClose: () => void;
  onFinish?: (session: CompletedWorkoutSession) => void;
}

// Audio Synthesizer for countdown & set completion
const playBeep = (type: 'tick' | 'done' | 'coin') => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'tick') {
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'done') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch {
    // Ignore audio errors
  }
};

export default function GuidedWorkoutPlayer({ plan, onClose, onFinish }: GuidedWorkoutPlayerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timers
  const [exerciseSecondsLeft, setExerciseSecondsLeft] = useState(45);
  const [restSecondsLeft, setRestSecondsLeft] = useState(30);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // States
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    coinsAwarded: number;
    durationMinutes: number;
    totalSets: number;
  } | null>(null);

  const startTimeRef = useRef<string>(new Date().toISOString());
  const completedSetsCountRef = useRef(0);

  const currentPlanExercise = plan.exercises[currentExerciseIndex] || plan.exercises[0];
  const totalExercises = plan.exercises.length;
  const totalPlannedSets = plan.exercises.reduce((acc, cur) => acc + cur.sets, 0);

  // Setup exercise timer on index or set change
  useEffect(() => {
    if (!isResting && currentPlanExercise) {
      const dur = currentPlanExercise.duration_seconds || 45;
      setExerciseSecondsLeft(dur);
    }
  }, [currentExerciseIndex, currentSet, isResting]);

  // Main countdown ticking timer
  useEffect(() => {
    if (isCompleted || isPaused || showExitConfirm) return;

    const timer = setInterval(() => {
      setTotalElapsedTime(prev => prev + 1);

      if (isResting) {
        setRestSecondsLeft(prev => {
          if (prev <= 1) {
            // Rest finished -> next set or next exercise
            if (soundEnabled) playBeep('done');
            setIsResting(false);
            return 30;
          }
          if (prev <= 4 && soundEnabled) playBeep('tick');
          return prev - 1;
        });
      } else {
        setExerciseSecondsLeft(prev => {
          if (prev <= 1) {
            // Exercise time auto-finished
            handleCompleteSet();
            return 0;
          }
          if (prev <= 4 && soundEnabled) playBeep('tick');
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isResting, isPaused, isCompleted, showExitConfirm, currentExerciseIndex, currentSet]);

  const handleCompleteSet = () => {
    completedSetsCountRef.current += 1;
    if (soundEnabled) playBeep('done');

    const totalSetsForThis = currentPlanExercise.sets;

    if (currentSet < totalSetsForThis) {
      // Go to next set with rest
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestSecondsLeft(currentPlanExercise.rest_seconds || 30);
    } else {
      // Completed all sets for this exercise
      if (currentExerciseIndex < totalExercises - 1) {
        // Go to next exercise with rest
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestSecondsLeft(currentPlanExercise.rest_seconds || 30);
      } else {
        // Entire workout finished!
        handleFinishWorkout();
      }
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      handleFinishWorkout();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const handleFinishWorkout = () => {
    setIsCompleted(true);
    if (soundEnabled) playBeep('coin');

    const durationSec = Math.max(totalElapsedTime, 60);
    const durationMin = Math.round(durationSec / 60);
    const totalSetsCompleted = Math.max(completedSetsCountRef.current, 1);

    // Record session and award tokens via store
    const result = WorkoutStore.recordCompletedWorkout({
      plan_id: plan.id,
      plan_title: plan.title,
      started_at: startTimeRef.current,
      duration_seconds: durationSec,
      exercises_completed: Math.min(currentExerciseIndex + 1, totalExercises),
      total_sets_completed: totalSetsCompleted,
      coins_awarded: plan.coin_reward,
      target_muscles: plan.target_muscles,
      idempotency_key: `m2e-workout-session-${Date.now()}`
    });

    setSummaryData({
      coinsAwarded: result.coinsAwarded,
      durationMinutes: durationMin,
      totalSets: totalSetsCompleted
    });
  };

  // Progress percentage calculation
  const completedSetsRatio = (completedSetsCountRef.current / totalPlannedSets) * 100;
  const progressPercent = Math.min(100, Math.round(completedSetsRatio));

  const nextExercise = currentExerciseIndex < totalExercises - 1 ? plan.exercises[currentExerciseIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070a0f] text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* TOP BAR */}
      <div className="px-4 py-3 bg-[#0d121c] border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 rounded-xl bg-gray-800/80 text-gray-400 hover:text-white"
            title="Keluar dari Sesi"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#ccff00] font-mono tracking-wider block">
              {plan.title}
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
              <span>Latihan {currentExerciseIndex + 1} dari {totalExercises}</span>
              <span>•</span>
              <span className="text-gray-400 font-mono">Total Waktu: {Math.floor(totalElapsedTime / 60)}m {totalElapsedTime % 60}s</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-gray-800/80 text-gray-300 hover:text-white"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ccff00]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div className="w-full bg-gray-900 h-1.5 shrink-0">
        <div 
          className="bg-[#ccff00] h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* MAIN VIEWPORT */}
      {!isCompleted ? (
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col justify-between overflow-y-auto">
          
          {/* STATE 1: RESTING BETWEEN SETS */}
          {isResting ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn py-6">
              <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl border border-teal-500/30">
                ☕
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-teal-400 tracking-widest block mb-1">
                  WAKTU ISTIRAHAT
                </span>
                <h3 className="text-2xl font-black text-white">Tarik Napas & Minum Air</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                  Relakskan otot sebelum set berikutnya untuk memaksimalkan performa gerakan.
                </p>
              </div>

              {/* Big Rest Timer Countdown */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-gray-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-teal-400 transition-all duration-1000 ease-linear"
                    strokeWidth="10"
                    strokeDasharray={477}
                    strokeDashoffset={477 * (1 - restSecondsLeft / (currentPlanExercise.rest_seconds || 30))}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-5xl font-black font-mono text-white block">
                    {restSecondsLeft}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Detik</span>
                </div>
              </div>

              {/* Skip Rest Button */}
              <button
                onClick={() => {
                  setIsResting(false);
                  if (soundEnabled) playBeep('tick');
                }}
                className="px-6 py-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold border border-gray-700 transition-all flex items-center gap-2"
              >
                <span>Lewati Istirahat</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Up Next Preview */}
              <div className="p-3.5 rounded-2xl bg-[#111724] border border-gray-800 max-w-md w-full text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Berikutnya:</span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <h5 className="text-xs font-bold text-white">{currentPlanExercise.exercise.name}</h5>
                    <span className="text-[10px] text-[#ccff00] font-mono">
                      Set {currentSet} dari {currentPlanExercise.sets} • {currentPlanExercise.reps_or_duration}
                    </span>
                  </div>
                  <Dumbbell className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            /* STATE 2: ACTIVE EXERCISE */
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Exercise Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-[#ccff00]/20 text-[#ccff00] px-2.5 py-0.5 rounded-full border border-[#ccff00]/30">
                      SET {currentSet} DARI {currentPlanExercise.sets}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Target: {currentPlanExercise.exercise.primary_muscle}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#ccff00] bg-black/60 px-3 py-1 rounded-xl border border-gray-800">
                    {currentPlanExercise.reps_or_duration}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentPlanExercise.exercise.name}
                </h1>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                  {currentPlanExercise.exercise.description}
                </p>
              </div>

              {/* Central Exercise Visual & Timer Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121825] to-[#0d121d] border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                
                {/* Visual / Movement Demonstration */}
                <div 
                  onClick={() => currentPlanExercise.exercise.full_video_url && setShowVideoModal(true)}
                  className={`relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-black/50 border border-gray-800/80 flex flex-col items-center justify-center overflow-hidden shrink-0 group ${
                    currentPlanExercise.exercise.full_video_url ? 'cursor-pointer hover:border-[#ccff00]/60' : ''
                  }`}
                  title={currentPlanExercise.exercise.full_video_url ? "Klik untuk melihat video tutorial" : undefined}
                >
                  {currentPlanExercise.exercise.full_video_image_url ? (
                    <>
                      <img
                        src={currentPlanExercise.exercise.full_video_image_url}
                        alt={currentPlanExercise.exercise.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black/20 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold shadow-lg mb-1">
                          <Play className="w-4 h-4 ml-0.5 fill-black" />
                        </div>
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded-full border border-white/10">
                          Video Tutorial
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center font-bold text-3xl mb-2">
                        🏃
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 capitalize">
                        {currentPlanExercise.exercise.category}
                      </span>
                      <span className="text-[9px] text-gray-500 block">
                        Alat: {currentPlanExercise.exercise.equipment.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Countdown Timer or Reps Display */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-6xl font-black font-mono text-white tracking-tighter">
                    {exerciseSecondsLeft < 10 ? `0${exerciseSecondsLeft}` : exerciseSecondsLeft}
                    <span className="text-sm text-gray-500 font-sans font-normal ml-1">detik</span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Atau selesaikan {currentPlanExercise.reps_or_duration} dengan postur stabil
                  </span>

                  {/* Complete Set Big Action Button */}
                  <button
                    onClick={handleCompleteSet}
                    className="mt-4 w-full py-3.5 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-sm shadow-lg shadow-[#ccff00]/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    <span>Selesaikan Set {currentSet}</span>
                  </button>
                </div>
              </div>

              {/* Form Instruction Card */}
              <div className="p-4 rounded-2xl bg-[#101520] border border-gray-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Instruksi Kunci:
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {currentPlanExercise.exercise.instructions[0] || 'Lakukan gerakan dengan perlahan dan kontrol napas teratur.'}
                </p>
                {currentPlanExercise.exercise.safety_notes && (
                  <p className="text-[10px] text-amber-300/90 italic flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Tips: {currentPlanExercise.exercise.safety_notes}</span>
                  </p>
                )}
              </div>

              {/* Next Up Banner */}
              {nextExercise && (
                <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs text-gray-400">
                  <span className="truncate">Berikutnya: <strong className="text-gray-200">{nextExercise.exercise.name}</strong></span>
                  <span className="font-mono text-[10px] text-gray-500">{nextExercise.sets} Sets</span>
                </div>
              )}

            </div>
          )}

          {/* PLAYER CONTROLS FOOTER */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-4">
            <button
              onClick={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
              className="p-3 rounded-2xl bg-[#121620] border border-gray-800 text-gray-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Latihan Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex-1 py-3 rounded-2xl bg-[#121620] hover:bg-[#181f2c] border border-gray-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 text-[#ccff00] fill-[#ccff00]" /> : <Pause className="w-4 h-4 text-amber-400" />}
              <span>{isPaused ? 'Lanjutkan (Resume)' : 'Jeda (Pause)'}</span>
            </button>

            <button
              onClick={handleSkipExercise}
              className="p-3 rounded-2xl bg-[#121620] border border-gray-800 text-gray-300 hover:text-white transition-colors"
              title="Lewati Latihan Ini"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* STATE 3: WORKOUT SUMMARY & REWARD CLAIM */
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col justify-center text-center space-y-6 animate-fadeIn">
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ccff00] to-emerald-400 text-black mx-auto flex items-center justify-center font-bold shadow-xl shadow-[#ccff00]/30 animate-bounce">
            <Sparkles className="w-10 h-10 fill-black" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold text-[#ccff00] tracking-widest block mb-1">
              WORKOUT SELESAI!
            </span>
            <h2 className="text-3xl font-black text-white">Luar Biasa, Kamu Berhasil!</h2>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              Kamu berhasil mengubah waktu santai menjadi keringat sehat dan koin reward.
            </p>
          </div>

          {/* Reward Token Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Reward MOVE2EARN Diberikan
            </span>
            <div className="text-3xl font-black font-mono text-[#ccff00] flex items-center justify-center gap-2">
              <Coins className="w-7 h-7 text-amber-400 fill-amber-400" />
              <span>+{summaryData?.coinsAwarded || plan.coin_reward} Move Coins</span>
            </div>
            <span className="text-[10px] text-gray-400 block">
              Saldo otomatis tersimpan di Wallet dan dapat ditukarkan di tab Rewards!
            </span>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#121620] border border-gray-800">
              <Clock className="w-4 h-4 text-[#ccff00] mx-auto mb-1" />
              <div className="text-base font-extrabold text-white font-mono">
                {summaryData?.durationMinutes || 1} min
              </div>
              <span className="text-[9px] uppercase text-gray-400">Total Durasi</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121620] border border-gray-800">
              <Dumbbell className="w-4 h-4 text-teal-400 mx-auto mb-1" />
              <div className="text-base font-extrabold text-white font-mono">
                {summaryData?.totalSets || totalPlannedSets}
              </div>
              <span className="text-[9px] uppercase text-gray-400">Set Selesai</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121620] border border-gray-800">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1 fill-orange-400" />
              <div className="text-base font-extrabold text-white font-mono">
                ~{plan.estimated_calories} kcal
              </div>
              <span className="text-[9px] uppercase text-gray-400">Kalori (Est.)</span>
            </div>
          </div>

          {/* Target Muscles Trained */}
          <div className="p-3 rounded-2xl bg-[#0f1420] border border-gray-800 text-xs text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Area Otot Terlatih:</span>
            <div className="flex flex-wrap gap-1.5">
              {plan.target_muscles.map(m => (
                <span key={m} className="px-2 py-0.5 rounded-lg bg-gray-800 text-gray-200 text-[10px] font-semibold uppercase">
                  {m.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Exit CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onClose();
                window.location.href = '/dashboard';
              }}
              className="w-full py-3.5 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#ccff00]/25 transition-all"
            >
              Kembali ke Dashboard
            </button>

            <Link
              href="/history"
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs block transition-all"
            >
              Lihat Riwayat & Log Aktivitas
            </Link>
          </div>

        </div>
      )}

      {/* VIDEO TUTORIAL IN-SESSION MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10141f] border border-gray-800 rounded-3xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#ccff00] font-mono">Tutorial Gerakan</span>
                <h4 className="text-base font-bold text-white">{currentPlanExercise.exercise.name}</h4>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800">
              {getYouTubeEmbedUrl(currentPlanExercise.exercise.full_video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(currentPlanExercise.exercise.full_video_url, { autoplay: true }) || ''}
                  title={currentPlanExercise.exercise.name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Video tutorial tidak dapat dimuat
                </div>
              )}
            </div>

            <div className="text-xs text-gray-300 bg-gray-900/60 p-3 rounded-xl border border-gray-800 space-y-1">
              <span className="font-bold text-white block">Instruksi Kunci:</span>
              <p>{currentPlanExercise.exercise.instructions[0] || 'Lakukan gerakan dengan perlahan dan kontrol napas teratur.'}</p>
            </div>

            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] transition-colors"
            >
              Lanjutkan Latihan
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION EXIT MODAL */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-gray-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Yakin Ingin Mengakhiri Sesi?</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Progres sesi saat ini akan disimpan sebagian dan koin reward penuh hanya diberikan setelah latihan selesai.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs"
              >
                Lanjutkan Workout
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs"
              >
                Akhiri Sesi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
