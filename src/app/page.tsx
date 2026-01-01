'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function FinderPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('iPhone');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['iPhone', 'iPad', 'Mac'];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMsg('');
      
      const tableName = category === 'iPhone' ? 'iPhones' : 
                        category === 'iPad' ? 'iPads' : 
                        category === 'Mac' ? 'Macs' : null;

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

  return (
    <main className="min-h-screen pt-40 pb-40 px-6 max-w-[1600px] mx-auto font-sans">
      
      {/* 1. HERO SECTION */}
      <header className="mb-24 text-center space-y-6">
        <h1 className="text-7xl md:text-9xl font-semibold tracking-tighter text-apple-text">
          {category}.
        </h1>
        <p className="text-xl md:text-2xl text-apple-gray font-medium max-w-2xl mx-auto leading-relaxed">
          The definitive technical database. <br/>
          <span className="text-apple-blue">Updated for 2026.</span>
        </p>
      </header>

      {/* 2. SEGMENTED CONTROL (Apple Settings Style) */}
      <div className="flex justify-center mb-20">
        <div className="inline-flex bg-[#E8E8ED] p-1.5 rounded-full relative">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-8 py-2.5 text-[13px] font-semibold rounded-full transition-all duration-300 relative z-10 ${
                category === cat 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-[450px] bg-gray-200/50 rounded-apple"></div>
           ))}
        </div>
      )}

      {/* 4. THE BENTO GRID (High-End Cards) */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link 
              href={`/device/${item.slug}`} 
              key={item.model_identifier || item.id}
              className="group relative bg-white rounded-apple p-10 h-[480px] flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Card Content */}
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-apple-gray mb-3 block">
                  {item.series}
                </span>
                <h2 className="text-4xl font-semibold tracking-tight text-apple-text leading-[1.1]">
                  {item.model_name}
                </h2>
                
                {/* Dynamic Specs */}
                <div className="mt-10 space-y-4">
                   <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                      <span className="text-gray-400 font-medium">Chip</span>
                      <span className="font-semibold">{item.chip_name}</span>
                   </div>
                   
                   {/* iPad Specific Logic */}
                   {category === 'iPad' ? (
                     <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                        <span className="text-gray-400 font-medium">Pencil</span>
                        <span className="font-semibold text-apple-blue">{item.pencil_support ? 'Supported' : 'No'}</span>
                     </div>
                   ) : (
                     <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                        <span className="text-gray-400 font-medium">Release</span>
                        <span className="font-semibold">{item.release_date}</span>
                     </div>
                   )}
                </div>
              </div>

              {/* Hover Action */}
              <div className="flex items-center gap-2 text-xs font-bold text-apple-blue opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                View Deep Dive <span className="text-lg">→</span>
              </div>
              
              {/* Subtle Liquid Gradient Background */}
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-50/50 rounded-full blur-[80px] group-hover:bg-blue-100/60 transition-colors duration-1000"></div>
            </Link>
          ))}
        </div>
      )}

      {/* 5. ERROR / EMPTY STATE */}
      {!loading && (items.length === 0 || errorMsg) && (
        <div className="text-center py-32 border border-dashed border-gray-200 rounded-apple">
           <h3 className="text-2xl font-bold text-gray-400">Database Empty</h3>
           <p className="text-gray-400 mt-2 max-w-md mx-auto">
             {errorMsg ? `Error: ${errorMsg}` : `No devices found in the '${category}' table.`}
           </p>
           {errorMsg && (
             <p className="mt-4 text-xs bg-red-50 text-red-500 py-1 px-3 rounded-full inline-block">
               Check Supabase RLS Policies
             </p>
           )}
        </div>
      )}

    </main>
  );
}