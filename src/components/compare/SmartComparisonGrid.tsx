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

export default function SmartComparisonGrid({ devices }: { devices: any[] }) {
  const [focusedCategory, setFocusedCategory] = useState<SpecCategory | null>(null);

  // Dynamic Grid Columns based on device count
  // If 0 devices, show 1 col. If 5 devices, show 5 cols.
  const gridCols = devices.length > 0 ? devices.length : 1;

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

  if (devices.length === 0) return (
    <div className="text-center py-20 text-gray-400">Select a device to start comparing.</div>
  );

  return (
    <LayoutGroup>
      <div className="w-full space-y-6">
        
        {/* Category Tabs */}
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
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

        {/* The Grid */}
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
                    relative overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl cursor-pointer
                    ${isFocused ? 'md:col-span-2 ring-4 ring-blue-500/10 z-10' : 'md:col-span-1 hover:bg-white/80'}
                  `}
                >
                  <div className="p-8 border-b border-gray-100/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">{cat.id}</h3>
                    {isFocused && <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Active</span>}
                  </div>
                  
                  <div className="p-8 grid gap-10">
                    {cat.specs.map((spec) => (
                      <div key={spec.key} className="relative">
                         {/* Centered Label */}
                        <div className="absolute -top-3 left-0 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {spec.label}
                        </div>
                        
                        {/* Dynamic Column Grid for Values */}
                        <div 
                           className="grid gap-4 pt-2"
                           style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                        >
                           {devices.map((device, idx) => (
                             <div key={device.slug || idx} className={`text-center ${idx < devices.length - 1 ? 'border-r border-gray-100' : ''}`}>
                               <span className="text-xl md:text-2xl font-semibold text-gray-800 block truncate">
                                 {device[spec.key] || '—'}
                                 <span className="text-xs text-gray-400 ml-1 font-normal">{spec.unit}</span>
                               </span>
                             </div>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}