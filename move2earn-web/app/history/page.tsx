'use client';

import React, { useState, useEffect } from 'react';
import { History, Calendar, Clock, Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { WalletTransaction, WorkoutSession } from '@/lib/types';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    setTransactions(Move2EarnStore.getTransactions());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-green-400" />
          Riwayat Aktivitas & Sesi Olahraga
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Catatan lengkap sesi workout yang telah diselesaikan dan intervensi screen time harian.
        </p>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Log Aktivitas Terbaru</span>
          <span className="text-xs text-gray-400 font-mono">{transactions.length} Entri Tercatat</span>
        </div>

        <div className="divide-y divide-gray-800/80">
          {transactions.map((tx) => {
            const isEarn = tx.transaction_type === 'earn';
            const dateStr = new Date(tx.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-850/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isEarn ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {isEarn ? <Flame className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{tx.description}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="capitalize">{tx.reference_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono ${
                      isEarn ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isEarn ? `+${tx.amount}` : tx.amount} Coins
                  </span>
                  <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
