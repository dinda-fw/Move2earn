package com.example.move2earn.ui.workout

import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import java.nio.ByteBuffer
import kotlin.math.abs

/**
 * Lightweight real-time motion detector using CameraX ImageAnalysis.
 * Calculates luminance variance between consecutive frames to detect active user exercise.
 */
class MotionDetectorAnalyzer(
    private val onMotionDetected: (isMoving: Boolean, motionLevel: Float) -> Unit
) : ImageAnalysis.Analyzer {

    private var previousLuminance: ByteArray? = null
    private var lastAnalyzedTimestamp = 0L

    override fun analyze(image: ImageProxy) {
        val currentTimestamp = System.currentTimeMillis()
        // Throttle to ~10 checks per second
        if (currentTimestamp - lastAnalyzedTimestamp < 100) {
            image.close()
            return
        }
        lastAnalyzedTimestamp = currentTimestamp

        val buffer: ByteBuffer = image.planes[0].buffer
        val data = ByteArray(buffer.remaining())
        buffer.get(data)

        val prev = previousLuminance
        if (prev != null && prev.size == data.size) {
            var diffSum = 0L
            val step = 16 // Subsample pixels for fast CPU performance
            var count = 0
            for (i in 0 until data.size step step) {
                val currentLum = data[i].toInt() and 0xFF
                val prevLum = prev[i].toInt() and 0xFF
                diffSum += abs(currentLum - prevLum)
                count++
            }

            val avgDiff = if (count > 0) diffSum.toFloat() / count else 0f
            val motionThreshold = 4.0f // Sensitivity threshold
            val isMoving = avgDiff > motionThreshold
            val normalizedLevel = (avgDiff / 25f).coerceIn(0f, 1f)

            onMotionDetected(isMoving, normalizedLevel)
        }

        previousLuminance = data
        image.close()
    }
}
