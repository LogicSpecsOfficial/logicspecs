/* v1.5.1 
   Changelog: @ Stylist Update: Unified theme sync for Matrix; replaced bg-white selector with glass-morphism.
*/

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
    /* Removed bg-[#F5F5F7] to allow global CSS variable to take over */
    <main className="min-h-screen pt-24 pb-40 font-sans">
      <div className="max-w-[1800px] mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-2">
          {/* Replaced hardcoded text color with current/variable inheritance */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            {category}<span className="text-blue-600">.</span>
          </h1>
          <p className="text-subtle font-medium text-lg">Technical Matrix — Local Memory Enabled</p>
        </div>
        
        <CategorySwitcher currentCategory={category} />
      </div>

      <div className="max-w-[1800px] mx-auto px-6">
        {/* Adjusted Sticky Z-Index to stay below Search but above Grid */}
        <div className="sticky top-6 z-40 mb-12">
          {/* Replaced bg-white/70 with glass-morphism utility */}
          <div className="glass-morphism rounded-[3rem] p-4 shadow-2xl">
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

        <Suspense fallback={<div className="h-96 glass-morphism animate-pulse rounded-[3rem]" />}>
           <SmartComparisonGrid devices={devices} />
        </Suspense>
      </div>
    </main>
  );
}