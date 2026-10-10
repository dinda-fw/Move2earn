package com.example.move2earn.ui.onboarding

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.move2earn.data.UsageStatsHelper
import com.example.move2earn.data.UserPreferences
import com.example.move2earn.service.NotificationHelper

@Composable
fun OnboardingScreen(
    onContinueToDashboard: () -> Unit
) {
    val context = LocalContext.current
    val usageStatsHelper = remember { UsageStatsHelper(context) }
    val notificationHelper = remember { NotificationHelper(context) }
    val userPreferences = remember { UserPreferences(context) }

    var hasUsageAccess by remember { mutableStateOf(usageStatsHelper.hasUsageAccessPermission()) }
    var hasNotificationPermission by remember { mutableStateOf(notificationHelper.hasNotificationPermission()) }

    val notificationLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasNotificationPermission = granted
    }

    // Refresh permissions whenever composable resumes / recomposes
    LaunchedEffect(Unit) {
        hasUsageAccess = usageStatsHelper.hasUsageAccessPermission()
        hasNotificationPermission = notificationHelper.hasNotificationPermission()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0B0F19))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // TOP HEADER
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Surface(
                color = Color(0x3322C55E),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.size(64.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.LocalFireDepartment,
                        contentDescription = null,
                        tint = Color(0xFF22C55E),
                        modifier = Modifier.size(36.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Selamat Datang di MOVE2EARN",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Ubah kebiasaan scrolling sosmed pasif menjadi gerakan olahraga aktif dan Move Coins!",
                fontSize = 13.sp,
                color = Color(0xFF94A3B8),
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )
        }

        // PERMISSION CARDS
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Card 1: Usage Access
            Surface(
                color = Color(0xFF131B2E),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (hasUsageAccess) Color(0xFF22C55E) else Color(0xFF334155)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                Icons.Default.Timeline,
                                null,
                                tint = if (hasUsageAccess) Color(0xFF22C55E) else Color(0xFF38BDF8)
                            )
                            Text(
                                text = "1. Izin Akses Penggunaan (Usage Access)",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                        if (hasUsageAccess) {
                            Icon(Icons.Default.CheckCircle, null, tint = Color(0xFF22C55E))
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Diperlukan untuk membaca total menit penggunaan aplikasi sosmed (TikTok, Instagram, YouTube) saat mencapai ambang 60 menit.",
                        color = Color(0xFF94A3B8),
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    // Privacy guarantee
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Default.Security, null, tint = Color(0xFF4ADE80), modifier = Modifier.size(14.dp))
                        Text(
                            text = "Privasi Dijaga: Tidak membaca konten, chat, atau password.",
                            color = Color(0xFF86EFAC),
                            fontSize = 10.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    if (!hasUsageAccess) {
                        Button(
                            onClick = {
                                context.startActivity(usageStatsHelper.createUsageAccessSettingsIntent())
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF38BDF8)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Buka Settings Android", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    } else {
                        Text(
                            text = "✓ Izin Telah Aktif",
                            color = Color(0xFF22C55E),
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // Card 2: Notifications
            Surface(
                color = Color(0xFF131B2E),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (hasNotificationPermission) Color(0xFF22C55E) else Color(0xFF334155)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                Icons.Default.NotificationsActive,
                                null,
                                tint = if (hasNotificationPermission) Color(0xFF22C55E) else Color(0xFFFBBF24)
                            )
                            Text(
                                text = "2. Izin Notifikasi Intervensi",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                        if (hasNotificationPermission) {
                            Icon(Icons.Default.CheckCircle, null, tint = Color(0xFF22C55E))
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Diperlukan untuk mengirim notifikasi yang membuka Workout Interstitial saat batas scrolling tercapai.",
                        color = Color(0xFF94A3B8),
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))
                    if (!hasNotificationPermission && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        Button(
                            onClick = {
                                notificationLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFBBF24)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Izinkan Notifikasi", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    } else {
                        Text(
                            text = "✓ Notifikasi Aktif",
                            color = Color(0xFF22C55E),
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        // BOTTOM ACTION BUTTON
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(
                onClick = {
                    userPreferences.isOnboardingCompleted = true
                    onContinueToDashboard()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF22C55E)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    text = if (hasUsageAccess) "Mulai Menggunakan MOVE2EARN" else "Lewati Sementara & Masuk",
                    color = Color.Black,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Kamu dapat mengubah pengaturan izin kapan saja di menu Pengaturan.",
                fontSize = 10.sp,
                color = Color.Gray,
                textAlign = TextAlign.Center
            )
        }
    }
}
