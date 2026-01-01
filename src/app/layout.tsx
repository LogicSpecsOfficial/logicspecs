import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100]">
          <nav className="h-14 bg-white/60 backdrop-blur-3xl border border-white/20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center justify-between px-10">
            <Link href="/" className="font-black text-xl tracking-tighter italic uppercase">
              Logic<span className="text-apple-blue font-black">Specs</span>
            </Link>
            
            <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-apple-gray-400">
              <Link href="/finder" className="hover:text-black transition-colors">Finder</Link>
              <Link href="/compare" className="hover:text-black transition-colors">Compare</Link>
              <Link href="/advisor" className="hover:text-black transition-colors">Advisor</Link>
              <Link href="/benchmarks" className="hover:text-black transition-colors">Benchmarks</Link>
            </div>

            <button className="bg-apple-gray-900 text-white px-6 h-8 rounded-full text-[10px] font-bold uppercase hover:bg-black transition-all">
              Search
            </button>
          </nav>
        </div>
        {children}
      </body>
    </html>
  )
}