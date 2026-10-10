export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
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
