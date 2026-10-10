-- =============================================================================
-- MOVE2EARN Seed Data
-- Default workout challenges and marketplace demo rewards
-- =============================================================================

-- 1. SEED CHALLENGES
INSERT INTO public.challenges (id, title, category, instructions, media_url, duration_seconds, coin_reward, is_active, verification_mode)
VALUES 
(
    '11111111-1111-1111-1111-111111111101',
    'Core Plank Power 60s',
    'strength',
    'Tahan posisi plank selama 60 detik. Posisikan siku sejajar bahu, jaga punggung tetap lurus, dan kencangkan otot perut. Jangan biarkan pinggang turun.',
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-planks-in-a-gym-42998-large.mp4',
    60,
    25,
    TRUE,
    'camera_motion_countdown'
),
(
    '11111111-1111-1111-1111-111111111102',
    'Senam Peregangan Anti-Pegal 90s',
    'mobility',
    'Ikuti gerakan senam peregangan leher, bahu, dan punggung untuk memulihkan postur setelah menatap layar ponsel terlalu lama.',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-stretching-exercises-before-exercising-42999-large.mp4',
    90,
    20,
    TRUE,
    'camera_motion_countdown'
),
(
    '11111111-1111-1111-1111-111111111103',
    'Jumping Jacks Cardio Burst 45s',
    'cardio',
    'Lompat dan buka kaki selebar bahu sambil mengangkat kedua tangan ke atas kepala. Bakar kalori dan segarkan pikiran dari doom-scrolling!',
    'https://assets.mixkit.co/videos/preview/mixkit-athlete-doing-jumping-jacks-in-a-gym-43003-large.mp4',
    45,
    15,
    TRUE,
    'camera_motion_countdown'
),
(
    '11111111-1111-1111-1111-111111111104',
    'Deep Bodyweight Squats 60s',
    'strength',
    'Lakukan squat teratur selama 60 detik dengan ritme stabil. Punggung tegak, lutut sejajar ujung kaki, dorong pinggul ke belakang.',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-deep-squats-in-a-gym-43001-large.mp4',
    60,
    30,
    TRUE,
    'camera_motion_countdown'
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED REWARDS (MARKETPLACE)
INSERT INTO public.rewards (id, title, description, category, image_url, coin_price, stock, voucher_code, is_demo, is_active)
VALUES
(
    '22222222-2222-2222-2222-222222222201',
    'GoPay / OVO Rp 25.000 Balance',
    'Saldo digital wallet Rp 25.000 langsung ditransfer atau gunakan kode voucher demo.',
    'digital_wallet',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    50,
    25,
    'M2E-GOPAY25K-DEMO',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222202',
    'Tokopedia Voucher Rp 50.000',
    'Potongan belanja Rp 50.000 tanpa minimum transaksi untuk produk kesehatan & olahraga.',
    'voucher',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
    90,
    15,
    'M2E-TKPD50K-DEMO',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222203',
    'Whey Protein Sachet Single Pack',
    'Sachet premium whey protein isolat 25g protein untuk pemulihan otot instan setelah workout.',
    'nutrition',
    'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=600&q=80',
    35,
    50,
    'M2E-PROTEIN-DEMO',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222204',
    'Move2Earn Premium Shaker Bottle 700ml',
    'Botol shaker BPA-free anti-bocor dengan stainless steel mixing ball edisi khusus Move2Earn.',
    'merchandise',
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    120,
    10,
    'M2E-SHAKER-DEMO',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222205',
    'Spotify Premium 1 Bulan',
    'Langganan Spotify Premium 1 bulan untuk mendengarkan workout playlist tanpa gangguan iklan.',
    'entertainment',
    'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=600&q=80',
    75,
    20,
    'M2E-SPOTIFY1M-DEMO',
    TRUE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;
