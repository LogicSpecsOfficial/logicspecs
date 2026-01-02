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
      <section className="pt-48 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-[#1D1D1F]">
            LOGIC<span className="text-blue-600">SPECS</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The professional technical database for the Apple ecosystem. 
            Select, Compare, and Analyze with 30+ data points.
          </p>
          <div className="pt-10 flex flex-wrap justify-center gap-6">
            <Link href="/finder" className="px-12 py-6 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Start Finding
            </Link>
            <Link href="/compare" className="px-12 py-6 bg-white border border-gray-200 text-black rounded-full font-bold text-lg hover:bg-gray-50 transition-colors">
              Launch Matrix
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/finder?category=${cat.name}`}>
            <div className="group relative h-72 rounded-[3.5rem] bg-white border border-gray-100 p-10 hover:shadow-2xl transition-all">
              <span className="text-5xl mb-4 block">{cat.icon}</span>
              <h3 className="text-3xl font-black tracking-tighter">{cat.name}</h3>
              <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">→</div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}