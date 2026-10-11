export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  fitness_level: 'Beginner' | 'Intermediate' | 'Advanced';
  daily_goal_minutes: number;
  is_logged_in: boolean;
  member_since: string;
  tier: 'Free Member' | 'MoveIt Pro 👑';
  height_cm: number;
  weight_kg: number;
  phone_number?: string;
}

export interface UserSettings {
  user_id: string;
  threshold_minutes: number;
  is_test_mode: boolean;
  test_threshold_minutes: number;
  target_packages: string[];
  timezone: string;
  notifications_enabled: boolean;
}

export interface ScreenTimeSummary {
  id: string;
  user_id: string;
  period_date: string;
  package_name: string;
  duration_seconds: number;
  total_duration_seconds: number;
  measured_at: string;
  source: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: 'strength' | 'cardio' | 'mobility' | 'posture';
  instructions: string;
  media_url: string;
  duration_seconds: number;
  coin_reward: number;
  is_active: boolean;
  verification_mode: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  challenge_id: string;
  started_at: string;
  completed_at?: string;
  duration_seconds: number;
  status: 'started' | 'completed' | 'cancelled';
  reward_status: 'unclaimed' | 'awarded' | 'disqualified';
  idempotency_key?: string;
  challenge?: Challenge;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'earn' | 'redeem' | 'adjustment';
  reference_type: 'workout_reward' | 'reward_redemption' | 'manual_adjustment';
  reference_id?: string;
  description: string;
  idempotency_key?: string;
  created_at: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  coin_price: number;
  stock: number;
  voucher_code?: string;
  is_demo: boolean;
  is_active: boolean;
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  coins_spent: number;
  status: 'pending' | 'completed' | 'revoked';
  voucher_code?: string;
  idempotency_key?: string;
  created_at: string;
  reward?: Reward;
}

export interface DashboardSummary {
  period_date: string;
  threshold_minutes: number;
  screen_time_seconds: number;
  screen_time_minutes: number;
  workout_count: number;
  coins_today: number;
  current_balance: number;
  app_breakdown: {
    package_name: string;
    duration_seconds: number;
  }[];
}

export interface ActivitySummary {
  daily_goal_minutes: number;
  active_minutes: number;
  daily_goal_percent: number;
  screen_time_saved_minutes: number;
  calories_burned: number;
  steps_count: number;
  workout_sessions_count: number;
  day_streak: number;
  this_week: {
    day: string;
    minutes: number;
    active?: boolean;
  }[];
  today_hourly_screentime: {
    hour: string;
    minutes: number;
    active?: boolean;
  }[];
  recent_sessions: {
    id: string;
    title: string;
    duration_minutes: number;
    calories: number;
    coins: number;
    time: string;
    status: string;
  }[];
}

// =============================================================================
// WORKOUT PLANNER & EXERCISE LIBRARY TYPES
// =============================================================================

export type EquipmentType = 
  | 'bodyweight'
  | 'dumbbell'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_band'
  | 'weight_plates'
  | 'pull_up_bar'
  | 'bench'
  | 'gym_machine'
  | 'yoga_mat'
  | 'jump_rope';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'full_body';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutCategory = 
  | 'strength' 
  | 'cardio' 
  | 'hiit' 
  | 'mobility' 
  | 'stretching' 
  | 'core' 
  | 'full_body' 
  | 'upper_body' 
  | 'lower_body';

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  description: string;
  introduction?: string;
  category: WorkoutCategory;
  primary_muscle: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: ExerciseDifficulty;
  instructions: string[];
  recommended_sets: number;
  recommended_reps: string;
  default_duration_seconds?: number;
  default_rest_seconds: number;
  safety_notes?: string;
  easier_alternative?: string;
  harder_alternative?: string;
  location: ('home' | 'gym' | 'outdoor')[];
  illustration_type?: string;
  full_video_url?: string;
  full_video_image_url?: string;
}

export interface WorkoutPlanExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  reps_or_duration: string;
  duration_seconds?: number;
  rest_seconds: number;
}

export interface WorkoutPlan {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  category: WorkoutCategory | 'mixed';
  target_muscles: MuscleGroup[];
  equipment: EquipmentType[];
  estimated_duration_minutes: number;
  estimated_calories: number;
  coin_reward: number;
  exercises: WorkoutPlanExercise[];
  is_custom?: boolean;
  is_featured?: boolean;
  is_favorite?: boolean;
  location?: 'home' | 'gym' | 'outdoor';
  created_at?: string;
}

export interface WorkoutBuilderPreferences {
  equipment: EquipmentType[];
  target_muscles: MuscleGroup[];
  duration_minutes: number; // 5, 10, 15, 20, 30, 45, 60
  difficulty: ExerciseDifficulty;
  category: WorkoutCategory | 'mixed';
  location: 'home' | 'gym' | 'outdoor';
  intensity: 'low' | 'moderate' | 'high';
  goal: 'stay_active' | 'build_strength' | 'improve_endurance' | 'flexibility' | 'general_fitness';
  daily_energy?: 'light' | 'normal' | 'extra_energy';
}

export interface SavedWorkout {
  id: string;
  user_id: string;
  plan: WorkoutPlan;
  is_favorite: boolean;
  saved_at: string;
}

export interface CompletedWorkoutSession {
  id: string;
  user_id: string;
  plan_id?: string;
  plan_title: string;
  started_at: string;
  completed_at: string;
  duration_seconds: number;
  exercises_completed: number;
  total_sets_completed: number;
  coins_awarded: number;
  target_muscles: MuscleGroup[];
  idempotency_key?: string;
}

