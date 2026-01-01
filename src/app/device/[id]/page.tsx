import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deviceSlug } = await params;

  // 1. Search Chain: iPhone -> iPad -> Mac -> Watch -> Accessories
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
  if (!device) {
    const { data: acc } = await supabase.from('Accessories').select('*').eq('slug', deviceSlug).single();
    device = acc;
  }

  if (!device) return notFound();

  // Helper Variables
  const isAccessory = !!device.connection_type; // Unique to accessories
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
        
        {/* LEFT COLUMN: DESIGN & COMPATIBILITY */}
        <div>
          <SectionTitle title="Design & Build" />
          
          <SpecRow label="Weight" value={device.weight_grams} unit=" g" />
          {device.weight_kg && <SpecRow label="Weight" value={device.weight_kg} unit=" kg" />}
          
          {isAccessory ? (
             <>
               <SpecRow label="Connection" value={device.connection_type} />
               <SpecRow label="Battery Type" value={device.battery_type} />
               <SpecRow label="Find My" value={device.find_my_support} />
             </>
          ) : (
             <>
               <SpecRow label="Height" value={device.height_mm} unit=" mm" />
               <SpecRow label="Width" value={device.width_mm} unit=" mm" />
               <SpecRow label="Depth" value={device.depth_mm} unit=" mm" />
               <SpecRow label="Material" value={device.case_material || device.frame_material} />
             </>
          )}

          {/* Special Compatibility Box for Accessories */}
          {isAccessory && device.compatibility_notes && (
            <div className="mt-8">
              <SectionTitle title="Compatibility" />
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-600">
                {device.compatibility_notes}
              </div>
            </div>
          )}

          {!isAccessory && (
            <>
              <SectionTitle title="Display" />
              <SpecRow label="Size" value={device.screen_size || device.display_size_inches} unit='"' />
              <SpecRow label="Resolution" value={device.resolution || device.resolution_pixels} />
              <SpecRow label="Refresh Rate" value={device.refresh_rate_hz} unit="Hz" />
              <SpecRow label="Brightness" value={device.peak_brightness || device.peak_brightness_nits} unit=" nits" />
            </>
          )}
        </div>

        {/* RIGHT COLUMN: PERFORMANCE & FEATURES */}
        <div>
          {isAccessory ? (
             <>
                <SectionTitle title="Input Technology" />
                <SpecRow label="Pressure Sensitivity" value={device.pressure_sensitivity} />
                <SpecRow label="Haptic Feedback" value={device.haptic_feedback} />
                <SpecRow label="Hover Support" value={device.hover_support} />
                <SpecRow label="Barrel Roll" value={device.barrel_roll} />
             </>
          ) : (
             <>
               <SectionTitle title="Performance" />
               <SpecRow label="Chipset" value={device.chip_name} />
               <SpecRow label="CPU Cores" value={device.cpu_cores} />
               <SpecRow label="RAM" value={device.ram_gb || device.base_ram_gb} unit="GB" />
               <SpecRow label="Storage" value={device.storage_gb || device.base_storage_gb} unit="GB" />
             </>
          )}

          {/* Universal Connectivity */}
          <SectionTitle title="Connectivity" />
          <SpecRow label="Wi-Fi" value={device.wifi_version} />
          <SpecRow label="Bluetooth" value={device.bluetooth_version} />
          
          {/* Watch Health Sensors */}
          {isWatch && (
            <>
               <SectionTitle title="Health Sensors" />
               <SpecRow label="Heart Rate" value={device.heart_rate_gen} />
               <SpecRow label="ECG" value={device.ecg_support} />
               <SpecRow label="Blood Oxygen" value={device.blood_oxygen} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}