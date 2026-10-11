'use client';

import React from 'react';
import { MuscleGroup } from '@/lib/types';
import { MUSCLE_OPTIONS } from '@/lib/exerciseData';
import { Check, Sparkles } from 'lucide-react';

interface MuscleSelectorProps {
  selectedMuscles: MuscleGroup[];
  onChange: (muscles: MuscleGroup[]) => void;
}

export default function MuscleSelector({ selectedMuscles, onChange }: MuscleSelectorProps) {
  const isFullBody = selectedMuscles.includes('full_body');

  const handleToggle = (id: MuscleGroup) => {
    if (id === 'full_body') {
      if (isFullBody) {
        onChange([]);
      } else {
        onChange(['full_body']);
      }
      return;
    }

    // If individual muscle toggled, remove full_body
    let updated = selectedMuscles.filter(m => m !== 'full_body');
    if (updated.includes(id)) {
      updated = updated.filter(m => m !== id);
    } else {
      updated = [...updated, id];
    }
    onChange(updated);
  };

  const categories = [
    { key: 'full', label: 'Menyeluruh', items: MUSCLE_OPTIONS.filter(m => m.category === 'full') },
    { key: 'upper', label: 'Tubuh Bagian Atas (Upper Body)', items: MUSCLE_OPTIONS.filter(m => m.category === 'upper') },
    { key: 'core', label: 'Inti Tubuh (Core & Abs)', items: MUSCLE_OPTIONS.filter(m => m.category === 'core') },
    { key: 'lower', label: 'Tubuh Bagian Bawah (Lower Body)', items: MUSCLE_OPTIONS.filter(m => m.category === 'lower') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Pilih Target Otot</span>
            {selectedMuscles.length > 0 && (
              <span className="text-xs bg-[#ccff00]/15 text-[#ccff00] font-mono px-2 py-0.5 rounded-full border border-[#ccff00]/30">
                {selectedMuscles.length} Terpilih
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Pilih satu atau beberapa area otot yang ingin kamu latih hari ini.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange(isFullBody ? [] : ['full_body'])}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isFullBody
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
              : 'bg-gray-800 text-gray-300 hover:text-white border border-gray-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Body Cepat</span>
        </button>
      </div>

      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat.key} className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block px-1">
              {cat.label}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {cat.items.map(item => {
                const isSelected = selectedMuscles.includes(item.id) || (isFullBody && item.id !== 'full_body');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-[#152010] border-[#ccff00] shadow-md shadow-[#ccff00]/10 text-white'
                        : 'bg-[#121620] border-gray-800 hover:border-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#ccff00]' : 'text-white'}`}>
                        {item.name}
                      </span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#ccff00] text-black' : 'border border-gray-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 block line-clamp-1 leading-tight">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
