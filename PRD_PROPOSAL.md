# PRODUCT REQUIREMENT DOCUMENT (PRD)
# MOVE2EARN: Smart Workout Tracking, Equipment-Based Planning & MoveIt Intervention Platform

| Dokumen | Spesifikasi Produk & Proposal Bisnis |
| :--- | :--- |
| **Nama Produk** | **MOVE2EARN (M2E)** |
| **Kategori Produk** | **Daily Workout Tracking & Smart Fitness Planning Platform** |
| **Versi Dokumen** | **v3.0 (Revised Core Architecture & Proposal Edition)** |
| **Tanggal Rilis** | **Oktober 2026** |
| **Status** | **Siap Diajukan (Proposal Bisnis, Pitch Deck, & Hibah)** |
| **Tech Stack Utama** | Android (Kotlin, Jetpack Compose, CameraX), Next.js 14, Supabase (PostgreSQL, RLS, RPC) |

---

## 1. Ringkasan Eksekutif (Executive Summary)

**MOVE2EARN** adalah platform pelacak dan perencana kebugaran harian (**Daily Workout Tracking & Smart Planning Platform**) yang dirancang untuk menjawab dua alasan terbesar mengapa orang gagal berolahraga: **kebingungan memilih menu latihan yang sesuai dengan alat yang ada di sekitarnya**, dan **sulitnya mempertahankan konsistensi akibat waktu yang tersita oleh kebiasaan scrolling media sosial**.

### Fondasi Produk:
1. **FITUR UTAMA (BASE PLATFORM):**
   - **Smart Daily Workout Planning (Inspirasi *workout.cool*):** Membantu pengguna menjawab pertanyaan *"Mau olahraga apa hari ini?"* secara instan. Pengguna cukup memilih target otot tubuh yang ingin dilatih dan menandai perlengkapan apa pun yang ada di sekitar mereka (tanpa alat/*bodyweight*, dumbbell, resistance band, kursi, matras, botol air, dll). Sistem secara otomatis menghasilkan modul latihan terstruktur lengkap dengan panduan visual.
   - **Comprehensive Daily Movement & Workout Tracking:** Melacak dan mencatat secara presisi seluruh aktivitas olahraga harian: sudah bergerak apa saja hari ini, jenis latihan yang dilakukan, repetisi, durasi efektif, kalori terbakar, dan konsistensi *streak*. Pelacakan ini divalidasi langsung oleh kamera ponsel (*computer vision*) untuk memastikan pengguna benar-benar bergerak aktif.
   - **Move-to-Earn (M2E) Reward Economy:** Setiap keringat dan gerakan tervalidasi dikonversi menjadi **Move Coins** yang dapat ditukarkan dengan hadiah bernilai nyata: voucher membership/tiket harian gym lokal, makanan dan minuman sehat (*healthy food, clean catering, cold-pressed juice*) dari mitra UMKM lokal, serta perlengkapan olahraga.

2. **FITUR PEMBEDA REVOLUSIONER (UNIQUE SELLING PROPOSITION / KILLER FEATURE):**
   - **"MoveIt" Time-Blocking Interstitial:** Pembeda radikal yang tidak dimiliki oleh aplikasi fitness manapun di pasar. Saat pengguna terjebak *doom-scrolling* di media sosial (TikTok, Instagram, YouTube) hingga mencapai ambang batas harian (misal: 60 menit), aplikasi secara aktif **memblokir dan membekukan (*freeze*) layar ponsel**. Layar menampilkan antarmuka *split-screen*:
     - **Layar Atas (50%):** Memutar video panduan gerakan mikro (plank, senam peregangan, calisthenics) dengan countdown timer.
     - **Layar Bawah (50%):** Mengaktifkan kamera depan untuk memvalidasi gerakan fisik pengguna.
     - **Hasil:** Layar ponsel hanya akan terbuka kembali setelah pengguna menuntaskan gerakan tersebut. Waktu pasif di sosmed dipaksa menjadi waktu olahraga aktif!

---

## 2. Latar Belakang & Analisis Masalah (Problem Statement)

```
+-------------------------------------------------------------------------------------------------+
|                              MASALAH: DISKONEKSI NIAT VS AKSI OLAHRAGA                          |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   [ Ingin Olahraga Tapi Bingung ] ──► Tidak Tahu Mau Latihan Apa dengan Alat Sekitar            |
|                                                                                                 |
|   [ Tracking Biasa Sering Curang ] ──► Aplikasi Biasa Hanya Mengandalkan Timer Pasif / Manual    |
|                                                                                                 |
|   [ Waktu Habis untuk Scrolling ] ──► Rata-rata 3-5 Jam Scrolling Sosmed; Pengingat Diabaikan   |
|                                                                                                 |
|   [ Kurangnya Reward Nyata ]      ──► Gamifikasi Badge Virtual Kurang Memotivasi Pengguna       |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

### 2.1. Masalah yang Dihadapi Pengguna
1. **Kebingungan *"Mau Olahraga Apa Hari Ini?"* & Hambatan Fasilitas:**
   - Sebagian besar orang yang ingin memulai olahraga di rumah atau kantor merasa bingung memilih gerakan yang aman dan efektif.
   - Aplikasi fitness konvensional umumnya kaku: mengharuskan pengguna berada di gym dengan alat lengkap atau mewajibkan langganan program berbayar yang rumit.
   - Padahal, banyak orang memiliki perlengkapan sederhana di kamarnya (sepasang dumbbell, resistance band, atau sekadar kursi dan lantai), namun tidak tahu variasi gerakan apa saja yang bisa dieksekusi dengan aman.
2. **Ketiadaan Pelacakan yang Akurat & Terverifikasi (Tracking Issue):**
   - Aplikasi workout rumahan saat ini umumnya hanya mengandalkan *timer stopwatch pasif*. Pengguna bisa menyalakan aplikasi, meninggalkannya di meja sambil menonton TV, lalu menekan "Selesai" untuk mendapatkan poin palsu.
   - Tidak ada validasi objektif apakah pengguna benar-benar bergerak atau tidak.
3. **Alasan "Tidak Punya Waktu" Akibat Terjebak *Doom-Scrolling*:**
   - Alasan paling umum orang tidak berolahraga adalah *"saya terlalu sibuk dan tidak punya waktu"*.
   - Kenyataannya, data menunjukkan rata-rata pengguna menghabiskan 3–5 jam per hari untuk *doom-scrolling* di TikTok, Instagram Reels, dan YouTube Shorts.
   - Fitur pengingat screen-time bawaan (seperti Android Digital Wellbeing / Apple Screen Time) **terbukti gagal total**: pengguna cukup menekan tombol *"Dismiss / Ignore"* dalam 1 detik tanpa beban mental, lalu melanjutkan scrolling berjam-jam.
4. **Kurangnya Insentif Riil untuk Membentuk Kebiasaan:**
   - Motivasi intrinsik seringkali memudar setelah 1–2 minggu. Hadiah virtual seperti medali atau badge digital tidak memberikan dampak nyata bagi gaya hidup sehari-hari pengguna.

---

## 3. Posisi Produk & Unique Value Proposition (UVP)

MOVE2EARN memosisikan diri sebagai **Platform Tracking & Planning Olahraga Cerdas** yang diperkuat oleh senjata pemicu perilaku (*behavioral trigger*) otomatis.

```
+-------------------------------------------------------------------------------------------------+
|                                  STRUKTUR NILAI PRODUK MOVE2EARN                                |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   |
|   │                         CORE ENGINE: TRACKING & SMART PLANNING                          │   |
|   │  • Tracking Lengkap: Riwayat gerak hari ini, durasi, repetisi, kalori, streak           │   |
|   │  • Smart Planner (workout.cool style): Filter otot target + alat yang ada di sekitar    │   |
|   │  • Validasi Kamera: Memastikan olahraga benar-benar dilakukan (Anti-Cheat)              │   |
|   │  • Move-to-Earn: Keringat dikonversi jadi Move Coins untuk reward UMKM lokal            │   |
|   └─────────────────────────────────────────────────────────────────────────────────────────┘   |
|                                                ▲                                                |
|                                                │ Diperkuat oleh                                 |
|   ┌────────────────────────────────────────────┴────────────────────────────────────────────┐   |
|   │                 KILLER FEATURE (PEMBEDA UTAMA): "MOVEIT" TIME-BLOCKING                  │   |
|   │  • Mendeteksi batas 60 menit scrolling sosmed pasif (TikTok/IG/YouTube)                 │   |
|   │  • Membekukan layar ponsel & memunculkan Split-Screen Interstitial                      │   |
|   │  • Memaksa gerakan mikro tuntas sebelum akses ponsel dapat dilanjutkan                  │   |
|   └─────────────────────────────────────────────────────────────────────────────────────────┘   |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

### Matriks Perbandingan dengan Solusi Eksisting

| Fitur / Parameter | Aplikasi Fitness Biasa (Nike Training / Freeletics) | Aplikasi Screen Time (Forest / Opal / Wellbeing) | **MOVE2EARN (M2E)** |
| :--- | :--- | :--- | :--- |
| **Kategori Utama** | Workout Tracker | Screen-Time Blocker | **Workout Tracker & Smart Planner** |
| **Perencanaan Berbasis Alat Sekitar** | Jarang / Harus ikuti paket latihan panjang | Tidak ada | **Dinamis & Fleksibel (Pilih otot + alat sekitar ala workout.cool)** |
| **Pencatatan Aktivitas (Tracking)** | Manual klik selesai / Timer pasif | Hanya durasi fokus | **Tracking harian tervalidasi kamera (Computer Vision)** |
| **Penanganan Masalah Scrolling** | Tidak ada (pasif menunggu user buka app) | Blokir pasif / notifikasi teks mudah diabaikan | **"MoveIt" Time-Blocking: Layar di-freeze, wajib gerak split-screen** |
| **Sistem Hadiah (Rewards)** | Badge virtual digital | Pohon virtual tumbuh | **Move Coins dapat ditukar voucher gym & healthy food UMKM lokal** |
| **Validasi Keaslian Olahraga** | Tidak ada validasi | Tidak ada | **Kamera On-Device (Luminance motion analyzer)** |

---

## 4. Target Pengguna (User Personas)

### Persona 1: Rian (24 Tahun, Fresh Graduate / Digital Native)
- **Profil:** Sangat aktif di media sosial, menghabiskan 4+ jam sehari scrolling konten video pendek.
- **Masalah:** Ingin mulai berolahraga tapi tidak tahu harus mulai dari mana saat berada di kamar kos. Hanya punya sepasang dumbbell 3 kg dan matras. Sering menunda olahraga karena keasyikan scrolling.
- **Kebutuhan:** Fitur planner yang bisa langsung menyusun latihan menggunakan dumbbell di kosnya, serta pengingat tegas yang memutus siklus scrolling-nya.

### Persona 2: Dita (29 Tahun, Pekerja Kantoran / WFH)
- **Profil:** Menghabiskan 8–9 jam sehari di depan meja kerja. Sering mengalami pegal leher, bahu kaku, dan postur bungkuk.
- **Masalah:** Merasa tidak punya waktu ke gym. Di sela jam kerja sering scrolling sosmed tanpa sadar hingga 1 jam lebih.
- **Kebutuhan:** Tracking olahraga harian untuk memantau apakah tubuhnya sudah cukup bergerak hari ini, menu latihan peregangan cepat tanpa alat (bodyweight), dan insentif voucher makanan sehat (salad/katering sehat) di dekat kantor.

---

## 5. Spesifikasi Fitur Lengkap

### 5.1. FITUR UTAMA 1: Tracking Olahraga & Riwayat Gerak Harian (Core Tracking Engine)
Fitur utama yang mencatat dan memantau seluruh aktivitas fisik yang dilakukan pengguna:
1. **Dasbor Ringkasan Harian (Daily Movement Overview):**
   - Menampilkan metrik utama dalam satu tampilan:
     - **Sudah Gerak Apa Aja Hari Ini:** Daftar jenis latihan yang telah diselesaikan (misal: *Plank 60s*, *Dumbbell Bicep Curl 3 set*, *Senam Peregangan Leher 90s*).
     - **Total Durasi Aktif:** Menghitung menit olahraga efektif hari ini.
     - **Estimasi Kalori:** Kalori terbakar berdasarkan jenis dan durasi gerakan.
     - **Aktivitas Streak:** Penghitung konsistensi latihan berturut-turut (*Daily Streak Counter*).
2. **Validasi Gerakan Berbasis Kamera (Computer Vision Tracking):**
   - Pelacakan olahraga tidak sekadar mengandalkan timer pasif.
   - Antarmuka latihan memanfaatkan kamera depan (*CameraX ImageAnalysis*) untuk mendeteksi apakah tubuh pengguna benar-benar melakukan pergerakan.
   - Terdapat indikator langsung **`✓ Gerakan Terdeteksi`** yang menjamin keaslian data aktivitas.
3. **Audit Log & Histori Latihan (`/history`):**
   - Rekam jejak kronologis setiap sesi olahraga yang pernah diselesaikan, dilengkapi tanggal, jenis latihan, durasi terverifikasi, dan perolehan koin.

---

### 5.2. FITUR UTAMA 2: Smart Daily Workout Planner & Equipment Selector (Inspirasi *workout.cool*)
Fitur cerdas yang memandu pengguna merencanakan menu latihan terbaik hari ini dengan memanfaatkan apa pun yang ada di sekitar mereka:
1. **Pemilihan Target Otot Interaktif (Target Muscle Selector):**
   - Diagram anatomi visual interaktif tubuh manusia di mana pengguna dapat memilih fokus latihan:
     - **Full Body** (Kebugaran Menyeluruh)
     - **Chest & Shoulders** (Dada & Bahu)
     - **Back & Posture** (Punggung & Perbaikan Postur)
     - **Core & Abs** (Otot Perut & Stabilitas)
     - **Legs & Glutes** (Kaki & Paha)
     - **Arms** (Biceps & Triceps)
     - **Mobility & Anti-Stiff Neck** (Peregangan Leher & Punggung untuk pengguna gadget)
2. **Filter Perlengkapan di Sekitar (Equipment Available in Your Room):**
   - Pengguna menandai perlengkapan yang saat itu ada di dekat mereka:
     - ☑ **Tanpa Alat (Bodyweight):** Push-up, plank, squats, jumping jacks, lunges.
     - ☑ **Dumbbell / Barbel Ringan:** Bicep curls, shoulder press, goblet squats, bent-over rows.
     - ☑ **Resistance Band:** Band pull-aparts, lateral walks, band curls.
     - ☑ **Kursi / Perabot Rumah:** Chair dips, incline push-ups, step-ups.
     - ☑ **Matras Yoga / Lantai:** Cat-cow stretch, bird-dog, cobra pose, floor crunches.
     - ☑ **Botol Air Minum:** Alternatif beban ringan saat tidak ada dumbbell.
3. **Generator Modul Latihan Instan (Instant Workout Generator):**
   - Sistem mencocokkan target otot dan alat yang dipilih, lalu langsung menyusun modul latihan 3–7 menit yang realistis dan siap dieksekusi.
   - Setiap gerakan dilengkapi demonstrasi video visual, instruksi postur yang aman, dan jumlah repetisi/durasi yang disarankan.
   - Pengguna cukup menekan tombol *"Mulai Latihan"* untuk langsung masuk ke sesi latihan tervalidasi kamera.

---

### 5.3. FITUR UTAMA 3: Move-to-Earn (M2E) Reward Economy & Kemitraan UMKM
Mengubah usaha fisik pengguna menjadi nilai ekonomi nyata yang mendorong kebiasaan hidup sehat:
1. **Move Coins Wallet & Ledger:**
   - Dompet digital internal untuk menampung Move Coins yang didapatkan dari penyelesaian modul latihan atau intervensi *MoveIt*.
   - Dicatat dalam buku besar (*immutable ledger*) di Supabase dengan proteksi idempotensi (tidak ada celah duplikasi koin).
2. **Marketplace Kemitraan UMKM & Gym Lokal:**
   - **Voucher Gym & Studio Kebugaran:** Tiket masuk harian (*gym day pass*), voucher kelas yoga/pilates, atau diskon membership di gym lokal terdekat.
   - **Voucher Makanan & Minuman Sehat UMKM:** Diskon menu salad bar, katering makanan sehat berkalori terukur (*clean catering*), jus buah/sayur *cold-pressed*, dan *healthy smoothies bowl* dari UMKM lokal.
   - **Suplemen & Produk Olahraga:** Sachet whey protein isolat, botol shaker BPA-free Move2Earn, tali resistance band.
3. **Mekanisme Penukaran Atomik:**
   - Pengguna memilih voucher, sistem memverifikasi saldo dan stok secara atomik di database, dan langsung menerbitkan **Kode Voucher Unik** yang dapat disalin dan digunakan di outlet mitra UMKM fisik.

---

### 5.4. FITUR PEMBEDA (USP / KILLER FEATURE): "MoveIt" Time-Blocking Interstitial
Senjata pemicu otomatis yang membedakan MOVE2EARN dari semua aplikasi fitness di dunia:
1. **Pemantauan Screen Time Latar Belakang Tanpa Intrusif:**
   - Layanan Android membaca durasi penggunaan aktif media sosial target (TikTok, Instagram, YouTube) secara hemat daya menggunakan `UsageStatsManager`.
   - **Privasi Terjamin:** Hanya membaca interval durasi aplikasi target; sama sekali tidak membaca obrolan pribadi, kata sandi, konten postingan, atau data privat pengguna.
2. **Pemicu Ambang Batas (Screen Time Threshold):**
   - **Ambang Default Produk:** 60 menit durasi kumulatif per hari.
   - **QA Demo Threshold:** Mode toggle 1–2 menit untuk pengujian cepat oleh juri/investor.
3. **Mekanisme Layar Dibekukan (*Screen Freeze / Time-Blocking*):**
   - Begitu batas 60 menit tercapai, sistem memicu notifikasi prioritas tinggi (`IMPORTANCE_HIGH`) yang mengunci alur dan membuka **Workout Interstitial**.
   - **Layar Terbagi Dua (Split-Screen 50/50):**
     - **Bagian Atas (50% Layar):** Menampilkan video demonstrasi gerakan mikro (misal: Plank 60s, Senam Peregangan Anti-Pegal 90s, Jumping Jacks 45s) lengkap dengan hitungan mundur waktu.
     - **Bagian Bawah (50% Layar):** Menampilkan live camera depan (CameraX) yang mendeteksi gerakan aktif pengguna.
4. **Syarat Melanjutkan Aktivitas:**
   - Pengguna **wajib menyelesaikan gerakan fisik tersebut** hingga countdown selesai untuk membuka kembali akses normal ponselnya.
   - Begitu gerakan tuntas:
     - Kunci intervensi terbuka.
     - Pengguna mendapatkan tambahan **Move Coins**.
     - Rasa bersalah akibat *doom-scrolling* berubah menjadi kepuasan fisik dan mental!

---

## 6. Alur Pengguna (User Journeys)

### Alur 1: Alur Utama Penggunaan Harian (Planning & Tracking)
```
[Buka Aplikasi MOVE2EARN]
       │
       ▼
[Masuk Menu "Workout Planner"]
       │
       ├─► 1. Pilih Otot yang Mau Dilatih (Dada / Punggung / Kaki / Core / Postur)
       │
       └─► 2. Pilih Alat di Sekitar (Dumbbell / Resistance Band / Kursi / Bodyweight)
       │
       ▼
[Sistem Mengeluarkan Modul Latihan Sesuai Alat & Otot]
       │
       ▼
[Mulai Sesi: Layar Membuka Video Panduan + Validasi Kamera On-Device]
       │
       ▼
[Selesai Latihan ──► Gerakan Dicatat di Dashboard Tracking Harian]
       │
       ▼
[Move Coins Diberikan ──► Saldo Dompet Bertambah]
```

### Alur 2: Alur Pembeda "MoveIt" Time-Blocking (Saat Scrolling Kebablasan)
```
[Pengguna Sedang Asyik Scrolling TikTok / Instagram / YouTube]
       │
       ▼
[Layanan Latar Belakang Mendeteksi Screen Time Mencapai Batas 60 Menit]
       │
       ▼
[TIME-BLOCKING AKTIF: Notifikasi Membuka Layar Split-Screen MoveIt]
       │
       ├─► LAYAR ATAS: Video Panduan Gerakan (Plank / Senam Peregangan) + Timer
       │
       └─► LAYAR BAWAH: Kamera Depan Memvalidasi Pengguna Aktif Bergerak
       │
       ▼
[Pengguna Menuntaskan Gerakan Mikro 60 Detik]
       │
       ▼
[Layar Ponsel Terbuka Kembali + Hadiah Move Coins Masuk ke Dompet]
```

### Alur 3: Alur Penukaran Reward (Redeem ke UMKM / Gym)
```
[Pengguna Membuka Halaman "Marketplace Rewards"]
       │
       ▼
[Pilih Voucher: Gym Day-Pass / Salad Bar UMKM / Suplemen]
       │
       ▼
[Konfirmasi Penukaran Koin (Validasi Saldo & Stok Atomik di Database)]
       │
       ▼
[Kode Voucher Unik Terbit (Tersimpan di Tab "Voucher Saya")]
       │
       ▼
[Tunjukkan Kode Voucher di Kasir Outlet Mitra UMKM]
```

---

## 7. Arsitektur Teknis Sistem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANDROID NATIVE (KOTLIN)                         │
│  - Jetpack Compose UI (Material 3)                                    │
│  - WorkoutPlannerModule: Generator modul latihan dinamis (alat sekitar)│
│  - UsageStatsHelper: Pelacak foreground session aplikasi sosmed        │
│  - WorkoutInterstitial: Split-screen (Top Video / Bottom CameraX)      │
│  - MotionDetectorAnalyzer: On-device luminance variance motion tracker │
│  - NotificationHelper: PendingIntent high-priority launcher            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS REST / RPC
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE CLOUD BACKEND                          │
│  - PostgreSQL 15 Database (Relational Data Engine)                     │
│  - Row Level Security (RLS): Perlindungan akses per user               │
│  - Secure RPC Functions:                                               │
│    • complete_workout_session()  --> Validasi & reward koin sekali     │
│    • redeem_reward()             --> Row locking & stok aman           │
│    • get_dashboard_summary()     --> Ringkasan tracking hari ini       │
│    • get_wallet_summary()        --> Ledger saldo anti-tamper          │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ HTTPS / Server Actions
┌───────────────────────────────────┴────────────────────────────────────┐
│                        NEXT.JS 14 WEB PLATFORM                         │
│  - Next.js App Router, TypeScript, Tailwind CSS                        │
│  - Web Dashboard (/dashboard): Visualisasi aktivitas & streak          │
│  - Split-Screen Simulator: Preview interaktif di web                   │
│  - Rewards Catalog & Redemption Flow (/rewards, /rewards/[id])         │
│  - Admin Portal (/admin): Manajemen tantangan & stok mitra UMKM        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Model Kemitraan UMKM & Monetisasi

```
+-------------------------------------------------------------------------------------------------+
|                               MODEL EKOSISTEM TIGA PIHAK (WIN-WIN-WIN)                          |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   [ PENGGUNA ]  ────────► Mendapatkan tubuh bugar, konsisten latihan, dan voucher gratis/diskon. |
|                                                                                                 |
|   [ MITRA UMKM] ────────► Mendapatkan pelanggan baru berkualitas tanpa biaya iklan di muka.     |
|                           (Gym lokal, warung salad/makanan sehat, penyedia katering sehat).     |
|                                                                                                 |
|   [ MOVE2EARN ] ────────► Memperoleh komisi penukaran voucher (success fee) & sponsor tantangan.|
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

1. **Model Promosi UMKM Berbasis Performa (*Performance-Based Marketing*):**
   - UMKM kuliner sehat dan gym lokal dapat memasang penawaran voucher di katalog Move2Earn.
   - UMKM hanya membayar komisi kecil per voucher yang berhasil digunakan di outlet mereka (*pay-per-redemption*).
2. **Sponsored Challenges / Brand Takeover:**
   - Brand produk olahraga atau rantai makanan sehat dapat mensponsori tantangan gerakan tertentu (misal: *"Tantangan Plank 7 Hari Bersama SaladPoint"* dengan reward koin ganda).
3. **B2B Corporate Wellness Subscription (Rencana Ekspansi):**
   - Paket langganan korporat untuk memantau dan memotivasi karyawan kantor agar tetap aktif bergerak di sela-sela jam kerja.

---

## 9. Metrik Keberhasilan (KPIs & OKRs)

| Dimensi | Indikator Kinerja Utama (KPI) | Target 3–6 Bulan |
| :--- | :--- | :--- |
| **Pemanfaatan Fitur Utama** | Persentase pengguna yang menggunakan Workout Planner | > 65% dari total pengguna aktif |
| **Tracking Harian** | Rata-rata sesi latihan yang dicatat per pengguna | Minimal 1–2 sesi tervalidasi / hari |
| **Efektivitas Pembeda** | Tingkat penyelesaian intervensi "MoveIt" saat batas tercapai | > 75% pengguna menuntaskan gerakan mikro |
| **Penurunan Waktu Layar** | Penurunan rata-rata durasi scrolling sosmed | Berkurang 20–30% dalam 30 hari |
| **Dampak Kemitraan** | Jumlah voucher UMKM yang ditebus dan digunakan | 1.500+ voucher / bulan |
| **Retensi Pengguna** | 30-Day User Retention Rate | > 40% (Standar industri fitness app: 15–20%) |

---

## 10. Roadmap Pengembangan Produk

```
+────────────────────────────────────────────────────────────────────────┐
│                        ROADMAP PENGEMBANGAN MOVE2EARN                  │
+────────────────────────────────────────────────────────────────────────┘
  FASE 1: HACKATHON & MVP CORE (SELESAI OKTOBER 2026)
  ├── Base Tracking Harian: Log durasi, jenis gerakan, dan kalori
  ├── Validasi Kamera On-Device (CameraX + ImageAnalysis)
  ├── Fitur Pembeda "MoveIt" Time-Blocking (Split-screen video + kamera)
  ├── Supabase Idempotent Database & Wallet Ledger
  └── Web Dashboard, Rewards Catalog, & QA Test Mode (1-2 Min)

  FASE 2: EXPANSION & SMART PLANNER ROLLOUT (Q1 2027)
  ├── Peluncuran Penuh Modul "Mau Olahraga Apa Hari Ini" (Pilihan Otot + Alat Sekitar)
  ├── Onboarding 25 Mitra UMKM Healthy Food & Gym Lokal (Fokus Jabodetabek)
  ├── Fitur Custom Target Otot & Durasi Latihan Fleksibel
  └── Program Referral Komunitas

  FASE 3: ADVANCED AI & MULTI-PLATFORM (Q2–Q4 2027)
  ├── Pose Estimation 33-Keypoint (MediaPipe) untuk Koreksi Sudut Gerakan
  ├── Integrasi Apple Screen Time API (FamilyControls) untuk Versi iOS
  ├── Portal Khusus Merchant UMKM untuk scan QR klaim voucher instan
  └── B2B Corporate Wellness Pilot Program
```

---

## 11. Kesimpulan

**MOVE2EARN** mengembalikan esensi olahraga ke tempatnya: **fleksibel, dapat dilakukan di mana saja dengan alat apa pun di sekitar kita, dan dicatat secara akurat**. 

Dengan memadukan **perencanaan latihan cerdas berbasis alat sekitar (ala workout.cool)** dan **pelacakan kebugaran harian tervalidasi kamera** sebagai fitur utamanya, serta menyematkan **"MoveIt" Time-Blocking** sebagai pembeda revolusionernya, MOVE2EARN berhasil mengubah lingkaran setan *doom-scrolling* pasif menjadi kebiasaan hidup sehat yang menguntungkan pengguna dan menggerakkan roda ekonomi UMKM lokal.
