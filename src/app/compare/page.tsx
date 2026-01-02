import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import SmartComparisonGrid from '@/components/compare/SmartComparisonGrid';
import DeviceSelector from '@/components/compare/DeviceSelector';
import CategorySwitcher from '@/components/compare/CategorySwitcher';

async function getDevices(slugs: string[], table: string) {
  if (slugs.length === 0) return [];
  const { data } = await supabase.from(table).select('*').in('slug', slugs);
  return slugs.map(slug => data?.find((d: any) => d.slug === slug)).filter(Boolean);
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ devices?: string; category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || 'iPhone';
  const rawDevices = params.devices ? params.devices.split(',') : [];
  const deviceSlugs = rawDevices.slice(0, 5);

  const table = category === 'Mac' ? 'Macs' : 
                category === 'iPad' ? 'iPads' : 
                category === 'Watch' ? 'Watches' : 
                'iPhones';

  const devices = await getDevices(deviceSlugs, table);
  const slots = [...devices];
  if (slots.length < 5) slots.push(null);

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-24 pb-40 font-sans">
      <div className="max-w-[1800px] mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1D1D1F]">
            {category}<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg">Technical Matrix — Local Memory Enabled</p>
        </div>
        
        {/* NEW: Client-side Category Switcher with Memory */}
        <CategorySwitcher currentCategory={category} />
      </div>

      <div className="max-w-[1800px] mx-auto px-6">
        <div className="sticky top-6 z-50 mb-12">
          <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-4 border border-white/50 shadow-2xl">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
               {slots.map((device: any, index: number) => (
                 <div key={device ? device.slug : `empty-${index}`} className="min-w-[220px] flex-1">
                   <DeviceSelector 
                     index={index}
                     device={device} 
                     category={category} 
                     currentSlugs={deviceSlugs}
                   />
                 </div>
               ))}
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-[3rem]" />}>
           <SmartComparisonGrid devices={devices} />
        </Suspense>
      </div>
    </main>
  );
}