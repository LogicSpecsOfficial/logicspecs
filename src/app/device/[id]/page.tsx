import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deviceSlug } = await params;

  // 1. Try finding it in iPhones table
  let { data: device, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', deviceSlug)
    .single();

  // 2. If not found, try iPads table
  if (!device || error) {
    const { data: ipad } = await supabase
      .from('iPads')
      .select('*')
      .eq('slug', deviceSlug)
      .single();
    device = ipad;
  }

  if (!device) return notFound();

  // Reusable Row Component - Hides itself if value is empty/null
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
        
        {/* COLUMN 1 */}
        <div>
          <SectionTitle title="Design & Build" />
          <SpecRow label="Height" value={device.height_mm} unit=" mm" />
          <SpecRow label="Width" value={device.width_mm} unit=" mm" />
          <SpecRow label="Depth" value={device.depth_mm} unit=" mm" />
          <SpecRow label="Weight" value={device.weight_grams} unit="g" />
          <SpecRow label="Frame Material" value={device.frame_material} />
          <SpecRow label="Back Material" value={device.back_material} />
          <SpecRow label="IP Rating" value={device.ip_rating} />
          <SpecRow label="Colors" value={device.colors} />

          <SectionTitle title="Display Technology" />
          <SpecRow label="Type" value={device.display_type} />
          <SpecRow label="Size" value={device.display_size_inches} unit='"' />
          <SpecRow label="Resolution" value={device.resolution_pixels} />
          <SpecRow label="Pixel Density" value={device.pixel_density_ppi} unit=" ppi" />
          <SpecRow label="Refresh Rate" value={device.refresh_rate_hz} unit="Hz" />
          <SpecRow label="Brightness (Peak)" value={device.peak_brightness_nits} unit=" nits" />
          <SpecRow label="HDR Support" value={device.hdr_support ? 'Yes' : null} />
          <SpecRow label="Always-On" value={device.always_on_display ? 'Yes' : null} />
        </div>

        {/* COLUMN 2 */}
        <div>
          <SectionTitle title="Performance & Silicon" />
          <SpecRow label="Chipset" value={device.chip_name} />
          <SpecRow label="CPU Cores" value={device.cpu_cores} />
          <SpecRow label="GPU Cores" value={device.gpu_cores} />
          <SpecRow label="Neural Engine" value={device.neural_engine_cores} unit=" Cores" />
          <SpecRow label="RAM" value={device.ram_gb} unit="GB" />
          <SpecRow label="RAM Type" value={device.ram_type} />
          <SpecRow label="Storage Options" value={device.storage_options} />
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">Benchmark Scores</div>
             <SpecRow label="Geekbench Single" value={device.geekbench_single} />
             <SpecRow label="Geekbench Multi" value={device.geekbench_multi} />
             <SpecRow label="Metal (GPU)" value={device.gpu_metal_score} />
          </div>

          <SectionTitle title="Camera System" />
          <SpecRow label="Main Camera" value={device.main_camera_mp} unit="MP" />
          <SpecRow label="Ultrawide" value={device.ultrawide_mp} unit="MP" />
          <SpecRow label="Telephoto" value={device.telephoto_mp} unit="MP" />
          <SpecRow label="Front Camera" value={device.front_camera_mp} unit="MP" />
          <SpecRow label="Optical Zoom" value={device.optical_zoom} />
          <SpecRow label="Video Recording" value={device.max_video_resolution} />
          <SpecRow label="ProRes Support" value={device.prores_support ? 'Yes' : null} />
        </div>

        {/* FULL WIDTH BOTTOM SECTIONS */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-20">
          <div>
            <SectionTitle title="Battery & Charging" />
            <SpecRow label="Capacity" value={device.battery_mah} unit=" mAh" />
            <SpecRow label="Video Playback" value={device.video_playback_hours} unit=" Hours" />
            <SpecRow label="Port Type" value={device.port_type} />
            <SpecRow label="USB Speed" value={device.usb_speed} />
            <SpecRow label="Wired Charging" value={device.wired_charging_w} unit="W" />
            <SpecRow label="Wireless Charging" value={device.wireless_charging_w} />
          </div>

          <div>
             <SectionTitle title="Connectivity & Features" />
             <SpecRow label="Wi-Fi" value={device.wifi_version} />
             <SpecRow label="Bluetooth" value={device.bluetooth_version} />
             <SpecRow label="5G" value={device.five_g_support ? 'Yes' : 'No'} />
             <SpecRow label="SIM Type" value={device.sim_type} />
             <SpecRow label="Face ID / Touch ID" value={device.biometrics} />
             {/* iPad Exclusive Fields */}
             <SpecRow label="Apple Pencil" value={device.pencil_support} />
             <SpecRow label="Keyboard" value={device.keyboard_support} />
          </div>
        </div>

      </div>

      <footer className="mt-20 pt-10 border-t border-gray-200 text-center text-gray-400 text-xs font-mono">
          LogicSpecs Model Identifier: {device.model_identifier}
      </footer>
    </main>
  );
}