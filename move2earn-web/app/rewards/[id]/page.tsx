'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Gift, 
  Coins, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { Reward, Redemption } from '@/lib/types';

export default function RewardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [reward, setReward] = useState<Reward | null>(null);
  const [balance, setBalance] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState<Redemption | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const r = Move2EarnStore.getRewardById(id);
      if (r) setReward(r);
      const summary = Move2EarnStore.getWalletSummary();
      setBalance(summary.balance);
    }
  }, [id]);

  if (!reward) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Reward Tidak Ditemukan</h2>
        <p className="text-xs text-gray-400 mb-6">Item yang kamu cari mungkin sudah tidak aktif atau salah tautan.</p>
        <Link href="/rewards" className="text-xs text-green-400 hover:underline">
          Kembali ke Katalog Reward
        </Link>
      </div>
    );
  }

  const canAfford = balance >= reward.coin_price;
  const isOutOfStock = reward.stock <= 0;

  const handleExecuteRedeem = () => {
    setIsRedeeming(true);
    setErrorMessage(null);

    const idempotencyKey = `web-redeem-${reward.id}-${Date.now()}`;
    const result = Move2EarnStore.redeemReward(reward.id, idempotencyKey);

    setIsRedeeming(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Gagal menukarkan reward.');
    } else if (result.redemption) {
      setRedemptionSuccess(result.redemption);
      setIsConfirming(false);
      // update state
      setReward(Move2EarnStore.getRewardById(reward.id) || reward);
      setBalance(Move2EarnStore.getWalletSummary().balance);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link href="/rewards" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#111827] border border-gray-800 rounded-3xl p-6 md:p-8">
        {/* Left: Product Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-950 aspect-square relative border border-gray-800">
          <img src={reward.image_url} alt={reward.title} className="w-full h-full object-cover" />
          {reward.is_demo && (
            <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
              DEMO VOUCHER
            </div>
          )}
        </div>

        {/* Right: Info & Redeem Card */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="capitalize">{reward.category.replace('_', ' ')}</span>
              <span className={reward.stock <= 5 ? 'text-red-400 font-semibold' : ''}>
                Sisa Stok: {reward.stock} unit
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white leading-tight">{reward.title}</h1>

            <div className="flex items-baseline gap-2 py-2">
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                {reward.coin_price}
              </span>
              <span className="text-sm text-amber-200/70 font-semibold">Move Coins</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed border-t border-b border-gray-800 py-4">
              {reward.description}
            </p>

            <div className="flex items-center justify-between text-xs bg-gray-900/80 p-3 rounded-xl border border-gray-800">
              <span className="text-gray-400">Saldo Move Coins Anda:</span>
              <span className={`font-mono font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                {balance} Coins
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsConfirming(true)}
              disabled={!canAfford || isOutOfStock}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : canAfford
                  ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/25'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>
                {isOutOfStock
                  ? 'Stok Hadiah Habis'
                  : canAfford
                  ? 'Tukarkan Sekarang'
                  : `Kurang ${reward.coin_price - balance} Koin Lagi`}
              </span>
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              Diproses secara atomik oleh Supabase backend
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Konfirmasi Penukaran</h3>
            <p className="text-xs text-gray-300">
              Apakah kamu yakin ingin menukarkan <strong className="text-amber-300">{reward.coin_price} Move Coins</strong> untuk:{' '}
              <span className="text-white font-medium">{reward.title}</span>?
            </p>
            <div className="p-3 bg-gray-900 rounded-xl text-xs space-y-1.5 border border-gray-800">
              <div className="flex justify-between text-gray-400">
                <span>Saldo Sebelum:</span>
                <span className="font-mono text-gray-200">{balance} Coins</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Biaya Penukaran:</span>
                <span className="font-mono text-red-400">-{reward.coin_price} Coins</span>
              </div>
              <div className="flex justify-between font-semibold text-white border-t border-gray-800 pt-1.5">
                <span>Sisa Saldo:</span>
                <span className="font-mono text-green-400">{balance - reward.coin_price} Coins</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsConfirming(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteRedeem}
                disabled={isRedeeming}
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-xl shadow"
              >
                {isRedeeming ? 'Memproses...' : 'Ya, Tukarkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL WITH VOUCHER CODE */}
      {redemptionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-green-500/50 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Penukaran Berhasil!</h3>
              <p className="text-xs text-gray-400 mt-1">
                Selamat! Hadiahmu telah berhasil ditebus dan dicatat dalam database.
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="p-4 bg-gray-950 border border-dashed border-gray-700 rounded-xl space-y-2">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Kode Voucher / Klaim:</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-mono font-bold text-amber-300 tracking-wider">
                  {redemptionSuccess.voucher_code}
                </span>
                <button
                  onClick={() => copyCode(redemptionSuccess.voucher_code || '')}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                  title="Salin Kode"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && <span className="text-[10px] text-green-400 font-medium block">Tersalin ke clipboard!</span>}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/redemptions"
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-xl"
              >
                Lihat di My Vouchers
              </Link>
              <button
                onClick={() => setRedemptionSuccess(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
