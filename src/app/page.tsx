'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function FinderPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('iPhone'); // Default to iPhone
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Apple-Style Categories
  const categories = ['iPhone', 'iPad', 'Mac'];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMsg('');
      
      // Map category name to DB Table Name EXACTLY
      const tableName = category === 'iPhone' ? 'iPhones' : 
                        category === 'iPad' ? 'iPads' : 
                        category === 'Mac' ? 'Macs' : null;

      if (!tableName) return;

      console.log(`Fetching from table: ${tableName}...`);

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('release_date', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        setErrorMsg(error.message);
        setItems([]);
      } else {
        console.log(`Success! Found ${data?.length} rows.`);
        setItems(data || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [category]);

  return (
    <main className="min-h-screen pt-32 pb-40 px-6 max-w-[1600px] mx-auto">
      
      {/* 1. HERO SECTION: Clean & Minimal */}
      <header className="mb-20 text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-[#1d1d1f]">
          {category}.
        </h1>
        <p className="text-xl text-[#86868b] font-medium max-w-2xl mx-auto">
          Explore technical specifications, performance benchmarks, and detailed comparisons.
        </p>
      </header>

      {/* 2. SEGMENTED CONTROLLER (The Switcher) */}
      <div className="flex justify-center mb-16">
        <div className="segmented-control inline-flex">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`segment-btn ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DEBUGGER (Only shows if there is an error) */}
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-10 max-w-xl mx-auto border border-red-100">
          <p className="font-bold">⚠️ Connection Error</p>
          <p className="text-sm">{errorMsg}</p>
          <p className="text-xs mt-2 text-red-400">Tip: Check if 'RLS Policies' are enabled in Supabase.</p>
        </div>
      )}

      {/* 4. LOADING STATE (Skeleton) */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-[400px] bg-gray-200 rounded-[2rem]"></div>
           ))}
        </div>
      )}

      {/* 5. THE BENTO GRID (Results) */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link 
              href={`/device/${item.slug}`} 
              key={item.model_identifier || item.id}
              className="bento-card group"
            >
              <div className="z-10 relative">
                <span className="bento-subtitle">{item.series}</span>
                <h2 className="bento-title mt-2 group-hover:text-[#0071e3] transition-colors">{item.model_name}</h2>
                
                <div className="mt-8 space-y-3">
                   {/* Conditional specs based on category */}
                   <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-medium">Chipset</span>
                      <span className="font-semibold">{item.chip_name}</span>
                   </div>
                   {category === 'iPad' && (
                     <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-400 font-medium">Pencil</span>
                        <span className="font-semibold">{item.pencil_support || 'N/A'}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-400 font-medium">Release</span>
                      <span className="font-semibold">{item.release_date}</span>
                   </div>
                </div>
              </div>

              {/* Hover Interaction Element */}
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#0071e3] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                View Full Analysis <span className="text-lg">→</span>
              </div>
              
              {/* Background Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      )}

      {/* 6. EMPTY STATE (If table works but has no data) */}
      {!loading && items.length === 0 && !errorMsg && (
        <div className="text-center py-20">
           <h3 className="text-2xl font-bold text-gray-300">No devices found.</h3>
           <p className="text-gray-400 mt-2">The table "{category}" appears to be empty in Supabase.</p>
        </div>
      )}

    </main>
  );
}