'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Coins, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Gift, 
  Receipt,
  Sparkles,
  Filter
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { WalletTransaction } from '@/lib/types';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'redeem'>('all');

  useEffect(() => {
    refreshWallet();
  }, []);

  const refreshWallet = () => {
    const summary = Move2EarnStore.getWalletSummary();
    setBalance(summary.balance);
    setTotalEarned(summary.totalEarned);
    setTotalSpent(summary.totalSpent);
    setTransactions(Move2EarnStore.getTransactions());
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'earn') return tx.transaction_type === 'earn';
    if (filterType === 'redeem') return tx.transaction_type === 'redeem';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-400" />
            Dompet Move Coins
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Buku besar transaksi aman (PostgreSQL Ledger) dengan proteksi RLS dan idempotensi penuh.
          </p>
        </div>

        <Link
          href="/rewards"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow transition-colors w-fit"
        >
          <Gift className="w-4 h-4" />
          <span>Tukarkan ke Marketplace</span>
        </Link>
      </div>

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Balance Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-gray-900 to-[#1c1811] border border-amber-500/40 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-4">
            <span>Saldo Aktif Saat Ini</span>
            <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-amber-300 font-mono">{balance}</span>
            <span className="text-sm text-amber-200/70 font-semibold">Move Coins</span>
          </div>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Tervalidasi secara atomik di Supabase
          </p>
        </div>

        {/* Total Earned */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-4">
            <span>Total Koin Didapat (Lifetime)</span>
            <ArrowDownLeft className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-green-400 font-mono">+{totalEarned}</span>
            <span className="text-xs text-gray-400">Coins</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Dari menyelesaikan intervensi workout
          </p>
        </div>

        {/* Total Spent */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-4">
            <span>Total Koin Dibelanjakan</span>
            <ArrowUpRight className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400 font-mono">-{totalSpent}</span>
            <span className="text-xs text-gray-400">Coins</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Penukaran voucher & hadiah di marketplace
          </p>
        </div>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-white">Buku Besar Transaksi (Ledger)</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('earn')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'earn' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Pendapatan
            </button>
            <button
              onClick={() => setFilterType('redeem')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'redeem' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Penukaran
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-800/80">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              Belum ada transaksi untuk kategori ini.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isEarn = tx.transaction_type === 'earn';
              const dateStr = new Date(tx.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-850/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isEarn ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {isEarn ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{tx.description}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        <span>{dateStr}</span>
                        {tx.idempotency_key && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-gray-600 truncate max-w-[120px]">
                              {tx.idempotency_key}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-bold font-mono ${
                      isEarn ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isEarn ? `+${tx.amount}` : tx.amount} Coins
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
