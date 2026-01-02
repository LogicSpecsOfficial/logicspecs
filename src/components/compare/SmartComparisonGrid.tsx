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

// --- DATA: HISTORICAL TRENDS ---
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

  if (!devices || devices.length === 0) {
    return (
      <div className="text-center py-32 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-dashed border-gray-300">
        <p className="text-gray-400 font-medium italic">Add devices to generate the technical matrix.</p>
      </div>
    );
  }

  const gridCols = devices.length;

  // Verdict calculation for the Summary Card
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
      <div className="w-full space-y-8">
        
        {/* 1. SUMMARY VERDICT BENTO */}
        {!focusedCategory && devices.length > 1 && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-xl">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">LogicSpecs AI Verdict</span>
                <h3 className="text-3xl font-bold mt-3 tracking-tight leading-tight">
                  The <span className="text-white underline decoration-4 underline-offset-8 decoration-blue-500/50">{perfWinner.model_name}</span> is the performance king in this lineup.
                </h3>
                <p className="text-blue-100/70 text-sm mt-6 leading-relaxed">
                  With a score of {perfWinner.geekbench_multi}, it outpaces the others in sustained multi-core tasks. Click any performance spec below to see how this fits into Apple's 10-year growth.
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-4 scrollbar-hide">
                {devices.map((d, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-2xl rounded-3xl px-6 py-4 border border-white/10 min-w-[120px]">
                    <div className="text-[9px] font-black opacity-40 uppercase mb-1">Score</div>
                    <div className="text-2xl font-black italic">{d.geekbench_multi || '—'}</div>
                    <div className="text-[9px] opacity-30 truncate mt-1 font-bold">{d.model_name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
          </motion.div>
        )}

        {/* 2. EVOLUTION SPOTLIGHT MODAL */}
        <AnimatePresence>
          {spotlightSpec && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSpotlightSpec(null)}
                className="absolute inset-0 bg-[#000000]/80 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-5xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Historical Analysis</span>
                    <h2 className="text-4xl font-black tracking-tighter text-gray-900 mt-2">
                      {spotlightSpec.replace('_', ' ').toUpperCase()} <span className="text-gray-300">GROWTH</span>
                    </h2>
                  </div>
                  <button onClick={() => setSpotlightSpec(null)} className="group bg-gray-100 p-4 rounded-full hover:bg-black transition-all">
                    <span className="text-gray-900 group-hover:text-white font-bold transition-colors">✕</span>
                  </button>
                </div>

                <div className="h-[450px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HISTORY_DATA[spotlightSpec] || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#bbb', fontSize: 10, fontWeight: 'bold'}} dy={15} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: '15px' }}
                        itemStyle={{ fontWeight: '900', color: '#2563eb', fontSize: '18px' }}
                        labelStyle={{ color: '#999', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}
                        formatter={(val, name, props) => [`${val}`, props.payload.model]}
                      />
                      <Line 
                        type="stepAfter" 
                        dataKey="val" 
                        stroke="#2563eb" 
                        strokeWidth={6} 
                        dot={{ r: 8, fill: '#2563eb', strokeWidth: 4, stroke: '#fff' }} 
                        activeDot={{ r: 12, strokeWidth: 0 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. THE MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <motion.div 
              key={cat.id} 
              layout 
              className="relative overflow-hidden rounded-[3rem] bg-white border border-gray-100 shadow-sm p-10 hover:shadow-xl transition-all duration-500"
            >
              <h3 className="text-2xl font-black tracking-tight mb-12 text-gray-900 flex justify-between items-center">
                {cat.id}
                <span className="w-8 h-1 bg-gray-100 rounded-full"></span>
              </h3>
              
              <div className="space-y-16">
                {cat.specs.map((spec) => {
                  const hasHistory = !!HISTORY_DATA[spec.key];
                  return (
                    <div 
                      key={spec.key} 
                      onClick={() => hasHistory && setSpotlightSpec(spec.key)}
                      className={`group relative ${hasHistory ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'} transition-all duration-300`}
                    >
                      {/* Floating Label */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-300 group-hover:text-blue-500 transition-colors whitespace-nowrap">
                          {spec.label}
                        </span>
                        {hasHistory && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>

                      {/* Data Row */}
                      <div className="grid gap-4 pt-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                        {devices.map((device, idx) => {
                          const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                          return (
                            <div key={idx} className={`text-center px-2 ${idx < gridCols - 1 ? 'border-r border-gray-50' : ''}`}>
                              <span className={`text-xl md:text-3xl font-black tracking-tighter block transition-all duration-500 ${isWinner ? 'text-green-600 scale-110' : 'text-gray-900 opacity-80'}`}>
                                {device[spec.key] || '—'}
                                <span className={`text-[10px] ml-0.5 font-bold ${isWinner ? 'text-green-400' : 'text-gray-300'}`}>
                                  {spec.unit}
                                </span>
                              </span>
                              {isWinner && devices.length > 1 && (
                                <span className="text-[8px] font-black text-green-500/50 uppercase tracking-widest mt-1 block">BEST</span>
                              )}
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