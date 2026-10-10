package com.example.move2earn.data.model

data class TargetAppUsage(
    val packageName: String,
    val displayName: String,
    val durationSeconds: Long,
    val isInstalled: Boolean = true
) {
    val durationMinutes: Float
        get() = String.format("%.1f", durationSeconds / 60f).toFloatOrNull() ?: (durationSeconds / 60f)
}

data class ScreenTimeEvaluation(
    val periodDate: String,
    val totalTargetSeconds: Long,
    val thresholdMinutes: Int,
    val isThresholdReached: Boolean,
    val apps: List<TargetAppUsage>,
    val lastEvaluatedAt: Long = System.currentTimeMillis()
) {
    val totalTargetMinutes: Float
        get() = String.format("%.1f", totalTargetSeconds / 60f).toFloatOrNull() ?: (totalTargetSeconds / 60f)

    val progressPercent: Int
        get() = if (thresholdMinutes > 0) {
            ((totalTargetMinutes / thresholdMinutes.toFloat()) * 100).toInt().coerceIn(0, 100)
        } else 0
}
