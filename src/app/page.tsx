export const dynamic = 'force-dynamic';
import { supabase } from '../lib/supabase';
import Link from 'next/link'; // Import the Link component

export default async function HomePage() {
  // Fetch data from Supabase
  const { data: iPhones, error } = await supabase
    .from('iPhones')
    .select('*')
    .order('release_date', { ascending: false });

  // AEO/SEO JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": iPhones?.map((phone, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": phone.model_name,
        "url": `https://logicspecs.vercel.app/device/${phone.model_identifier}`,
        "description": `Technical specs for ${phone.model_name} featuring ${phone.chip_name}.`,
        "brand": { "@type": "Brand", "name": "Apple" }
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-blue-100">
      {/* SEO Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Liquid Glass Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 
                      bg-white/60 backdrop-blur-xl border border-white/20 
                      rounded-full px-8 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
                      flex justify-between items-center transition-all">
        <span className="text-lg font-bold tracking-tighter italic uppercase">LogicSpecs</span>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">Devices</Link>
          <a href="#" className="hover:text-black transition-colors">Compare</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter mb-6 bg-gradient-to-b from-black to-gray-500 bg-clip-text text-transparent">
          iPhone Specs.
        </h1>
        <p className="text-2xl text-gray-500 font-medium max-w-2xl mx-auto italic">
          High-authority technical database for every Apple device.
        </p>
      </header>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
        {iPhones?.map((phone: any) => (
          /* THIS IS THE LINK COMPONENT THAT CONNECTS TO DEVICE/[ID] */
          <Link 
            href={`/device/${phone.model_identifier}`} 
            key={phone.model_identifier}
            className="group relative bg-white rounded-[2.5rem] p-1 border border-gray-100 
                       shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] 
                       transition-all duration-700 hover:-translate-y-2 cursor-pointer"
          >
            <div className="p-8">
              <span className="text-blue-600 font-bold text-[10px] tracking-widest uppercase">
                {phone.series}
              </span>
              <h2 className="text-3xl font-semibold mt-2 mb-8 tracking-tight">
                {phone.model_name}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Geekbench Multi
                  </span>
                  <span className="text-2xl font-light italic tracking-tighter">
                    {phone.geekbench_multi || '—'}
                  </span>
                </div>
                {/* Visual Power Bar */}
                <div className="w-full bg-gray-100 h-[3px] rounded-full overflow-hidden">
                  <div 
                    className="bg-black h-full transition-all duration-1000 group-hover:bg-blue-600" 
                    style={{ width: `${(phone.geekbench_multi / 10000) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-[#f5f5f7] rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Weight</p>
                  <p className="text-sm font-semibold">{phone.weight_grams}g</p>
                </div>
                <div className="bg-[#f5f5f7] rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Chip</p>
                  <p className="text-sm font-semibold truncate">{phone.chip_name}</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-xs text-blue-500 font-medium group-hover:underline">
                  Full Technical Specifications →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {error && (
        <div className="text-center text-red-500 py-10">
          Database connection error: {error.message}
        </div>
      )}
    </main>
  );
}