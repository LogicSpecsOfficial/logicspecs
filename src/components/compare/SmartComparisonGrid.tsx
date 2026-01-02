/* v1.3.0 
   Changelog: Phase 2: Merged advanced longevity audit and chart logic with high-performance sticky grid architecture.
*/

'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// --- UTILS: OUTSIDE COMPONENT FOR PERFORMANCE ---
const getIsWinner = (currentVal: any, allDevices: any[], specKey: string) => {
  if (typeof currentVal !== 'number') return false;
  const values = allDevices.map(d => typeof d[specKey] === 'number' ? d[specKey] : 0);
  const max = Math.max(...values);
  return currentVal === max && max !== 0;
};

const getSupportRemaining = (releaseDate: string) => {
  if (!releaseDate) return 0;
  const releaseYear = new Date(releaseDate).getFullYear();
  const currentYear = 2026; 
  const estimatedEndYear = releaseYear + 7;
  return Math.max(0, estimatedEndYear - currentYear);
};

export default function SmartComparisonGrid({ devices }: { devices: any[] }) {
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
    ]},
    { id: 'Display', specs: [
      { label: 'Size', key: 'display_size_inches', unit: '"' },
      { label: 'Brightness', key: 'peak_brightness_nits', unit: ' nits' },
      { label: 'Refresh Rate', key: 'refresh_rate_hz', unit: 'Hz' },
    ]},
    { id: 'Battery', specs: [
      { label: 'Capacity', key: 'battery_mah', unit: ' mAh' },
      { label: 'Charge Speed', key: 'wired_charging_w', unit: 'W' },
    ]}
  ];

  return (
    <LayoutGroup>
      <div className="w-full space-y-12">
        
        {/* 1. LONGEVITY BENTO (AEO Optimized) */}
        {devices.length > 1 && (
          <motion.div layout className="bg-brand-dark dark:bg-black rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Hardware Lifespan Audit</span>
                <div className="space-y-4">
                  {devices.map((d) => {
                    const remaining = getSupportRemaining(d.release_date);
                    const isWinner = d.slug === longevityWinner.slug;
                    return (
                      <div key={d.slug} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${isWinner ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase">{d.model_name}</span>
                          <span className="text-sm font-medium text-white/40">Support ends ~{new Date(d.release_date).getFullYear() + 7}</span>
                        </div>
                        <span className={`text-2xl font-black italic ${remaining > 2 ? 'text-green-500' : 'text-yellow-500'}`}>
                          {remaining}Y Left
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-[250px] w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speedChartData}>
                    <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 'bold'}} />
                    <Bar dataKey="score" radius={[10, 10, 10, 10]} barSize={40}>
                      {speedChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.score === Math.max(...speedChartData.map(s => s.score)) ? '#2563eb' : '#333'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. MAIN MATRIX GRID */}
        <div className="relative overflow-hidden rounded-[3.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0B]/50 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="p-8 min-w-[200px] text-[10px] font-black uppercase tracking-widest text-gray-400">Specifications</th>
                  {devices.map((device) => (
                    <th key={device.slug} className="p-8 min-w-[250px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase italic">{device.model_name}</span>
                        <span className="text-[9px] font-bold text-blue-600 tracking-widest uppercase">{device.chip_name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {categories.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr className="bg-gray-50/50 dark:bg-white/5">
                      <td colSpan={devices.length + 1} className="px-8 py-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        {cat.id} Module
                      </td>
                    </tr>
                    {cat.specs.map((spec) => (
                      <tr key={spec.key} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                        <td className="p-8 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">{spec.label}</td>
                        {devices.map((device) => {
                          const isWinner = getIsWinner(device[spec.key], devices, spec.key);
                          return (
                            <td key={device.slug} className="p-8">
                              <span className={`text-xl font-black tracking-tighter transition-all ${isWinner ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-900 dark:text-gray-100 opacity-60'}`}>
                                {device[spec.key] || '—'}
                                {typeof device[spec.key] === 'number' && spec.unit && <span className="text-[10px] ml-1 opacity-40">{spec.unit}</span>}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}

import React from 'react';