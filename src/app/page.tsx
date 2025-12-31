export const dynamic = 'force-dynamic';

import { supabase } from '../lib/supabase';

export default async function HomePage() {
  // Fetch data from Supabase
  const { data: iPhones, error } = await supabase
    .from('iPhones')
    .select('*');

  return (
    <main className="p-10 font-sans">
      <h1 className="text-4xl font-bold mb-8">LogicSpecs Official</h1>
      
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <div className="grid gap-4">
        {iPhones?.map((phone: any) => (
          <div key={phone.id} className="p-6 border rounded-xl bg-gray-50">
            <h2 className="text-2xl font-semibold">{phone.name}</h2>
            <p className="text-gray-500">Chip: {phone.chip}</p>
          </div>
        ))}
      </div>

      {(!iPhones || iPhones.length === 0) && !error && (
        <p className="text-gray-400">Database connected! (Table is currently empty)</p>
      )}
    </main>
  );
}