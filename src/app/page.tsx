'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function FinderPage() {
  const [phones, setPhones] = useState<any[]>([]);
  const [filteredPhones, setFilteredPhones] = useState<any[]>([]);
  
  // 1. Current Global Category (iPhone, iPad, Mac, etc.)
  const [currentCategory, setCurrentCategory] = useState('iPhone');
  
  // 2. Current Sub-Filter (Pro, Max, etc.)
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function fetchPhones() {
      const { data } = await supabase
        .from('iPhones')
        .select('*')
        .order('release_date', { ascending: false });
      if (data) {
        setPhones(data);
        setFilteredPhones(data);
      }
    }
    if (currentCategory === 'iPhone') {
      fetchPhones();
    }
  }, [currentCategory]);

  const filterDevices = (series: string) => {
    setActiveFilter(series);
    if (series === 'All') {
      setFilteredPhones(phones);
    } else {
      setFilteredPhones(phones.filter(p => p.series.includes(series)));
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f]">
      
      {/* GLOBAL CATEGORY SWITCHER */}
      <nav className="fixed top-0 w-full z-50 bg-[#1d1d1f]/90 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="font-black tracking-tighter text-xl italic text-blue-500">LOGICSPECS</span>
          <div className="flex gap-8 text-[12px] font-bold uppercase tracking-widest">
            {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`transition-colors ${currentCategory === cat ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* SUB-FILTER (Changes based on Category) */}
      <div className="pt-24 pb-6 bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter {currentCategory}:</span>
          <div className="flex gap-2">
            {currentCategory === 'iPhone' ? (
              ['All', 'Pro', 'Max', 'Plus', 'SE'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => filterDevices(sub)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    activeFilter === sub ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">Database coming soon...</span>
            )}
          </div>
        </div>
      </div>

      <header className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter">
          Explore {currentCategory}.
        </h1>
      </header>

      {/* RESULT GRID */}
      {currentCategory === 'iPhone' && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-40">
          {filteredPhones.map((phone) => (
            <Link 
              href={`/device/${phone.slug}`} 
              key={phone.model_identifier}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{phone.series}</p>
                    <h2 className="text-2xl font-bold tracking-tight mt-1">{phone.model_name}</h2>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Chip</span>
                  <span className="font-bold text-gray-800">{phone.chip_name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Display</span>
                  <span className="font-bold text-gray-800">{phone.display_size_inches}"</span>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <span className="text-xs font-bold text-blue-500 group-hover:underline">View All Specs →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}