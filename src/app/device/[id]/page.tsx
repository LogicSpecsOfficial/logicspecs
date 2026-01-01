import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deviceSlug } = await params;

  // 1. Search Chain: iPhone -> iPad -> Mac -> Watch
  // Note: For production speed, we do sequential checks.
  let { data: device } = await supabase.from('iPhones').select('*').eq('slug', deviceSlug).single();

  if (!device) {
    const { data: ipad } = await supabase.from('iPads').select('*').eq('slug', deviceSlug).single();
    device = ipad;
  }
  if (!device) {
    const { data: mac } = await supabase.from('Macs').select('*').eq('slug', deviceSlug).single();
    device = mac;
  }
  if (!device) {
    const { data: watch } = await supabase.from('Watches').select('*').eq('slug', deviceSlug).single();
    device = watch;
  }

  if (!device) return notFound();

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

  // Helper to detect if it's a Watch (using a unique watch column)
  const isWatch = !!device.case_size_mm;

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
          
          {/* Watch Specific Design */}
          {isWatch ? (
            <>
               <SpecRow label="Case Size" value={device.case_size_mm} unit=" mm" />
               <SpecRow label="Material" value={device.case_material} />
               <SpecRow label="Depth" value={device.depth_mm} unit=" mm" />
               <SpecRow label="Dust Resistance" value={device.dust_resistance} />
            </>
          ) : (
            <>
               <SpecRow label="Height" value={device.height_mm} unit=" mm" />
               <SpecRow label="Width" value={device.width_mm} unit=" mm" />
               <SpecRow label="Depth" value={device.depth_mm} unit=" mm" />
            </>
          )}

          {/* Universal Design */}
          {device.weight_kg && <SpecRow label="Weight" value={device.weight_kg} unit=" kg" />}
          {device.weight_grams && <SpecRow label="Weight" value={device.weight_grams} unit=" g" />}
          <SpecRow label="Colors" value={device.colors || device.case_material} />
          
          <SectionTitle title="Display Technology" />
          <SpecRow label="Panel Type" value={device.panel_type || device.display_type || device.display_tech} />
          {/* Handles Watch 'Always-On' vs Phone 'Always-On' */}
          <SpecRow label="Always-On" value={device.always_on || device.always_on_display} />
          <SpecRow label="Size" value={device.screen_size || device.display_size_inches} unit='"' />
          <SpecRow label="Resolution" value={device.resolution || device.resolution_pixels} />
          <SpecRow label="Refresh Rate" value={device.refresh_rate_hz} unit="Hz" />
          <SpecRow label="Brightness (Peak)" value={device.peak_brightness || device.peak_brightness_nits} unit=" nits" />
        </div>

        {/* RIGHT COLUMN: PERFORMANCE & HEALTH */}
        <div>
          {isWatch ? (
             <>
                <SectionTitle title="Health & Vitals" />
                <SpecRow label="Heart Rate Sensor" value={device.heart_rate_gen} />
                <SpecRow label="ECG" value={device.ecg_support} />
                <SpecRow label="Blood Oxygen" value={device.blood_oxygen} />
                <SpecRow label="Temp Sensor" value={device.temp_sensor} />
                <SpecRow label="Sleep Apnea" value={device.sleep_apnea_detect} />
                <SpecRow label="Fall Detection" value={device.fall_detection} />
                <SpecRow label="Crash Detection" value={device.crash_detection} />
             </>
          ) : (
             <>
               <SectionTitle title="Performance Architecture" />
               <SpecRow label="Chipset" value={device.chip_name} />
               <SpecRow label="CPU Cores" value={device.cpu_cores} />
               <SpecRow label="GPU Cores" value={device.gpu_cores} />
               <SpecRow label="RAM" value={device.ram_gb || device.base_ram_gb} unit="GB" />
               
               {/* Benchmark Box */}
               <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mb-4">Lab Benchmarks</div>
                  <SpecRow label="Geekbench Multi" value={device.geekbench_multi} />
                  <SpecRow label="Metal (GPU)" value={device.gpu_metal_score} />
               </div>
             </>
          )}

          {/* Watch Chipset is smaller, shown here if Watch */}
          {isWatch && (
            <>
               <SectionTitle title="SiP (System in Package)" />
               <SpecRow label="Chip" value={device.chip_name} />
               <SpecRow label="UWB Generation" value={device.ultra_wideband_gen} />
               <SpecRow label="Storage" value={device.storage_gb} />
            </>
          )}
        </div>

        {/* BOTTOM SECTION */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-20">
          <div>
            <SectionTitle title={isWatch ? "Durability & Power" : "Power & Efficiency"} />
            
            {/* Watch Durability */}
            {isWatch && (
               <>
                 <SpecRow label="Water Resistance" value={device.water_resistance_m} unit="m" />
                 <SpecRow label="Dive Certified" value={device.dive_certified} />
                 <SpecRow label="Low Power Mode" value={device.low_power_mode_hours} unit=" hrs" />
               </>
            )}

            <SpecRow label="Battery Life" value={device.battery_hours || device.battery_runtime_hrs} unit=" hrs" />
            <SpecRow label="Capacity" value={device.battery_mah} unit=" mAh" />
            <SpecRow label="Charging" value={device.fast_charging} />
          </div>

          <div>
             <SectionTitle title="Connectivity" />
             <SpecRow label="Wi-Fi" value={device.wifi_version} />
             <SpecRow label="Bluetooth" value={device.bluetooth_version} />
             <SpecRow label="5G / Cellular" value={device.five_g_support || device.cellular} />
             {!isWatch && <SpecRow label="Port" value={device.port_type || `Thunderbolt ${device.thunderbolt_gen}`} />}
          </div>
        </div>

      </div>
    </main>
  );
}