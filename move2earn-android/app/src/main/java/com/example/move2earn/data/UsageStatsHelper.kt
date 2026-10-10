package com.example.move2earn.data

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.example.move2earn.data.model.ScreenTimeEvaluation
import com.example.move2earn.data.model.TargetAppUsage
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class UsageStatsHelper(private val context: Context) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager

    /**
     * Checks if Usage Access permission has been granted in Android Settings.
     */
    fun hasUsageAccessPermission(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager ?: return false
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    /**
     * Creates an intent to direct user directly to Android Settings for Usage Access.
     */
    fun createUsageAccessSettingsIntent(): Intent {
        return Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
    }

    /**
     * Queries daily screen time usage for target social media packages.
     * Prevents double counting by calculating foreground session intervals.
     */
    fun queryDailyScreenTime(
        targetPackages: Set<String>,
        thresholdMinutes: Int
    ): ScreenTimeEvaluation {
        val todayCalendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        val startTime = todayCalendar.timeInMillis
        val endTime = System.currentTimeMillis()
        val periodDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date(startTime))

        val packageUsageMap = mutableMapOf<String, Long>()
        for (pkg in targetPackages) {
            packageUsageMap[pkg] = 0L
        }

        if (hasUsageAccessPermission() && usageStatsManager != null) {
            val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
            val event = UsageEvents.Event()

            val lastResumeMap = mutableMapOf<String, Long>()

            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event)
                val pkg = event.packageName ?: continue

                if (targetPackages.contains(pkg)) {
                    when (event.eventType) {
                        UsageEvents.Event.ACTIVITY_RESUMED -> {
                            lastResumeMap[pkg] = event.timeStamp
                        }
                        UsageEvents.Event.ACTIVITY_PAUSED,
                        UsageEvents.Event.ACTIVITY_STOPPED -> {
                            val resumeTime = lastResumeMap.remove(pkg)
                            if (resumeTime != null && event.timeStamp > resumeTime) {
                                val sessionDuration = (event.timeStamp - resumeTime) / 1000L
                                val current = packageUsageMap[pkg] ?: 0L
                                packageUsageMap[pkg] = current + sessionDuration
                            }
                        }
                    }
                }
            }

            // Close any currently ongoing active session up to current time
            for ((pkg, resumeTime) in lastResumeMap) {
                if (endTime > resumeTime) {
                    val sessionDuration = (endTime - resumeTime) / 1000L
                    val current = packageUsageMap[pkg] ?: 0L
                    packageUsageMap[pkg] = current + sessionDuration
                }
            }
        }

        // Build target app items
        val appsList = targetPackages.map { pkg ->
            val durationSec = packageUsageMap[pkg] ?: 0L
            val displayName = resolveAppLabel(pkg)
            TargetAppUsage(
                packageName = pkg,
                displayName = displayName,
                durationSeconds = durationSec,
                isInstalled = isAppInstalled(pkg)
            )
        }

        val totalSeconds = appsList.sumOf { it.durationSeconds }
        val isReached = (totalSeconds / 60) >= thresholdMinutes

        return ScreenTimeEvaluation(
            periodDate = periodDate,
            totalTargetSeconds = totalSeconds,
            thresholdMinutes = thresholdMinutes,
            isThresholdReached = isReached,
            apps = appsList
        )
    }

    private fun resolveAppLabel(packageName: String): String {
        return when {
            packageName.contains("musically") || packageName.contains("tiktok") -> "TikTok"
            packageName.contains("instagram") -> "Instagram"
            packageName.contains("youtube") -> "YouTube"
            else -> {
                try {
                    val pm = context.packageManager
                    val info = pm.getApplicationInfo(packageName, 0)
                    pm.getApplicationLabel(info).toString()
                } catch (e: Exception) {
                    packageName
                }
            }
        }
    }

    private fun isAppInstalled(packageName: String): Boolean {
        return try {
            context.packageManager.getPackageInfo(packageName, 0)
            true
        } catch (e: PackageManager.NameNotFoundException) {
            false
        }
    }

    companion object {
        val DEFAULT_TARGET_PACKAGES = setOf(
            "com.zhiliaoapp.musically",     // TikTok Global
            "com.instagram.android",        // Instagram
            "com.google.android.youtube"    // YouTube
        )
    }
}
