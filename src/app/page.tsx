'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function FinderPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('iPhone');
  const [filter, setFilter] = useState('All'); // New Filter State
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    'iPhone', 'iPad', 'Mac', 'Watch', 
    'Spatial', 'Audio', 'Home', 'Accessory'
  ];

  // 1. FETCH DATA
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMsg('');
      setFilter('All'); // Reset filter when category changes
      
      const tableName = 
        category === 'iPhone' ? 'iPhones' : 
        category === 'iPad' ? 'iPads' : 
        category === 'Mac' ? 'Macs' : 
        category === 'Watch' ? 'Watches' :
        category === 'Spatial' ? 'spatial_computers' :
        category === 'Audio' ? 'audio_devices' :
        category === 'Home' ? 'home_entertainment' :
        category === 'Accessory' ? 'Accessories' : null;

      if (!tableName) return;

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('release_date', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        setErrorMsg(error.message);
        setItems([]);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [category]);

  // 2. GENERATE FILTERS DYNAMICALLY
  const filters = useMemo(() => {
    if (items.length === 0) return [];

    // Special Logic for Macs (Laptops vs Desktops)
    if (category === 'Mac') {
      return ['All', 'MacBook Pro', 'MacBook Air', 'iMac', 'Mac mini', 'Mac Studio', 'Mac Pro'];
    }

    // Default Logic: Extract unique 'series' or 'category'
    const uniqueValues = new Set(items.map(item => {
      // Accessories use 'category', others use 'series'
      const val = category === 'Accessory' ? item.category : item.series;
      // Clean up the string (e.g. remove "Series" word if redundant)
      return val ? val.replace('Series', '').trim() : 'Other';
    }));

    return ['All', ...Array.from(uniqueValues).sort()];
  }, [items, category]);

  // 3. APPLY FILTER
  const filteredItems = useMemo(() => {
    if (filter === 'All') return items;

    return items.filter(item => {
      // Mac Logic: Check if model name contains the filter (e.g. "MacBook Pro 16" includes "MacBook Pro")
      if (category === 'Mac') {
        return item.model_name.includes(filter);
      }
      
      // Default Logic: Exact match on Series/Category
      const val = category === 'Accessory' ? item.category : item.series;
      return val && val.includes(filter);
    });
  }, [items, filter, category]);

  return (
    <main className="min-h-screen pt-40 pb-40 px-6 max-w-[1600px] mx-auto font-sans">
      
      {/* HERO & CATEGORY SWITCHER */}
      <header className="mb-12 text-center space-y-6">
        <h1 className="text-7xl md:text-9xl font-semibold tracking-tighter text-apple-text transition-all duration-500">
          {category}.
        </h1>
        
        {/* Main Category Toggles */}
        <div className="flex justify-center">
          <div className="inline-flex bg-[#E8E8ED] p-1.5 rounded-full relative overflow-x-auto max-w-full scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 relative z-10 whitespace-nowrap ${
                  category === cat 
                    ? 'bg-white text-black shadow-sm scale-105' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* DYNAMIC SUB-FILTER BAR */}
      {!loading && items.length > 0 && (
        <div className="mb-16 flex justify-center flex-wrap gap-3 animate-fade-in-up">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                filter === f 
                  ? 'bg-apple-blue text-white border-apple-blue shadow-lg shadow-blue-500/20' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-[450px] bg-gray-200/50 rounded-apple"></div>
           ))}
        </div>
      )}

      {/* BENTO GRID (Filtered) */}
      {!loading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link 
              href={`/device/${item.slug}`} 
              key={item.model_id || item.model_identifier || item.id}
              className="group relative bg-white rounded-apple p-10 h-[480px] flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-transparent hover:border-blue-100"
            >
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-apple-gray mb-3 block">
                  {item.series || item.category || category}
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-apple-text leading-[1.1]">
                  {item.model_name}
                </h2>
                
                <div className="mt-10 space-y-4">
                   {/* DYNAMIC SPECS (Simplified for brevity, uses same logic as before) */}
                   <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                      <span className="text-gray-400 font-medium">Release</span>
                      <span className="font-semibold">{item.release_date}</span>
                   </div>
                   
                   {/* Conditional Specs based on Category */}
                   {(category === 'iPhone' || category === 'iPad' || category === 'Mac') && (
                     <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                        <span className="text-gray-400 font-medium">Chip</span>
                        <span className="font-semibold">{item.chip_name}</span>
                     </div>
                   )}
                   {category === 'Spatial' && (
                     <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                        <span className="text-gray-400 font-medium">PPD</span>
                        <span className="font-semibold text-apple-blue">{item.pixels_per_eye}</span>
                     </div>
                   )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-apple-blue opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                View Specs <span className="text-lg">→</span>
              </div>
              
              {/* Subtle Gradient Glow */}
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-50/50 rounded-full blur-[80px] group-hover:bg-blue-100/60 transition-colors duration-1000"></div>
            </Link>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-32 border border-dashed border-gray-200 rounded-apple">
           <h3 className="text-2xl font-bold text-gray-400">No results.</h3>
           <p className="text-gray-400 mt-2">No devices found for filter "{filter}".</p>
        </div>
      )}
    </main>
  );
}