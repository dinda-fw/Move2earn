package com.example.move2earn

import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import com.example.move2earn.data.UsageStatsHelper
import com.example.move2earn.data.UserPreferences
import com.example.move2earn.ui.dashboard.DashboardScreen
import com.example.move2earn.ui.onboarding.OnboardingScreen

@Composable
fun MainNavigation() {
    val context = LocalContext.current
    val userPreferences = remember { UserPreferences(context) }
    val usageStatsHelper = remember { UsageStatsHelper(context) }

    var currentScreen by remember {
        mutableStateOf(
            if (userPreferences.isOnboardingCompleted && usageStatsHelper.hasUsageAccessPermission()) {
                Screen.Dashboard
            } else {
                Screen.Onboarding
            }
        )
    }

    when (currentScreen) {
        Screen.Onboarding -> {
            OnboardingScreen(
                onContinueToDashboard = {
                    currentScreen = Screen.Dashboard
                }
            )
        }
        Screen.Dashboard -> {
            DashboardScreen(
                onOpenSettings = {
                    currentScreen = Screen.Onboarding
                }
            )
        }
    }
}

enum class Screen {
    Onboarding,
    Dashboard
}
