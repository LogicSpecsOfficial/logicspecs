import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deviceSlug } = await params;

  // 1. SEQUENTIAL SEARCH (The "Waterfall" Search)
  // Check tables in order of popularity to minimize wait time
  let device = null;
  const tables = ['iPhones', 'iPads', 'Macs', 'Watches', 'audio_devices', 'spatial_computers', 'home_entertainment', 'Accessories'];
  
  for (const table of tables) {
    const { data } = await supabase.from(table).select('*').eq('slug', deviceSlug).single();
    if (data) {
      device = data;
      break;
    }
  }

  if (!device) return notFound();

  // 2. CATEGORY DETECTION
  const isSpatial = !!device.r1_chip; // Only Vision Pro has R1
  const isAudio = !!device.noise_cancellation; // Only AirPods/Beats
  const isHome = !!device.thread_support && !device.r1_chip; // Apple TV / HomePod
  const isWatch = !!device.case_size_mm;
  
  // Reusable Spec Row
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
          {device.series || device.category} — Released {device.release_date}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-x-20">
        
        {/* --- LEFT COLUMN: DESIGN & BUILD --- */}
        <div>
          <SectionTitle title="Design & Build" />
          
          <SpecRow label="Weight" value={device.weight_grams} unit=" g" />
          <SpecRow label="Weight" value={device.weight_kg} unit=" kg" />
          
          {isSpatial && <SpecRow label="Headband" value={device.headband_type} />}
          {isHome && <SpecRow label="Dimensions" value={device.display_size || 'N/A'} />}
          {isAudio && <SpecRow label="IP Rating" value={device.ip_rating} />}
          
          <SpecRow label="Material" value={device.case_material || device.frame_material} />
          
          {/* DISPLAY (For Phones/Macs/Spatial) */}
          {(device.resolution || device.pixels_per_eye) && (
            <>
              <SectionTitle title="Visual Technology" />
              <SpecRow label="Pixels per Eye" value={device.pixels_per_eye} />
              <SpecRow label="Display Type" value={device.display_tech || device.panel_type} />
              <SpecRow label="Refresh Rate" value={device.refresh_rate_hz} unit="Hz" />
              <SpecRow label="IPD Range" value={device.ipd_range_mm} />
            </>
          )}
        </div>

        {/* --- RIGHT COLUMN: PERFORMANCE & FEATURES --- */}
        <div>
          
          {/* SPATIAL COMPUTING SPECS */}
          {isSpatial && (
             <>
                <SectionTitle title="Spatial Computing" />
                <SpecRow label="Main Chip" value={device.chip_name} />
                <SpecRow label="Co-Processor" value={device.r1_chip} />
                <SpecRow label="Photon Latency" value={device.photon_latency_ms} unit=" ms" />
                <SpecRow label="Operating System" value={device.os_version} />
             </>
          )}

          {/* AUDIO SPECS */}
          {isAudio && (
             <>
                <SectionTitle title="Audio Architecture" />
                <SpecRow label="Chip" value={device.chip_name} />
                <SpecRow label="Noise Cancellation" value={device.noise_cancellation} />
                <SpecRow label="Transparency" value={device.transparency_mode} />
                <SpecRow label="Spatial Audio" value={device.spatial_audio} />
             </>
          )}

          {/* HOME SPECS */}
          {isHome && (
             <>
               <SectionTitle title="Home Theater" />
               <SpecRow label="Processor" value={device.processor} />
               <SpecRow label="Audio Tech" value={device.audio_tech} />
               <SpecRow label="Thread Support" value={device.thread_support} />
               <SpecRow label="Ethernet" value={device.ethernet_speed_mbps} unit=" Mbps" />
             </>
          )}

          {/* CONNECTIVITY (Universal) */}
          <SectionTitle title="Connectivity & Power" />
          
          {/* Battery Logic */}
          <SpecRow label="Battery Life" value={device.battery_life_hrs || device.listening_time_hrs} unit=" hrs" />
          {isAudio && <SpecRow label="With ANC" value={device.anc_listening_time_hrs} unit=" hrs" />}
          {isAudio && <SpecRow label="Charging Case" value={device.charging_port} />}
          
          <SpecRow label="Wi-Fi" value={device.wi_fi_gen || device.wifi_version} />
          <SpecRow label="Bluetooth" value={device.bluetooth_version} />
          <SpecRow label="HDMI Version" value={device.hdmi_version} />
        </div>

      </div>
    </main>
  );
}