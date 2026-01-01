import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deviceSlug } = await params;

  // 1. Search iPhones table
  let { data: device, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', deviceSlug)
    .single();

  // 2. If not found, search iPads table
  if (!device || error) {
    const { data: ipad } = await supabase
      .from('iPads')
      .select('*')
      .eq('slug', deviceSlug)
      .single();
    device = ipad;
  }

  if (!device) return notFound();

  const SpecRow = ({ label, value, unit = "" }: { label: string, value: any, unit?: string }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-4 border-b border-gray-100 px-2">
        <span className="text-gray-400 font-medium text-sm">{label}</span>
        <span className="text-gray-900 font-bold text-sm">{value}{unit}</span>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#f5f5f7] pt-32 pb-20 px-6 text-center">
        <Link href="/" className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">← Back to Finder</Link>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-6">{device.model_name}</h1>
        <p className="text-xl text-gray-400 mt-4 italic font-medium">{device.chip_name} Architecture</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-x-16">
        <section className="mb-12">
          <h3 className="text-xs font-black uppercase text-blue-600 mb-6 tracking-widest border-b-2 border-blue-600 pb-1 w-fit">Core Data</h3>
          <SpecRow label="Series" value={device.series} />
          <SpecRow label="Weight" value={device.weight_grams} unit="g" />
          <SpecRow label="RAM" value={device.ram_gb} unit="GB" />
          <SpecRow label="Port" value={device.port_type} />
        </section>

        <section className="mb-12">
          <h3 className="text-xs font-black uppercase text-blue-600 mb-6 tracking-widest border-b-2 border-blue-600 pb-1 w-fit">Display</h3>
          <SpecRow label="Type" value={device.display_type} />
          <SpecRow label="Size" value={device.display_size_inches} unit='"' />
          <SpecRow label="Resolution" value={device.resolution_pixels} />
          <SpecRow label="Refresh Rate" value={device.refresh_rate_hz} unit="Hz" />
        </section>
        
        {/* iPad-Only Specs (Will hide if null) */}
        <section className="mb-12">
          <h3 className="text-xs font-black uppercase text-blue-600 mb-6 tracking-widest border-b-2 border-blue-600 pb-1 w-fit">Accessories</h3>
          <SpecRow label="Pencil Support" value={device.pencil_support} />
          <SpecRow label="Keyboard Support" value={device.keyboard_support} />
        </section>
      </div>
    </main>
  );
}