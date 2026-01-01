import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deviceSlug } = await params;

  // 1. Search Chain: iPhone -> iPad -> Mac
  let { data: device, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', deviceSlug)
    .single();

  if (!device) {
    const { data: ipad } = await supabase
      .from('iPads')
      .select('*')
      .eq('slug', deviceSlug)
      .single();
    device = ipad;
  }

  if (!device) {
    const { data: mac } = await supabase
      .from('Macs')
      .select('*')
      .eq('slug', deviceSlug)
      .single();
    device = mac;
  }

  if (!device) return notFound();

  // Helper Components
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

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6 border-b-2 border-blue-600 w-fit pb-1 mt-12">
      {title}
    </h3>
  );

  return (
    <main className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-blue-100 pb-40">
      
      {/* HEADER */}
      <div className="bg-[#f5f5f7] pt-40 pb-20 px-6 text-center border-b border-gray-200">
        <Link href="/" className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline mb-4 inline-block">
          ← Back to Finder
        </Link>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mt-4 mb-2">{device.model_name}</h1>
        <p className="text-xl text-gray-500 font-medium italic">
          {device.series} — Released {device.release_date}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-x-20">
        
        {/* LEFT COLUMN: DESIGN & DISPLAY */}
        <div>
          <SectionTitle title="Design & Build" />
          {/* Handles both Mac (weight_kg) and Mobile (weight_grams) */}
          {device.weight_kg && <SpecRow label="Weight" value={device.weight_kg} unit=" kg" />}
          {device.weight_grams && <SpecRow label="Weight" value={device.weight_grams} unit=" g" />}
          
          <SpecRow label="Frame Material" value={device.frame_material} />
          <SpecRow label="Colors" value={device.colors} />
          
          {/* Mac Specific Design */}
          <SpecRow label="Thunderbolt" value={device.thunderbolt_gen ? `Thunderbolt ${device.thunderbolt_gen}` : null} />
          <SpecRow label="Port Count" value={device.port_count} />
          <SpecRow label="HDMI" value={device.hdmi_version} />

          <SectionTitle title="Display Technology" />
          <SpecRow label="Panel Type" value={device.panel_type || device.display_type} />
          <SpecRow label="Size" value={device.screen_size || device.display_size_inches} unit='"' />
          <SpecRow label="Resolution" value={device.resolution || device.resolution_pixels} />
          <SpecRow label="Refresh Rate" value={device.refresh_rate_hz} unit="Hz" />
          <SpecRow label="Brightness" value={device.peak_brightness || device.peak_brightness_nits} unit=" nits" />
        </div>

        {/* RIGHT COLUMN: PERFORMANCE */}
        <div>
          <SectionTitle title="Performance Architecture" />
          <SpecRow label="Chipset" value={device.chip_name} />
          <SpecRow label="CPU Cores" value={device.cpu_cores} />
          <SpecRow label="GPU Cores" value={device.gpu_cores} />
          
          {/* Mac Specific Memory */}
          {device.base_ram_gb && (
            <div className="py-4 border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium text-sm">Unified Memory</span>
                <span className="text-gray-900 font-semibold text-sm">{device.base_ram_gb}GB - {device.max_ram_gb}GB</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 text-right">Bandwidth: {device.memory_bandwidth_gbs} GB/s</div>
            </div>
          )}

          {/* iPhone/iPad Memory */}
          <SpecRow label="RAM" value={device.ram_gb} unit="GB" />

          {device.base_storage_gb && (
             <SpecRow label="Storage" value={`${device.base_storage_gb}GB - ${device.max_storage_gb >= 1000 ? device.max_storage_gb/1000 + 'TB' : device.max_storage_gb + 'GB'}`} />
          )}

          {/* BENCHMARK BOX */}
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
             <div className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mb-4">Lab Benchmarks</div>
             <SpecRow label="Geekbench Single" value={device.geekbench_single} />
             <SpecRow label="Geekbench Multi" value={device.geekbench_multi} />
             <SpecRow label="Cinebench Multi" value={device.cinebench_multi} />
             <SpecRow label="Metal (GPU)" value={device.gpu_metal_score} />
             <SpecRow label="Video Encode" value={device.video_encode_fps} unit=" fps" />
             <SpecRow label="Neural Engine" value={device.neural_engine_tops} unit=" TOPS" />
          </div>
        </div>

        {/* BOTTOM SECTION: BATTERY & EXTRAS */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-20">
          <div>
            <SectionTitle title="Power & Efficiency" />
            <SpecRow label="Battery Runtime" value={device.battery_runtime_hrs} unit=" hrs" />
            <SpecRow label="Capacity" value={device.battery_mah} unit=" mAh" />
            <SpecRow label="Charging" value={device.wired_charging_w} unit="W" />
          </div>

          <div>
             <SectionTitle title="Features" />
             <SpecRow label="OS at Launch" value={device.os_launch_version || device.ios_launch_version} />
             <SpecRow label="Face ID / Touch ID" value={device.biometrics} />
             <SpecRow label="Pencil Support" value={device.pencil_support} />
          </div>
        </div>

      </div>
    </main>
  );
}