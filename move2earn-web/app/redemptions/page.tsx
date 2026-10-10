'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TicketCheck, Copy, Check, Gift, ArrowRight, ShieldCheck } from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { Redemption } from '@/lib/types';

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setRedemptions(Move2EarnStore.getRedemptions());
  }, []);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TicketCheck className="w-6 h-6 text-green-400" />
          Voucher & Hadiah Saya
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Daftar seluruh kode voucher demo dan hadiah yang telah berhasil kamu klaim.
        </p>
      </div>

      {redemptions.length === 0 ? (
        <div className="p-12 text-center bg-[#111827] border border-gray-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-gray-500">
            <TicketCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white">Belum Ada Voucher</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Kamu belum menukarkan Move Coins dengan hadiah apapun. Kumpulkan koin dengan berolahraga dan kunjungi katalog reward!
          </p>
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs shadow transition-colors"
          >
            <Gift className="w-4 h-4" />
            <span>Jelajahi Katalog Reward</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {redemptions.map((red) => {
            const dateStr = new Date(red.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={red.id}
                className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                    <span>{dateStr}</span>
                    <span className="text-green-400 font-mono">-{red.coins_spent} Coins</span>
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    {red.reward?.title || 'Reward Penukaran'}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {red.reward?.description}
                  </p>
                </div>

                <div className="p-3 bg-gray-950 border border-dashed border-gray-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>KODE VOUCHER</span>
                    <span className="text-emerald-400">Status: {red.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-amber-300">
                      {red.voucher_code}
                    </span>
                    <button
                      onClick={() => handleCopy(red.id, red.voucher_code || '')}
                      className="p-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center gap-1"
                    >
                      {copiedId === red.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
