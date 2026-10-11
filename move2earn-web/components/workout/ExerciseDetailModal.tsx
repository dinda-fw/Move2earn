'use client';

import React, { useState } from 'react';
import { Exercise } from '@/lib/types';
import { getYouTubeEmbedUrl } from '@/lib/youtube';
import { 
  X, 
  Play, 
  Dumbbell, 
  Clock, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartSingle?: (exercise: Exercise) => void;
}

export default function ExerciseDetailModal({ exercise, onClose, onStartSingle }: ExerciseDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'instructions' | 'anatomy'>('video');

  if (!exercise) return null;

  const embedUrl = getYouTubeEmbedUrl(exercise.full_video_url, { autoplay: false });
  const thumbnailUrl = exercise.full_video_image_url;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f1420] border border-gray-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-fadeIn">
        
        {/* HEADER */}
        <div className="p-5 border-b border-gray-800/80 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-mono">
                {exercise.category}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 capitalize px-2 py-0.5 rounded-md bg-gray-800">
                Level: {exercise.difficulty}
              </span>
              {exercise.name_en && (
                <span className="text-[11px] text-gray-400 italic">
                  ({exercise.name_en})
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{exercise.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-gray-800/80 bg-[#0a0e17] px-5 shrink-0">
          <button
            onClick={() => setActiveTab('video')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'video' 
                ? 'border-[#ccff00] text-[#ccff00]' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Video Tutorial</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'instructions' 
                ? 'border-[#ccff00] text-[#ccff00]' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Instruksi Langkah Gerakan</span>
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'anatomy' 
                ? 'border-[#ccff00] text-[#ccff00]' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Otot & Alat</span>
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: VIDEO DEMONSTRATION */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800 relative shadow-inner">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={exercise.name}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : thumbnailUrl ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={thumbnailUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-14 h-14 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold mb-2 shadow-lg">
                        <Play className="w-6 h-6 ml-1" />
                      </div>
                      <span className="text-xs font-bold text-white">Video Tutorial Demonstrasi</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121824] to-[#0a0e16]">
                    <div className="w-16 h-16 rounded-2xl bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center text-3xl mb-2">
                      🏃
                    </div>
                    <span className="text-sm font-bold text-white mb-1">{exercise.name}</span>
                    <span className="text-xs text-gray-400">Ilustrasi gerakan & teknik dapat dibaca di tab instruksi.</span>
                  </div>
                )}
              </div>

              {/* Video Note & Attribution */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 bg-[#121722] p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#ccff00]" />
                  <span>Video demonstrasi teknik resmi diputar via YouTube embed player tanpa cookie pelacak.</span>
                </div>
                {exercise.full_video_url && (
                  <a
                    href={exercise.full_video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ccff00] hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Buka YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Short Introduction */}
              {exercise.introduction && (
                <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-300 leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-[#ccff00] block mb-1">Ikhtisar Latihan</span>
                  {exercise.introduction}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STEP BY STEP INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Panduan Pelaksanaan</h4>
                <ol className="space-y-2.5 text-xs text-gray-200">
                  {exercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 items-start bg-[#121722] p-3 rounded-xl border border-gray-800">
                      <span className="w-6 h-6 rounded-full bg-[#ccff00]/20 text-[#ccff00] flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-[#ccff00]/30 font-mono">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-xs">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Safety Notes */}
              {exercise.safety_notes && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex gap-3 text-xs text-amber-200">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5 text-amber-400">Catatan Keselamatan & Bentuk Gerakan:</span>
                    <p className="leading-relaxed">{exercise.safety_notes}</p>
                  </div>
                </div>
              )}

              {/* Alternatives & Progressions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {exercise.easier_alternative && (
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <span className="text-[10px] font-bold text-teal-400 uppercase block mb-1">Alternatif Lebih Mudah (Regresi)</span>
                    <p className="text-gray-300">{exercise.easier_alternative}</p>
                  </div>
                )}
                {exercise.harder_alternative && (
                  <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">Variasi Lebih Berat (Progresi)</span>
                    <p className="text-gray-300">{exercise.harder_alternative}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ANATOMY & DETAILS */}
          {activeTab === 'anatomy' && (
            <div className="space-y-4">
              {/* Muscle Targets Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#141b27] to-[#0c1017] border border-gray-800 space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1.5">Target Otot Utama (Primary)</span>
                  <span className="px-3 py-1 rounded-lg bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-bold text-xs uppercase tracking-wide inline-block">
                    {exercise.primary_muscle.replace('_', ' ')}
                  </span>
                </div>

                {exercise.secondary_muscles.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1.5">Otot Sekunder Terlibat</span>
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.secondary_muscles.map((muscle) => (
                        <span key={muscle} className="px-2.5 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[11px] font-medium capitalize">
                          {muscle.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#121722] border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Rekomendasi Set</span>
                  <span className="text-base font-black text-white font-mono">{exercise.recommended_sets} Sets</span>
                </div>

                <div className="p-3 rounded-xl bg-[#121722] border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Target Repetisi</span>
                  <span className="text-xs font-bold text-[#ccff00] font-mono">{exercise.recommended_reps}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#121722] border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Waktu Istirahat</span>
                  <span className="text-base font-black text-white font-mono">{exercise.default_rest_seconds}s</span>
                </div>

                <div className="p-3 rounded-xl bg-[#121722] border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Alat Dibutuhkan</span>
                  <span className="text-xs font-bold text-gray-300 capitalize">{exercise.equipment.join(', ')}</span>
                </div>
              </div>

              {/* Location options */}
              <div className="p-3 rounded-xl bg-[#121722] border border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Dapat Dilakukan Di:</span>
                <span className="font-bold text-white capitalize">{exercise.location.join(' • ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-gray-800 bg-[#0c1018] flex items-center justify-between shrink-0 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>

          {onStartSingle && (
            <button
              onClick={() => {
                onClose();
                onStartSingle(exercise);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#ccff00]/15 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Mulai Latihan Ini (Single Session)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
