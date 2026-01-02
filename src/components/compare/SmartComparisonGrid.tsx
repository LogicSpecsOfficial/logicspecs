'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type SpecCategory = 'Performance' | 'Display' | 'Camera' | 'Battery';

const springTransition = { 
  type: "spring" as const, 
  stiffness: 300, 
  damping: 30, 
  mass: 1 
};

// --- HISTORICAL DATA FOR THE SPOTLIGHT ---
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
    { id: 'Performance', specs: [{ label: 'Chipset', key: 'chip_name' }, { label: 'RAM', key: 'ram_gb', unit: 'GB' }, { label: 'Geekbench', key: 'geekbench_multi' }] },
    { id: 'Display', specs: [{ label: 'Size', key: 'display_size_inches', unit: '"' }, { label: 'Refresh', key: 'refresh_rate_hz', unit: 'Hz' }, { label: 'Brightness', key: 'peak_brightness_nits', unit: ' nits' }] },
    { id: 'Camera', specs: [{ label: 'Main', key: 'main_camera_mp', unit: 'MP' }, { label: 'Ultrawide', key: 'ultrawide_mp', unit: 'MP' }, { label: 'Zoom', key: 'optical_zoom' }] },
    { id: 'Battery', specs: [{ label: 'Capacity', key: 'battery_mah', unit: ' mAh' }, { label: 'Charging', key: 'wired_charging_w', unit: 'W' }] }
  ];

  return (
    <LayoutGroup>
      <div className="w-full space-y-6">
        
        {/* SPEC HISTORY OVERLAY (SPOTLIGHT) */}
        <AnimatePresence>
          {spotlightSpec && HISTORY_DATA[spotlightSpec] && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpotlightSpec(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Evolution Spotlight</h2>
                    <p className="text-gray-400 font-medium">Tracing the history of Apple's {spotlightSpec.replace('_', ' ')}</p>
                  </div>
                  <button onClick={() => setSpotlightSpec(null)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all">✕</button>
                </div>

                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HISTORY_DATA[spotlightSpec]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} dy={10} />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 'bold', color: '#2563eb' }}
                        labelStyle={{ color: '#999', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => (
              <motion.div key={cat.id} layout className={`relative overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl p-8`}>
                <h3 className="text-xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-4">{cat.id}</h3>
                <div className="space-y-12">
                  {cat.specs.map((spec) => (
                    <div 
                      key={spec.key} 
                      onClick={() => HISTORY_DATA[spec.key] && setSpotlightSpec(spec.key)}
                      className={`group cursor-pointer relative ${HISTORY_DATA[spec.key] ? 'hover:scale-[1.02]' : ''} transition-transform`}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {spec.label} {HISTORY_DATA[spec.key] && <span className="text-blue-500 ml-1">● History</span>}
                      </div>
                      
                      <div className="grid gap-2 pt-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                        {devices.map((device, idx) => {
                          const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                          return (
                            <div key={idx} className={`text-center px-2 ${idx < gridCols - 1 ? 'border-r border-gray-100' : ''}`}>
                              <span className={`text-xl md:text-2xl font-bold tracking-tighter block transition-colors ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
                                {device[spec.key] || '—'}
                                <span className="text-[10px] ml-0.5 font-medium text-gray-400">{spec.unit}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </LayoutGroup>
  );
}