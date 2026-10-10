package com.example.move2earn.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ChallengeItem(
    val id: String,
    val title: String,
    val category: String,
    val instructions: String,
    val mediaUrl: String,
    val durationSeconds: Int,
    val coinReward: Int,
    val verificationMode: String = "camera_motion_countdown"
)
