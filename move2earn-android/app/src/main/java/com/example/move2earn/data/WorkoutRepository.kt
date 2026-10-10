package com.example.move2earn.data

import android.content.Context
import com.example.move2earn.data.model.ChallengeItem
import com.example.move2earn.data.model.ScreenTimeEvaluation

class WorkoutRepository(private val context: Context) {

    private val userPreferences = UserPreferences(context)
    private val usageStatsHelper = UsageStatsHelper(context)

    fun getChallenges(): List<ChallengeItem> {
        return listOf(
            ChallengeItem(
                id = "11111111-1111-1111-1111-111111111101",
                title = "Core Plank Power 60s",
                category = "Kekuatan Otot",
                instructions = "Tahan posisi plank selama 60 detik. Posisikan siku sejajar bahu, luruskan punggung, kencangkan otot perut.",
                mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-planks-in-a-gym-42998-large.mp4",
                durationSeconds = 60,
                coinReward = 25
            ),
            ChallengeItem(
                id = "11111111-1111-1111-1111-111111111102",
                title = "Senam Peregangan Anti-Pegal 90s",
                category = "Mobilitas Postur",
                instructions = "Ikuti gerakan senam leher, bahu, dan punggung atas untuk melepas ketegangan akibat menunduk scrolling.",
                mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-stretching-exercises-before-exercising-42999-large.mp4",
                durationSeconds = 90,
                coinReward = 20
            ),
            ChallengeItem(
                id = "11111111-1111-1111-1111-111111111103",
                title = "Jumping Jacks Cardio Burst 45s",
                category = "Kardio Singkat",
                instructions = "Lompat buka kaki dan angkat tangan ke atas kepala dengan ritme dinamis. Bakar kalori dan segarkan pikiran!",
                mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-athlete-doing-jumping-jacks-in-a-gym-43003-large.mp4",
                durationSeconds = 45,
                coinReward = 15
            ),
            ChallengeItem(
                id = "11111111-1111-1111-1111-111111111104",
                title = "Deep Bodyweight Squats 60s",
                category = "Kekuatan Otot",
                instructions = "Lakukan gerakan squat stabil selama 60 detik. Punggung tegak, tekuk lutut seolah hendak duduk di kursi.",
                mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-deep-squats-in-a-gym-43001-large.mp4",
                durationSeconds = 60,
                coinReward = 30
            )
        )
    }

    fun getChallengeById(id: String): ChallengeItem {
        return getChallenges().find { it.id == id } ?: getChallenges().first()
    }

    /**
     * Completes a workout session and awards coins exactly once (idempotent).
     */
    fun completeSession(
        challengeId: String,
        durationSeconds: Int,
        idempotencyKey: String
    ): Result<Int> {
        val challenge = getChallengeById(challengeId)

        // Idempotency check: if already awarded, do not add coins again!
        if (userPreferences.isSessionAwarded(idempotencyKey)) {
            return Result.success(0) // already awarded
        }

        // Validate minimum duration
        if (durationSeconds < 10) {
            return Result.failure(IllegalArgumentException("Durasi workout terlalu singkat untuk reward"))
        }

        userPreferences.recordSessionAward(idempotencyKey, challenge.coinReward)
        return Result.success(challenge.coinReward)
    }

    fun getScreenTimeEvaluation(): ScreenTimeEvaluation {
        val targetPackages = UsageStatsHelper.DEFAULT_TARGET_PACKAGES
        val effectiveThreshold = userPreferences.effectiveThresholdMinutes
        return usageStatsHelper.queryDailyScreenTime(targetPackages, effectiveThreshold)
    }
}
