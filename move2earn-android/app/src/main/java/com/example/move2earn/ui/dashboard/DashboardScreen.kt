package com.example.move2earn.ui.dashboard

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.move2earn.data.UsageStatsHelper
import com.example.move2earn.data.UserPreferences
import com.example.move2earn.data.WorkoutRepository
import com.example.move2earn.data.model.ChallengeItem
import com.example.move2earn.data.model.ScreenTimeEvaluation
import com.example.move2earn.service.NotificationHelper
import com.example.move2earn.ui.workout.WorkoutInterstitialActivity

@Composable
fun DashboardScreen(
    onOpenSettings: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { WorkoutRepository(context) }
    val userPreferences = remember { UserPreferences(context) }
    val usageStatsHelper = remember { UsageStatsHelper(context) }
    val notificationHelper = remember { NotificationHelper(context) }

    var evaluation by remember { mutableStateOf(repository.getScreenTimeEvaluation()) }
    var isTestMode by remember { mutableStateOf(userPreferences.isTestMode) }
    var coinBalance by remember { mutableIntStateOf(userPreferences.coinBalance) }
    var challenges by remember { mutableStateOf(repository.getChallenges()) }
    var hasUsageAccess by remember { mutableStateOf(usageStatsHelper.hasUsageAccessPermission()) }

    // Refresh stats when view becomes active
    LaunchedEffect(Unit) {
        hasUsageAccess = usageStatsHelper.hasUsageAccessPermission()
        evaluation = repository.getScreenTimeEvaluation()
        coinBalance = userPreferences.coinBalance
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0B0F19))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. TOP HEADER & COIN BALANCE
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Surface(
                        color = Color(0x3322C55E),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.size(36.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.LocalFireDepartment, null, tint = Color(0xFF22C55E), modifier = Modifier.size(20.dp))
                        }
                    }
                    Column {
                        Text("MOVE2EARN", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
                        Text("Scroll Less • Move More", color = Color.Gray, fontSize = 10.sp)
                    }
                }

                // Balance Badge
                Surface(
                    color = Color(0x33FBBF24),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x66FBBF24))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Default.MonetizationOn, null, tint = Color(0xFFFBBF24), modifier = Modifier.size(16.dp))
                        Text(
                            text = "$coinBalance Coins",
                            color = Color(0xFFFDE68A),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        // 2. PERMISSION BANNER (IF MISSING)
        if (!hasUsageAccess) {
            item {
                Surface(
                    color = Color(0x22F59E0B),
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x66F59E0B))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.Warning, null, tint = Color(0xFFF59E0B), modifier = Modifier.size(18.dp))
                            Text("Izin Usage Access Belum Aktif", color = Color(0xFFFDE68A), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                        Text(
                            text = "Aktifkan di Settings agar MOVE2EARN dapat menghitung screen time sosmed harianmu.",
                            color = Color(0xFFE2E8F0),
                            fontSize = 11.sp,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Button(
                            onClick = {
                                context.startActivity(usageStatsHelper.createUsageAccessSettingsIntent())
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("Buka Settings", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }
                    }
                }
            }
        }

        // 3. COMBINED SCREENTIME PROGRESS CARD
        item {
            Surface(
                color = Color(0xFF131B2E),
                shape = RoundedCornerShape(20.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Screen Time Sosmed Gabungan", color = Color(0xFF94A3B8), fontSize = 12.sp)
                        Text(evaluation.periodDate, color = Color.Gray, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = String.format("%.1f", evaluation.totalTargetMinutes),
                            color = Color.White,
                            fontSize = 36.sp,
                            fontWeight = FontWeight.ExtraBold,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = " / ${userPreferences.effectiveThresholdMinutes} Menit",
                            color = Color(0xFF94A3B8),
                            fontSize = 14.sp,
                            modifier = Modifier.padding(bottom = 6.dp, start = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    LinearProgressIndicator(
                        progress = { (evaluation.progressPercent / 100f).coerceIn(0f, 1f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp),
                        color = if (evaluation.isThresholdReached) Color(0xFFEF4444) else Color(0xFF22C55E),
                        trackColor = Color(0xFF1E293B),
                    )

                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${evaluation.progressPercent}% dari ambang harian",
                            color = Color.Gray,
                            fontSize = 10.sp
                        )
                        Text(
                            text = if (evaluation.isThresholdReached) "⚠️ Batas Tercapai!" else "Status Normal",
                            color = if (evaluation.isThresholdReached) Color(0xFFF87171) else Color(0xFF4ADE80),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // 4. QA THRESHOLD TEST SWITCH & SIMULATION CONTROLS
        item {
            Surface(
                color = Color(0xFF111827),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1F2937))
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("QA Test Threshold Mode", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text(
                                if (isTestMode) "Ambang aktif: 2 Menit (untuk QA/demo cepat)" else "Default produk: 60 Menit",
                                color = Color.Gray,
                                fontSize = 10.sp
                            )
                        }
                        Switch(
                            checked = isTestMode,
                            onCheckedChange = { checked ->
                                isTestMode = checked
                                userPreferences.isTestMode = checked
                                evaluation = repository.getScreenTimeEvaluation()
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Button 1: Test Notification (PRD Milestone 3)
                        Button(
                            onClick = {
                                notificationHelper.sendWorkoutInterventionNotification(
                                    screenTimeMinutes = evaluation.totalTargetMinutes,
                                    thresholdMinutes = userPreferences.effectiveThresholdMinutes,
                                    forceTest = true
                                )
                            },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF38BDF8)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Notifications, null, tint = Color.Black, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Kirim Notifikasi", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }

                        // Button 2: Direct Interstitial Split-Screen (PRD Milestone 4)
                        Button(
                            onClick = {
                                val intent = Intent(context, WorkoutInterstitialActivity::class.java).apply {
                                    putExtra(
                                        WorkoutInterstitialActivity.EXTRA_CHALLENGE_ID,
                                        challenges.firstOrNull()?.id ?: "11111111-1111-1111-1111-111111111101"
                                    )
                                }
                                context.startActivity(intent)
                            },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF22C55E)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.PlayArrow, null, tint = Color.Black, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Buka Interstitial", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }
                    }
                }
            }
        }

        // 5. APPS BREAKDOWN LIST
        item {
            Text("Aplikasi Target Terpantau", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }

        items(evaluation.apps) { app ->
            Surface(
                color = Color(0xFF131B2E),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .background(
                                    when {
                                        app.packageName.contains("musically") -> Color(0xFFEC4899)
                                        app.packageName.contains("instagram") -> Color(0xFFA855F7)
                                        else -> Color(0xFFEF4444)
                                    },
                                    CircleShape
                                )
                        )
                        Column {
                            Text(app.displayName, color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                            Text(
                                if (app.isInstalled) app.packageName else "Belum terpasang di perangkat",
                                color = Color.Gray,
                                fontSize = 9.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Text(
                        text = "${app.durationMinutes} Min",
                        color = Color(0xFFCBD5E1),
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        // 6. AVAILABLE CHALLENGES
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Text("Pilihan Intervensi Workout", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }

        items(challenges) { challenge ->
            Surface(
                color = Color(0xFF131B2E),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(challenge.title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Surface(
                                color = Color(0x3322C55E),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text(
                                    "+${challenge.coinReward} Coins",
                                    color = Color(0xFF4ADE80),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = "${challenge.durationSeconds} Detik • ${challenge.category}",
                            color = Color.Gray,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }

                    IconButton(
                        onClick = {
                            val intent = Intent(context, WorkoutInterstitialActivity::class.java).apply {
                                putExtra(WorkoutInterstitialActivity.EXTRA_CHALLENGE_ID, challenge.id)
                            }
                            context.startActivity(intent)
                        }
                    ) {
                        Icon(Icons.Default.PlayCircle, null, tint = Color(0xFF22C55E), modifier = Modifier.size(28.dp))
                    }
                }
            }
        }
    }
}
