'use client';

import React from 'react';
import { EquipmentType } from '@/lib/types';
import { EQUIPMENT_OPTIONS } from '@/lib/exerciseData';
import { Check, Home, Dumbbell } from 'lucide-react';

interface EquipmentSelectorProps {
  selectedEquipment: EquipmentType[];
  onChange: (equip: EquipmentType[]) => void;
}

export default function EquipmentSelector({ selectedEquipment, onChange }: EquipmentSelectorProps) {
  const isBodyweightOnly = selectedEquipment.length === 1 && selectedEquipment[0] === 'bodyweight';

  const handleToggle = (id: EquipmentType) => {
    let updated: EquipmentType[];
    if (selectedEquipment.includes(id)) {
      updated = selectedEquipment.filter(e => e !== id);
      // Ensure at least bodyweight is preserved
      if (updated.length === 0) updated = ['bodyweight'];
    } else {
      updated = [...selectedEquipment, id];
    }
    onChange(updated);
  };

  const setHomeOnly = () => {
    onChange(['bodyweight']);
  };

  const setAllGym = () => {
    onChange(EQUIPMENT_OPTIONS.map(e => e.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Pilih Alat yang Tersedia</span>
            <span className="text-xs bg-[#ccff00]/15 text-[#ccff00] font-mono px-2 py-0.5 rounded-full border border-[#ccff00]/30">
              {selectedEquipment.length} Alat Aktif
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Sistem hanya akan merekomendasikan latihan yang alatnya kamu miliki saat ini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={setHomeOnly}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isBodyweightOnly
                ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                : 'bg-gray-800 text-gray-300 hover:text-white border border-gray-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Tanpa Alat (Home)</span>
          </button>

          <button
            type="button"
            onClick={setAllGym}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 hover:text-white border border-gray-700 transition-all flex items-center gap-1.5"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Pilih Semua</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {EQUIPMENT_OPTIONS.map(eq => {
          const isSelected = selectedEquipment.includes(eq.id);

          return (
            <button
              key={eq.id}
              type="button"
              onClick={() => handleToggle(eq.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3.5 group relative ${
                isSelected
                  ? 'bg-[#152010] border-[#ccff00] shadow-md shadow-[#ccff00]/10'
                  : 'bg-[#121620] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-black/40 border border-gray-800 shrink-0">
                {eq.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#ccff00]' : 'text-white'}`}>
                    {eq.name}
                  </span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1.5 ${
                    isSelected ? 'bg-[#ccff00] text-black' : 'border border-gray-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {eq.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
