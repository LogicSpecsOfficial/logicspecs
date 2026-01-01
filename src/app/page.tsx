export const dynamic = 'force-dynamic';
import { supabase } from '../lib/supabase';

export default async function HomePage() {
  const { data: iPhones, error } = await supabase
    .from('iPhones')
    .select('*')
    .order('release_date', { ascending: false });

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      {/* Apple-style Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 py-4 px-10">
        <span className="text-xl font-bold tracking-tight">LogicSpecs</span>
      </nav>

      <header className="py-20 px-6 text-center">
        <h1 className="text-6xl font-semibold tracking-tight mb-4">iPhone.</h1>
        <p className="text-2xl text-gray-500">Every spec. Every detail.</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {iPhones?.map((phone: any) => (
            <div key={phone.model_identifier} className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-blue-400">
              <div className="mb-6">
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">{phone.series}</p>
                <h2 className="text-3xl font-semibold">{phone.model_name}</h2>
              </div>

              {/* Performance Section */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex justify-around text-center">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Single Core</p>
                  <p className="text-lg font-bold text-gray-800">{phone.geekbench_single || '—'}</p>
                </div>
                <div className="border-x border-gray-200 px-4">
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Multi Core</p>
                  <p className="text-lg font-bold text-gray-800">{phone.geekbench_multi || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">RAM</p>
                  <p className="text-lg font-bold text-gray-800">{phone.ram_gb}GB</p>
                </div>
              </div>

              {/* Physical Specs */}
              <div className="space-y-3 text-sm border-t border-gray-100 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Chip</span>
                  <span className="font-semibold text-gray-800">{phone.chip_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-semibold text-gray-800">{phone.weight_grams}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Battery</span>
                  <span className="font-semibold text-gray-800">{phone.battery_mah} mAh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peak Brightness</span>
                  <span className="font-semibold text-gray-800">{phone.peak_brightness_nits} nits</span>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-[#1D1D1F] text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                View All Specs
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}