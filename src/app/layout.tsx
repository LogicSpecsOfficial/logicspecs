import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'LogicSpecs | The Ultimate Apple Device Database',
  description: 'Technical specifications, comparisons, and finder for iPhone, iPad, Mac, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased">
        
        {/* GLOBAL HEADER */}
        <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity">
              LOGICSPECS
            </Link>
            
            <div className="hidden md:flex gap-8 text-[12px] font-bold uppercase tracking-widest text-gray-500">
              <Link href="/device" className="hover:text-black transition-colors">iPhone</Link>
              <Link href="/ipad" className="hover:text-black transition-colors">iPad</Link>
              <Link href="/mac" className="hover:text-black transition-colors">Mac</Link>
              <Link href="/finder" className="text-blue-600 hover:text-blue-700 transition-colors">Finder</Link>
            </div>

            <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all">
              Compare
            </button>
          </div>
        </nav>

        {/* PAGE CONTENT (This is where your different pages will appear) */}
        <div className="pt-16 min-h-screen">
          {children}
        </div>

        {/* GLOBAL FOOTER */}
        <footer className="bg-white border-t border-gray-200 pt-20 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
              <div>
                <h4 className="text-xs font-bold uppercase mb-4 tracking-widest text-gray-400">Database</h4>
                <ul className="space-y-2 text-sm font-medium">
                  <li><Link href="/device" className="hover:underline">iPhone</Link></li>
                  <li><Link href="/ipad" className="hover:underline">iPad</Link></li>
                  <li><Link href="/mac" className="hover:underline">Mac</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase mb-4 tracking-widest text-gray-400">Tools</h4>
                <ul className="space-y-2 text-sm font-medium">
                  <li><Link href="/finder" className="hover:underline">Device Finder</Link></li>
                  <li><Link href="/compare" className="hover:underline">Side-by-Side</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between text-[11px] text-gray-500">
              <p>© 2026 LogicSpecs. All technical data is subject to change.</p>
              <p>Affiliate Disclosure: We may earn commissions from Amazon and eBay.</p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}