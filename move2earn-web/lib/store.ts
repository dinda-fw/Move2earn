import { 
  Challenge, 
  Reward, 
  WalletTransaction, 
  Redemption, 
  DashboardSummary,
  ActivitySummary,
  WorkoutSession,
  ScreenTimeSummary,
  UserProfile
} from './types';
import { supabase, isSupabaseConfigured } from './supabase';

// Initial Mock Seed Data (Mirrors database seed.sql)
const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    title: 'Core Plank Power 60s',
    category: 'strength',
    instructions: 'Tahan posisi plank selama 60 detik. Posisikan siku sejajar bahu, jaga punggung tetap lurus, dan kencangkan otot perut.',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-planks-in-a-gym-42998-large.mp4',
    duration_seconds: 60,
    coin_reward: 25,
    is_active: true,
    verification_mode: 'camera_motion_countdown'
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    title: 'Senam Peregangan Anti-Pegal 90s',
    category: 'mobility',
    instructions: 'Ikuti gerakan senam peregangan leher, bahu, dan punggung untuk memulihkan postur setelah menatap layar ponsel terlalu lama.',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-stretching-exercises-before-exercising-42999-large.mp4',
    duration_seconds: 90,
    coin_reward: 20,
    is_active: true,
    verification_mode: 'camera_motion_countdown'
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    title: 'Jumping Jacks Cardio Burst 45s',
    category: 'cardio',
    instructions: 'Lompat dan buka kaki selebar bahu sambil mengangkat kedua tangan ke atas kepala. Bakar kalori dan segarkan pikiran dari doom-scrolling!',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-doing-jumping-jacks-in-a-gym-43003-large.mp4',
    duration_seconds: 45,
    coin_reward: 15,
    is_active: true,
    verification_mode: 'camera_motion_countdown'
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    title: 'Deep Bodyweight Squats 60s',
    category: 'strength',
    instructions: 'Lakukan squat teratur selama 60 detik dengan ritme stabil. Punggung tegak, dorong pinggul ke belakang seperti hendak duduk di kursi.',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-deep-squats-in-a-gym-43001-large.mp4',
    duration_seconds: 60,
    coin_reward: 30,
    is_active: true,
    verification_mode: 'camera_motion_countdown'
  }
];

const DEFAULT_REWARDS: Reward[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    title: 'GoPay / OVO Rp 5.000 Balance',
    description: 'Saldo dompet digital Rp 25.000 langsung ditransfer atau gunakan kode voucher.',
    category: 'digital_wallet',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    coin_price: 50,
    stock: 24,
    voucher_code: 'M2E-GOPAY5K',
    is_demo: true,
    is_active: true
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    title: 'Tokopedia Voucher Rp 5.000',
    description: 'Potongan belanja Rp 5.000 tanpa minimum transaksi untuk kategori kebutuhan harian.',
    category: 'voucher',
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
    coin_price: 90,
    stock: 14,
    voucher_code: 'M2E-TKPD5K',
    is_demo: true,
    is_active: true
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    title: 'Whey Protein Sachet Single Pack',
    description: 'Sachet premium whey protein isolat 25g protein untuk pemulihan otot instan.',
    category: 'nutrition',
    image_url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=600&q=80',
    coin_price: 35,
    stock: 48,
    voucher_code: 'M2E-PROTEIN',
    is_demo: true,
    is_active: true
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    title: 'Move2Earn Premium Shaker Bottle 700ml',
    description: 'Botol shaker BPA-free anti-bocor dengan stainless steel mixing ball.',
    category: 'merchandise',
    image_url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    coin_price: 120,
    stock: 8,
    voucher_code: 'M2E-SHAKER',
    is_demo: true,
    is_active: true
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    title: 'Spotify Premium 1 Bulan',
    description: 'Langganan Spotify Premium 1 bulan untuk mendengarkan workout beat tanpa iklan.',
    category: 'entertainment',
    image_url: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=600&q=80',
    coin_price: 75,
    stock: 19,
    voucher_code: 'M2E-SPOTIFY1M',
    is_demo: true,
    is_active: true
  }
];

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    user_id: 'demo-user-id',
    amount: 25,
    transaction_type: 'earn',
    reference_type: 'workout_reward',
    description: 'Reward for completing Core Plank Power 60s',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'tx-2',
    user_id: 'user-id',
    amount: 30,
    transaction_type: 'earn',
    reference_type: 'workout_reward',
    description: 'Reward for completing Deep Bodyweight Squats 60s',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'tx-3',
    user_id: 'user-id',
    amount: 20,
    transaction_type: 'earn',
    reference_type: 'workout_reward',
    description: 'Reward for completing Senam Peregangan Anti-Pegal 90s',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

const STORAGE_KEYS = {
  BALANCE: 'm2e_balance',
  TRANSACTIONS: 'm2e_transactions',
  REWARDS: 'm2e_rewards',
  REDEMPTIONS: 'm2e_redemptions',
  SESSIONS: 'm2e_sessions',
  SCREENTIME: 'm2e_screentime',
  PROFILE: 'm2e_user_profile',
};

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Fajar',
  email: 'fajardindawati@gmail.com',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  fitness_level: 'Beginner',
  daily_goal_minutes: 35,
  is_logged_in: true,
  member_since: 'Oktober 2026',
  tier: 'MoveIt Pro 👑',
  height_cm: 172,
  weight_kg: 68,
  phone_number: '+62 812-3456-7890'
};

// Client-side local storage helper for demo persistence across page reloads
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
  } catch {
    // ignore
  }
}

export const Move2EarnStore = {
  getChallenges(): Challenge[] {
    return DEFAULT_CHALLENGES;
  },

  getRewards(): Reward[] {
    return getStored<Reward[]>(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS);
  },

  getRewardById(id: string): Reward | undefined {
    const list = this.getRewards();
    return list.find(r => r.id === id);
  },

  getWalletSummary(): { balance: number; totalEarned: number; totalSpent: number } {
    const txs = this.getTransactions();
    let totalEarned = 0;
    let totalSpent = 0;
    for (const tx of txs) {
      if (tx.amount > 0) totalEarned += tx.amount;
      else totalSpent += Math.abs(tx.amount);
    }
    const balance = totalEarned - totalSpent;
    return { balance, totalEarned, totalSpent };
  },

  getTransactions(): WalletTransaction[] {
    return getStored<WalletTransaction[]>(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
  },

  getRedemptions(): Redemption[] {
    return getStored<Redemption[]>(STORAGE_KEYS.REDEMPTIONS, []);
  },

  getDashboardSummary(): DashboardSummary {
    const { balance } = this.getWalletSummary();
    const sessions = getStored<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = sessions.filter(s => s.status === 'completed' && s.completed_at?.startsWith(today)).length;
    
    // Screentime mock or sync
    const screentimeData = getStored(STORAGE_KEYS.SCREENTIME, [
      { package_name: 'com.zhiliaoapp.musically', duration_seconds: 2340 }, // TikTok: 39m
      { package_name: 'com.instagram.android', duration_seconds: 1560 }, // IG: 26m
      { package_name: 'com.google.android.youtube', duration_seconds: 780 }, // YT: 13m
    ]);

    const totalSeconds = screentimeData.reduce((acc: number, cur: any) => acc + cur.duration_seconds, 0);

    return {
      period_date: today,
      threshold_minutes: 60,
      screen_time_seconds: totalSeconds,
      screen_time_minutes: Math.round((totalSeconds / 60) * 10) / 10,
      workout_count: Math.max(todayWorkouts, 2),
      coins_today: 45,
      current_balance: balance,
      app_breakdown: screentimeData
    };
  },

  getActivitySummary(): ActivitySummary {
    return {
      daily_goal_minutes: 35,
      active_minutes: 24,
      daily_goal_percent: 68,
      screen_time_saved_minutes: 80, // 1h 20m
      calories_burned: 245,
      steps_count: 3200,
      workout_sessions_count: 4,
      day_streak: 7,
      this_week: [
        { day: 'Mon', minutes: 20 },
        { day: 'Tue', minutes: 30 },
        { day: 'Wed', minutes: 25 },
        { day: 'Thu', minutes: 35, active: true },
        { day: 'Fri', minutes: 20 },
        { day: 'Sat', minutes: 28 },
        { day: 'Sun', minutes: 15 },
      ],
      today_hourly_screentime: [
        { hour: '6', minutes: 10 },
        { hour: '9', minutes: 18 },
        { hour: '12', minutes: 28, active: true },
        { hour: '15', minutes: 12 },
        { hour: '18', minutes: 8 },
        { hour: '21', minutes: 4 },
      ],
      recent_sessions: [
        {
          id: 'ws-1',
          title: 'Full Body Move',
          duration_minutes: 10,
          calories: 120,
          coins: 50,
          time: 'Today, 10:24',
          status: 'verified'
        },
        {
          id: 'ws-2',
          title: 'Jumping Jacks',
          duration_minutes: 3,
          calories: 40,
          coins: 15,
          time: 'Today, 14:20',
          status: 'verified'
        },
        {
          id: 'ws-3',
          title: 'Squat Challenge',
          duration_minutes: 5,
          calories: 60,
          coins: 20,
          time: 'Today, 10:05',
          status: 'verified'
        },
        {
          id: 'ws-4',
          title: 'Stretching & Mobility',
          duration_minutes: 5,
          calories: 35,
          coins: 15,
          time: 'Today, 08:12',
          status: 'verified'
        }
      ]
    };
  },

  redeemReward(rewardId: string, idempotencyKey: string = `m2e-redeem-${Date.now()}`): {
    success: boolean;
    error?: string;
    redemption?: Redemption;
  } {
    const rewards = this.getRewards();
    const rewardIndex = rewards.findIndex(r => r.id === rewardId);
    if (rewardIndex === -1) {
      return { success: false, error: 'Reward tidak ditemukan.' };
    }

    const reward = rewards[rewardIndex];
    if (reward.stock <= 0) {
      return { success: false, error: 'Stok reward habis!' };
    }

    const { balance } = this.getWalletSummary();
    if (balance < reward.coin_price) {
      return { 
        success: false, 
        error: `Saldo Move Coins tidak mencukupi (Perlu ${reward.coin_price}, Memiliki ${balance}). Lakukan workout terlebih dahulu!` 
      };
    }

    // Check existing idempotency
    const redemptions = this.getRedemptions();
    const existing = redemptions.find(r => r.idempotency_key === idempotencyKey);
    if (existing) {
      return { success: true, redemption: existing };
    }

    // Generate Voucher
    const voucherCode = reward.voucher_code || `M2E-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Deduct stock
    rewards[rewardIndex].stock -= 1;
    setStored(STORAGE_KEYS.REWARDS, rewards);

    // Record wallet deduction transaction
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      user_id: 'demo-user-id',
      amount: -reward.coin_price,
      transaction_type: 'redeem',
      reference_type: 'reward_redemption',
      reference_id: reward.id,
      description: `Redeemed ${reward.title}`,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString()
    };
    const txs = this.getTransactions();
    txs.unshift(newTx);
    setStored(STORAGE_KEYS.TRANSACTIONS, txs);

    // Record redemption
    const newRedemption: Redemption = {
      id: `red-${Date.now()}`,
      user_id: 'demo-user-id',
      reward_id: reward.id,
      coins_spent: reward.coin_price,
      status: 'completed',
      voucher_code: voucherCode,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
      reward
    };
    redemptions.unshift(newRedemption);
    setStored(STORAGE_KEYS.REDEMPTIONS, redemptions);

    return { success: true, redemption: newRedemption };
  },

  completeWorkout(challengeId: string, durationSeconds: number): {
    success: boolean;
    coinsAwarded: number;
    challengeTitle: string;
  } {
    const challenge = DEFAULT_CHALLENGES.find(c => c.id === challengeId) || DEFAULT_CHALLENGES[0];
    const coinsAwarded = challenge.coin_reward;

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      user_id: 'demo-user-id',
      amount: coinsAwarded,
      transaction_type: 'earn',
      reference_type: 'workout_reward',
      reference_id: challenge.id,
      description: `Completed ${challenge.title}`,
      created_at: new Date().toISOString()
    };

    const txs = this.getTransactions();
    txs.unshift(newTx);
    setStored(STORAGE_KEYS.TRANSACTIONS, txs);

    const sessions = getStored<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
    sessions.unshift({
      id: `session-${Date.now()}`,
      user_id: 'demo-user-id',
      challenge_id: challenge.id,
      started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      status: 'completed',
      reward_status: 'awarded',
      challenge
    });
    setStored(STORAGE_KEYS.SESSIONS, sessions);

    return {
      success: true,
      coinsAwarded,
      challengeTitle: challenge.title
    };
  },

  updateRewardStock(rewardId: string, newStock: number, newPrice: number): boolean {
    const rewards = this.getRewards();
    const idx = rewards.findIndex(r => r.id === rewardId);
    if (idx !== -1) {
      rewards[idx].stock = newStock;
      rewards[idx].coin_price = newPrice;
      setStored(STORAGE_KEYS.REWARDS, rewards);
      return true;
    }
    return false;
  },

  addMoveCoins(amount: number, description: string = 'Move Coins Bonus'): { success: boolean; newBalance: number } {
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      user_id: 'demo-user-id',
      amount,
      transaction_type: 'earn',
      reference_type: 'manual_adjustment',
      description,
      created_at: new Date().toISOString()
    };
    const txs = this.getTransactions();
    txs.unshift(newTx);
    setStored(STORAGE_KEYS.TRANSACTIONS, txs);
    return { success: true, newBalance: this.getWalletSummary().balance };
  },

  getUserProfile(): UserProfile {
    return getStored<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_USER_PROFILE);
  },

  updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.PROFILE, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    return updated;
  },

  loginUser(email: string, name?: string): UserProfile {
    const current = this.getUserProfile();
    const updated: UserProfile = {
      ...current,
      email,
      name: name || current.name || 'fajar',
      is_logged_in: true
    };
    setStored(STORAGE_KEYS.PROFILE, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    return updated;
  },

  logoutUser(): UserProfile {
    const current = this.getUserProfile();
    const updated: UserProfile = {
      ...current,
      is_logged_in: false
    };
    setStored(STORAGE_KEYS.PROFILE, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    return updated;
  }
};
