'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type SpecCategory = 'Performance' | 'Display' | 'Camera' | 'Battery' | 'Design' | 'Connectivity';

const springTransition = { 
  type: "spring" as const, 
  stiffness: 300, 
  damping: 30, 
  mass: 1 
};

// --- DATA: HISTORICAL TRENDS ---
const HISTORY_DATA: Record<string, { year: string; val: number; model: string }[]> = {
  ram_gb: [
    { year: '2012', val: 1, model: 'iPhone 5' },
    { year: '2015', val: 2, model: 'iPhone 6s' },
    { year: '2017', val: 3, model: 'iPhone X' },
    { year: '2020', val: 6, model: 'iPhone 12 Pro' },
    { year: '2024', val: 8, model: 'iPhone 16 Pro' },
  ],
  geekbench_multi: [
    { year: '2017', val: 4000, model: 'A11' },
    { year: '2020', val: 9000, model: 'A14' },
    { year: '2022', val: 15000, model: 'A16' },
    { year: '2024', val: 21000, model: 'A18 Pro' },
  ],
  peak_brightness_nits: [
    { year: '2016', val: 625, model: 'iPhone 7' },
    { year: '2021', val: 1200, model: 'iPhone 13 Pro' },
    { year: '2022', val: 2000, model: 'iPhone 14 Pro' },
    { year: '2024', val: 2500, model: 'iPhone 16 Pro' },
  ],
  main_camera_mp: [
    { year: '2011', val: 8, model: 'iPhone 4s' },
    { year: '2015', val: 12, model: 'iPhone 6s' },
    { year: '2022', val: 48, model: 'iPhone 14 Pro' },
  ]
};

const getIsWinner = (currentVal: any, allDevices: any[], specKey: string) => {
  if (typeof currentVal !== 'number') return false;
  const values = allDevices.map(d => typeof d[specKey] === 'number' ? d[specKey] : 0);
  const max = Math.max(...values);
  return currentVal === max && max !== 0;
};

export default function SmartComparisonGrid({ devices }: { devices: any[] }) {
  const [focusedCategory, setFocusedCategory] = useState<SpecCategory | null>(null);
  const [spotlightSpec, setSpotlightSpec] = useState<string | null>(null);

  if (!devices || devices.length === 0) return null;

  const gridCols = devices.length;

  const categories: { id: SpecCategory; specs: { label: string; key: string; unit?: string }[] }[] = [
    { 
      id: 'Performance', 
      specs: [
        { label: 'Chipset', key: 'chip_name' },
        { label: 'CPU Cores', key: 'cpu_cores' },
        { label: 'RAM', key: 'ram_gb', unit: 'GB' },
        { label: 'Geekbench Multi', key: 'geekbench_multi' },
        { label: 'Geekbench Single', key: 'geekbench_single' },
      ] 
    },
    { 
      id: 'Display', 
      specs: [
        { label: 'Size', key: 'display_size_inches', unit: '"' },
        { label: 'Technology', key: 'display_tech' },
        { label: 'Refresh Rate', key: 'refresh_rate_hz', unit: 'Hz' },
        { label: 'Peak Brightness', key: 'peak_brightness_nits', unit: ' nits' },
      ] 
    },
    { 
      id: 'Camera', 
      specs: [
        { label: 'Main Camera', key: 'main_camera_mp', unit: 'MP' },
        { label: 'Optical Zoom', key: 'optical_zoom_x', unit: 'x' },
        { label: 'Video', key: 'max_video_resolution' },
      ] 
    },
    { 
      id: 'Battery', 
      specs: [
        { label: 'Capacity', key: 'battery_mah', unit: ' mAh' },
        { label: 'Wired Charge', key: 'wired_charging_w', unit: 'W' },
        { label: 'Connector', key: 'port_type' }
      ] 
    },
    {
      id: 'Design',
      specs: [
        { label: 'Weight', key: 'weight_grams', unit: 'g' },
        { label: 'Material', key: 'frame_material' },
        { label: 'Water Resist', key: 'ip_rating' }
      ]
    }
  ];

  return (
    <LayoutGroup>
      <div className="w-full space-y-10">
        
        {/* HISTORY MODAL */}
        <AnimatePresence>
          {spotlightSpec && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpotlightSpec(null)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[3.5rem] p-10 shadow-2xl">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Historical Trend</span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">{spotlightSpec.replace(/_/g, ' ')}</h2>
                  </div>
                  <button onClick={() => setSpotlightSpec(null)} className="bg-gray-100 h-14 w-14 rounded-full flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all">✕</button>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORY_DATA[spotlightSpec] || []}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10, fontWeight: '800'}} dy={15} />
                      <Tooltip content={({ active, payload }) => (active && payload ? (
                        <div className="bg-black text-white p-4 rounded-2xl">
                          <p className="text-[10px] font-black opacity-50 uppercase">{payload[0].payload.year}</p>
                          <p className="text-xl font-black italic text-blue-400">{payload[0].value}</p>
                          <p className="text-[10px] font-bold">{payload[0].payload.model}</p>
                        </div>
                      ) : null)} />
                      <Area type="stepAfter" dataKey="val" stroke="#2563eb" strokeWidth={5} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          {categories.map((cat) => (
            <motion.div key={cat.id} layout className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm overflow-hidden">
              <h3 className="text-xl font-black tracking-tighter mb-8 uppercase italic text-gray-300 border-b border-gray-50 pb-4">
                {cat.id}
              </h3>
              
              {/* THE FIX: Device Names Header for each category block */}
              <div className="grid mb-10 pb-4 border-b border-gray-50" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                {devices.map((device, idx) => (
                  <div key={idx} className="text-center px-1">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-blue-600 block line-clamp-2 leading-none">
                      {device.model_name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-12">
                {cat.specs.map((spec) => {
                  const hasHistory = !!HISTORY_DATA[spec.key];
                  return (
                    <div key={spec.key} onClick={() => hasHistory && setSpotlightSpec(spec.key)} className={`relative ${hasHistory ? 'cursor-pointer group' : ''}`}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-300 group-hover:text-blue-500 transition-colors">
                          {spec.label}
                        </span>
                      </div>

                      <div className="grid pt-2" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                        {devices.map((device, idx) => {
                          const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                          const value = device[spec.key];
                          const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || '—');
                          
                          return (
                            <div key={idx} className={`text-center px-2 ${idx < gridCols - 1 ? 'border-r border-gray-50' : ''}`}>
                              <span className={`text-lg md:text-xl font-black tracking-tighter block transition-colors ${isWinner ? 'text-blue-600' : 'text-gray-900 opacity-80'}`}>
                                {displayValue}
                                {typeof value === 'number' && spec.unit && (
                                  <span className="text-[9px] ml-0.5 font-bold text-gray-300">{spec.unit}</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}