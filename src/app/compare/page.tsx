import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import SmartComparisonGrid from '@/components/compare/SmartComparisonGrid'; // Updated Import
import DeviceSelector from '@/components/compare/DeviceSelector';
import Link from 'next/link';

// 1. Fetch Data on the Server (SEO Friendly)
async function getDevice(slug: string, table: string = 'iPhones') {
  if (!slug) return null;
  const { data } = await supabase.from(table).select('*').eq('slug', slug).single();
  return data;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string; category?: string }>;
}) {
  const params = await searchParams;
  const leftSlug = params.left || '';
  const rightSlug = params.right || '';
  const category = params.category || 'iPhone';
  const table = category === 'Mac' ? 'Macs' : category === 'iPad' ? 'iPads' : 'iPhones';

  const [leftDevice, rightDevice] = await Promise.all([
    getDevice(leftSlug, table),
    getDevice(rightSlug, table)
  ]);

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-24 pb-20">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
            Compare {category}.
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            See the difference. Decide with data.
          </p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-full border border-gray-200/50">
          {['iPhone', 'iPad', 'Mac', 'Watch'].map((cat) => (
            <Link
              key={cat}
              href={`/compare?category=${cat}`}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                category === cat 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:text-black'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* COMPARISON STAGE */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-4 md:gap-12 mb-8 sticky top-24 z-30 bg-[#F5F5F7]/95 backdrop-blur-sm py-4 border-b border-gray-200/50">
           {/* Selectors */}
           <DeviceSelector side="left" device={leftDevice} category={category} />
           <DeviceSelector side="right" device={rightDevice} category={category} />
        </div>

        {/* The New Smart Grid */}
        <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-3xl" />}>
           <SmartComparisonGrid left={leftDevice} right={rightDevice} />
        </Suspense>
      </div>

    </main>
  );
}