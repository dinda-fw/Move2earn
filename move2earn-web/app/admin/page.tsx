'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Dumbbell, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  Plus, 
  Database,
  RefreshCw
} from 'lucide-react';
import { Move2EarnStore } from '@/lib/store';
import { Challenge, Reward } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChallenges(Move2EarnStore.getChallenges());
    setRewards(Move2EarnStore.getRewards());
  };

  const startEdit = (reward: Reward) => {
    setEditingRewardId(reward.id);
    setEditStock(reward.stock);
    setEditPrice(reward.coin_price);
  };

  const saveEdit = (rewardId: string) => {
    Move2EarnStore.updateRewardStock(rewardId, editStock, editPrice);
    setEditingRewardId(null);
    setIsSavedNotice(true);
    loadData();
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              Admin Portal
            </h1>
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono">
              Staff Only
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Pengelolaan katalog tantangan olahraga, inventaris hadiah, dan verifikasi status sinkronisasi backend.
          </p>
        </div>

        {/* Backend Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs">
          <Database className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-gray-500 font-mono">BACKEND MODE</div>
            <div className="font-semibold text-white">
              {supabaseReady ? 'Supabase Live Connected' : 'Hybrid Local Demo Store'}
            </div>
          </div>
        </div>
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Perubahan data berhasil disimpan!</span>
        </div>
      )}

      {/* SECTION 1: WORKOUT CHALLENGES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Dumbbell className="w-5 h-5 text-green-400" />
            <span>Katalog Gerakan Workout (Interstitial)</span>
          </div>
          <span className="text-xs text-gray-400">{challenges.length} Tantangan Aktif</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => (
            <div key={ch.id} className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-md">
                  {ch.category}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  +{ch.coin_reward} Move Coins
                </span>
              </div>
              <h4 className="text-base font-semibold text-white">{ch.title}</h4>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{ch.instructions}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
                <span>Durasi: {ch.duration_seconds} Detik</span>
                <span className="text-emerald-400 font-mono">Camera + Video Split</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: REWARDS INVENTORY MANAGEMENT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Gift className="w-5 h-5 text-amber-400" />
            <span>Manajemen Stok & Harga Hadiah Marketplace</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900/80 text-gray-400 uppercase font-mono text-[11px] border-b border-gray-800">
                <tr>
                  <th className="p-4">Hadiah</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga Koin</th>
                  <th className="p-4">Sisa Stok</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/70">
                {rewards.map((r) => {
                  const isEditing = editingRewardId === r.id;

                  return (
                    <tr key={r.id} className="hover:bg-gray-850/40">
                      <td className="p-4 font-medium text-white max-w-xs">{r.title}</td>
                      <td className="p-4 capitalize text-gray-400">{r.category.replace('_', ' ')}</td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-amber-300 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-amber-300 font-bold">{r.coin_price} Coins</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white font-mono"
                          />
                        ) : (
                          <span className={`font-mono ${r.stock <= 5 ? 'text-red-400 font-bold' : ''}`}>
                            {r.stock} unit
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                          Aktif
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => saveEdit(r.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-lg inline-flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" /> Simpan
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(r)}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
