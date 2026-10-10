package com.example.move2earn.ui.workout

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.move2earn.theme.Move2EarnTheme

class WorkoutInterstitialActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val challengeId = intent.getStringExtra(EXTRA_CHALLENGE_ID)
            ?: "11111111-1111-1111-1111-111111111101"

        setContent {
            Move2EarnTheme {
                WorkoutInterstitialScreen(
                    challengeId = challengeId,
                    onClose = { finish() }
                )
            }
        }
    }

    companion object {
        const val EXTRA_CHALLENGE_ID = "extra_challenge_id"
    }
}
