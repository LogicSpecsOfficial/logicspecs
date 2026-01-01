import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const deviceSlug = resolvedParams.id;

  const { data: phone, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', deviceSlug)
    .single();

  if (!phone || error) return notFound();

  // A reusable component for each spec row
  const SpecRow = ({ label, value, unit = "" }: { label: string, value: any, unit?: string }) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <div className="flex justify-between py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-2">
        <span className="text-gray-500 font-medium text-sm">{label}</span>
        <span className="text-gray-900 font-semibold text-sm text-right">
          {value}{unit}
        </span>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-blue-100">
      {/* Liquid Glass Header */}
      <div className="bg-[#f5f5f7] pt-32 pb-20 px-6 text-center border-b border-gray-200">
        <Link href="/" className="text-blue-600 text-sm font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
          ← Back to All Devices
        </Link>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mt-4">{phone.model_name}</h1>
        <p className="text-xl text-gray-500 mt-4 max-w-2xl mx-auto font-medium italic">
          {phone.series} — {phone.chip_name}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Category: Performance */}
        <section className="mb-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6 border-b-2 border-blue-600 w-fit pb-1">
            Performance & Power
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <SpecRow label="Chipset" value={phone.chip_name} />
            <SpecRow label="RAM" value={phone.ram_gb} unit="GB" />
            <SpecRow label="RAM Type" value={phone.ram_type} />
            <SpecRow label="Geekbench Multi" value={phone.geekbench_multi} />
            <SpecRow label="Geekbench Single" value={phone.geekbench_single} />
            <SpecRow label="GPU Metal Score" value={phone.gpu_metal_score} />
            <SpecRow label="Neural Engine" value={phone.neural_engine_cores} unit=" Cores" />
          </div>
        </section>

        {/* Category: Display */}
        <section className="mb-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6 border-b-2 border-blue-600 w-fit pb-1">
            Display Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <SpecRow label="Size" value={phone.display_size_inches} unit='"' />
            <SpecRow label="Resolution" value={phone.resolution_pixels} />
            <SpecRow label="Refresh Rate" value={phone.refresh_rate_hz} unit="Hz" />
            <SpecRow label="Brightness" value={phone.peak_brightness_nits} unit=" nits" />
            <SpecRow label="Pixel Density" value={phone.pixel_density_ppi} unit=" ppi" />
            <SpecRow label="Always-On" value={phone.always_on_display} />
          </div>
        </section>

        {/* Category: Battery & Charging */}
        <section className="mb-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6 border-b-2 border-blue-600 w-fit pb-1">
            Battery & Charging
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <SpecRow label="Capacity" value={phone.battery_mah} unit=" mAh" />
            <SpecRow label="Video Playback" value={phone.video_playback_hours} unit=" Hours" />
            <SpecRow label="Wired Charging" value={phone.wired_charging_w} />
            <SpecRow label="Port Type" value={phone.port_type} />
            <SpecRow label="Wireless Charging" value={phone.wireless_charging_w} />
          </div>
        </section>

        {/* Category: Physical */}
        <section className="mb-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6 border-b-2 border-blue-600 w-fit pb-1">
            Design & Build
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <SpecRow label="Weight" value={phone.weight_grams} unit="g" />
            <SpecRow label="Height" value={phone.height_mm} unit=" mm" />
            <SpecRow label="Width" value={phone.width_mm} unit=" mm" />
            <SpecRow label="Depth" value={phone.depth_mm} unit=" mm" />
            <SpecRow label="Frame Material" value={phone.frame_material} />
            <SpecRow label="IP Rating" value={phone.ip_rating} />
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-gray-200 text-center text-gray-400 text-sm italic">
          LogicSpecs identifier: {phone.model_identifier}
        </footer>
      </div>
    </main>
  );
}