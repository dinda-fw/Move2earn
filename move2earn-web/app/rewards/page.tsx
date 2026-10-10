'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Coins, 
  Tag, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { Reward } from '@/lib/types';

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [balance, setBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setRewards(Move2EarnStore.getRewards());
    setBalance(Move2EarnStore.getWalletSummary().balance);
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'digital_wallet', label: 'Dompet Digital' },
    { id: 'voucher', label: 'Voucher Belanja' },
    { id: 'nutrition', label: 'Suplemen & Nutrisi' },
    { id: 'merchandise', label: 'Merchandise Olahraga' },
  ];

  const filteredRewards = rewards.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#1e1c14] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Marketplace & Katalog Reward</h1>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono uppercase">
              Demo Rewards Included
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Tukarkan Move Coins yang kamu dapatkan dari menuntaskan intervensi workout menjadi saldo e-wallet dan voucher belanja nyata.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-950/80 px-4 py-2.5 rounded-xl border border-gray-800">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-gray-400">Saldo Tersedia</div>
            <div className="text-lg font-bold text-amber-300 font-mono leading-none">{balance} Coins</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-800 pb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedCategory === c.id
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-transparent'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* REWARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const canAfford = balance >= reward.coin_price;
          const isOutOfStock = reward.stock <= 0;

          return (
            <div
              key={reward.id}
              className="rounded-2xl bg-[#111827] border border-gray-800 overflow-hidden flex flex-col justify-between hover:border-gray-700 transition-all group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 bg-gray-950 overflow-hidden">
                  <img
                    src={reward.image_url}
                    alt={reward.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {reward.is_demo && (
                      <span className="bg-amber-500/90 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                        DEMO REWARD
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-black/75 backdrop-blur text-gray-200 text-xs px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      {reward.coin_price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{reward.category.replace('_', ' ')}</span>
                    <span className={reward.stock < 5 ? 'text-red-400 font-semibold' : 'text-gray-400'}>
                      Stok: {reward.stock} unit
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white leading-snug group-hover:text-green-400 transition-colors">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {reward.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  href={`/rewards/${reward.id}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isOutOfStock
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-green-500 hover:bg-green-400 text-black shadow-md shadow-green-500/20'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <span>{isOutOfStock ? 'Stok Habis' : 'Detail & Tukarkan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
