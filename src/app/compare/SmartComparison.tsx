'use client';
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// --- Types ---
type SpecCategory = 'Performance' | 'Display' | 'Camera' | 'Battery' | 'Design';

interface DeviceData {
  name: string;
  [key: string]: any;
}

// --- The Physics Config (Apple-style Spring) ---
const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
};

export default function SmartComparisonGrid({ left, right }: { left: DeviceData, right: DeviceData }) {
  const [focusedCategory, setFocusedCategory] = useState<SpecCategory | null>(null);

  // Define the Bento Tiles
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
        { label: 'Refresh Rate', key: 'refresh_rate_hz', unit: 'Hz' },
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
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* INTENT TABS: Allow user to trigger the "Focus" state manually */}
        <div className="flex gap-2 justify-center mb-10">
          <button 
            onClick={() => setFocusedCategory(null)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!focusedCategory ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            Overview
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFocusedCategory(focusedCategory === cat.id ? null : cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${focusedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-400 hover:text-gray-900'}`}
            >
              {cat.id}
            </button>
          ))}
        </div>

        {/* THE FLUID BENTO GRID */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => {
              // Logic: If a category is focused, it takes up full width (col-span-2).
              // If another category is focused, this one fades out or shrinks.
              const isFocused = focusedCategory === cat.id;
              const isDimmed = focusedCategory !== null && !isFocused;

              if (isDimmed) return null; // "Intent-Based": Hide irrelevant data to reduce cognitive load

              return (
                <motion.div
                  layout
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  transition={springTransition}
                  onClick={() => setFocusedCategory(isFocused ? null : cat.id)} // Click to expand
                  className={`
                    relative overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl cursor-pointer
                    ${isFocused ? 'md:col-span-2 ring-4 ring-blue-500/10 z-10' : 'md:col-span-1 hover:bg-white/80'}
                  `}
                >
                  {/* Card Header */}
                  <div className="p-8 border-b border-gray-100/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">{cat.id}</h3>
                    {isFocused && <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Deep Dive Active</span>}
                  </div>

                  {/* Comparison Data Rows */}
                  <div className="p-8 grid gap-8">
                    {cat.specs.map((spec) => (
                      <div key={spec.key} className="relative">
                        {/* Kinetic Typography: Label grows when focused */}
                        <motion.span 
                          layout 
                          className={`absolute left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-widest text-gray-300 bg-gray-50 px-2 rounded-full ${isFocused ? 'scale-110 text-blue-400' : ''}`}
                        >
                          {spec.label}
                        </motion.span>
                        
                        <div className="flex justify-between items-center pt-2">
                           {/* Left Device Value */}
                           <div className="w-1/2 text-center pr-4 border-r border-gray-100">
                             <span className="text-2xl font-semibold text-gray-800">
                               {left?.[spec.key] || '—'}<span className="text-sm text-gray-400 font-medium">{spec.unit}</span>
                             </span>
                           </div>

                           {/* Right Device Value */}
                           <div className="w-1/2 text-center pl-4">
                             <span className="text-2xl font-semibold text-gray-800">
                               {right?.[spec.key] || '—'}<span className="text-sm text-gray-400 font-medium">{spec.unit}</span>
                             </span>
                           </div>
                        </div>

                        {/* Visual Bar - Only shows when Expanded (Intent-Based) */}
                        {isFocused && typeof left?.[spec.key] === 'number' && (
                          <motion.div 
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden flex"
                          >
                             <div className="h-full bg-blue-500" style={{ width: '50%' }} />
                             <div className="h-full bg-purple-500" style={{ width: '60%' }} />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Liquid Glass Background Reflection */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-[80px] opacity-50 pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}