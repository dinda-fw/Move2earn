package com.example.move2earn.service

import android.Manifest
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.example.move2earn.data.UserPreferences
import com.example.move2earn.ui.workout.WorkoutInterstitialActivity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class NotificationHelper(private val context: Context) {

    private val notificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    private val userPreferences = UserPreferences(context)

    fun hasNotificationPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }

    /**
     * Sends the workout interstitial notification if not already sent today.
     */
    fun sendWorkoutInterventionNotification(
        screenTimeMinutes: Float,
        thresholdMinutes: Int,
        challengeId: String = "11111111-1111-1111-1111-111111111101",
        forceTest: Boolean = false
    ): Boolean {
        if (!hasNotificationPermission()) return false

        val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        if (!forceTest && userPreferences.lastNotifiedDate == today) {
            // Already notified today, prevent duplicate notification according to PRD
            return false
        }

        val intent = Intent(context, WorkoutInterstitialActivity::class.java).apply {
            putExtra(WorkoutInterstitialActivity.EXTRA_CHALLENGE_ID, challengeId)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            NOTIFICATION_ID,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("⏱️ Waktunya Bergerak! Batas Scroll Tercapai")
            .setContentText("Total scrolling sosmed telah mencapai ${screenTimeMinutes.toInt()} menit. Ketuk untuk membuka Workout Interstitial & klaim Move Coins!")
            .setStyle(
                NotificationCompat.BigTextStyle().bigText(
                    "Kamu sudah menghabiskan ${screenTimeMinutes.toInt()} menit di sosmed hari ini (Batas: $thresholdMinutes min). Selesaikan 60 detik plank/senam untuk menjaga kebugaran dan raih Move Coins!"
                )
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        notificationManager.notify(NOTIFICATION_ID, notification)
        userPreferences.lastNotifiedDate = today
        return true
    }

    companion object {
        const val CHANNEL_ID = "move2earn_workout_channel"
        const val NOTIFICATION_ID = 2026
    }
}
