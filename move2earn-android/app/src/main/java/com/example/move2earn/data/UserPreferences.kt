package com.example.move2earn.data

import android.content.Context
import android.content.SharedPreferences

class UserPreferences(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("move2earn_prefs", Context.MODE_PRIVATE)

    var thresholdMinutes: Int
        get() = prefs.getInt(KEY_THRESHOLD_MINUTES, 60)
        set(value) = prefs.edit().putInt(KEY_THRESHOLD_MINUTES, value).apply()

    var isTestMode: Boolean
        get() = prefs.getBoolean(KEY_IS_TEST_MODE, false)
        set(value) = prefs.edit().putBoolean(KEY_IS_TEST_MODE, value).apply()

    var testThresholdMinutes: Int
        get() = prefs.getInt(KEY_TEST_THRESHOLD_MINUTES, 2)
        set(value) = prefs.edit().putInt(KEY_TEST_THRESHOLD_MINUTES, value).apply()

    val effectiveThresholdMinutes: Int
        get() = if (isTestMode) testThresholdMinutes else thresholdMinutes

    var coinBalance: Int
        get() = prefs.getInt(KEY_COIN_BALANCE, 75) // initial demo balance
        set(value) = prefs.edit().putInt(KEY_COIN_BALANCE, value).apply()

    var lastNotifiedDate: String
        get() = prefs.getString(KEY_LAST_NOTIFIED_DATE, "") ?: ""
        set(value) = prefs.edit().putString(KEY_LAST_NOTIFIED_DATE, value).apply()

    var isOnboardingCompleted: Boolean
        get() = prefs.getBoolean(KEY_ONBOARDING_COMPLETED, false)
        set(value) = prefs.edit().putBoolean(KEY_ONBOARDING_COMPLETED, value).apply()

    /**
     * Checks if a session has already awarded coins (idempotency guard).
     */
    fun isSessionAwarded(idempotencyKey: String): Boolean {
        val set = prefs.getStringSet(KEY_AWARDED_SESSIONS, emptySet()) ?: emptySet()
        return set.contains(idempotencyKey)
    }

    /**
     * Marks session as awarded and updates coins.
     */
    fun recordSessionAward(idempotencyKey: String, coins: Int) {
        val currentSet = prefs.getStringSet(KEY_AWARDED_SESSIONS, emptySet())?.toMutableSet() ?: mutableSetOf()
        currentSet.add(idempotencyKey)
        prefs.edit()
            .putStringSet(KEY_AWARDED_SESSIONS, currentSet)
            .putInt(KEY_COIN_BALANCE, coinBalance + coins)
            .apply()
    }

    companion object {
        private const val KEY_THRESHOLD_MINUTES = "key_threshold_minutes"
        private const val KEY_IS_TEST_MODE = "key_is_test_mode"
        private const val KEY_TEST_THRESHOLD_MINUTES = "key_test_threshold_minutes"
        private const val KEY_COIN_BALANCE = "key_coin_balance"
        private const val KEY_LAST_NOTIFIED_DATE = "key_last_notified_date"
        private const val KEY_AWARDED_SESSIONS = "key_awarded_sessions"
        private const val KEY_ONBOARDING_COMPLETED = "key_onboarding_completed"
    }
}
