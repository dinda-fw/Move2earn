import { 
  Exercise, 
  WorkoutPlan, 
  WorkoutPlanExercise, 
  WorkoutBuilderPreferences, 
  SavedWorkout, 
  CompletedWorkoutSession,
  EquipmentType,
  MuscleGroup,
  ExerciseDifficulty
} from './types';
import { INITIAL_EXERCISES, PRESET_WORKOUT_PLANS } from './exerciseData';
import { Move2EarnStore } from './store';

const WORKOUT_STORAGE_KEYS = {
  CUSTOM_EXERCISES: 'm2e_custom_exercises',
  SAVED_PLANS: 'm2e_saved_plans',
  FAVORITE_IDS: 'm2e_favorite_plan_ids',
  COMPLETED_SESSIONS: 'm2e_completed_workout_sessions'
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger storage event for cross-component sync
    window.dispatchEvent(new Event('storage'));
  } catch {
    // ignore
  }
}

export const WorkoutStore = {
  // 1. EXERCISE LIBRARY
  getAllExercises(): Exercise[] {
    const custom = getStored<Exercise[]>(WORKOUT_STORAGE_KEYS.CUSTOM_EXERCISES, []);
    return [...INITIAL_EXERCISES, ...custom];
  },

  getExerciseById(id: string): Exercise | undefined {
    return this.getAllExercises().find(e => e.id === id || e.slug === id);
  },

  // 2. PRESET & SAVED PLANS
  getPresetPlans(): WorkoutPlan[] {
    const favIds = this.getFavoritePlanIds();
    return PRESET_WORKOUT_PLANS.map(p => ({
      ...p,
      is_favorite: favIds.includes(p.id)
    }));
  },

  getSavedWorkouts(): SavedWorkout[] {
    return getStored<SavedWorkout[]>(WORKOUT_STORAGE_KEYS.SAVED_PLANS, []);
  },

  saveWorkout(plan: WorkoutPlan): void {
    const saved = this.getSavedWorkouts();
    const existingIndex = saved.findIndex(s => s.plan.id === plan.id);
    const newSaved: SavedWorkout = {
      id: `saved-${Date.now()}`,
      user_id: 'demo-user-id',
      plan: { ...plan, is_custom: true },
      is_favorite: false,
      saved_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      saved[existingIndex] = newSaved;
    } else {
      saved.unshift(newSaved);
    }
    setStored(WORKOUT_STORAGE_KEYS.SAVED_PLANS, saved);
  },

  deleteSavedWorkout(planId: string): void {
    const saved = this.getSavedWorkouts();
    const updated = saved.filter(s => s.plan.id !== planId && s.id !== planId);
    setStored(WORKOUT_STORAGE_KEYS.SAVED_PLANS, updated);
  },

  getFavoritePlanIds(): string[] {
    return getStored<string[]>(WORKOUT_STORAGE_KEYS.FAVORITE_IDS, []);
  },

  toggleFavoriteWorkout(planId: string): boolean {
    const favIds = this.getFavoritePlanIds();
    const isFav = favIds.includes(planId);
    let updated: string[];
    if (isFav) {
      updated = favIds.filter(id => id !== planId);
    } else {
      updated = [...favIds, planId];
    }
    setStored(WORKOUT_STORAGE_KEYS.FAVORITE_IDS, updated);
    return !isFav;
  },

  // 3. WORKOUT BUILDER ALGORITHM (Workout.cool Inspired)
  generateWorkout(prefs: WorkoutBuilderPreferences): WorkoutPlan {
    const allExercises = this.getAllExercises();
    const availableEquip: EquipmentType[] = prefs.equipment.length > 0 ? prefs.equipment : (['bodyweight'] as EquipmentType[]);
    
    // Filter by Equipment: An exercise is available if ALL of its required equipment is owned by user, OR if it requires bodyweight
    const equipmentFiltered = allExercises.filter(ex => {
      // If user selected bodyweight only, only exercises with ONLY bodyweight/yoga_mat are eligible
      return ex.equipment.every(eq => availableEquip.includes(eq) || eq === 'yoga_mat');
    });

    // Filter by Location if outdoor/home specific
    const locationFiltered = equipmentFiltered.filter(ex => {
      return ex.location.includes(prefs.location);
    });

    const pool = locationFiltered.length >= 3 ? locationFiltered : equipmentFiltered;

    // Filter by Muscles: Match primary or secondary muscles
    const targetMuscles: MuscleGroup[] = prefs.target_muscles.length > 0 ? prefs.target_muscles : (['full_body'] as MuscleGroup[]);
    const isFullBody = targetMuscles.includes('full_body');

    let muscleMatches: Exercise[] = [];
    if (isFullBody) {
      muscleMatches = pool;
    } else {
      muscleMatches = pool.filter(ex => {
        const matchesPrimary = targetMuscles.includes(ex.primary_muscle);
        const matchesSecondary = ex.secondary_muscles.some(m => targetMuscles.includes(m));
        return matchesPrimary || matchesSecondary;
      });
      // Fallback if too few matches
      if (muscleMatches.length < 3) {
        muscleMatches = pool;
      }
    }

    // Determine target count based on duration
    let targetCount = 4;
    if (prefs.duration_minutes <= 10) targetCount = 3;
    else if (prefs.duration_minutes <= 15) targetCount = 4;
    else if (prefs.duration_minutes <= 20) targetCount = 5;
    else if (prefs.duration_minutes <= 30) targetCount = 6;
    else if (prefs.duration_minutes <= 45) targetCount = 7;
    else targetCount = 8;

    // Shuffle & Select
    const shuffled = [...muscleMatches].sort(() => 0.5 - Math.random());
    const selectedExercises = shuffled.slice(0, Math.min(targetCount, shuffled.length));

    // Sort logically: Mobility/Warm-up first -> Compound Strength/Cardio -> Core -> Mobility cooldown
    selectedExercises.sort((a, b) => {
      const order: Record<string, number> = { mobility: 1, cardio: 2, strength: 3, hiit: 4, core: 5, stretching: 6, full_body: 3, upper_body: 3, lower_body: 3 };
      return (order[a.category] || 3) - (order[b.category] || 3);
    });

    // Determine sets and reps based on difficulty and duration
    const setsMultiplier = prefs.difficulty === 'beginner' ? 3 : prefs.difficulty === 'intermediate' ? 3 : 4;
    const planExercises: WorkoutPlanExercise[] = selectedExercises.map((ex, index) => {
      let reps = ex.recommended_reps;
      let durationSec = ex.default_duration_seconds || 45;
      let rest = ex.default_rest_seconds;

      if (prefs.intensity === 'high') {
        rest = Math.max(15, rest - 10);
      } else if (prefs.intensity === 'low') {
        rest = rest + 15;
      }

      return {
        id: `we-${Date.now()}-${index}`,
        exercise: ex,
        sets: setsMultiplier,
        reps_or_duration: reps,
        duration_seconds: durationSec,
        rest_seconds: rest
      };
    });

    const titlePrefix = prefs.target_muscles.length === 1 
      ? `${prefs.target_muscles[0].toUpperCase()} Focus`
      : isFullBody ? 'Full Body' : 'Targeted Custom';
    const equipLabel = availableEquip.includes('bodyweight') && availableEquip.length === 1 ? 'Bodyweight' : 'Mixed Equipment';

    const estCalories = Math.round(prefs.duration_minutes * (prefs.intensity === 'high' ? 9.5 : prefs.intensity === 'moderate' ? 8.0 : 6.5));
    const tokenReward = Math.round(prefs.duration_minutes * 1.8 + (prefs.difficulty === 'advanced' ? 10 : 5));

    return {
      id: `custom-plan-${Date.now()}`,
      title: `${titlePrefix} ${equipLabel} (${prefs.duration_minutes}M)`,
      description: `Rangkaian latihan ${prefs.difficulty} dirancang khusus untuk target ${targetMuscles.join(', ')} menggunakan ${availableEquip.join(', ')}.`,
      difficulty: prefs.difficulty,
      category: prefs.category,
      target_muscles: targetMuscles,
      equipment: availableEquip,
      estimated_duration_minutes: prefs.duration_minutes,
      estimated_calories: estCalories,
      coin_reward: tokenReward,
      exercises: planExercises,
      is_custom: true,
      location: prefs.location,
      created_at: new Date().toISOString()
    };
  },

  // 4. COMPLETED SESSIONS & REWARD INTEGRATION
  getCompletedWorkouts(): CompletedWorkoutSession[] {
    return getStored<CompletedWorkoutSession[]>(WORKOUT_STORAGE_KEYS.COMPLETED_SESSIONS, [
      {
        id: 'cws-demo-1',
        user_id: 'demo-user-id',
        plan_id: 'plan-preset-01',
        plan_title: 'Full Body Fat Burner 20M',
        started_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86400000 + 1200000).toISOString(),
        duration_seconds: 1200,
        exercises_completed: 5,
        total_sets_completed: 15,
        coins_awarded: 45,
        target_muscles: ['full_body', 'abs', 'quadriceps']
      }
    ]);
  },

  recordCompletedWorkout(data: {
    plan_id?: string;
    plan_title: string;
    started_at: string;
    duration_seconds: number;
    exercises_completed: number;
    total_sets_completed: number;
    coins_awarded: number;
    target_muscles: MuscleGroup[];
    idempotency_key?: string;
  }): { success: boolean; coinsAwarded: number } {
    const key = data.idempotency_key || `m2e-workout-${Date.now()}`;
    const sessions = this.getCompletedWorkouts();

    // Prevent duplicate reward claims
    const existing = sessions.find(s => s.idempotency_key === key);
    if (existing) {
      return { success: true, coinsAwarded: existing.coins_awarded };
    }

    const newSession: CompletedWorkoutSession = {
      id: `cws-${Date.now()}`,
      user_id: 'demo-user-id',
      plan_id: data.plan_id,
      plan_title: data.plan_title,
      started_at: data.started_at,
      completed_at: new Date().toISOString(),
      duration_seconds: data.duration_seconds,
      exercises_completed: data.exercises_completed,
      total_sets_completed: data.total_sets_completed,
      coins_awarded: data.coins_awarded,
      target_muscles: data.target_muscles,
      idempotency_key: key
    };

    sessions.unshift(newSession);
    setStored(WORKOUT_STORAGE_KEYS.COMPLETED_SESSIONS, sessions);

    // Integrate with Move2Earn wallet transactions (ledger)
    const newTx = {
      id: `tx-workout-${Date.now()}`,
      user_id: 'demo-user-id',
      amount: data.coins_awarded,
      transaction_type: 'earn' as const,
      reference_type: 'workout_reward' as const,
      description: `Reward Sesi Workout: ${data.plan_title} (${Math.round(data.duration_seconds / 60)} menit)`,
      idempotency_key: key,
      created_at: new Date().toISOString()
    };

    const currentTxs = Move2EarnStore.getTransactions();
    currentTxs.unshift(newTx);
    setStored('m2e_transactions', currentTxs);

    return {
      success: true,
      coinsAwarded: data.coins_awarded
    };
  },

  getAlternativeExercise(
    currentExerciseId: string, 
    allowedEquip: EquipmentType[] = ['bodyweight'], 
    targetMuscles: MuscleGroup[] = ['full_body']
  ): Exercise | undefined {
    const all = this.getAllExercises();
    const current = this.getExerciseById(currentExerciseId);
    if (!current) return undefined;

    const candidates = all.filter(ex => {
      if (ex.id === currentExerciseId) return false;
      const equipMatch = ex.equipment.every(eq => allowedEquip.includes(eq) || eq === 'yoga_mat');
      const muscleMatch = targetMuscles.includes('full_body') || targetMuscles.includes(ex.primary_muscle) || ex.primary_muscle === current.primary_muscle;
      return equipMatch && muscleMatch;
    });

    if (candidates.length === 0) {
      return all.find(ex => ex.id !== currentExerciseId);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  },

  generateWorkoutPlan(prefs: {
    equipment: EquipmentType[];
    targetMuscles: MuscleGroup[];
    durationMinutes: number;
    difficulty: ExerciseDifficulty;
    category?: any;
    location?: any;
  }): WorkoutPlan {
    return this.generateWorkout({
      equipment: prefs.equipment,
      target_muscles: prefs.targetMuscles,
      duration_minutes: prefs.durationMinutes,
      difficulty: prefs.difficulty,
      category: prefs.category || 'mixed',
      location: prefs.location || 'home',
      intensity: 'moderate',
      goal: 'stay_active'
    });
  }
};
