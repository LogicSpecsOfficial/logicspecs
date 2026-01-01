export const dynamic = 'force-dynamic';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default async function HomePage() {
  const { data: iPhones } = await supabase
    .from('iPhones')
    .select('*')
    .order('release_date', { ascending: false });

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 bg-white/60 backdrop-blur-xl border border-white/20 rounded-full px-8 py-3 shadow-lg flex justify-between items-center">
        <span className="text-lg font-bold tracking-tighter italic uppercase">LogicSpecs</span>
      </nav>

      <header className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter mb-6 bg-gradient-to-b from-black to-gray-500 bg-clip-text text-transparent">iPhone Specs.</h1>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
        {iPhones?.map((phone: any) => (
          <Link 
            href={`/device/${phone.slug}`} // Now using the SEO slug!
            key={phone.model_identifier}
            className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2"
          >
            <span className="text-blue-600 font-bold text-[10px] tracking-widest uppercase">{phone.series}</span>
            <h2 className="text-3xl font-semibold mt-2 mb-8 tracking-tight">{phone.model_name}</h2>
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Geekbench Multi</span>
                <span className="text-2xl font-light italic">{phone.geekbench_multi}</span>
            </div>
            <div className="mt-6 text-center text-xs text-blue-500 font-medium">Full Technical Specifications →</div>
          </Link>
        ))}
      </div>
    </main>
  );
}