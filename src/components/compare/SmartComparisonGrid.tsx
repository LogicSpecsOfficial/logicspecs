'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

type SpecCategory = 'Performance' | 'Display' | 'Camera' | 'Battery';

const springTransition = { 
  type: "spring" as const, 
  stiffness: 300, 
  damping: 30, 
  mass: 1 
};

/**
 * Utility to determine if a value is the "Winner" in a set of devices
 * for a specific key (e.g., highest RAM or highest Geekbench)
 */
const getIsWinner = (currentVal: any, allDevices: any[], specKey: string) => {
  if (typeof currentVal !== 'number') return false;
  const values = allDevices.map(d => typeof d[specKey] === 'number' ? d[specKey] : 0);
  const max = Math.max(...values);
  return currentVal === max && max !== 0;
};

export default function SmartComparisonGrid({ devices }: { devices: any[] }) {
  const [focusedCategory, setFocusedCategory] = useState<SpecCategory | null>(null);

  // Safety: If no devices, show empty state
  if (!devices || devices.length === 0) {
    return (
      <div className="text-center py-32 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-300">
        <p className="text-gray-400 font-medium italic">Add devices to start the technical analysis.</p>
      </div>
    );
  }

  const gridCols = devices.length;

  // Performance Winner Calculation for the Summary Bento
  const perfWinner = devices.reduce((prev, current) => 
    ((prev.geekbench_multi || 0) > (current.geekbench_multi || 0)) ? prev : current
  , devices[0]);

  const categories: { id: SpecCategory; specs: { label: string; key: string; unit?: string }[] }[] = [
    {
      id: 'Performance',
      specs: [
        { label: 'Chipset', key: 'chip_name' },
        { label: 'RAM', key: 'ram_gb', unit: 'GB' },
        { label: 'Geekbench', key: 'geekbench_multi' },
      ]
    },
    {
      id: 'Display',
      specs: [
        { label: 'Size', key: 'display_size_inches', unit: '"' },
        { label: 'Refresh', key: 'refresh_rate_hz', unit: 'Hz' },
        { label: 'Brightness', key: 'peak_brightness_nits', unit: ' nits' },
      ]
    },
    {
      id: 'Camera',
      specs: [
        { label: 'Main', key: 'main_camera_mp', unit: 'MP' },
        { label: 'Ultrawide', key: 'ultrawide_mp', unit: 'MP' },
        { label: 'Zoom', key: 'optical_zoom' },
      ]
    },
    {
      id: 'Battery',
      specs: [
        { label: 'Capacity', key: 'battery_mah', unit: ' mAh' },
        { label: 'Charging', key: 'wired_charging_w', unit: 'W' },
      ]
    }
  ];

  return (
    <LayoutGroup>
      <div className="w-full space-y-6">
        
        {/* SUMMARY INSIGHT BENTO */}
        {!focusedCategory && devices.length > 1 && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden mb-10"
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-md">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">LogicSpecs AI Insight</span>
                <h3 className="text-2xl font-bold mt-2 tracking-tight">The Verdict</h3>
                <p className="text-blue-100 text-sm mt-2 font-medium">
                  The <span className="font-bold text-white underline decoration-2 underline-offset-4 decoration-blue-300">
                    {perfWinner.model_name}
                  </span> stands out as the power leader with a Geekbench score of {perfWinner.geekbench_multi}.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto">
                {devices.map((d, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 flex-shrink-0">
                    <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Score</div>
                    <div className="text-xl font-black">{d.geekbench_multi || 'N/A'}</div>
                    <div className="text-[8px] opacity-40 truncate max-w-[80px]">{d.model_name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          </motion.div>
        )}

        {/* TABS FOR FILTERING INTENT */}
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          <button 
            onClick={() => setFocusedCategory(null)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!focusedCategory ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-500 hover:text-black border border-gray-200'}`}
          >
            Overview
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFocusedCategory(focusedCategory === cat.id ? null : cat.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${focusedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-500 hover:text-black border border-gray-200'}`}
            >
              {cat.id}
            </button>
          ))}
        </div>

        {/* BENTO GRID SPECIFICATION MATRIX */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => {
              const isFocused = focusedCategory === cat.id;
              if (focusedCategory && !isFocused) return null;

              return (
                <motion.div
                  layout
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springTransition}
                  onClick={() => setFocusedCategory(isFocused ? null : cat.id)}
                  className={`
                    relative overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl cursor-pointer transition-colors
                    ${isFocused ? 'md:col-span-2 ring-4 ring-blue-500/10 z-10' : 'md:col-span-1 hover:bg-white/80'}
                  `}
                >
                  <div className="p-8 border-b border-gray-100/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">{cat.id}</h3>
                    {isFocused && <span className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span> Deep Analysis
                    </span>}
                  </div>

                  <div className="p-8 grid gap-12">
                    {cat.specs.map((spec) => (
                      <div key={spec.key} className="relative">
                        {/* THE FIX: Floating spec labels that adapt to the grid */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 bg-gray-50 px-3 py-0.5 rounded-full z-10">
                          {spec.label}
                        </div>
                        
                        {/* THE FIX: Row that iterates through ALL devices dynamically */}
                        <div 
                           className="grid gap-2 pt-4 items-end"
                           style={{ 
                             gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` 
                           }}
                        >
                           {devices.map((device, idx) => {
                             const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                             
                             return (
                               <div 
                                 key={`${device.slug}-${idx}`} 
                                 className={`text-center px-2 flex flex-col items-center justify-center ${idx < gridCols - 1 ? 'border-r border-gray-100' : ''}`}
                               >
                                 <span className={`text-lg md:text-2xl font-bold tracking-tighter block transition-colors duration-500 ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
                                   {device[spec.key] || '—'}
                                   {device[spec.key] && (
                                     <span className={`text-[10px] ml-0.5 font-medium ${isWinner ? 'text-green-500/70' : 'text-gray-400'}`}>
                                       {spec.unit}
                                     </span>
                                   )}
                                 </span>
                                 {isWinner && devices.length > 1 && (
                                   <motion.span 
                                     initial={{ opacity: 0, y: 5 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-1"
                                   >
                                     Best
                                   </motion.span>
                                 )}
                               </div>
                             );
                           })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Subtle decorative glow */}
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}