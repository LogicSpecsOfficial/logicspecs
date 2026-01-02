import Link from 'next/link';

export default function LandingPage() {
  const categories = [
    { name: 'iPhone', icon: '📱', color: 'from-blue-500 to-indigo-600' },
    { name: 'Mac', icon: '💻', color: 'from-gray-700 to-black' },
    { name: 'iPad', icon: '平板', color: 'from-purple-500 to-pink-600' },
    { name: 'Watch', icon: '⌚', color: 'from-orange-400 to-red-500' },
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest mb-4">
            New: Hardware Longevity Predictor
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1D1D1F]">
            LOGIC<span className="text-blue-600">SPECS</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The ultimate technical database for Apple hardware. 
            Deep-dive into 15+ years of evolution.
          </p>
          
          <div className="pt-10 flex flex-wrap justify-center gap-6">
            <Link href="/finder" className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Start Finding
            </Link>
            <Link href="/compare" className="px-10 py-5 bg-white border border-gray-200 text-black rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-sm">
              Launch Matrix
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY SELECTOR */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/finder?category=${cat.name}`}>
              <div className="group relative h-80 rounded-[3.5rem] overflow-hidden bg-white border border-gray-100 p-10 hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                <span className="text-5xl mb-6 block">{cat.icon}</span>
                <h3 className="text-3xl font-black tracking-tighter">{cat.name}</h3>
                <p className="text-gray-400 font-medium mt-2">Browse the database</p>
                <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}