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
      // Determine which table to pull from
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
      setFilteredDevices(devices.filter(d => d.series?.includes(series)));
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f]">
      {/* Global Category Switcher */}
      <nav className="fixed top-0 w-full z-50 bg-[#1d1d1f]/90 backdrop-blur-md text-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-black text-xl italic text-blue-500 uppercase">LogicSpecs</Link>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest">
            {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
              <button 
                key={cat}
                onClick={() => { setCurrentCategory(cat); setActiveFilter('All'); }}
                className={`transition-colors ${currentCategory === cat ? 'text-white underline underline-offset-8' : 'text-gray-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sub-Filter Bar */}
      <div className="pt-24 pb-6 bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter {currentCategory}:</span>
          <div className="flex gap-2">
            {['All', 'Pro', 'Max', 'Plus', 'Air', 'mini'].map((sub) => (
              <button
                key={sub}
                onClick={() => filterDevices(sub)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  activeFilter === sub ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-20">
        {filteredDevices.map((device) => (
          <Link 
            href={`/device/${device.slug}`} 
            key={device.model_identifier}
            className="liquid-glass rounded-apple p-8 flex flex-col justify-between h-[420px] group"
          >
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{device.series}</span>
              <h2 className="text-2xl font-bold tracking-tight mt-2">{device.model_name}</h2>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-xs border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Chip</span>
                  <span className="font-bold">{device.chip_name}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Display</span>
                  <span className="font-bold">{device.display_size_inches}"</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-500 group-hover:underline">Technical Specs →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}