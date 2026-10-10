# MOVE2EARN Platform

> **Ubah Scrolling Sosmed Jadi Workout & Move Coins!**  
> Platform tracking olahraga berbasis Android & Next.js dengan fitur unik pemicu aktivitas fisik saat ambang batas penggunaan media sosial tercapai.

---

## 1. Arsitektur & Tech Stack

```
+-----------------------------------------------------------------------------------+
|                                  MOVE2EARN ECOSYSTEM                              |
+-----------------------------------------------------------------------------------+
|  [Android Native App]                      |  [Web Application (Next.js 14)]      |
|  - Kotlin + Jetpack Compose                |  - App Router, TypeScript            |
|  - UsageStatsManager (Foreground tracking) |  - Tailwind CSS + Lucide Icons       |
|  - Notification Manager (PendingIntent)    |  - Screen Time & Activity Dashboard  |
|  - Split-Screen Interstitial:              |  - Move Coins Wallet Ledger          |
|    • Atas: Video Panduan & Countdown       |  - Marketplace Rewards               |
|    • Bawah: CameraX Live Motion Detector   |  - My Vouchers & Admin Portal        |
+--------------------------------------------+--------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                               [Backend: Supabase]                                 |
|  - PostgreSQL 15+ with Row Level Security (RLS)                                   |
|  - Idempotent Stored Procedures (RPC):                                            |
|    • complete_workout_session (Award coins once)                                  |
|    • redeem_reward (Atomic stock & balance verification)                          |
|    • get_wallet_summary, get_dashboard_summary, upsert_screen_time_summary        |
+-----------------------------------------------------------------------------------+
```

---

## 2. Struktur Proyek

```
moveon/
├── .env.example                     # Contoh variabel lingkungan
├── ACCEPTANCE_TESTS.md              # Matriks pengujian penerimaan & hasil verifikasi
├── README.md                        # Dokumentasi utama proyek
├── supabase/
│   ├── migrations/
│   │   └── 20261010_initial_schema.sql  # Skema tabel, RLS, dan fungsi RPC atomik
│   └── seed.sql                     # Seed data tantangan olahraga & hadiah marketplace
├── move2earn-web/                   # Web Next.js App Router
│   ├── app/                         # Routes: /, /dashboard, /history, /wallet, /rewards, dll.
│   ├── components/                  # Navbar, Footer, UI components
│   ├── lib/                         # Supabase client, TypeScript types, hybrid store
│   └── package.json
└── move2earn-android/               # Aplikasi Android Native
    ├── app/
    │   ├── src/main/
    │   │   ├── AndroidManifest.xml  # UsageStats, Camera, Notification permissions
    │   │   └── java/com/example/move2earn/
    │   │       ├── data/            # UsageStatsHelper, UserPreferences, WorkoutRepository
    │   │       ├── service/         # NotificationHelper, ScreenTimeMonitorWorker
    │   │       └── ui/
    │   │           ├── onboarding/  # Penjelasan privasi & izin
    │   │           ├── dashboard/   # Monitor screentime & QA mode
    │   │           └── workout/     # Split-screen Interstitial (Video + CameraX)
    │   └── build.gradle.kts
    └── gradlew.bat
```

---

## 3. Cara Menjalankan Aplikasi Web (`move2earn-web`)

1. **Masuk ke direktori web:**
   ```bash
   cd move2earn-web
   ```
2. **Install dependensi:**
   ```bash
   npm install
   ```
3. **Konfigurasi Environment:**
   Salin `.env.example` ke `move2earn-web/.env.local`. Web app dilengkapi mode demo hybrid sehingga dapat langsung diuji secara interaktif tanpa menunggu koneksi database eksternal.
4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser di: [http://localhost:3000](http://localhost:3000)
5. **Build Produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## 4. Cara Menjalankan Aplikasi Android (`move2earn-android`)

1. **Masuk ke direktori Android:**
   ```bash
   cd move2earn-android
   ```
2. **Build Debug APK:**
   ```bash
   .\gradlew.bat assembleDebug
   ```
   File APK berhasil di-generate di:
   `app/build/outputs/apk/debug/app-debug.apk`
3. **Install ke Perangkat / Emulator:**
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 5. Fitur Unggulan Sesuai PRD

1. **Deteksi Screentime Sosmed Harian:** Membaca durasi gabungan TikTok, Instagram, dan YouTube melalui `UsageStatsManager` tanpa double counting.
2. **QA Test Mode (1–2 Menit):** Sediakan tombol toggle cepat di dashboard Android dan Web untuk memudahkan juri hackathon menguji pemicu notifikasi dalam hitungan menit tanpa harus menunggu 60 menit.
3. **Layar Terbagi Dua (Split-Screen Interstitial):**
   - **Bagian Atas (50%):** Menampilkan video/animasi panduan gerakan (Plank, Senam Peregangan, Jumping Jacks, Squats), countdown timer, dan panduan keselamatan.
   - **Bagian Bawah (50%):** Menampilkan kamera depan (CameraX) dengan deteksi gerakan optik in-memory (`✓ Gerakan Terdeteksi`) untuk memastikan pengguna benar-benar berolahraga.
4. **Pemberian Reward Idempotent:** Move Coins diberikan maksimal 1 kali per sesi valid melalui verifikasi database RPC di Supabase, mencegah kecurangan penambahan saldo berulang.
5. **Marketplace & Dompet Koin:** Tukarkan Move Coins dengan voucher e-wallet (GoPay/OVO), diskon belanja Tokopedia, dan suplemen olahraga dengan penanganan stok atomik.

---

## 6. Lisensi & Tim Pengembang
Dibuat untuk Hackathon 48 Jam MOVE2EARN 2026.
