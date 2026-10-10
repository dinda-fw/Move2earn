package com.example.move2earn.service

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.example.move2earn.data.UsageStatsHelper
import com.example.move2earn.data.UserPreferences
import java.util.concurrent.TimeUnit

class ScreenTimeMonitorWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val helper = UsageStatsHelper(applicationContext)
        val prefs = UserPreferences(applicationContext)

        if (!helper.hasUsageAccessPermission()) {
            return Result.success()
        }

        val eval = helper.queryDailyScreenTime(
            UsageStatsHelper.DEFAULT_TARGET_PACKAGES,
            prefs.effectiveThresholdMinutes
        )

        if (eval.isThresholdReached) {
            val notificationHelper = NotificationHelper(applicationContext)
            notificationHelper.sendWorkoutInterventionNotification(
                screenTimeMinutes = eval.totalTargetMinutes,
                thresholdMinutes = eval.thresholdMinutes
            )
        }

        return Result.success()
    }

    companion object {
        private const val WORK_NAME = "ScreenTimeMonitorPeriodicWork"

        fun schedule(context: Context) {
            val request = PeriodicWorkRequestBuilder<ScreenTimeMonitorWorker>(
                15, TimeUnit.MINUTES
            ).build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                request
            )
        }
    }
}
