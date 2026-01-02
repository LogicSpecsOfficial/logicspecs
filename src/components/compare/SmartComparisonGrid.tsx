'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

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

// Logic for Support Years (Using 2026 as current context)
const getSupportRemaining = (releaseDate: string) => {
  if (!releaseDate) return 0;
  const releaseYear = new Date(releaseDate).getFullYear();
  const currentYear = 2026; // Current year context
  // iPhones generally get 6-7 years of major OS updates
  const estimatedEndYear = releaseYear + 7;
  const remaining = estimatedEndYear - currentYear;
  return Math.max(0, remaining);
};

export default function SmartComparisonGrid({ devices }: { devices: any[] }) {
  const [spotlightSpec, setSpotlightSpec] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!devices || devices.length === 0) return null;

  const gridCols = devices.length;

  // Identify the device with the most years of updates remaining
  const longevityWinner = devices.reduce((prev, current) => 
    (getSupportRemaining(prev.release_date) > getSupportRemaining(current.release_date)) ? prev : current
  , devices[0]);

  const speedChartData = devices.map(d => ({
    name: d.model_name,
    score: d.geekbench_multi || 0,
    shortName: d.model_name.replace('iPhone ', '')
  }));

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
    }
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
      <div className="w-full space-y-10">
        
        {/* 1. LONGEVITY FORECAST BENTO - Updated to show device names clearly */}
        {devices.length > 1 && !filterQuery && (
           <motion.div layout className="bg-[#0A0A0B] rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                <div className="space-y-6">
                  <div>
                    <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Hardware Lifespan Audit</span>
                    <h3 className="text-3xl font-black mt-3 tracking-tighter italic uppercase">
                      Longevity <span className="text-blue-600">Comparison</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {devices.map((d, i) => {
                      const remaining = getSupportRemaining(d.release_date);
                      const isWinner = d.slug === longevityWinner.slug;
                      return (
                        <div key={i} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${isWinner ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5' : 'bg-white/5 border-white/10'}`}>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d.model_name}</span>
                            <span className="text-sm font-medium text-white/60">Estimated Support until {new Date(d.release_date).getFullYear() + 7}</span>
                          </div>
                          <div className="text-right">
                             <div className={`text-2xl font-black italic ${remaining > 2 ? 'text-green-500' : remaining > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                               {remaining === 0 ? 'EOL' : `${remaining}Y Left`}
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="h-[250px] w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/10 relative">
                  <span className="absolute top-6 left-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Multi-Core Performance Gap</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={speedChartData} margin={{ top: 30, right: 0, left: -40, bottom: 0 }}>
                      <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 'bold'}} />
                      <Bar dataKey="score" radius={[12, 12, 12, 12]} barSize={45}>
                        {speedChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score === Math.max(...speedChartData.map(s => s.score)) ? '#2563eb' : '#222'} />
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
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search specifications..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3. HISTORY MODAL */}
        <AnimatePresence>
          {spotlightSpec && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpotlightSpec(null)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[3.5rem] p-10 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Historical Trend</span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">{spotlightSpec.replace(/_/g, ' ')}</h2>
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
                      <Tooltip content={({ active, payload }) => (active && payload ? (
                        <div className="bg-black text-white p-4 rounded-2xl shadow-2xl">
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

        {/* 4. MAIN MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          {filteredCategories.map((cat) => (
            <motion.div key={cat.id} layout className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-50 px-10 pt-8 pb-4">
                <h3 className="text-xl font-black tracking-tighter mb-4 uppercase italic text-gray-300">{cat.id}</h3>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                  {devices.map((device, idx) => (
                    <div key={idx} className="text-center px-1">
                      <span className="text-[9px] font-black uppercase tracking-tighter text-blue-600 block line-clamp-2 leading-none">
                        {device.model_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 pt-12 space-y-12">
                {cat.specs.map((spec) => {
                  const hasHistory = !!HISTORY_DATA[spec.key];
                  return (
                    <div key={spec.key} onClick={() => hasHistory && setSpotlightSpec(spec.key)} className={`relative ${hasHistory ? 'cursor-pointer group' : ''}`}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-300 group-hover:text-blue-500 transition-colors">{spec.label}</span>
                        {hasHistory && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
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
                                {typeof value === 'number' && spec.unit && <span className="text-[9px] ml-0.5 font-bold text-gray-300">{spec.unit}</span>}
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