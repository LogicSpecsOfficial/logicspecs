import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function DevicePage({ params }: { params: { id: string } }) {
  // Fetch the specific phone based on the ID in the URL
  const { data: phone } = await supabase
    .from('iPhones')
    .select('*')
    .eq('model_identifier', params.id)
    .single();

  if (!phone) return notFound();

  // Helper to render spec rows
  const SpecRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between py-4 border-b border-gray-100">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value || '—'}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Liquid Glass Header for Product */}
      <div className="bg-[#f5f5f7] py-20 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">{phone.model_name}</h1>
        <p className="text-xl text-gray-500 mt-2">{phone.series} — {phone.chip_name}</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-12">
        <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
        
        <section className="mb-10">
          <h4 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-4">Display & Body</h4>
          <SpecRow label="Display Size" value={`${phone.display_size_inches}"`} />
          <SpecRow label="Resolution" value={phone.resolution_pixels} />
          <SpecRow label="Weight" value={`${phone.weight_grams}g`} />
          <SpecRow label="Dimensions" value={`${phone.height_mm} x ${phone.width_mm} x ${phone.depth_mm} mm`} />
        </section>

        <section className="mb-10">
          <h4 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-4">Performance</h4>
          <SpecRow label="Chip" value={phone.chip_name} />
          <SpecRow label="CPU Cores" value={phone.cpu_cores} />
          <SpecRow label="RAM" value={`${phone.ram_gb}GB ${phone.ram_type}`} />
          <SpecRow label="Geekbench Multi" value={phone.geekbench_multi} />
        </section>

        {/* Add more sections as you like using your 70+ columns! */}
      </div>
    </main>
  );
}