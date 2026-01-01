// Force build 2
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function DevicePage({ params }: { params: { id: string } }) {
  // We look for the slug that matches the [id] in the URL
  const { data: phone, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', params.id) 
    .single();

  if (!phone || error) return notFound();

  const SpecRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between py-4 border-b border-gray-100">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value || '—'}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#f5f5f7] py-20 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">{phone.model_name}</h1>
        <p className="text-xl text-gray-500 mt-2 italic">Technical Specifications</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-12 pb-20">
        <section className="mb-10">
          <h4 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-4">Core Dimensions</h4>
          <SpecRow label="Height" value={`${phone.height_mm} mm`} />
          <SpecRow label="Width" value={`${phone.width_mm} mm`} />
          <SpecRow label="Depth" value={`${phone.depth_mm} mm`} />
          <SpecRow label="Weight" value={`${phone.weight_grams}g`} />
        </section>

        <section className="mb-10">
          <h4 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-4">Internal Power</h4>
          <SpecRow label="Chip" value={phone.chip_name} />
          <SpecRow label="RAM" value={`${phone.ram_gb}GB`} />
          <SpecRow label="Geekbench Multi" value={phone.geekbench_multi} />
          <SpecRow label="Battery" value={`${phone.battery_mah} mAh`} />
        </section>
      </div>
    </main>
  );
}