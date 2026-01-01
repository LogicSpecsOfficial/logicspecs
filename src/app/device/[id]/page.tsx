import { supabase } from '@/lib/supabase';

// We make 'params' a Promise because Next.js 15 requires it
export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Wait for the params to arrive from the URL
  const resolvedParams = await params;
  const deviceSlug = resolvedParams.id;

  // 2. Search Supabase
  const { data: phone, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', deviceSlug)
    .single();

  // 3. Debug View if it fails
  if (!phone) {
    return (
      <div className="p-20 font-sans">
        <h1 className="text-red-500 font-bold text-2xl">Debug: Search Failed</h1>
        <p className="mt-4">The URL slug found: <span className="bg-yellow-100 px-2 font-mono">"{deviceSlug}"</span></p>
        <p className="mt-2 text-gray-500 text-sm">Supabase looked in the 'slug' column for that exact text.</p>
        {error && <p className="mt-4 p-4 bg-gray-100 rounded">Supabase Error: {error.message}</p>}
      </div>
    );
  }

  // 4. Success View
  return (
    <main className="p-20 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold tracking-tighter mb-4">{phone.model_name}</h1>
        <p className="text-blue-600 text-xl font-medium mb-10 italic">Full Technical Specifications</p>
        
        <div className="grid gap-6 border-t pt-10 border-gray-100">
           <div className="flex justify-between border-b pb-4">
              <span className="text-gray-400 font-medium">Model ID</span>
              <span className="font-bold">{phone.model_identifier}</span>
           </div>
           <div className="flex justify-between border-b pb-4">
              <span className="text-gray-400 font-medium">Chip</span>
              <span className="font-bold">{phone.chip_name}</span>
           </div>
           <div className="flex justify-between border-b pb-4">
              <span className="text-gray-400 font-medium">Battery</span>
              <span className="font-bold">{phone.battery_mah} mAh</span>
           </div>
        </div>
      </div>
    </main>
  );
}