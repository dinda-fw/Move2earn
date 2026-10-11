'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Bookmark, 
  History, 
  Search, 
  Filter, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Flame, 
  Coins, 
  Sliders, 
  Zap, 
  Heart, 
  Shuffle, 
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { 
  Exercise, 
  WorkoutPlan, 
  WorkoutPlanExercise,
  WorkoutBuilderPreferences, 
  EquipmentType, 
  MuscleGroup, 
  WorkoutCategory, 
  ExerciseDifficulty,
  SavedWorkout,
  CompletedWorkoutSession
} from '@/lib/types';
import { WorkoutStore } from '@/lib/workoutStore';
import { INITIAL_EXERCISES, PRESET_WORKOUT_PLANS } from '@/lib/exerciseData';
import MuscleSelector from '@/components/workout/MuscleSelector';
import EquipmentSelector from '@/components/workout/EquipmentSelector';
import ExerciseDetailModal from '@/components/workout/ExerciseDetailModal';
import GuidedWorkoutPlayer from '@/components/workout/GuidedWorkoutPlayer';

type WorkoutTab = 'builder' | 'discovery' | 'library' | 'saved_history';

export default function WorkoutPage() {
  const [activeTab, setActiveTab] = useState<WorkoutTab>('builder');

  // Workout Builder State (Workout.cool workflow)
  const [builderStep, setBuilderStep] = useState<number>(1);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>(['bodyweight']);
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(['full_body']);
  const [preferences, setPreferences] = useState<WorkoutBuilderPreferences>({
    equipment: ['bodyweight'],
    target_muscles: ['full_body'],
    duration_minutes: 20,
    difficulty: 'beginner',
    category: 'mixed',
    location: 'home',
    intensity: 'moderate',
    goal: 'stay_active',
    daily_energy: 'normal'
  });

  // Generated Plan State
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);

  // Exercise Library State
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState<string>('all');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('all');
  const [inspectingExercise, setInspectingExercise] = useState<Exercise | null>(null);

  // Presets, Saved & History State
  const [presetPlans, setPresetPlans] = useState<WorkoutPlan[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedWorkoutSession[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Guided Player Active State
  const [activePlayerPlan, setActivePlayerPlan] = useState<WorkoutPlan | null>(null);

  // Exercise swap selection modal
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAllExercises(WorkoutStore.getAllExercises());
    setPresetPlans(WorkoutStore.getPresetPlans());
    setSavedWorkouts(WorkoutStore.getSavedWorkouts());
    setCompletedSessions(WorkoutStore.getCompletedWorkouts());
    setFavoriteIds(WorkoutStore.getFavoritePlanIds());
  };

  // BUILDER ACTIONS
  const handleGenerateWorkout = () => {
    const finalPrefs: WorkoutBuilderPreferences = {
      ...preferences,
      equipment: selectedEquipment,
      target_muscles: selectedMuscles
    };
    const plan = WorkoutStore.generateWorkout(finalPrefs);
    setGeneratedPlan(plan);
    setBuilderStep(4);
  };

  const handleSaveCurrentPlan = () => {
    if (!generatedPlan) return;
    WorkoutStore.saveWorkout(generatedPlan);
    refreshData();
    alert('Workout berhasil disimpan ke koleksi kamu!');
  };

  const handleToggleFavorite = (planId: string) => {
    WorkoutStore.toggleFavoriteWorkout(planId);
    refreshData();
  };

  const handleRemoveExerciseFromPlan = (index: number) => {
    if (!generatedPlan) return;
    if (generatedPlan.exercises.length <= 2) {
      alert('Workout minimal memiliki 2 latihan.');
      return;
    }
    const updated = [...generatedPlan.exercises];
    updated.splice(index, 1);
    setGeneratedPlan({
      ...generatedPlan,
      exercises: updated,
      estimated_duration_minutes: Math.max(5, generatedPlan.estimated_duration_minutes - 4)
    });
  };

  const handleSwapExercise = (replacementExercise: Exercise) => {
    if (!generatedPlan || swapTargetIndex === null) return;
    const updated = [...generatedPlan.exercises];
    updated[swapTargetIndex] = {
      ...updated[swapTargetIndex],
      exercise: replacementExercise
    };
    setGeneratedPlan({
      ...generatedPlan,
      exercises: updated
    });
    setSwapTargetIndex(null);
  };

  const handleAddExerciseToPlan = (exerciseToAdd: Exercise) => {
    if (!generatedPlan) return;
    const newPlanEx: WorkoutPlanExercise = {
      id: `we-add-${Date.now()}-${generatedPlan.exercises.length}`,
      exercise: exerciseToAdd,
      sets: 3,
      reps_or_duration: exerciseToAdd.recommended_reps || '12 reps',
      duration_seconds: exerciseToAdd.default_duration_seconds || 45,
      rest_seconds: exerciseToAdd.default_rest_seconds || 30
    };
    setGeneratedPlan({
      ...generatedPlan,
      exercises: [...generatedPlan.exercises, newPlanEx],
      estimated_duration_minutes: generatedPlan.estimated_duration_minutes + 4
    });
    setIsAddExerciseModalOpen(false);
  };

  const handleStartSingleExercise = (exercise: Exercise) => {
    const singlePlan: WorkoutPlan = {
      id: `single-${exercise.id}-${Date.now()}`,
      title: `${exercise.name} Focus`,
      description: `Sesi latihan mandiri fokus pada ${exercise.name}.`,
      difficulty: exercise.difficulty,
      category: exercise.category,
      target_muscles: [exercise.primary_muscle],
      equipment: exercise.equipment,
      estimated_duration_minutes: 5,
      estimated_calories: 45,
      coin_reward: 15,
      exercises: [
        {
          id: `single-ex-1`,
          exercise,
          sets: exercise.recommended_sets || 3,
          reps_or_duration: exercise.recommended_reps || '12 reps',
          duration_seconds: exercise.default_duration_seconds || 45,
          rest_seconds: exercise.default_rest_seconds || 30
        }
      ]
    };
    setInspectingExercise(null);
    setActivePlayerPlan(singlePlan);
  };

  // FILTERED EXERCISES FOR LIBRARY
  const filteredExercises = allExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.primary_muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || ex.category === selectedCategoryFilter;
    const matchesDifficulty = selectedDifficultyFilter === 'all' || ex.difficulty === selectedDifficultyFilter;
    const matchesEquipment = selectedEquipmentFilter === 'all' || ex.equipment.includes(selectedEquipmentFilter as any);
    const matchesMuscle = selectedMuscleFilter === 'all' || ex.primary_muscle === selectedMuscleFilter || ex.secondary_muscles.includes(selectedMuscleFilter as any);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment && matchesMuscle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* GUIDED PLAYER MODAL IF ACTIVE */}
      {activePlayerPlan && (
        <GuidedWorkoutPlayer
          plan={activePlayerPlan}
          onClose={() => {
            setActivePlayerPlan(null);
            refreshData();
          }}
          onFinish={() => {
            refreshData();
          }}
        />
      )}

      {/* EXERCISE DETAIL MODAL */}
      {inspectingExercise && (
        <ExerciseDetailModal
          exercise={inspectingExercise}
          onClose={() => setInspectingExercise(null)}
          onStartSingle={handleStartSingleExercise}
        />
      )}

      {/* HERO BANNER & NAVIGATION */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#121926] via-[#10141f] to-[#0c0f17] border border-gray-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MOVE2EARN WORKOUT ENGINE</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Workout Planner & <span className="text-[#ccff00]">Exercise Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            Tentukan latihan yang ingin kamu lakukan sekarang. Pilih alat, target otot, dan waktu luangmu — sistem kami akan menyusun rekomendasi latihan berhadiah koin secara otomatis!
          </p>

          {/* Quick Stat Pill */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Dumbbell className="w-4 h-4 text-[#ccff00]" />
              <strong>{allExercises.length}</strong> Gerakan Terverifikasi
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Clock className="w-4 h-4 text-teal-400" />
              Sesi Fleksibel 5-60 Menit
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Coins className="w-4 h-4 text-amber-400" />
              Hasilkan Move Coins Otomatis
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-gray-800 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'builder'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Workout Builder (Buat Latihan)</span>
        </button>

        <button
          onClick={() => setActiveTab('discovery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'discovery'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discovery & Rekomendasi</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'library'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Exercise Library ({allExercises.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'saved_history'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Tersimpan & Riwayat ({savedWorkouts.length + completedSessions.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: WORKOUT BUILDER (WORKOUT.COOL INSPIRED 4-STEP WIZARD) */}
      {/* ===================================================================== */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          
          {/* Step Progress Pills */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { num: 1, title: 'Alat Olahraga' },
              { num: 2, title: 'Target Otot' },
              { num: 3, title: 'Preferensi & Durasi' },
              { num: 4, title: 'Hasil Workout' },
            ].map(step => (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  if (step.num === 4 && !generatedPlan) return;
                  setBuilderStep(step.num);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  builderStep === step.num
                    ? 'bg-[#152010] border-[#ccff00] shadow-md shadow-[#ccff00]/10'
                    : builderStep > step.num
                    ? 'bg-[#121620] border-gray-700 text-gray-300'
                    : 'bg-[#0f1420]/60 border-gray-800/80 text-gray-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    builderStep === step.num
                      ? 'bg-[#ccff00] text-black'
                      : builderStep > step.num
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {builderStep > step.num ? '✓' : step.num}
                  </span>
                  <span className="text-[11px] font-bold text-white hidden sm:inline">{step.title}</span>
                </div>
                <span className="text-[9px] text-gray-400 block sm:hidden">{step.title}</span>
              </button>
            ))}
          </div>

          {/* BUILDER STEP CONTENT */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#10141f] border border-gray-800 shadow-xl space-y-6">
            
            {/* STEP 1: CHOOSE EQUIPMENT */}
            {builderStep === 1 && (
              <div className="space-y-6">
                <EquipmentSelector
                  selectedEquipment={selectedEquipment}
                  onChange={setSelectedEquipment}
                />

                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setBuilderStep(2)}
                    className="px-6 py-3 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#ccff00]/20 transition-all"
                  >
                    <span>Lanjut: Pilih Target Otot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT MUSCLES */}
            {builderStep === 2 && (
              <div className="space-y-6">
                <MuscleSelector
                  selectedMuscles={selectedMuscles}
                  onChange={setSelectedMuscles}
                />

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setBuilderStep(1)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Kembali
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuilderStep(3)}
                    disabled={selectedMuscles.length === 0}
                    className="px-6 py-3 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#ccff00]/20 disabled:opacity-40 transition-all"
                  >
                    <span>Lanjut: Atur Preferensi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: WORKOUT PREFERENCES */}
            {builderStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white">Atur Preferensi Workout</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Sesuaikan durasi, tingkat kesulitan, dan kondisi energimu saat ini.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  
                  {/* Duration Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Target Durasi Waktu
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 15, 20, 30, 45, 60].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, duration_minutes: mins })}
                          className={`py-2 rounded-xl font-bold font-mono text-xs border transition-all ${
                            preferences.duration_minutes === mins
                              ? 'bg-[#ccff00] text-black border-[#ccff00]'
                              : 'bg-[#121620] text-gray-300 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Tingkat Kesulitan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['beginner', 'intermediate', 'advanced'] as ExerciseDifficulty[]).map(diff => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, difficulty: diff })}
                          className={`py-2 rounded-xl font-bold text-xs capitalize border transition-all ${
                            preferences.difficulty === diff
                              ? 'bg-[#ccff00] text-black border-[#ccff00]'
                              : 'bg-[#121620] text-gray-300 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Lokasi Latihan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'home', label: 'Di Rumah 🏠' },
                        { id: 'gym', label: 'Di Gym 🏋️' },
                        { id: 'outdoor', label: 'Outdoor 🌳' },
                      ].map(loc => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, location: loc.id as any })}
                          className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                            preferences.location === loc.id
                              ? 'bg-[#ccff00] text-black border-[#ccff00]'
                              : 'bg-[#121620] text-gray-300 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Daily Condition / Energy State */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Kondisi Tubuh Hari Ini
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'light', label: 'Latihan Ringan' },
                        { id: 'normal', label: 'Normal' },
                        { id: 'extra_energy', label: 'Penuh Energi 🔥' },
                      ].map(energy => (
                        <button
                          key={energy.id}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, daily_energy: energy.id as any })}
                          className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                            preferences.daily_energy === energy.id
                              ? 'bg-[#ccff00] text-black border-[#ccff00]'
                              : 'bg-[#121620] text-gray-300 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          {energy.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setBuilderStep(2)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Kembali
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateWorkout}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ccff00] to-emerald-400 hover:from-[#b8e600] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#ccff00]/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Generate My Workout!</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: GENERATED ROUTINE PREVIEW & MANAGEMENT */}
            {builderStep === 4 && generatedPlan && (
              <div className="space-y-6">
                
                {/* Plan Summary Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#131b28] to-[#0c1018] border border-[#ccff00]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 font-mono">
                        HASIL REKOMENDASI AI PLANNER
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold capitalize">
                        {generatedPlan.difficulty} • {generatedPlan.location}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white">{generatedPlan.title}</h2>
                    <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                      {generatedPlan.description}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-mono block">Estimasi Waktu & Kalori</span>
                      <div className="text-sm font-bold text-white font-mono">
                        {generatedPlan.estimated_duration_minutes}m • ~{generatedPlan.estimated_calories} kcal (Est.)
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                      <Coins className="w-3.5 h-3.5 fill-amber-400" />
                      <span>+{generatedPlan.coin_reward} Move Coins</span>
                    </div>
                  </div>
                </div>

                {/* Exercises Sequence List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      Rangkaian Gerakan ({generatedPlan.exercises.length} Latihan)
                    </h3>
                    <span className="text-xs text-gray-400">
                      Kamu dapat mengganti atau menghapus gerakan sebelum mulai.
                    </span>
                  </div>

                  <div className="space-y-3">
                    {generatedPlan.exercises.map((pEx, idx) => (
                      <div
                        key={pEx.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-[#121620] border border-gray-800/80 hover:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-black/60 border border-gray-800 flex items-center justify-center font-bold text-xs text-[#ccff00] font-mono shrink-0">
                            {idx + 1}
                          </span>

                          {/* Exercise Thumbnail / Video Preview */}
                          <div 
                            onClick={() => setInspectingExercise(pEx.exercise)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-gray-800 shrink-0 cursor-pointer group"
                            title="Klik untuk melihat video tutorial"
                          >
                            {pEx.exercise.full_video_image_url ? (
                              <>
                                <img
                                  src={pEx.exercise.full_video_image_url}
                                  alt={pEx.exercise.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold shadow-md">
                                    <Play className="w-3 h-3 ml-0.5 fill-black" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg bg-gray-900">
                                🏃
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 
                                className="text-xs sm:text-sm font-bold text-white hover:text-[#ccff00] cursor-pointer transition-colors"
                                onClick={() => setInspectingExercise(pEx.exercise)}
                              >
                                {pEx.exercise.name}
                              </h4>
                              {pEx.exercise.name_en && (
                                <span className="text-[10px] text-gray-500 hidden sm:inline">
                                  ({pEx.exercise.name_en})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 flex-wrap">
                              <span className="text-[#ccff00] font-mono font-bold bg-[#ccff00]/10 px-2 py-0.5 rounded-md border border-[#ccff00]/20">
                                {pEx.sets} Sets × {pEx.reps_or_duration}
                              </span>
                              <span className="capitalize px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">
                                {pEx.exercise.primary_muscle.replace('_', ' ')}
                              </span>
                              <span className="capitalize px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                                {pEx.exercise.equipment.join(', ')}
                              </span>
                              <span className="font-mono text-gray-400">
                                Rest: {pEx.rest_seconds}s
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800/80">
                          <button
                            type="button"
                            onClick={() => setInspectingExercise(pEx.exercise)}
                            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-[#ccff00] text-xs font-bold flex items-center gap-1.5 transition-colors border border-gray-700"
                          >
                            <Play className="w-3 h-3 fill-[#ccff00]" />
                            <span>Panduan & Video</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSwapTargetIndex(idx)}
                            className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-[#ccff00] hover:bg-gray-700 transition-colors"
                            title="Ganti Latihan Ini"
                          >
                            <Shuffle className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromPlan(idx)}
                            className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors"
                            title="Hapus Latihan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Exercise to Plan Button */}
                    <button
                      type="button"
                      onClick={() => setIsAddExerciseModalOpen(true)}
                      className="w-full py-3 rounded-2xl bg-[#111724] border border-dashed border-gray-700 hover:border-[#ccff00] text-gray-300 hover:text-[#ccff00] text-xs font-bold flex items-center justify-center gap-2 transition-all mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Gerakan Latihan ke Routine</span>
                    </button>
                  </div>
                </div>

                {/* Plan Control CTAs */}
                <div className="pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateWorkout}
                      className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold border border-gray-700 transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Generate Ulang</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCurrentPlan}
                      className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold border border-gray-700 transition-all flex items-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Simpan Workout</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePlayerPlan(generatedPlan)}
                    className="px-8 py-3.5 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-[#ccff00]/25 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Mulai Workout Sekarang!</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: WORKOUT DISCOVERY (PRESETS & FEATURED) */}
      {/* ===================================================================== */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Rekomendasi Workout Pilihan</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Rangkaian latihan terkurasi terinspirasi DAREBEE yang siap dimainkan dalam hitungan detik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetPlans.map(plan => {
              const isFav = favoriteIds.includes(plan.id);

              return (
                <div
                  key={plan.id}
                  className="p-5 rounded-3xl bg-[#111622] border border-gray-800 hover:border-gray-700 flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-mono">
                        {plan.category}
                      </span>
                      <button
                        onClick={() => handleToggleFavorite(plan.id)}
                        className="p-1 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#ccff00] transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-800/80">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                      <span>{plan.estimated_duration_minutes} Menit</span>
                      <span>~{plan.estimated_calories} kcal</span>
                      <span className="text-amber-300 font-bold">+{plan.coin_reward} Coins</span>
                    </div>

                    <button
                      onClick={() => setActivePlayerPlan(plan)}
                      className="w-full py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#ccff00]/15 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Mulai Workout</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: EXERCISE LIBRARY (32+ EXERCISES WITH FILTERS) */}
      {/* ===================================================================== */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-[#10141f] border border-gray-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari latihan berdasarkan nama, otot, atau deskripsi (misal: Push-up, Squat, Plank)..."
                  className="w-full bg-[#0d1017] border border-gray-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Quick Filter Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#0d1017] border border-gray-800 rounded-xl px-2.5 py-2 text-gray-300 text-xs focus:border-[#ccff00] focus:outline-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="hiit">HIIT</option>
                <option value="mobility">Mobility</option>
                <option value="core">Core</option>
              </select>

              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="bg-[#0d1017] border border-gray-800 rounded-xl px-2.5 py-2 text-gray-300 text-xs focus:border-[#ccff00] focus:outline-none"
              >
                <option value="all">Semua Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={selectedEquipmentFilter}
                onChange={(e) => setSelectedEquipmentFilter(e.target.value)}
                className="bg-[#0d1017] border border-gray-800 rounded-xl px-2.5 py-2 text-gray-300 text-xs focus:border-[#ccff00] focus:outline-none"
              >
                <option value="all">Semua Alat</option>
                <option value="bodyweight">Tanpa Alat</option>
                <option value="dumbbell">Dumbbell</option>
                <option value="pull_up_bar">Pull-up Bar</option>
                <option value="jump_rope">Jump Rope</option>
                <option value="kettlebell">Kettlebell</option>
              </select>

              <select
                value={selectedMuscleFilter}
                onChange={(e) => setSelectedMuscleFilter(e.target.value)}
                className="bg-[#0d1017] border border-gray-800 rounded-xl px-2.5 py-2 text-gray-300 text-xs focus:border-[#ccff00] focus:outline-none"
              >
                <option value="all">Semua Otot</option>
                <option value="chest">Dada (Chest)</option>
                <option value="back">Punggung (Back)</option>
                <option value="shoulders">Bahu (Shoulders)</option>
                <option value="abs">Perut (Core)</option>
                <option value="quadriceps">Paha Depan</option>
                <option value="glutes">Bokong (Glutes)</option>
              </select>
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredExercises.map(ex => (
              <div
                key={ex.id}
                className="rounded-3xl bg-[#121620] border border-gray-800 hover:border-[#ccff00]/50 overflow-hidden flex flex-col justify-between transition-all group shadow-md"
              >
                {/* Visual Video Thumbnail */}
                <div 
                  onClick={() => setInspectingExercise(ex)}
                  className="relative w-full aspect-video bg-black/60 overflow-hidden cursor-pointer"
                >
                  {ex.full_video_image_url ? (
                    <>
                      <img
                        src={ex.full_video_image_url}
                        alt={ex.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                          <Play className="w-4 h-4 ml-0.5 fill-black" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-3xl">
                      🏃
                    </div>
                  )}

                  {/* Category & Difficulty Pill Overlays */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/80 text-[#ccff00] border border-[#ccff00]/30 font-mono">
                      {ex.category}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/80 font-mono ${
                      ex.difficulty === 'beginner' ? 'text-emerald-400 border border-emerald-500/40' :
                      ex.difficulty === 'intermediate' ? 'text-amber-400 border border-amber-500/40' :
                      'text-rose-400 border border-rose-500/40'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 
                      onClick={() => setInspectingExercise(ex)}
                      className="text-sm font-bold text-white group-hover:text-[#ccff00] cursor-pointer transition-colors line-clamp-1"
                    >
                      {ex.name}
                    </h4>

                    {ex.name_en && (
                      <span className="text-[10px] text-gray-400 block line-clamp-1 italic">
                        {ex.name_en}
                      </span>
                    )}

                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-800/80">
                    <div className="flex items-center justify-between text-[10px] text-gray-300">
                      <span className="uppercase font-semibold text-gray-400">
                        Target: <span className="text-[#ccff00]">{ex.primary_muscle.replace('_', ' ')}</span>
                      </span>
                      <span className="font-mono text-gray-400">
                        {ex.recommended_reps}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 capitalize">
                        Alat: {ex.equipment.join(', ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                        Rest: {ex.default_rest_seconds}s
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectingExercise(ex)}
                      className="w-full py-2 rounded-xl bg-gray-800 hover:bg-[#ccff00] text-gray-200 hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Lihat Detail & Tutorial</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="p-12 text-center text-gray-400 bg-[#10141f] rounded-3xl border border-gray-800">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-white">Tidak ada latihan yang cocok</p>
              <p className="text-xs text-gray-500 mt-1">Coba ubah kata kunci atau reset filter pencarianmu.</p>
            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: SAVED WORKOUTS & WORKOUT HISTORY */}
      {/* ===================================================================== */}
      {activeTab === 'saved_history' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Saved Plans */}
          <div className="p-6 rounded-3xl bg-[#10141f] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#ccff00]" />
                <span>Workout Tersimpan ({savedWorkouts.length})</span>
              </h3>
            </div>

            {savedWorkouts.length > 0 ? (
              <div className="space-y-3">
                {savedWorkouts.map(sw => (
                  <div
                    key={sw.id}
                    className="p-4 rounded-2xl bg-[#121620] border border-gray-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{sw.plan.title}</h4>
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                        {sw.plan.estimated_duration_minutes}m • {sw.plan.exercises.length} Gerakan • {sw.plan.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActivePlayerPlan(sw.plan)}
                        className="px-3 py-1.5 rounded-xl bg-[#ccff00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
                      >
                        Mulai
                      </button>
                      <button
                        onClick={() => {
                          WorkoutStore.deleteSavedWorkout(sw.id);
                          refreshData();
                        }}
                        className="p-1.5 rounded-xl text-gray-500 hover:text-red-400"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs bg-[#0d1017] rounded-2xl border border-gray-800/80">
                Belum ada workout yang kamu simpan. Buat workout di tab Builder lalu klik "Simpan Workout".
              </div>
            )}
          </div>

          {/* Column 2: Completed Workout History Log */}
          <div className="p-6 rounded-3xl bg-[#10141f] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <span>Log Sesi Selesai ({completedSessions.length})</span>
              </h3>
            </div>

            {completedSessions.length > 0 ? (
              <div className="space-y-3">
                {completedSessions.map(cs => {
                  const dateStr = new Date(cs.completed_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={cs.id}
                      className="p-4 rounded-2xl bg-[#121620] border border-gray-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{cs.plan_title}</h4>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                            {dateStr} • {Math.round(cs.duration_seconds / 60)} Menit • {cs.total_sets_completed} Sets
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#ccff00] font-mono block">
                          +{cs.coins_awarded} Coins
                        </span>
                        <span className="text-[9px] text-gray-500 uppercase">Terverifikasi</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs bg-[#0d1017] rounded-2xl border border-gray-800/80">
                Belum ada riwayat workout selesai. Mulai latihan pertamamu sekarang!
              </div>
            )}
          </div>

        </div>
      )}

      {/* ADD EXERCISE MODAL */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-gray-800 rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Tambah Gerakan ke Routine</h3>
                <span className="text-[11px] text-gray-400">Pilih latihan dari database untuk ditambahkan</span>
              </div>
              <button onClick={() => setIsAddExerciseModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-full bg-gray-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {allExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseToPlan(ex)}
                  className="p-3 rounded-xl bg-[#0f1420] border border-gray-800 hover:border-[#ccff00] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0">
                      {ex.full_video_image_url ? (
                        <img src={ex.full_video_image_url} alt={ex.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">🏃</div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors">{ex.name}</h5>
                      <span className="text-[10px] text-gray-400 capitalize">
                        {ex.category} • {ex.primary_muscle.replace('_', ' ')} • {ex.equipment.join(', ')}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#ccff00] font-bold px-2.5 py-1 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20">
                    + Tambah
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SWAP EXERCISE SELECTION MODAL */}
      {swapTargetIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-gray-800 rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Pilih Latihan Pengganti</h3>
                <span className="text-[11px] text-gray-400">Ganti gerakan posisi ke-{(swapTargetIndex || 0) + 1}</span>
              </div>
              <button onClick={() => setSwapTargetIndex(null)} className="text-gray-400 hover:text-white p-1 rounded-full bg-gray-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {allExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => handleSwapExercise(ex)}
                  className="p-3 rounded-xl bg-[#0f1420] border border-gray-800 hover:border-[#ccff00] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0">
                      {ex.full_video_image_url ? (
                        <img src={ex.full_video_image_url} alt={ex.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">🏃</div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors">{ex.name}</h5>
                      <span className="text-[10px] text-gray-400 capitalize">
                        {ex.category} • {ex.primary_muscle.replace('_', ' ')} • {ex.equipment.join(', ')}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#ccff00] font-bold">Pilih &gt;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
