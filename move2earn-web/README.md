# MOVE2EARN Web Application

A modern Next.js App Router web application providing the daily screen time dashboard, Move Coins wallet ledger, rewards marketplace, redemption voucher viewer, and administrative portal.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Backend / Database:** Supabase (PostgreSQL 15+, RLS, Idempotent RPC Functions)
- **Store Mode:** Hybrid Supabase Client + Client-side Fallback Store for offline demo evaluation.

## Key Features & Routes
- `/`: Product landing page explaining the split-screen workout and value proposition.
- `/dashboard`: Daily combined screen time analytics, target apps breakdown (TikTok, Instagram, YouTube), QA threshold test toggle (2-min mode vs 60-min mode), streak tracker, and split-screen workout interstitial preview.
- `/history`: Audit log of workout sessions and screentime evaluations.
- `/wallet`: Current Move Coins balance, lifetime earnings, total redemptions, and immutable transaction ledger.
- `/rewards`: Marketplace catalog with stock checks, category filters, and demo tags.
- `/rewards/[id]`: Product details with atomic confirmation dialog and instant voucher code generator.
- `/redemptions`: List of redeemed vouchers with one-click copy buttons.
- `/admin`: Management portal for challenges and live reward stock/pricing adjustments.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env.local` or set:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ENABLE_DEMO_MODE=true
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production build:**
   ```bash
   npm run build
   npm run start
   ```
