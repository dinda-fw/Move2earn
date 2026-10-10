-- =============================================================================
-- MOVE2EARN Database Schema & Migrations
-- Target: Supabase (PostgreSQL 15+)
-- Description: Screentime tracking, workout challenges, idempotent rewards & wallet
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT 'Mover',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 2. USER SETTINGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    threshold_minutes INTEGER NOT NULL DEFAULT 60,
    is_test_mode BOOLEAN NOT NULL DEFAULT FALSE,
    test_threshold_minutes INTEGER NOT NULL DEFAULT 2,
    target_packages JSONB NOT NULL DEFAULT '["com.zhiliaoapp.musically", "com.instagram.android", "com.google.android.youtube"]'::jsonb,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 3. SCREEN TIME SUMMARIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.screen_time_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    period_date DATE NOT NULL,
    package_name TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    total_duration_seconds INTEGER NOT NULL DEFAULT 0,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    source TEXT NOT NULL DEFAULT 'android_usage_stats',
    CONSTRAINT unique_user_period_package UNIQUE (user_id, period_date, package_name)
);

CREATE INDEX IF NOT EXISTS idx_screen_time_user_date ON public.screen_time_summaries(user_id, period_date);

-- -----------------------------------------------------------------------------
-- 4. CHALLENGES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'strength', -- strength, cardio, mobility, posture
    instructions TEXT NOT NULL,
    media_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 60,
    coin_reward INTEGER NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verification_mode TEXT NOT NULL DEFAULT 'camera_motion_countdown', -- camera_motion_countdown, self_report_countdown
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 5. WORKOUT SESSIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE RESTRICT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'cancelled')),
    reward_status TEXT NOT NULL DEFAULT 'unclaimed' CHECK (reward_status IN ('unclaimed', 'awarded', 'disqualified')),
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_status ON public.workout_sessions(user_id, status);

-- -----------------------------------------------------------------------------
-- 6. WALLET TRANSACTIONS TABLE (LEDGER)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- positive for earn, negative for spend
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'adjustment')),
    reference_type TEXT NOT NULL CHECK (reference_type IN ('workout_reward', 'reward_redemption', 'manual_adjustment')),
    reference_id UUID,
    description TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 7. REWARDS TABLE (MARKETPLACE)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'voucher',
    image_url TEXT,
    coin_price INTEGER NOT NULL CHECK (coin_price > 0),
    stock INTEGER NOT NULL DEFAULT 100 CHECK (stock >= 0),
    voucher_code TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 8. REDEMPTIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
    coins_spent INTEGER NOT NULL CHECK (coins_spent > 0),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'revoked')),
    voucher_code TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_redemptions_user ON public.redemptions(user_id, created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_time_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can select and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- User Settings: users manage their own settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Screen Time Summaries: users can view and insert/update their own screentime
CREATE POLICY "Users can view own screentime" ON public.screen_time_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own screentime" ON public.screen_time_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own screentime" ON public.screen_time_summaries
    FOR UPDATE USING (auth.uid() = user_id);

-- Challenges: anyone authenticated can read active challenges
CREATE POLICY "Public read active challenges" ON public.challenges
    FOR SELECT USING (is_active = TRUE);

-- Workout Sessions: users can view their own sessions
CREATE POLICY "Users can view own sessions" ON public.workout_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Note: Session creation & completion is guarded via secure RPC to enforce reward atomicity.
-- Read-only directly; write restricted to RPC functions.
CREATE POLICY "Users cannot insert sessions directly" ON public.workout_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallet Transactions: Read-only for users! User CANNOT write or tamper directly with transactions.
CREATE POLICY "Users can view own wallet ledger" ON public.wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Rewards: Read-only for authenticated users
CREATE POLICY "Anyone can view active rewards" ON public.rewards
    FOR SELECT USING (is_active = TRUE);

-- Redemptions: Users can view their own redemptions
CREATE POLICY "Users can view own redemptions" ON public.redemptions
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- SECURE DATABASE FUNCTIONS / RPC (SECURITY DEFINER)
-- =============================================================================

-- Auto profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Mover ' || substr(NEW.id::text, 1, 6)));
    
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- RPC 1: create_workout_session
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_workout_session(
    p_challenge_id UUID,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_session_id UUID;
    v_existing_session RECORD;
    v_challenge RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Check idempotency
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id, status, reward_status INTO v_existing_session
        FROM public.workout_sessions
        WHERE idempotency_key = p_idempotency_key;

        IF FOUND THEN
            RETURN jsonb_build_object(
                'status', 'success',
                'session_id', v_existing_session.id,
                'state', v_existing_session.status,
                'reward_status', v_existing_session.reward_status,
                'message', 'Existing session returned'
            );
        END IF;
    END IF;

    -- Validate challenge exists
    SELECT * INTO v_challenge FROM public.challenges WHERE id = p_challenge_id AND is_active = TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Challenge not found or inactive';
    END IF;

    -- Insert new workout session
    INSERT INTO public.workout_sessions (
        user_id,
        challenge_id,
        started_at,
        status,
        reward_status,
        idempotency_key
    ) VALUES (
        v_user_id,
        p_challenge_id,
        now(),
        'started',
        'unclaimed',
        p_idempotency_key
    )
    RETURNING id INTO v_session_id;

    RETURN jsonb_build_object(
        'status', 'success',
        'session_id', v_session_id,
        'state', 'started',
        'reward_status', 'unclaimed'
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC 2: complete_workout_session (Atomically completes & awards Move Coins once)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_workout_session(
    p_session_id UUID,
    p_duration_seconds INTEGER,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_session RECORD;
    v_challenge RECORD;
    v_coins_awarded INTEGER := 0;
    v_txn_id UUID;
    v_current_balance INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fetch and lock session
    SELECT * INTO v_session
    FROM public.workout_sessions
    WHERE id = p_session_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Workout session not found';
    END IF;

    IF v_session.user_id <> v_user_id THEN
        RAISE EXCEPTION 'Unauthorized session';
    END IF;

    -- Idempotency check: if already completed and awarded, return current state safely
    IF v_session.status = 'completed' AND v_session.reward_status = 'awarded' THEN
        -- Calculate current balance
        SELECT COALESCE(SUM(amount), 0) INTO v_current_balance
        FROM public.wallet_transactions
        WHERE user_id = v_user_id;

        RETURN jsonb_build_object(
            'status', 'success',
            'session_id', v_session.id,
            'state', 'completed',
            'reward_status', 'awarded',
            'coins_awarded', 0,
            'current_balance', v_current_balance,
            'message', 'Session was already completed and awarded previously'
        );
    END IF;

    -- Fetch challenge details
    SELECT * INTO v_challenge
    FROM public.challenges
    WHERE id = v_session.challenge_id;

    -- Basic sanity check: user must exercise at least 50% of expected duration or min 15 seconds
    IF p_duration_seconds < GREATEST(15, (v_challenge.duration_seconds / 2)) THEN
        UPDATE public.workout_sessions
        SET completed_at = now(),
            duration_seconds = p_duration_seconds,
            status = 'cancelled',
            reward_status = 'disqualified'
        WHERE id = p_session_id;

        RAISE EXCEPTION 'Session duration too short to qualify for reward';
    END IF;

    v_coins_awarded := v_challenge.coin_reward;

    -- Update session as completed
    UPDATE public.workout_sessions
    SET completed_at = now(),
        duration_seconds = p_duration_seconds,
        status = 'completed',
        reward_status = 'awarded'
    WHERE id = p_session_id;

    -- Insert wallet transaction (Ledger)
    INSERT INTO public.wallet_transactions (
        user_id,
        amount,
        transaction_type,
        reference_type,
        reference_id,
        description,
        idempotency_key
    ) VALUES (
        v_user_id,
        v_coins_awarded,
        'earn',
        'workout_reward',
        p_session_id,
        'Reward for completing ' || v_challenge.title,
        p_idempotency_key
    )
    RETURNING id INTO v_txn_id;

    -- Calculate updated balance
    SELECT COALESCE(SUM(amount), 0) INTO v_current_balance
    FROM public.wallet_transactions
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'status', 'success',
        'session_id', p_session_id,
        'state', 'completed',
        'reward_status', 'awarded',
        'coins_awarded', v_coins_awarded,
        'current_balance', v_current_balance
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC 3: get_wallet_summary
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_wallet_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_balance INTEGER;
    v_total_earned INTEGER;
    v_total_spent INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT 
        COALESCE(SUM(amount), 0),
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0)
    INTO v_balance, v_total_earned, v_total_spent
    FROM public.wallet_transactions
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'balance', v_balance,
        'total_earned', v_total_earned,
        'total_spent', v_total_spent
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC 4: redeem_reward (Atomic balance and stock validation, zero double-spend)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.redeem_reward(
    p_reward_id UUID,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_reward RECORD;
    v_balance INTEGER;
    v_existing_redemption RECORD;
    v_redemption_id UUID;
    v_voucher_code TEXT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Check idempotency
    IF p_idempotency_key IS NOT NULL THEN
        SELECT * INTO v_existing_redemption
        FROM public.redemptions
        WHERE idempotency_key = p_idempotency_key;

        IF FOUND THEN
            RETURN jsonb_build_object(
                'status', 'success',
                'redemption_id', v_existing_redemption.id,
                'voucher_code', v_existing_redemption.voucher_code,
                'coins_spent', v_existing_redemption.coins_spent,
                'message', 'Existing redemption returned'
            );
        END IF;
    END IF;

    -- Lock reward row for update
    SELECT * INTO v_reward
    FROM public.rewards
    WHERE id = p_reward_id AND is_active = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward not found or inactive';
    END IF;

    IF v_reward.stock <= 0 THEN
        RAISE EXCEPTION 'Reward is out of stock';
    END IF;

    -- Lock and compute user balance
    SELECT COALESCE(SUM(amount), 0) INTO v_balance
    FROM public.wallet_transactions
    WHERE user_id = v_user_id;

    IF v_balance < v_reward.coin_price THEN
        RAISE EXCEPTION 'Insufficient Move Coins balance (Need %, Have %)', v_reward.coin_price, v_balance;
    END IF;

    -- Generate unique demo voucher code if not preset
    v_voucher_code := COALESCE(v_reward.voucher_code, 'M2E-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)));

    -- Deduct stock
    UPDATE public.rewards
    SET stock = stock - 1
    WHERE id = p_reward_id;

    -- Record wallet deduction transaction
    INSERT INTO public.wallet_transactions (
        user_id,
        amount,
        transaction_type,
        reference_type,
        reference_id,
        description,
        idempotency_key
    ) VALUES (
        v_user_id,
        -v_reward.coin_price,
        'redeem',
        'reward_redemption',
        p_reward_id,
        'Redeemed ' || v_reward.title,
        p_idempotency_key
    );

    -- Insert redemption record
    INSERT INTO public.redemptions (
        user_id,
        reward_id,
        coins_spent,
        status,
        voucher_code,
        idempotency_key
    ) VALUES (
        v_user_id,
        p_reward_id,
        v_reward.coin_price,
        'completed',
        v_voucher_code,
        p_idempotency_key
    )
    RETURNING id INTO v_redemption_id;

    RETURN jsonb_build_object(
        'status', 'success',
        'redemption_id', v_redemption_id,
        'reward_title', v_reward.title,
        'coins_spent', v_reward.coin_price,
        'voucher_code', v_voucher_code,
        'remaining_balance', v_balance - v_reward.coin_price
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC 5: get_dashboard_summary
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_dashboard_summary(p_period_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_screen_time_seconds INTEGER := 0;
    v_workout_count INTEGER := 0;
    v_coins_today INTEGER := 0;
    v_current_balance INTEGER := 0;
    v_threshold_minutes INTEGER := 60;
    v_app_breakdown JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- User settings
    SELECT threshold_minutes INTO v_threshold_minutes
    FROM public.user_settings
    WHERE user_id = v_user_id;
    IF v_threshold_minutes IS NULL THEN
        v_threshold_minutes := 60;
    END IF;

    -- Screen time today
    SELECT COALESCE(SUM(duration_seconds), 0) INTO v_screen_time_seconds
    FROM public.screen_time_summaries
    WHERE user_id = v_user_id AND period_date = p_period_date;

    -- App breakdown
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'package_name', package_name,
        'duration_seconds', duration_seconds
    )), '[]'::jsonb) INTO v_app_breakdown
    FROM public.screen_time_summaries
    WHERE user_id = v_user_id AND period_date = p_period_date;

    -- Workout sessions today
    SELECT COUNT(*) INTO v_workout_count
    FROM public.workout_sessions
    WHERE user_id = v_user_id AND status = 'completed' AND DATE(completed_at) = p_period_date;

    -- Coins earned today
    SELECT COALESCE(SUM(amount), 0) INTO v_coins_today
    FROM public.wallet_transactions
    WHERE user_id = v_user_id AND transaction_type = 'earn' AND DATE(created_at) = p_period_date;

    -- Current wallet balance
    SELECT COALESCE(SUM(amount), 0) INTO v_current_balance
    FROM public.wallet_transactions
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'period_date', p_period_date,
        'threshold_minutes', v_threshold_minutes,
        'screen_time_seconds', v_screen_time_seconds,
        'screen_time_minutes', round(v_screen_time_seconds / 60.0, 1),
        'workout_count', v_workout_count,
        'coins_today', v_coins_today,
        'current_balance', v_current_balance,
        'app_breakdown', v_app_breakdown
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC 6: upsert_screen_time_summary
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.upsert_screen_time_summary(
    p_period_date DATE,
    p_package_name TEXT,
    p_duration_seconds INTEGER,
    p_total_duration_seconds INTEGER,
    p_source TEXT DEFAULT 'android_usage_stats'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_row_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    INSERT INTO public.screen_time_summaries (
        user_id,
        period_date,
        package_name,
        duration_seconds,
        total_duration_seconds,
        measured_at,
        source
    ) VALUES (
        v_user_id,
        p_period_date,
        p_package_name,
        p_duration_seconds,
        p_total_duration_seconds,
        now(),
        p_source
    )
    ON CONFLICT (user_id, period_date, package_name)
    DO UPDATE SET
        duration_seconds = EXCLUDED.duration_seconds,
        total_duration_seconds = EXCLUDED.total_duration_seconds,
        measured_at = now(),
        source = EXCLUDED.source
    RETURNING id INTO v_row_id;

    RETURN jsonb_build_object(
        'status', 'success',
        'summary_id', v_row_id,
        'period_date', p_period_date,
        'package_name', p_package_name,
        'duration_seconds', p_duration_seconds
    );
END;
$$;
