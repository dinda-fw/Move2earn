package com.example.move2earn.data.model

/**
 * State machine according to PRD section 6:
 * NORMAL -> LIMIT_REACHED -> NOTIFICATION_SENT -> WORKOUT_PENDING -> WORKOUT_COMPLETED
 */
enum class InterventionState {
    NORMAL,
    LIMIT_REACHED,
    NOTIFICATION_SENT,
    WORKOUT_PENDING,
    WORKOUT_COMPLETED
}
