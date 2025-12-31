import { supabase } from '../lib/supabase';
  // This is the "Fetch" – it asks Supabase for all data in the 'iPhones' table
  const { data: iPhones, error } = await supabase
    .from('iPhones')
    .select('*')

  if (error) {
    return <div className="p-10 text-red-500">Error loading data: {error.message}</div>
  }

  return (
    <main className="min-h-screen bg-white p-10 font-sans text-black">
      <h1 className="text-4xl font-bold mb-8">Technical Logic</h1>
      
      <div className="grid gap-4">
        {iPhones?.map((phone) => (
          <div key={phone.id} className="p-6 border border-gray-100 rounded-3xl bg-gray-50 shadow-sm">
            <h2 className="text-2xl font-semibold">{phone.name}</h2>
            <p className="text-gray-500">Chip: {phone.chip || 'N/A'}</p>
            <p className="text-blue-600 font-medium">Price: ${phone.price || '???'}</p>
          </div>
        ))}
      </div>

      {iPhones?.length === 0 && (
        <p className="text-gray-400">Connection successful, but your table is empty!</p>
      )}
    </main>
  )
}