export const dynamic = 'force-dynamic';

import { supabase } from '../lib/supabase';

export default async function HomePage() {
  // 1. Fetch data from Supabase (sorted by newest first)
  const { data: phones, error } = await supabase
    .from('iPhones')
    .select('*')
    .order('name', { ascending: false });

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      {/* Hero Section */}
      <div className="bg-white pt-20 pb-16 px-6 text-center border-b border-gray-200">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-4">
          iPhone Specs.
        </h1>
        <p className="text-2xl text-gray-500 font-medium">
          The heavyweights, weighed.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
            Unable to load specs: {error.message}
          </div>
        )}

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phones?.map((phone: any) => (
            <div 
              key={phone.id} 
              className="bg-white p-8 rounded-[28px] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <h2 className="text-3xl font-semibold mb-2">{phone.name}</h2>
              <div className="text-sm font-semibold px-3 py-1 bg-gray-100 rounded-full text-gray-600 mb-6">
                {phone.chip || 'Unknown Chip'}
              </div>
              
              <div className="w-full space-y-4 text-lg">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium">{phone.weight_g ? `${phone.weight_g}g` : 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">{phone.price ? `$${phone.price}` : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!phones || phones.length === 0) && !error && (
          <div className="text-center text-gray-400 mt-20">
            <p>No devices found in the database yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}