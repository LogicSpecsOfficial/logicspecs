'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function FinderPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState('iPhone');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function fetchData() {
      const tableName = currentCategory === 'iPhone' ? 'iPhones' : 
                        currentCategory === 'iPad' ? 'iPads' : null;
      
      if (!tableName) return;

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('release_date', { ascending: false });

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
      } else {
        setDevices(data || []);
        setFilteredDevices(data || []);
      }
    }
    fetchData();
  }, [currentCategory]);

  const filterDevices = (series: string) => {
    setActiveFilter(series);
    if (series === 'All') {
      setFilteredDevices(devices);
    } else {
      setFilteredDevices(devices.filter(d => d.series?.toLowerCase().includes(series.toLowerCase())));
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      
      {/* 1. Category Switcher (iPhone/iPad/Mac) */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex justify-center gap-12 border-b border-gray-200 pb-4">
          {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
            <button 
              key={cat}
              onClick={() => { setCurrentCategory(cat); setActiveFilter('All'); }}
              className={`text-sm font-bold uppercase tracking-widest transition-all ${
                currentCategory === cat ? 'text-apple-blue scale-110' : 'text-gray-400 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Sub-Filters (Pro/Max/Air) */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Select Series</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['All', 'Pro', 'Max', 'Plus', 'Air', 'mini', 'SE'].map((sub) => (
            <button
              key={sub}
              onClick={() => filterDevices(sub)}
              className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${
                activeFilter === sub ? 'bg-apple-blue text-white border-apple-blue shadow-lg shadow-blue-200' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Device Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-40">
        {filteredDevices.map((device) => (
          <Link 
            href={`/device/${device.slug}`} 
            key={device.model_identifier}
            className="liquid-glass rounded-apple p-8 flex flex-col justify-between h-[400px] group border border-white/50"
          >
            <div>
              <span className="text-[10px] font-black text-apple-blue uppercase tracking-widest">{device.series}</span>
              <h2 className="text-2xl font-bold tracking-tight mt-2 leading-tight group-hover:text-apple-blue transition-colors">
                {device.model_name}
              </h2>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-[11px] border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-bold uppercase">Chip</span>
                  <span className="font-bold text-gray-900">{device.chip_name}</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-bold uppercase">Display</span>
                  <span className="font-bold text-gray-900">{device.display_size_inches}"</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-apple-blue opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
              Full Details <span className="text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}