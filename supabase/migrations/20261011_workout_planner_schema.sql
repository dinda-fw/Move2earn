-- =============================================================================
-- MOVE2EARN: WORKOUT PLANNER & EXERCISE LIBRARY SCHEMA MIGRATION
-- =============================================================================

-- 1. EXERCISES TABLE (Comprehensive Exercise Library)
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT NOT NULL,
    introduction TEXT,
    category TEXT NOT NULL CHECK (category IN ('strength', 'cardio', 'hiit', 'mobility', 'stretching', 'core', 'full_body', 'upper_body', 'lower_body')),
    primary_muscle TEXT NOT NULL,
    secondary_muscles TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{bodyweight}',
    full_video_url TEXT,
    full_video_image_url TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructions TEXT[] NOT NULL DEFAULT '{}',
    recommended_sets INTEGER NOT NULL DEFAULT 3,
    recommended_reps TEXT NOT NULL DEFAULT '10-12 reps',
    default_duration_seconds INTEGER DEFAULT 45,
    default_rest_seconds INTEGER NOT NULL DEFAULT 30,
    safety_notes TEXT,
    easier_alternative TEXT,
    harder_alternative TEXT,
    location TEXT[] DEFAULT '{home, gym, outdoor}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscle ON public.exercises(primary_muscle);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);

-- 2. WORKOUT PLANS TABLE (Preset and Custom Generated Plans)
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for global/preset plans
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category TEXT NOT NULL,
    target_muscles TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    estimated_duration_minutes INTEGER NOT NULL DEFAULT 20,
    estimated_calories INTEGER NOT NULL DEFAULT 150,
    coin_reward INTEGER NOT NULL DEFAULT 30,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. WORKOUT PLAN EXERCISES (Join table linking exercises to plans)
CREATE TABLE IF NOT EXISTS public.workout_plan_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    order_index INTEGER NOT NULL DEFAULT 1,
    sets INTEGER NOT NULL DEFAULT 3,
    reps_or_duration TEXT NOT NULL DEFAULT '12 reps',
    rest_seconds INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_plan_exercises_plan ON public.workout_plan_exercises(plan_id, order_index);

-- 4. USER SAVED WORKOUTS (User Custom Plans & Bookmarks)
CREATE TABLE IF NOT EXISTS public.user_saved_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, plan_id)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_workouts_user ON public.user_saved_workouts(user_id);

-- 5. WORKOUT EXECUTION LOGS (Extending session tracking)
CREATE TABLE IF NOT EXISTS public.user_completed_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    plan_title TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    exercises_completed INTEGER NOT NULL DEFAULT 0,
    total_sets_completed INTEGER NOT NULL DEFAULT 0,
    coins_awarded INTEGER NOT NULL DEFAULT 0,
    target_muscles TEXT[] DEFAULT '{}',
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_completed_workouts_user ON public.user_completed_workouts(user_id, completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_completed_workouts ENABLE ROW LEVEL SECURITY;

-- Public read access for exercises and global plans
CREATE POLICY "Public read exercises" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "Public read global plans" ON public.workout_plans FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Public read plan exercises" ON public.workout_plan_exercises FOR SELECT USING (true);

-- User-restricted policies
CREATE POLICY "Users manage own saved workouts" ON public.user_saved_workouts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own completed workouts" ON public.user_completed_workouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert completed workouts" ON public.user_completed_workouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
