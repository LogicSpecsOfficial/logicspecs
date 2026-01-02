/* v1.4.2 
   Changelog: # Deep Debug Repair: Removed duplicate React import at bottom to fix namespace collision.
*/

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

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

const getSupportRemaining = (releaseDate: string) => {
  if (!releaseDate) return 0;
  const releaseYear = new Date(releaseDate).getFullYear();
  const estimatedEndYear = releaseYear + 7;
  return Math.max(0, estimatedEndYear - 2026);
};

export default function SmartComparisonGrid({ devices }: { devices: any[] }) {
  const [spotlightSpec, setSpotlightSpec] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!devices || devices.length === 0) return null;

  const longevityWinner = devices.reduce((prev, current) => 
    (getSupportRemaining(prev.release_date) > getSupportRemaining(current.release_date)) ? prev : current
  , devices[0]);

  const speedChartData = devices.map(d => ({
    name: d.model_name,
    score: d.geekbench_multi || 0,
    shortName: d.model_name.replace('iPhone ', '')
  }));

  const categories = [
    { id: 'Performance', specs: [
      { label: 'Chipset', key: 'chip_name' },
      { label: 'CPU Cores', key: 'cpu_cores' },
      { label: 'RAM', key: 'ram_gb', unit: 'GB' },
      { label: 'Geekbench Multi', key: 'geekbench_multi' },
      { label: 'Geekbench Single', key: 'geekbench_single' },
    ]},
    { id: 'Display', specs: [
      { label: 'Size', key: 'display_size_inches', unit: '"' },
      { label: 'Refresh Rate', key: 'refresh_rate_hz', unit: 'Hz' },
      { label: 'Peak Brightness', key: 'peak_brightness_nits', unit: ' nits' },
    ]},
    { id: 'Camera', specs: [
      { label: 'Main Camera', key: 'main_camera_mp', unit: 'MP' },
      { label: 'Optical Zoom', key: 'optical_zoom_x', unit: 'x' },
    ]},
    { id: 'Battery', specs: [
      { label: 'Capacity', key: 'battery_mah', unit: ' mAh' },
      { label: 'Charge Speed', key: 'wired_charging_w', unit: 'W' },
      { label: 'Port', key: 'port_type' }
    ]}
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    specs: cat.specs.filter(s => 
      s.label.toLowerCase().includes(filterQuery.toLowerCase()) || 
      cat.id.toLowerCase().includes(filterQuery.toLowerCase())
    )
  })).filter(cat => cat.specs.length > 0);

  return (
    <LayoutGroup>
      <div className="w-full max-w-7xl mx-auto space-y-12 pb-20 px-4">
        
        {/* 1. LONGEVITY BENTO */}
        {!filterQuery && (
          <motion.div layout className="bg-[#0A0A0B] rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Hardware Lifespan Audit</span>
                  <h3 className="text-3xl font-black mt-3 tracking-tighter italic uppercase">Longevity <span className="text-blue-600">Forecast</span></h3>
                </div>
                <div className="space-y-4">
                  {devices.map((d) => {
                    const remaining = getSupportRemaining(d.release_date);
                    const isWinner = d.slug === longevityWinner.slug;
                    return (
                      <div key={d.slug} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${isWinner ? 'bg-blue-600/20 border-blue-500/50 shadow-lg' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d.model_name}</span>
                          <span className="text-sm font-medium text-white/40 italic">Ends ~{new Date(d.release_date).getFullYear() + 7}</span>
                        </div>
                        <span className={`text-2xl font-black italic tabular-nums ${remaining > 2 ? 'text-green-500' : 'text-yellow-500'}`}>
                          {remaining === 0 ? 'EOL' : `${remaining}Y`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-[300px] w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speedChartData}>
                    <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 'bold'}} />
                    <Bar dataKey="score" radius={[12, 12, 12, 12]} barSize={45}>
                      {speedChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.score === Math.max(...speedChartData.map(s => s.score)) ? '#2563eb' : '#222'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>
        )}

        {/* 2. SPEC SEARCH BAR */}
        <div className="flex justify-center sticky top-24 z-50">
          <div className="relative w-full max-w-md px-4">
            <input 
              type="text" 
              placeholder="Filter specifications..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold shadow-[0_20px_50px_rgba(0,0,0,0.1)] outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
            />
          </div>
        </div>

        {/* 3. MAIN MATRIX GRID */}
        <div className="relative overflow-hidden rounded-[3rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0B] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left table-auto">
              <thead className="sticky top-0 z-40 bg-white/98 dark:bg-[#0A0A0B]/98 backdrop-blur-3xl border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="p-8 min-w-[180px] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Parameter</th>
                  {devices.map((device) => (
                    <th key={device.slug} className="p-8 min-w-[260px]">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight">{device.model_name}</span>
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.1em]">{device.chip_name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredCategories.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr className="bg-gray-50/30 dark:bg-white/2">
                      <td colSpan={devices.length + 1} className="px-8 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">{cat.id}</td>
                    </tr>
                    {cat.specs.map((spec) => {
                      const hasHistory = !!HISTORY_DATA[spec.key];
                      return (
                        <tr key={spec.key} 
                            onClick={() => hasHistory && setSpotlightSpec(spec.key)}
                            className={`group transition-all duration-300 ${hasHistory ? 'cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                          <td className="p-8">
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight group-hover:text-blue-500 transition-colors">{spec.label}</span>
                              {hasHistory && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#2563eb]" />}
                            </div>
                          </td>
                          {devices.map((device) => {
                            const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                            return (
                              <td key={device.slug} className="p-8">
                                <span className={`text-xl font-black tracking-tighter tabular-nums transition-all ${isWinner ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100 opacity-60'}`}>
                                  {device[spec.key] || '—'}
                                  {typeof device[spec.key] === 'number' && spec.unit && <span className="text-[10px] ml-1 opacity-30 font-bold uppercase">{spec.unit}</span>}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. HISTORY MODAL */}
        <AnimatePresence>
          {spotlightSpec && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpotlightSpec(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} className="relative bg-white dark:bg-[#0A0A0B] w-full max-w-5xl rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-white/10">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Developmental Cycle</span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">{spotlightSpec.replace(/_/g, ' ')}</h2>
                  </div>
                  <button onClick={() => setSpotlightSpec(null)} className="bg-gray-100 dark:bg-white/10 h-14 w-14 rounded-full flex items-center justify-center dark:text-white hover:scale-90 transition-all">✕</button>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORY_DATA[spotlightSpec] || []}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888811" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10, fontWeight: '800'}} dy={15} />
                      <Tooltip content={({ active, payload }) => (active && payload ? (
                        <div className="bg-black text-white p-5 rounded-2xl shadow-2xl border border-white/10">
                          <p className="text-[10px] font-black opacity-40 uppercase mb-1 tracking-widest">{payload[0].payload.year}</p>
                          <p className="text-2xl font-black italic text-blue-400 tabular-nums">{payload[0].value}</p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">{payload[0].payload.model}</p>
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
      </div>
    </LayoutGroup>
  );
}