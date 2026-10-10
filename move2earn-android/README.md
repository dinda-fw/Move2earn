# MOVE2EARN Android Native Application

MOVE2EARN is an Android-first fitness platform that monitors target social media app usage (TikTok, Instagram, YouTube) via `UsageStatsManager` and triggers an interactive **Split-Screen Workout Interstitial** when a daily screen time threshold is reached (default 60 mins/day, or 1–2 mins in QA Test Mode).

## Tech Stack & Architecture
- **Language & UI:** Kotlin, Jetpack Compose, Material 3
- **Screen Time Tracking:** Android SDK `UsageStatsManager`, `AppOpsManager`, foreground event interval calculations (zero double counting)
- **Live Motion Validation:** CameraX (`camera-camera2`, `camera-lifecycle`, `camera-view`), custom `ImageAnalysis` luminance variance optical analyzer
- **Notifications:** Android Notification Manager (`POST_NOTIFICATIONS` Android 13+) with High Priority and PendingIntent deep links
- **Background Worker:** Android WorkManager (`work-runtime-ktx`) for periodic background threshold checks
- **State Machine:** `NORMAL -> LIMIT_REACHED -> NOTIFICATION_SENT -> WORKOUT_PENDING -> WORKOUT_COMPLETED`
- **Security & Idempotency:** Session UUID + Idempotency Key validation, ensuring Move Coins are awarded at most once per workout.

## Key Screens & Features

### 1. Onboarding Screen (`ui.onboarding.OnboardingScreen`)
- Explains why Usage Access is requested and provides a direct shortcut to Android Settings (`Settings.ACTION_USAGE_ACCESS_SETTINGS`).
- **Privacy First:** Clearly explains that zero chats, messages, passwords, or personal content are accessed.
- Prompts for `POST_NOTIFICATIONS` permission with transparent context.

### 2. Dashboard Screen (`ui.dashboard.DashboardScreen`)
- Displays combined daily screen time across target apps (TikTok, Instagram, YouTube).
- Visual progress bar towards threshold.
- **QA Test Mode Switch:** Toggle between 60 minutes default and 1–2 minutes QA mode for fast judge and tester evaluation.
- Manual "Kirim Notifikasi" and "Buka Interstitial" test buttons.
- Move Coins balance pill and challenge catalog.

### 3. Workout Interstitial Split-Screen (`ui.workout.WorkoutInterstitialActivity`)
- **Top 50% of screen:** Exercise guidance video/animation, real-time countdown timer (60s/90s/45s), exercise tips, and safety disclaimers.
- **Bottom 50% of screen:** CameraX live camera preview with real-time motion detection badge (`✓ Gerakan Terdeteksi`), ensuring user is physically moving.
- "Batalkan" and "Selesaikan (+Coins)" buttons with atomic reward completion dialog.

## How to Build and Run

### Prerequisites
- JDK 17 or JDK 21 (Microsoft OpenJDK 21 tested)
- Android SDK Platform 36 and Build-Tools 36

### Build Debug APK
```bash
# In move2earn-android directory
.\gradlew.bat assembleDebug
```
The output APK is generated at:
`app/build/outputs/apk/debug/app-debug.apk`

### Install on Device via ADB
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```
