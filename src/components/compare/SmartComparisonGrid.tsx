'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

type SpecCategory = 'Performance' | 'Display' | 'Camera' | 'Battery';

const springTransition = { 
  type: "spring" as const, 
  stiffness: 300, 
  damping: 30, 
  mass: 1 
};

// --- EXPANDED HISTORICAL TRENDS ---
const HISTORY_DATA: Record<string, { year: string; val: number; model: string }[]> = {
  ram_gb: [
    { year: '2007', val: 0.128, model: 'iPhone 2G' },
    { year: '2010', val: 0.512, model: 'iPhone 4' },
    { year: '2012', val: 1, model: 'iPhone 5' },
    { year: '2015', val: 2, model: 'iPhone 6s' },
    { year: '2017', val: 3, model: 'iPhone X' },
    { year: '2020', val: 6, model: 'iPhone 12 Pro' },
    { year: '2024', val: 8, model: 'iPhone 16 Pro' },
    { year: '2026', val: 12, model: 'iPhone 17 Ultra (Est)' },
  ],
  geekbench_multi: [
    { year: '2013', val: 1200, model: 'A7 Chip' },
    { year: '2017', val: 4000, model: 'A11 Bionic' },
    { year: '2020', val: 9000, model: 'A14 Bionic' },
    { year: '2022', val: 15000, model: 'A16 Bionic' },
    { year: '2024', val: 21000, model: 'A18 Pro' },
    { year: '2026', val: 28000, model: 'A19 Pro (Est)' },
  ],
  peak_brightness_nits: [
    { year: '2016', val: 625, model: 'iPhone 7' },
    { year: '2018', val: 800, model: 'iPhone XS' },
    { year: '2021', val: 1200, model: 'iPhone 13 Pro' },
    { year: '2022', val: 2000, model: 'iPhone 14 Pro' },
    { year: '2024', val: 2500, model: 'iPhone 16 Pro' },
  ],
  main_camera_mp: [
    { year: '2007', val: 2, model: 'iPhone 2G' },
    { year: '2010', val: 5, model: 'iPhone 4' },
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

  const perfWinner = devices.reduce((prev, current) => 
    ((prev.geekbench_multi || 0) > (current.geekbench_multi || 0)) ? prev : current
  , devices[0]);

  const categories: { id: SpecCategory; specs: { label: string; key: string; unit?: string }[] }[] = [
    { id: 'Performance', specs: [{ label: 'Chipset', key: 'chip_name' }, { label: 'RAM', key: 'ram_gb', unit: 'GB' }, { label: 'Geekbench', key: 'geekbench_multi' }] },
    { id: 'Display', specs: [{ label: 'Size', key: 'display_size_inches', unit: '"' }, { label: 'Refresh', key: 'refresh_rate_hz', unit: 'Hz' }, { label: 'Brightness', key: 'peak_brightness_nits', unit: ' nits' }] },
    { id: 'Camera', specs: [{ label: 'Main', key: 'main_camera_mp', unit: 'MP' }, { label: 'Ultrawide', key: 'ultrawide_mp', unit: 'MP' }, { label: 'Zoom', key: 'optical_zoom' }] },
    { id: 'Battery', specs: [{ label: 'Capacity', key: 'battery_mah', unit: ' mAh' }, { label: 'Charging', key: 'wired_charging_w', unit: 'W' }] }
  ];

  return (
    <LayoutGroup>
      <div className="w-full space-y-10">
        
        {/* 1. VERDICT BENTO */}
        {!focusedCategory && devices.length > 1 && (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1c1c1e] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-xl">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Analysis complete</span>
                <h3 className="text-3xl md:text-4xl font-black mt-3 tracking-tighter leading-none">
                  THE <span className="text-blue-500 italic">{perfWinner.model_name.toUpperCase()}</span> TAKES THE LEAD.
                </h3>
                <p className="text-gray-400 text-sm mt-6 leading-relaxed max-w-sm">
                  Hardware benchmarking confirms {perfWinner.model_name} as the superior choice for high-intensity workflows and gaming.
                </p>
              </div>
              <div className="flex gap-3">
                {devices.map((d, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                    <div className="text-[24px] font-black italic mb-1">{d.geekbench_multi || '—'}</div>
                    <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{d.model_name}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-32 -mt-32" />
          </motion.div>
        )}

        {/* 2. HISTORY MODAL */}
        <AnimatePresence>
          {spotlightSpec && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpotlightSpec(null)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
              <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[3.5rem] p-10 shadow-2xl">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Hardware Timeline</span>
                    <h2 className="text-5xl font-black tracking-tighter">{spotlightSpec.replace(/_/g, ' ').toUpperCase()}</h2>
                  </div>
                  <button onClick={() => setSpotlightSpec(null)} className="bg-gray-100 h-14 w-14 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">✕</button>
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
                      <Tooltip 
                        cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-black text-white p-4 rounded-2xl shadow-2xl border border-white/20">
                                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">{payload[0].payload.year}</p>
                                <p className="text-xl font-black italic">{payload[0].value}</p>
                                <p className="text-[10px] font-bold text-blue-400">{payload[0].payload.model}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="stepAfter" dataKey="val" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. THE MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <motion.div key={cat.id} layout className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700">
              <h3 className="text-2xl font-black tracking-tighter mb-12 uppercase italic text-gray-300">{cat.id}</h3>
              <div className="space-y-16">
                {cat.specs.map((spec) => {
                  const hasHistory = !!HISTORY_DATA[spec.key];
                  return (
                    <div 
                      key={spec.key} 
                      onClick={() => hasHistory && setSpotlightSpec(spec.key)}
                      className={`relative ${hasHistory ? 'cursor-pointer group' : ''}`}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 group-hover:text-blue-600 transition-colors">
                          {spec.label}
                        </span>
                        {hasHistory && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                      </div>

                      <div className="grid pt-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                        {devices.map((device, idx) => {
                          const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                          return (
                            <div key={idx} className={`text-center px-2 ${idx < gridCols - 1 ? 'border-r border-gray-50' : ''}`}>
                              <span className={`text-2xl md:text-4xl font-black tracking-tighter block transition-all duration-500 ${isWinner ? 'text-blue-600' : 'text-gray-900 opacity-80'}`}>
                                {device[spec.key] || '—'}
                                <span className="text-[10px] ml-1 font-bold text-gray-300">{spec.unit}</span>
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